import { useEffect, memo } from "react";
import { CSP_POLICY } from "@/lib/security";

/**
 * Injects security-related meta tags into the document head.
 * Renders nothing visually.
 */
const SecurityHeaders = memo(() => {
  useEffect(() => {
    const metas: HTMLMetaElement[] = [];

    const addMeta = (httpEquiv: string, content: string) => {
      // Avoid duplicates
      const existing = document.querySelector(`meta[http-equiv="${httpEquiv}"]`);
      if (existing) return;
      const meta = document.createElement("meta");
      meta.httpEquiv = httpEquiv;
      meta.content = content;
      document.head.appendChild(meta);
      metas.push(meta);
    };

    // Content Security Policy
    addMeta("Content-Security-Policy", CSP_POLICY);

    // XSS Protection (legacy browsers)
    addMeta("X-XSS-Protection", "1; mode=block");

    // Prevent MIME-type sniffing
    addMeta("X-Content-Type-Options", "nosniff");

    // Referrer policy
    addMeta("Referrer-Policy", "strict-origin-when-cross-origin");

    // Permissions policy
    addMeta(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=(), payment=()"
    );

    return () => {
      metas.forEach((m) => m.remove());
    };
  }, []);

  return null;
});

SecurityHeaders.displayName = "SecurityHeaders";

export default SecurityHeaders;
