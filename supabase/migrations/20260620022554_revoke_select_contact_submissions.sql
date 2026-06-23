-- Remove SELECT privilege from anon and authenticated so the table
-- is not exposed in the GraphQL schema to unauthenticated or signed-in users.
REVOKE SELECT ON public.contact_submissions FROM anon;
REVOKE SELECT ON public.contact_submissions FROM authenticated;

-- Drop the authenticated SELECT policy; submissions are write-only from the client.
DROP POLICY IF EXISTS "Authenticated users can view submissions" ON public.contact_submissions;
