import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useCourseAccess = (courseId: string | undefined) => {
  const { user } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user || !courseId) {
        setHasAccess(false);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Check if user is admin
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .single();

        const userIsAdmin = !!roleData;
        setIsAdmin(userIsAdmin);

        if (userIsAdmin) {
          setHasAccess(true);
          setLoading(false);
          return;
        }

        // Check if user has access through access code
        const { data: accessData } = await supabase
          .from('user_course_access')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', courseId)
          .single();

        setHasAccess(!!accessData);
      } catch (error) {
        console.error('Error checking course access:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [user, courseId]);

  return { hasAccess, isAdmin, loading };
};
