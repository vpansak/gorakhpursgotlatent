# GGL Instagram showcase

The homepage features the verified viral reel De6SIoRAY2S and an accessible slideshow. The initial snapshot contains 83 public posts collected on 27 October 2026, and 3,831,438 views verified in Instagram Insights on that date. The profile showed 84 posts; one additional post was not available during collection. Snapshot labels deliberately show the verification date, not a live counter.

## Activate official synchronization

1. Finish creating the staged Meta app **GGL Website Feed**, using the Instagram content use case. The account owner must accept Meta's terms and approve access.
2. Connect the professional Instagram account **gkp_got_latent** through the app's supported Instagram login flow. Grant only the media and insights scopes required by the current Meta documentation. Do not enable messaging access for this website.
3. Validate the account ID, API version, media pagination and reel views metric against the app's current API configuration. The adapter uses graph.instagram.com and requires the exact account username.
4. Add `INSTAGRAM_ACCESS_TOKEN`, `INSTAGRAM_USER_ID`, and `INSTAGRAM_API_VERSION` as server-side production environment variables in Vercel. Never put tokens in source code, public variables, browser storage or the feed JSON. Redeploy.
5. Verify `/api/instagram` returns `mode: live`, current media and a live featured metric. Media access can work before insights permission; in that case the view count remains the dated verified snapshot.
6. Follow Meta's token expiry and renewal requirements and verify renewal before relying on unattended operation. Official synchronization has not been activated or tested with this account yet.

The slideshow advances every six seconds, with manual controls and pause on hover/focus. Reduced-motion users start paused. The client checks the feed every five minutes while the page is visible; server responses are cached for five minutes, so updates are periodic rather than instant. On connection failure, a clearly dated static snapshot remains available. The reel loads Instagram's embed only after the visitor clicks Play and includes a direct Instagram link.

No new third-party feed subscription is required by this implementation. Integration permissions, API availability and token renewal must be completed before claiming automatic synchronization is operational.
