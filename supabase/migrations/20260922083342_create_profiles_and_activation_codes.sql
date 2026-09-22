/*
# Create profiles and activation_codes tables

## Overview
This migration creates the core database schema for a PC optimization tool with:
- User authentication via Supabase Auth
- Payment status tracking (paywall)
- Activation code system for email-based account activation

## New Tables

### 1. profiles
- `id` (uuid, primary key, references auth.users)
- `email` (text, user email)
- `paid` (boolean, default false — controls paywall access)
- `stripe_customer_id` (text, nullable — Stripe customer reference)
- `stripe_subscription_id` (text, nullable — Stripe subscription reference)
- `activation_code` (text, nullable — 6-digit code sent via email)
- `activated` (boolean, default false — whether user activated via code)
- `created_at` (timestamptz)

### 2. activation_codes
- `id` (uuid, primary key)
- `user_id` (uuid, references auth.users, defaults to auth.uid())
- `code` (text, 6-digit activation code)
- `used` (boolean, default false)
- `expires_at` (timestamptz — code expires after 24h)
- `created_at` (timestamptz)

## Security
- RLS enabled on both tables.
- profiles: users can read/update only their own profile.
- activation_codes: users can read only their own codes.
- A trigger auto-creates a profile row when a new auth.users row is inserted.

## Notes
1. The `handle_new_user` trigger function creates a profile automatically on signup.
2. paid defaults to false — the paywall blocks access until payment is confirmed via Stripe.
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  paid boolean NOT NULL DEFAULT false,
  stripe_customer_id text,
  stripe_subscription_id text,
  activation_code text,
  activated boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

-- Create activation_codes table
CREATE TABLE IF NOT EXISTS activation_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  code text NOT NULL,
  used boolean NOT NULL DEFAULT false,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '24 hours'),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE activation_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_codes" ON activation_codes;
CREATE POLICY "select_own_codes" ON activation_codes FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, UPDATE ON profiles TO authenticated;
GRANT SELECT ON activation_codes TO authenticated;