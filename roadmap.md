# Academy video access
- [x] Remove video embeds from public listings and keep modules inside Academy.
- [x] Enforce signed-in, course-specific access-code video permissions and protect source URLs.
- [x] Test public denial, invalid-code rejection, and authenticated admin playback.
- [ ] Verify learner redemption and playback with a real assigned code: blocked by no existing learner code grants or supplied learner test code.

# Visitor landing page
- [x] Rebuild `/` as a public landing page for any visitor (welcome hero, quick links to Academy/News/Community, impact stats, founder spotlight, testimonials, tier pricing, contact); verified desktop + 375px with no errors or overflow, and pricing/menu links work.
- [x] Confirm jerryguma01@gmail.com holds the admin role and the admin dashboard (courses, access codes, installments, users, analytics) loads fully under his sign-in.

# Mobile-first audit
- [x] Check phone-sized public pages and signed-in navigation for layout and runtime errors.
- [x] Fix reproduced countdown, news-card, navigation and admin layout bugs while preserving Academy access restrictions.
- [x] Recheck seven pages at 320, 375, 768 and 1280px, Academy search-to-course navigation, and five signed-in admin tabs; no runtime errors observed.
- [x] Add interactivity pass: scroll-reveal sections, reading-progress bar, back-to-top button, and active menu highlighting; verified at 390px with no console errors.

# Basic course pricing and interactivity
- [ ] Set beginner-level course prices to at least ₦120,000 and enforce the floor for future edits.
- [ ] Limit the Basic selection to beginner courses, make difficulty levels interactive in Academy, and verify the phone layout.