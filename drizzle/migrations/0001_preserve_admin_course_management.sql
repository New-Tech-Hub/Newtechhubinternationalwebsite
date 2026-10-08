CREATE OR REPLACE FUNCTION public.get_admin_courses()
RETURNS SETOF public.courses LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path=public
AS $$ BEGIN
 IF auth.uid() IS NULL OR NOT private.has_role(auth.uid(),'admin'::public.app_role) THEN RAISE EXCEPTION 'Admin access required' USING ERRCODE='42501'; END IF;
 RETURN QUERY SELECT * FROM public.courses ORDER BY created_at DESC;
END $$;
REVOKE ALL ON FUNCTION public.get_admin_courses() FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.get_admin_courses() TO authenticated,service_role;