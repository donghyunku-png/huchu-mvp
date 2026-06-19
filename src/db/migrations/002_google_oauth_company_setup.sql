-- ============================================================
-- Huchu Google OAuth + company onboarding migration
-- Apply after 001_init.sql.
-- ============================================================

ALTER TABLE users
  ALTER COLUMN password_hash DROP NOT NULL;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(30),
  ADD COLUMN IF NOT EXISTS auth_provider_id VARCHAR(255);

CREATE INDEX IF NOT EXISTS idx_users_auth_provider
  ON users(auth_provider, auth_provider_id);
