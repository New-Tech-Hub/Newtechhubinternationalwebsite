import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "nth_session_id";

export const getSessionId = (): string => {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "anon";
  }
};

const parseUA = (ua: string) => {
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(ua);
  const isTablet = /iPad|Tablet/i.test(ua);
  let browser = "Other";
  if (/Edg\//.test(ua)) browser = "Edge";
  else if (/OPR|Opera/.test(ua)) browser = "Opera";
  else if (/Chrome/.test(ua)) browser = "Chrome";
  else if (/Firefox/.test(ua)) browser = "Firefox";
  else if (/Safari/.test(ua)) browser = "Safari";
  return {
    device_type: isTablet ? "tablet" : isMobile ? "mobile" : "desktop",
    browser,
  };
};

export const trackPageView = async (path: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const ua = navigator.userAgent;
    const { device_type, browser } = parseUA(ua);
    await supabase.from("page_views").insert({
      session_id: getSessionId(),
      user_id: user?.id ?? null,
      path,
      referrer: document.referrer || null,
      user_agent: ua,
      device_type,
      browser,
    });
  } catch (e) {
    // silent
  }
};

export const trackEvent = async (
  event_type: string,
  opts: { category?: string; label?: string; metadata?: Record<string, any> } = {}
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("activity_events").insert({
      session_id: getSessionId(),
      user_id: user?.id ?? null,
      event_type,
      event_category: opts.category ?? null,
      event_label: opts.label ?? null,
      metadata: opts.metadata ?? {},
    });
  } catch (e) {
    // silent
  }
};
