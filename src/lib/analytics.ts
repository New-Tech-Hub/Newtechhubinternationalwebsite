// Analytics tracking utility
// Supports Google Analytics, Facebook Pixel, and custom events

export interface AnalyticsEvent {
  event: string;
  category: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
}

export const trackEvent = (event: AnalyticsEvent) => {
  // Log to console in development
  if (import.meta.env.DEV) {
    console.log('📊 Analytics Event:', event);
  }

  // Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event.event, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      ...event.metadata,
    });
  }

  // Facebook Pixel
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('trackCustom', event.event, event.metadata);
  }

  // Custom analytics endpoint (if needed)
  // You can send to your own backend here
};

// Predefined tracking events for the sales funnel
export const Analytics = {
  // Hero CTA events
  heroCtaClick: (buttonLabel: string) => 
    trackEvent({
      event: 'cta_click',
      category: 'Hero',
      label: buttonLabel,
      metadata: { location: 'hero_section', button: buttonLabel }
    }),

  // Course listing events
  courseListView: () =>
    trackEvent({
      event: 'view_item_list',
      category: 'Courses',
      label: 'Course Listing Viewed'
    }),

  courseCardClick: (courseId: string, courseTitle: string) =>
    trackEvent({
      event: 'select_item',
      category: 'Courses',
      label: courseTitle,
      metadata: { course_id: courseId, course_title: courseTitle }
    }),

  // Course detail events
  courseDetailView: (courseId: string, courseTitle: string, price: number) =>
    trackEvent({
      event: 'view_item',
      category: 'Course Detail',
      label: courseTitle,
      value: price,
      metadata: { course_id: courseId, course_title: courseTitle, price }
    }),

  // Lead capture events
  leadCaptureStart: (courseId: string) =>
    trackEvent({
      event: 'begin_checkout',
      category: 'Lead Capture',
      label: 'Enrollment Form Started',
      metadata: { course_id: courseId }
    }),

  leadCaptureComplete: (courseId: string, email: string) =>
    trackEvent({
      event: 'add_contact_info',
      category: 'Lead Capture',
      label: 'Contact Info Added',
      metadata: { course_id: courseId, email }
    }),

  // Payment events
  paymentInitiated: (courseId: string, amount: number) =>
    trackEvent({
      event: 'initiate_checkout',
      category: 'Payment',
      label: 'Payment Started',
      value: amount,
      metadata: { course_id: courseId, amount }
    }),

  paymentCompleted: (courseId: string, amount: number, reference: string) =>
    trackEvent({
      event: 'purchase',
      category: 'Payment',
      label: 'Payment Completed',
      value: amount,
      metadata: { 
        course_id: courseId, 
        amount, 
        transaction_id: reference,
        currency: 'NGN'
      }
    }),

  // Upsell events
  upsellView: (courseId: string) =>
    trackEvent({
      event: 'view_promotion',
      category: 'Upsell',
      label: 'Upsell Offer Viewed',
      metadata: { course_id: courseId }
    }),

  upsellAccepted: (originalCourseId: string, upsellCourseId: string) =>
    trackEvent({
      event: 'select_promotion',
      category: 'Upsell',
      label: 'Upsell Accepted',
      metadata: { original_course: originalCourseId, upsell_course: upsellCourseId }
    }),

  upsellDeclined: (courseId: string) =>
    trackEvent({
      event: 'dismiss_promotion',
      category: 'Upsell',
      label: 'Upsell Declined',
      metadata: { course_id: courseId }
    }),

  // Access events
  courseAccessGranted: (courseId: string) =>
    trackEvent({
      event: 'course_access',
      category: 'Access',
      label: 'Course Access Granted',
      metadata: { course_id: courseId }
    }),
};
