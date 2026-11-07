# Architecture rules

- Keep the Courses catalog exclusively on Academy; public homepage category links lead there without loading video embeds.
- Playback URLs are fetched only through an authenticated, course-entitlement-checking function; public course column grants exclude playback URLs, and code redemption is atomic and derives ownership from auth.uid().
- Enforce the ₦120,000 beginner-course price floor in the database as well as the purchase interface so course prices cannot bypass it.