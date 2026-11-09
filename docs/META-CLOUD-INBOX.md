# GGL cloud messaging pilot — OFF until account authorization and owner activation

This uses official inbound webhooks and the existing Next.js/Vercel runtime + Neon database. It does not depend on a personal computer being on. No browser scraping, paid AI calls, marketing templates, number migration, code messages, or unsolicited fee/video replies are included. The local `whatsapp-instagram` heartbeat is unchanged.

## Observed setup (9 November 2026)
- Existing project: `gorakhpursgotlatent`, Vercel project `prj_LFAF3s9KOuqjt7zF3eVHSCLBfZLq`.
- Production has DATABASE_URL, but no configured META_WA_* or META_IG_* environment keys (checked names only; no secrets decrypted).
- Developer apps could not be inspected: /apps/ showed Meta's page-not-found screen. WhatsApp Web/Instagram browser login alone is not API permission.
- Account eligibility, WABA registration, number coexistence and app-review permissions are UNVERIFIED. Do not infer them from a professional Instagram UI or a WhatsApp Business badge.

## Files and behavior
- `migrations/20261109_meta_inbox.sql`: additive tables only; NOT run on production.
- Callback URLs after deployment: `/api/meta/webhook/whatsapp` and `/api/meta/webhook/instagram`.
- GET hub.challenge verification; POST raw-body HMAC-SHA256 checks using channel app secret, strict account/recipient identity, echo suppression and media escalation.
- Durable inbox before acknowledging receipt. Duplicate provider IDs are ignored by a unique constraint. No database fallback pretending an outage is an empty result.
- `after()` starts a bounded worker after a persisted webhook. `/api/meta/process` is an authenticated POST recovery trigger. Connect a supported cloud scheduler to this POST if timely recovery of interrupted workers is required. No new scheduler/subscription is provisioned.
- `/malik/inbox`: authenticated staff inbox, drafts, history and pause control. It includes new webhook history ONLY; previous browser conversations are not imported or represented as read.
- Automatic replies are limited to reviewed greetings/application/clip FAQs, explicitly identified as automated. Unknown/financial/status/selection/event/complaint/media questions pause for a human. No dates, selection promises, payment actions, broad application lookups, or private application records are disclosed.
- A WhatsApp sender ID is a verified provider identity; never use a claimed email/phone in message text to disclose an application. Instagram-scoped IDs are not verified applicant email/phone identities.
- Conservative <23h reply window; no templates/out-of-window replies. Repeated same answers escalate. Human echoes pause Instagram; WhatsApp coexistence/operator activity must be routed to explicit inbox pause until supported echo subscriptions are verified.
- Ambiguous send outcomes are NEVER retried automatically. State `sending` after a crash or `needs_human` requires reconciling the actual Meta conversation first. This avoids duplicate sends rather than claiming impossible exactly-once external delivery.
- Conversations run under a DB lease. No cross-contact or cross-channel history mixing.

## Minimum account setup (owner/Meta admin)
Use private server-side environment settings, never paste tokens into chat and never NEXT_PUBLIC_. No credentials have been invented or generated here.
1. Meta app(s), app secrets, webhook verify tokens, supported pinned Graph version (`META_GRAPH_VERSION`, e.g. the version selected in the Meta app; no unverified default).
2. WhatsApp Business Platform Cloud API: WABA + phone-number ID + server token with `whatsapp_business_messaging` and required `whatsapp_business_management` access. Confirm phone-number ownership/coexistence support in the actual Meta account BEFORE any onboarding/migration. Existing mobile app must not be disconnected. Subscribe the app to WABA `messages` and verify the callback.
3. Instagram API with Instagram Login (this implementation): Business/Creator account ID + Instagram user access token, `instagram_business_basic`, `instagram_business_manage_messages`, webhook `messages`. Account subscription, app Live mode/advanced access and review requirements must be confirmed for conversations with non-test users. Facebook Login/Page tokens are a different integration and must not be pasted into this adapter.
4. Confirm both accounts are the actual GGL identities (WhatsApp number and @gkp_got_latent). Test tokens/permissions through Meta's own tools without sending customer messages.

Environment keys:
```
META_GRAPH_VERSION=
META_WA_ACCOUNT_ID=  # PHONE_NUMBER_ID, not the visible phone number / WABA ID
META_WA_ACCESS_TOKEN=
META_WA_APP_SECRET=
META_WA_VERIFY_TOKEN=
META_IG_ACCOUNT_ID=
META_IG_ACCESS_TOKEN=
META_IG_APP_SECRET=
META_IG_VERIFY_TOKEN=
META_WORKER_SECRET=
META_MESSAGING_ACTIVATED=false
META_WA_AUTO_REPLY=false
META_IG_AUTO_REPLY=false
META_WA_PILOT_SENDERS=
META_IG_PILOT_SENDERS=
```

## Review and cutover checklist
1. Review/merge/deploy this isolated PR, apply only the additive SQL migration after approval, configure credentials privately, verify callbacks/subscriptions. Keep three sending flags false. Check `/malik/inbox` reports readiness; messages must persist and produce drafts with NO sends.
2. Import the relevant prior conversation history via an authorized supported export/API, or leave existing conversations human-only. This pilot does not fetch or claim to know full historic inboxes. Reconcile local recent replies to prevent duplicate cloud answers.
3. Confirm charges/policies in Meta before enabling anything; no paid templates, LLM or extra service subscriptions are part of this implementation.
4. Owner approves one tester on each channel. Pause/remove these SAME conversations from local automation BEFORE setting activated + channel flags true with exact pilot sender IDs. Run incoming-message tests and check identity, duplicate webhook, media/status handoff, window, account/token revocation and outage cases. This is not authorization to message random customers.
5. Only after both channels and supported recovery scheduling are proven, request approval to disable the local heartbeat and broaden cloud sender scope. Never run both responders for the same sender. `*` is broad live activation and requires explicit owner approval.
6. Reset flags to false to stop future sends. Staff can pause a single conversation in the inbox. Secret/token revocation, data-retention rules and any deletions must be managed deliberately by the owner.

## Primary references
- Meta WhatsApp Cloud API collection: https://www.postman.com/meta/whatsapp-business-platform/collection/wlk6lh4/whatsapp-cloud-api
- Meta Instagram API collection: https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api
- https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks
- https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/messaging-api

Meta documentation access was partly rate-limited. Live account permissions and Graph version are deliberately not assumed. End-to-end Meta delivery is BLOCKED until the above access is authorized; passing local tests is not proof of live account connection.

## Costs and usage controls
The responder is deterministic TypeScript FAQ/rules, not a Codex job and not an LLM agent. Runtime makes **zero OpenAI/LLM calls**, even though this existing project has an OPENAI_API_KEY for unrelated work. Implementation/review in Codex still uses the current chat's normal credits. The existing local heartbeat can also keep using Codex credits while active; it has intentionally NOT been disabled.

Runtime dependencies are the existing Vercel Functions/hosting, Neon Postgres storage/queries and Meta messaging APIs. Their plan allowances and usage-based charges remain applicable; no promise of a free service is made. No paid provisioning, phone migration or subscription purchase was performed. WhatsApp service replies within the current customer-service window have special pricing treatment; verify the actual account and Meta's current pricing before activation. No paid templates are supported by this adapter.

`META_DAILY_REPLY_LIMIT=20` is the default maximum send attempts per connected channel/account per UTC day (allowed 1–100). At most 5 automatic replies per sender/conversation in 24 hours. Send attempts, including uncertain failures, reserve budget BEFORE the Meta call; no automatic send retry. `/malik/inbox` exposes attempts over the last 7 days. Caps do not eliminate incoming webhook, database, hosting or bandwidth costs; retain provider budget alerts/spend controls independently. Activation/recovery scheduling requiring new spend must be approved separately.

Primary pricing: https://whatsappbusiness.com/products/platform-pricing/ , https://vercel.com/docs/pricing , https://neon.com/pricing .

Owner subsequently authorized cloud activation in this chat. A repeat generic activation approval is not required; missing Meta permissions, exact account/recipient identities, safe cutover and any new-spend decisions remain prerequisites. Do not mark active until actual incoming and outgoing Meta tests succeed.
