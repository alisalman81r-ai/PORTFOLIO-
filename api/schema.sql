-- Contact enquiries.
--
-- Written for Postgres, which is what Supabase runs. Nothing here is
-- Supabase-specific except the RLS block at the bottom, which is clearly marked
-- and can be dropped on plain Postgres.
--
-- Run it in the Supabase SQL editor, or with `psql -f api/schema.sql`.

-- ── Status ────────────────────────────────────────────────────────────────
-- An enum rather than a free-text column: the set of states is small, closed
-- and known, and a typo in a text column ('Repled') is a row that quietly
-- disappears from every filtered view.
--
-- Adding a state later is `ALTER TYPE enquiry_status ADD VALUE 'archived';`
-- which is a non-blocking operation in modern Postgres.
do $$
begin
  if not exists (select 1 from pg_type where typname = 'enquiry_status') then
    create type enquiry_status as enum ('new', 'replied', 'closed');
  end if;
end
$$;

create table if not exists contact_enquiries (
  id            uuid primary key default gen_random_uuid(),

  -- Lengths mirror the constraints in shared/contactSchema.js. Enforced in both
  -- places deliberately: the application rejects with a useful message, and the
  -- column rejects anything that reaches it another way.
  name          varchar(80)  not null,
  email         varchar(160) not null,
  company       varchar(120),
  service       varchar(40)  not null,
  budget        varchar(40),
  timeline      varchar(40),
  subject       varchar(120) not null,
  message       varchar(2000) not null,

  status        enquiry_status not null default 'new',
  created_at    timestamptz    not null default now(),
  replied_at    timestamptz,

  -- Kept for abuse investigation, not analytics. Both are personal data under
  -- GDPR; see the retention note at the bottom of this file.
  ip            varchar(64),
  user_agent    varchar(300),

  -- Free-text working notes. Nothing writes this but you.
  notes         text
);

-- ── Indexes ───────────────────────────────────────────────────────────────
-- The two queries this table will actually serve: "what is new" and "everything
-- from this person". Anything else is a table scan over a table that will never
-- be large enough for that to matter.
create index if not exists contact_enquiries_status_created_idx
  on contact_enquiries (status, created_at desc);

create index if not exists contact_enquiries_email_idx
  on contact_enquiries (lower(email));

-- ── Replied timestamp ─────────────────────────────────────────────────────
-- Set by the database rather than by whoever changes the status, so it cannot
-- be forgotten and cannot disagree with the status column.
create or replace function set_replied_at()
returns trigger as $$
begin
  if new.status = 'replied' and old.status is distinct from 'replied' then
    new.replied_at = now();
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists contact_enquiries_replied_at on contact_enquiries;
create trigger contact_enquiries_replied_at
  before update on contact_enquiries
  for each row execute function set_replied_at();

-- ── Row level security (Supabase) ─────────────────────────────────────────
-- Enabled with NO policies, which denies everything by default. That is the
-- intent: this table is written only by the serverless function, which uses the
-- service role key and bypasses RLS entirely.
--
-- Without this, Supabase's anon key — which IS exposed to browsers — could read
-- every enquiry you have ever received. Leaving RLS off on a table like this is
-- one of the most common Supabase data leaks.
--
-- Drop this block if you are running plain Postgres.
alter table contact_enquiries enable row level security;

-- ── Retention ─────────────────────────────────────────────────────────────
-- `ip` and `user_agent` are personal data kept only to investigate abuse, and
-- there is no reason to hold them for years. Run this periodically — Supabase
-- can schedule it with pg_cron:
--
--   update contact_enquiries
--      set ip = null, user_agent = null
--    where created_at < now() - interval '90 days'
--      and ip is not null;
