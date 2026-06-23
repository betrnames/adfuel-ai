/*
  # Fix contact_submissions RLS policies

  1. Security Changes
    - Drop and recreate SELECT policy to use `(select auth.uid())` instead of `auth.uid()`
      for better query performance (avoids per-row re-evaluation)
    - Drop and recreate INSERT policy to add field validation constraints
      instead of unrestricted `WITH CHECK (true)`

  2. Important Notes
    - The INSERT policy now validates that name, email, and message are non-empty
      and within reasonable length limits to prevent abuse
    - The SELECT policy wraps auth.uid() in a subselect so Postgres evaluates
      it once per query instead of once per row
*/

DROP POLICY IF EXISTS "Authenticated users can view submissions" ON contact_submissions;

CREATE POLICY "Authenticated users can view submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Anyone can submit contact form" ON contact_submissions;

CREATE POLICY "Anon users can submit contact form with valid data"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (
    length(name) > 0 AND length(name) <= 200
    AND length(email) > 0 AND length(email) <= 320
    AND email ~ '^[^@]+@[^@]+\.[^@]+$'
    AND length(message) > 0 AND length(message) <= 5000
    AND (company IS NULL OR length(company) <= 200)
    AND (budget IS NULL OR length(budget) <= 50)
  );
