export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activity_events: {
        Row: {
          created_at: string
          event_category: string | null
          event_label: string | null
          event_type: string
          id: string
          metadata: Json | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_category?: string | null
          event_label?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_category?: string | null
          event_label?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      certifications: {
        Row: {
          certificate_number: string
          course_id: string | null
          id: string
          issued_at: string
          skills_acquired: string[] | null
          user_id: string | null
          verification_url: string | null
        }
        Insert: {
          certificate_number: string
          course_id?: string | null
          id?: string
          issued_at?: string
          skills_acquired?: string[] | null
          user_id?: string | null
          verification_url?: string | null
        }
        Update: {
          certificate_number?: string
          course_id?: string | null
          id?: string
          issued_at?: string
          skills_acquired?: string[] | null
          user_id?: string | null
          verification_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certifications_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations: {
        Row: {
          created_at: string
          id: string
          messages: Json
          session_id: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          messages?: Json
          session_id: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          messages?: Json
          session_id?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      course_access_codes: {
        Row: {
          access_code: string
          course_id: string
          created_at: string
          created_by: string | null
          current_uses: number | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          max_uses: number | null
        }
        Insert: {
          access_code: string
          course_id: string
          created_at?: string
          created_by?: string | null
          current_uses?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
        }
        Update: {
          access_code?: string
          course_id?: string
          created_at?: string
          created_by?: string | null
          current_uses?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "course_access_codes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_videos: {
        Row: {
          course_id: string | null
          created_at: string | null
          id: string
          is_required: boolean | null
          sequence_order: number
          video_id: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_required?: boolean | null
          sequence_order: number
          video_id?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_required?: boolean | null
          sequence_order?: number
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_videos_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_videos_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: Database["public"]["Enums"]["course_category"]
          certificate_available: boolean | null
          created_at: string | null
          created_by: string | null
          description: string | null
          difficulty_level: Database["public"]["Enums"]["difficulty_level"]
          estimated_hours: number | null
          file_size_mb: number | null
          id: string
          instructor_id: string | null
          is_free: boolean | null
          is_offline_available: boolean | null
          language: string | null
          learning_outcomes: string[] | null
          prerequisites: string[] | null
          price: number
          published: boolean | null
          real_world_projects: string[] | null
          subtitles_available: string[] | null
          target_audience: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          video_preview_url: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["course_category"]
          certificate_available?: boolean | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty_level: Database["public"]["Enums"]["difficulty_level"]
          estimated_hours?: number | null
          file_size_mb?: number | null
          id?: string
          instructor_id?: string | null
          is_free?: boolean | null
          is_offline_available?: boolean | null
          language?: string | null
          learning_outcomes?: string[] | null
          prerequisites?: string[] | null
          price?: number
          published?: boolean | null
          real_world_projects?: string[] | null
          subtitles_available?: string[] | null
          target_audience?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          video_preview_url?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["course_category"]
          certificate_available?: boolean | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty_level?: Database["public"]["Enums"]["difficulty_level"]
          estimated_hours?: number | null
          file_size_mb?: number | null
          id?: string
          instructor_id?: string | null
          is_free?: boolean | null
          is_offline_available?: boolean | null
          language?: string | null
          learning_outcomes?: string[] | null
          prerequisites?: string[] | null
          price?: number
          published?: boolean | null
          real_world_projects?: string[] | null
          subtitles_available?: string[] | null
          target_audience?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          video_preview_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_posts: {
        Row: {
          content: string
          created_at: string
          forum_id: string | null
          id: string
          is_pinned: boolean | null
          title: string
          updated_at: string
          upvotes: number | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          forum_id?: string | null
          id?: string
          is_pinned?: boolean | null
          title: string
          updated_at?: string
          upvotes?: number | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          forum_id?: string | null
          id?: string
          is_pinned?: boolean | null
          title?: string
          updated_at?: string
          upvotes?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_forum_id_fkey"
            columns: ["forum_id"]
            isOneToOne: false
            referencedRelation: "forums"
            referencedColumns: ["id"]
          },
        ]
      }
      forums: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      import_reports: {
        Row: {
          created_at: string | null
          details: Json | null
          id: string
          report_date: string
          sources_checked: string[] | null
          summary: string | null
          videos_added: number | null
          videos_flagged: number | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          id?: string
          report_date: string
          sources_checked?: string[] | null
          summary?: string | null
          videos_added?: number | null
          videos_flagged?: number | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          id?: string
          report_date?: string
          sources_checked?: string[] | null
          summary?: string | null
          videos_added?: number | null
          videos_flagged?: number | null
        }
        Relationships: []
      }
      installment_payment_records: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          installment_id: string
          installment_number: number
          paid_at: string | null
          payment_id: string | null
          status: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          installment_id: string
          installment_number: number
          paid_at?: string | null
          payment_id?: string | null
          status?: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          installment_id?: string
          installment_number?: number
          paid_at?: string | null
          payment_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "installment_payment_records_installment_id_fkey"
            columns: ["installment_id"]
            isOneToOne: false
            referencedRelation: "payment_installments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "installment_payment_records_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      instructor_profiles: {
        Row: {
          bio: string | null
          created_at: string
          expertise: string[] | null
          full_name: string
          id: string
          linkedin_url: string | null
          profile_image_url: string | null
          students_taught: number | null
          twitter_url: string | null
          updated_at: string
          user_id: string | null
          years_experience: number | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          expertise?: string[] | null
          full_name: string
          id?: string
          linkedin_url?: string | null
          profile_image_url?: string | null
          students_taught?: number | null
          twitter_url?: string | null
          updated_at?: string
          user_id?: string | null
          years_experience?: number | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          expertise?: string[] | null
          full_name?: string
          id?: string
          linkedin_url?: string | null
          profile_image_url?: string | null
          students_taught?: number | null
          twitter_url?: string | null
          updated_at?: string
          user_id?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
      learner_outcomes: {
        Row: {
          completion_date: string | null
          course_id: string | null
          created_at: string
          employment_status: string | null
          id: string
          is_public: boolean | null
          job_title: string | null
          privacy_consent_given: boolean | null
          salary_range: string | null
          skills_gained: string[] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          completion_date?: string | null
          course_id?: string | null
          created_at?: string
          employment_status?: string | null
          id?: string
          is_public?: boolean | null
          job_title?: string | null
          privacy_consent_given?: boolean | null
          salary_range?: string | null
          skills_gained?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          completion_date?: string | null
          course_id?: string | null
          created_at?: string
          employment_status?: string | null
          id?: string
          is_public?: boolean | null
          job_title?: string | null
          privacy_consent_given?: boolean | null
          salary_range?: string | null
          skills_gained?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learner_outcomes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_path_courses: {
        Row: {
          course_id: string | null
          created_at: string | null
          id: string
          learning_path_id: string | null
          sequence_order: number
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          learning_path_id?: string | null
          sequence_order: number
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          learning_path_id?: string | null
          sequence_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "learning_path_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_path_courses_learning_path_id_fkey"
            columns: ["learning_path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_paths: {
        Row: {
          category: Database["public"]["Enums"]["course_category"]
          created_at: string | null
          description: string | null
          difficulty_level: Database["public"]["Enums"]["difficulty_level"]
          estimated_completion_time: number | null
          id: string
          is_free: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["course_category"]
          created_at?: string | null
          description?: string | null
          difficulty_level: Database["public"]["Enums"]["difficulty_level"]
          estimated_completion_time?: number | null
          id?: string
          is_free?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["course_category"]
          created_at?: string | null
          description?: string | null
          difficulty_level?: Database["public"]["Enums"]["difficulty_level"]
          estimated_completion_time?: number | null
          id?: string
          is_free?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      page_views: {
        Row: {
          browser: string | null
          country: string | null
          created_at: string
          device_type: string | null
          id: string
          path: string
          referrer: string | null
          session_id: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          browser?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          path: string
          referrer?: string | null
          session_id: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          browser?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          path?: string
          referrer?: string | null
          session_id?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      partnerships: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          location: string | null
          logo_url: string | null
          partner_name: string
          partner_type: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          logo_url?: string | null
          partner_name: string
          partner_type: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          logo_url?: string | null
          partner_name?: string
          partner_type?: string
          website_url?: string | null
        }
        Relationships: []
      }
      payment_installments: {
        Row: {
          course_id: string
          created_at: string | null
          current_installment: number
          id: string
          installment_amount: number
          next_payment_date: string | null
          plan_id: string | null
          status: string
          total_amount: number
          total_installments: number
          total_paid: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string | null
          current_installment?: number
          id?: string
          installment_amount: number
          next_payment_date?: string | null
          plan_id?: string | null
          status?: string
          total_amount: number
          total_installments: number
          total_paid?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string | null
          current_installment?: number
          id?: string
          installment_amount?: number
          next_payment_date?: string | null
          plan_id?: string | null
          status?: string
          total_amount?: number
          total_installments?: number
          total_paid?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_installments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_installments_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "payment_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_plans: {
        Row: {
          course_id: string
          created_at: string | null
          id: string
          installment_amount: number
          installment_count: number
          is_active: boolean | null
          plan_name: string
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          course_id: string
          created_at?: string | null
          id?: string
          installment_amount: number
          installment_count: number
          is_active?: boolean | null
          plan_name: string
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string | null
          id?: string
          installment_amount?: number
          installment_count?: number
          is_active?: boolean | null
          plan_name?: string
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_plans_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          course_id: string | null
          created_at: string
          id: string
          metadata: Json | null
          payment_method: string | null
          reference: string
          status: string
          updated_at: string
          user_id: string | null
          verified_at: string | null
        }
        Insert: {
          amount: number
          course_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          reference: string
          status?: string
          updated_at?: string
          user_id?: string | null
          verified_at?: string | null
        }
        Update: {
          amount?: number
          course_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          reference?: string
          status?: string
          updated_at?: string
          user_id?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          company: string | null
          consent_to_publish: boolean | null
          content: string
          course_id: string | null
          created_at: string
          full_name: string
          id: string
          image_url: string | null
          is_approved: boolean | null
          is_featured: boolean | null
          location: string | null
          outcome_achieved: string | null
          rating: number | null
          role: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          company?: string | null
          consent_to_publish?: boolean | null
          content: string
          course_id?: string | null
          created_at?: string
          full_name: string
          id?: string
          image_url?: string | null
          is_approved?: boolean | null
          is_featured?: boolean | null
          location?: string | null
          outcome_achieved?: string | null
          rating?: number | null
          role?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          company?: string | null
          consent_to_publish?: boolean | null
          content?: string
          course_id?: string | null
          created_at?: string
          full_name?: string
          id?: string
          image_url?: string | null
          is_approved?: boolean | null
          is_featured?: boolean | null
          location?: string | null
          outcome_achieved?: string | null
          rating?: number | null
          role?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_course_access: {
        Row: {
          access_code_id: string | null
          course_id: string
          granted_at: string
          granted_by: string | null
          id: string
          user_id: string
        }
        Insert: {
          access_code_id?: string | null
          course_id: string
          granted_at?: string
          granted_by?: string | null
          id?: string
          user_id: string
        }
        Update: {
          access_code_id?: string | null
          course_id?: string
          granted_at?: string
          granted_by?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_course_access_access_code_id_fkey"
            columns: ["access_code_id"]
            isOneToOne: false
            referencedRelation: "course_access_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_course_access_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_enrollments: {
        Row: {
          completed_at: string | null
          course_id: string | null
          enrolled_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          course_id?: string | null
          enrolled_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          course_id?: string | null
          enrolled_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_video_progress: {
        Row: {
          completed: boolean | null
          created_at: string | null
          id: string
          last_watched_at: string | null
          progress_seconds: number | null
          user_id: string | null
          video_id: string | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          last_watched_at?: string | null
          progress_seconds?: number | null
          user_id?: string | null
          video_id?: string | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          last_watched_at?: string | null
          progress_seconds?: number | null
          user_id?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_video_progress_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_import_logs: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          import_method: string | null
          import_source: string | null
          metadata: Json | null
          success: boolean | null
          video_id: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          import_method?: string | null
          import_source?: string | null
          metadata?: Json | null
          success?: boolean | null
          video_id?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          import_method?: string | null
          import_source?: string | null
          metadata?: Json | null
          success?: boolean | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "video_import_logs_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          admin_notes: string | null
          attribution: string | null
          author_channel: string | null
          category: Database["public"]["Enums"]["course_category"]
          created_at: string | null
          description: string | null
          difficulty_level: Database["public"]["Enums"]["difficulty_level"]
          duration_seconds: number | null
          embed_code: string | null
          engagement_score: number | null
          id: string
          imported_by: string | null
          is_available: boolean | null
          language: string | null
          last_checked_at: string | null
          license_details: string | null
          license_type: Database["public"]["Enums"]["license_type"]
          quality_rating: number | null
          source_platform: string | null
          source_url: string
          status: Database["public"]["Enums"]["video_status"] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          attribution?: string | null
          author_channel?: string | null
          category: Database["public"]["Enums"]["course_category"]
          created_at?: string | null
          description?: string | null
          difficulty_level: Database["public"]["Enums"]["difficulty_level"]
          duration_seconds?: number | null
          embed_code?: string | null
          engagement_score?: number | null
          id?: string
          imported_by?: string | null
          is_available?: boolean | null
          language?: string | null
          last_checked_at?: string | null
          license_details?: string | null
          license_type: Database["public"]["Enums"]["license_type"]
          quality_rating?: number | null
          source_platform?: string | null
          source_url: string
          status?: Database["public"]["Enums"]["video_status"] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          attribution?: string | null
          author_channel?: string | null
          category?: Database["public"]["Enums"]["course_category"]
          created_at?: string | null
          description?: string | null
          difficulty_level?: Database["public"]["Enums"]["difficulty_level"]
          duration_seconds?: number | null
          embed_code?: string | null
          engagement_score?: number | null
          id?: string
          imported_by?: string | null
          is_available?: boolean | null
          language?: string | null
          last_checked_at?: string | null
          license_details?: string | null
          license_type?: Database["public"]["Enums"]["license_type"]
          quality_rating?: number | null
          source_platform?: string | null
          source_url?: string
          status?: Database["public"]["Enums"]["video_status"] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      course_category:
        | "digital_marketing"
        | "web_development"
        | "graphic_design"
        | "ai_data"
        | "cybersecurity"
        | "video_editing"
        | "freelancing"
      difficulty_level: "beginner" | "intermediate" | "advanced"
      license_type:
        | "youtube_standard"
        | "creative_commons_by"
        | "creative_commons_by_sa"
        | "creative_commons_by_nc"
        | "creative_commons_by_nc_sa"
        | "mit_opencourseware"
        | "public_domain"
        | "other"
      video_status:
        | "pending_review"
        | "approved"
        | "rejected"
        | "broken"
        | "removed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      course_category: [
        "digital_marketing",
        "web_development",
        "graphic_design",
        "ai_data",
        "cybersecurity",
        "video_editing",
        "freelancing",
      ],
      difficulty_level: ["beginner", "intermediate", "advanced"],
      license_type: [
        "youtube_standard",
        "creative_commons_by",
        "creative_commons_by_sa",
        "creative_commons_by_nc",
        "creative_commons_by_nc_sa",
        "mit_opencourseware",
        "public_domain",
        "other",
      ],
      video_status: [
        "pending_review",
        "approved",
        "rejected",
        "broken",
        "removed",
      ],
    },
  },
} as const
