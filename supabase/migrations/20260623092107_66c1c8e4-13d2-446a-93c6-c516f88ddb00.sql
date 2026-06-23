
-- ============================================================
-- 1) Move SECURITY DEFINER functions out of the exposed public schema
-- ============================================================
CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION private.verify_course_access(_user_id uuid, _course_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN private.has_role(_user_id, 'admin'::public.app_role) THEN true
    ELSE EXISTS (
      SELECT 1 FROM public.user_course_access uca
      WHERE uca.user_id = _user_id AND uca.course_id = _course_id
    )
  END;
$$;

GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.verify_course_access(uuid, uuid) TO authenticated, service_role;

-- ============================================================
-- 2) Repoint every existing policy from public.has_role to private.has_role
-- ============================================================
ALTER POLICY "Only admins can create certifications" ON public.certifications
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins can manage certifications" ON public.certifications
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- chat_conversations: also restrict admin policy to authenticated role
DROP POLICY IF EXISTS "Admins can view all conversations" ON public.chat_conversations;
CREATE POLICY "Admins can view all conversations" ON public.chat_conversations
  FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Users can read only their own conversations" ON public.chat_conversations
  USING ((user_id = auth.uid()) OR ((user_id IS NULL) AND private.has_role(auth.uid(), 'admin'::public.app_role)));

ALTER POLICY "Admins can manage access codes" ON public.course_access_codes
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can manage course videos" ON public.course_videos
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- course_videos: replace public-read policy with enrollment-gated one
DROP POLICY IF EXISTS "Anyone can view course videos" ON public.course_videos;
CREATE POLICY "Enrolled users or admins can view course videos" ON public.course_videos
  FOR SELECT TO authenticated
  USING (
    private.has_role(auth.uid(), 'admin'::public.app_role)
    OR private.verify_course_access(auth.uid(), course_id)
    OR EXISTS (
      SELECT 1 FROM public.user_enrollments ue
      WHERE ue.user_id = auth.uid() AND ue.course_id = course_videos.course_id
    )
  );

ALTER POLICY "Admins can manage all courses" ON public.courses
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can manage all posts" ON public.forum_posts
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can manage forums" ON public.forums
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can create reports" ON public.import_reports
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins can view reports" ON public.import_reports
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can manage installment payment records" ON public.installment_payment_records
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins can insert payment records" ON public.installment_payment_records
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins can update payment records" ON public.installment_payment_records
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can manage instructor profiles" ON public.instructor_profiles
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can view all outcomes" ON public.learner_outcomes
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can manage learning path courses" ON public.learning_path_courses
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can manage learning paths" ON public.learning_paths
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can manage partnerships" ON public.partnerships
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can update installments" ON public.payment_installments
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins can view all installments" ON public.payment_installments
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can manage payment plans" ON public.payment_plans
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Only admins or service role can create payments" ON public.payments
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins can view all payments" ON public.payments
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can update all profiles" ON public.profiles
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins can view all profiles" ON public.profiles
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can manage all testimonials" ON public.testimonials
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can manage user access" ON public.user_course_access
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can view all enrollments" ON public.user_enrollments
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can delete roles" ON public.user_roles
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins can view all roles" ON public.user_roles
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins can insert roles" ON public.user_roles
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins can update roles" ON public.user_roles
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can view all progress" ON public.user_video_progress
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can create import logs" ON public.video_import_logs
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Admins can view import logs" ON public.video_import_logs
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

ALTER POLICY "Admins can manage all videos" ON public.videos
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- ============================================================
-- 3) Drop the now-unused public SECURITY DEFINER functions
-- ============================================================
DROP FUNCTION IF EXISTS public.verify_course_access(uuid, uuid);
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);

-- ============================================================
-- 4) Stop broadcasting payments / access grants over realtime
-- ============================================================
ALTER PUBLICATION supabase_realtime DROP TABLE public.payments;
ALTER PUBLICATION supabase_realtime DROP TABLE public.user_course_access;
