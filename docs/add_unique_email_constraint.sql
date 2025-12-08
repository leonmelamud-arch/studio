-- Migration: Add unique constraint on email per session
-- This ensures that each email can only be used once per session

-- First, clean up any existing duplicate emails within the same session (if any)
-- This keeps the first entry and removes duplicates
DELETE FROM public.participants a
USING public.participants b
WHERE a.created_at > b.created_at
  AND a.email = b.email
  AND a.session_id = b.session_id
  AND a.email IS NOT NULL;

-- Create a unique index on email + session_id combination
-- This allows the same email to be used in different sessions, but only once per session
-- NULL emails are allowed and don't violate uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS idx_participants_unique_email_per_session 
ON public.participants(email, session_id) 
WHERE email IS NOT NULL;

-- Alternative: If you want email to be globally unique across all sessions, use this instead:
-- CREATE UNIQUE INDEX IF NOT EXISTS idx_participants_unique_email_global 
-- ON public.participants(email) 
-- WHERE email IS NOT NULL;
