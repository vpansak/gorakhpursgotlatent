-- Additive only. Run after review, before connecting webhooks. No existing data is changed.
CREATE TABLE IF NOT EXISTS ggl_meta_conversations (
 channel TEXT NOT NULL CHECK (channel IN ('whatsapp','instagram')),
 account TEXT NOT NULL, sender TEXT NOT NULL,
 paused BOOLEAN NOT NULL DEFAULT FALSE, pause_reason TEXT,
 lease_token TEXT, lease_until TIMESTAMPTZ,
 PRIMARY KEY (channel, account, sender)
);
CREATE TABLE IF NOT EXISTS ggl_meta_messages (
 id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 channel TEXT NOT NULL, account TEXT NOT NULL, sender TEXT NOT NULL,
 provider_id TEXT NOT NULL, message_at TIMESTAMPTZ NOT NULL,
 text TEXT NOT NULL, kind TEXT NOT NULL,
 direction TEXT NOT NULL CHECK (direction IN ('inbound','outbound','echo')),
 state TEXT NOT NULL DEFAULT 'pending', reason TEXT,
 draft TEXT, outbound_id TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 UNIQUE(channel,account,provider_id),
 FOREIGN KEY(channel,account,sender) REFERENCES ggl_meta_conversations(channel,account,sender)
);
CREATE INDEX IF NOT EXISTS ggl_meta_messages_pending ON ggl_meta_messages (state,id);
CREATE INDEX IF NOT EXISTS ggl_meta_messages_history ON ggl_meta_messages (channel,account,sender,id DESC);

CREATE TABLE IF NOT EXISTS ggl_meta_daily_usage (
 day DATE NOT NULL, channel TEXT NOT NULL, account TEXT NOT NULL,
 attempts INTEGER NOT NULL DEFAULT 0 CHECK(attempts>=0),
 PRIMARY KEY(day,channel,account)
);
