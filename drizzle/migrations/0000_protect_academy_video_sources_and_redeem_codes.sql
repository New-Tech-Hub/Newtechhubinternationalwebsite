-- Keep public course metadata readable, but never expose playback URLs through the catalog.
REVOKE SELECT ON public.courses FROM PUBLIC, anon, authenticated;
DO $$ DECLARE cols text; BEGIN
 SELECT string_agg(quote_ident(column_name), ', ' ORDER BY ordinal_position) INTO cols FROM information_schema.columns WHERE table_schema='public' AND table_name='courses' AND column_name <> 'video_preview_url';
 EXECUTE format('GRANT SELECT (%s) ON public.courses TO anon, authenticated', cols);
END $$;
CREATE OR REPLACE FUNCTION public.get_course_video(_course_id uuid)
RETURNS text LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$ BEGIN
 IF auth.uid() IS NULL OR NOT private.verify_course_access(auth.uid(), _course_id) THEN
   RAISE EXCEPTION 'Course access code required' USING ERRCODE='42501';
 END IF;
 RETURN (SELECT video_preview_url FROM public.courses WHERE id=_course_id);
END $$;
REVOKE ALL ON FUNCTION public.get_course_video(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_course_video(uuid) TO authenticated, service_role;
DROP POLICY IF EXISTS "Enrolled users or admins can view course videos" ON public.course_videos;
CREATE POLICY "Code holders can view course videos" ON public.course_videos FOR SELECT TO authenticated USING (private.verify_course_access(auth.uid(), course_id));
DROP POLICY IF EXISTS "Anyone can view approved videos" ON public.videos;
CREATE POLICY "Code holders can view approved course videos" ON public.videos FOR SELECT TO authenticated USING (status='approved' AND EXISTS (SELECT 1 FROM public.course_videos cv WHERE cv.video_id=videos.id AND private.verify_course_access(auth.uid(),cv.course_id)));
CREATE OR REPLACE FUNCTION public.redeem_course_access_code(_course_id uuid, _access_code text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=public
AS $$ DECLARE code public.course_access_codes%ROWTYPE; BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in required' USING ERRCODE='42501'; END IF;
 IF EXISTS (SELECT 1 FROM public.user_course_access WHERE user_id=auth.uid() AND course_id=_course_id) THEN RETURN true; END IF;
 SELECT * INTO code FROM public.course_access_codes WHERE course_id=_course_id AND access_code=upper(trim(_access_code)) FOR UPDATE;
 IF NOT FOUND OR NOT coalesce(code.is_active,false) OR (code.expires_at IS NOT NULL AND code.expires_at <= now()) OR (code.max_uses IS NOT NULL AND coalesce(code.current_uses,0) >= code.max_uses) THEN
 RAISE EXCEPTION 'Invalid or expired course access code' USING ERRCODE='22023'; END IF;
 INSERT INTO public.user_course_access(user_id,course_id,access_code_id) VALUES(auth.uid(),_course_id,code.id);
 UPDATE public.course_access_codes SET current_uses=coalesce(current_uses,0)+1 WHERE id=code.id;
 RETURN true;
END $$;
REVOKE ALL ON FUNCTION public.redeem_course_access_code(uuid,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.redeem_course_access_code(uuid,text) TO authenticated,service_role;