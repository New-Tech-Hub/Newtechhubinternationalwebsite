-- Fix critical security vulnerabilities (updated)

-- 1. Add INSERT policy for payments table (CRITICAL)
DROP POLICY IF EXISTS "Only admins or service role can create payments" ON public.payments;
CREATE POLICY "Only admins or service role can create payments"
ON public.payments
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 2. Restrict anonymous chat conversations (CRITICAL)
DROP POLICY IF EXISTS "Users can read their own conversations or anonymous ones" ON public.chat_conversations;
DROP POLICY IF EXISTS "Users can create their own conversations or anonymous ones" ON public.chat_conversations;
DROP POLICY IF EXISTS "Users can read only their own conversations" ON public.chat_conversations;
DROP POLICY IF EXISTS "Users can create only their own conversations" ON public.chat_conversations;

-- Create new secure policies for chat_conversations
CREATE POLICY "Users can read only their own conversations"
ON public.chat_conversations
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR (user_id IS NULL AND public.has_role(auth.uid(), 'admin')));

CREATE POLICY "Users can create only their own conversations"
ON public.chat_conversations
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- 3. Add INSERT policy for certifications (prevent fake certificates)
DROP POLICY IF EXISTS "Only admins can create certifications" ON public.certifications;
CREATE POLICY "Only admins can create certifications"
ON public.certifications
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. Update learner_outcomes to warn about public salary data
ALTER TABLE public.learner_outcomes 
ADD COLUMN IF NOT EXISTS privacy_consent_given boolean DEFAULT false;

-- Update RLS policy to require explicit consent for public outcomes
DROP POLICY IF EXISTS "Anyone can view public outcomes" ON public.learner_outcomes;
DROP POLICY IF EXISTS "Anyone can view public outcomes with consent" ON public.learner_outcomes;
CREATE POLICY "Anyone can view public outcomes with consent"
ON public.learner_outcomes
FOR SELECT
USING (is_public = true AND privacy_consent_given = true);

-- 5. Secure profiles table - restrict public email access
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 6. Fix function search paths (warning fix)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 7. Secure testimonials - ensure explicit consent
ALTER TABLE public.testimonials 
ADD COLUMN IF NOT EXISTS consent_to_publish boolean DEFAULT false;

DROP POLICY IF EXISTS "Anyone can view approved testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Anyone can view approved and consented testimonials" ON public.testimonials;
CREATE POLICY "Anyone can view approved and consented testimonials"
ON public.testimonials
FOR SELECT
USING (is_approved = true AND consent_to_publish = true);