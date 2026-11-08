# Architecture rules

- Keep the Courses catalog exclusively on Academy; public homepage category links lead there without loading video embeds.
- Playback URLs are fetched only through an authenticated, course-entitlement-checking function; public course column grants exclude playback URLs, and code redemption is atomic and derives ownership from auth.uid().
- Enforce the active beginner-course price floor in both the database and purchase interface so it cannot be bypassed.