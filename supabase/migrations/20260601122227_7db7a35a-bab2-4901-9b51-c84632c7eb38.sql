
-- Drop overly permissive chat_conversations policies that exposed anonymous (NULL user_id) conversations
DROP POLICY IF EXISTS "Users can view their own conversations" ON public.chat_conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON public.chat_conversations;
DROP POLICY IF EXISTS "Users can update their own conversations" ON public.chat_conversations;

-- Keep tighter policy: only owner can update
CREATE POLICY "Owners can update their conversations"
ON public.chat_conversations
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Revoke EXECUTE on SECURITY DEFINER functions from PostgREST-exposed roles.
-- They remain usable inside RLS policies and triggers (executed with the function owner's privileges).
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.verify_course_access(uuid, uuid) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_updated_at() FROM anon, authenticated, PUBLIC;
