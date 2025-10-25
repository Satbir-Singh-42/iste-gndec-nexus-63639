-- ISTE GNDEC Student Chapter Website - Database Schema
-- This file contains all table definitions for the Supabase PostgreSQL database

-- Event Highlights Table
-- Stores completed event highlights with Instagram integration
create table public.event_highlights (
  id bigserial not null,
  title text not null,
  date text not null,
  location text not null,
  description text not null,
  poster text not null,
  instagram_link text not null,
  attendees text null default ''::text,
  highlights text[] null default '{}'::text[],
  created_at timestamp with time zone null default now(),
  hidden boolean null default false,
  display_order integer null,
  constraint event_highlights_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists idx_event_highlights_display_order on public.event_highlights using btree (display_order) TABLESPACE pg_default;

create index IF not exists idx_event_highlights_hidden on public.event_highlights using btree (hidden) TABLESPACE pg_default;


-- Events Table
-- Stores event information with details, agenda, and status
create table public.events (
  id bigserial not null,
  title text not null,
  date text not null,
  time text not null,
  location text not null,
  description text not null,
  status text not null,
  capacity text null,
  organizer text not null,
  details text not null,
  agenda text[] null,
  created_at timestamp with time zone null default now(),
  hidden boolean null default false,
  display_order integer null,
  constraint events_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists idx_events_display_order on public.events using btree (display_order) TABLESPACE pg_default;

create index IF not exists idx_events_hidden on public.events using btree (hidden) TABLESPACE pg_default;

create index IF not exists idx_events_status on public.events using btree (status) TABLESPACE pg_default;


-- Gallery Table
-- Stores photo galleries with categories and multiple images
create table public.gallery (
  id bigserial not null,
  title text not null,
  category text not null,
  description text not null,
  created_at timestamp with time zone null default now(),
  hidden boolean null default false,
  display_order integer null,
  images text[] not null,
  constraint gallery_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists idx_gallery_display_order on public.gallery using btree (display_order) TABLESPACE pg_default;

create index IF not exists idx_gallery_hidden on public.gallery using btree (hidden) TABLESPACE pg_default;

create index IF not exists idx_gallery_category on public.gallery using btree (category) TABLESPACE pg_default;


-- Core Team Members Table
-- Stores information about core team members
create table public.members_core_team (
  id bigserial not null,
  name text not null,
  position text not null,
  image text not null,
  email text null,
  created_at timestamp with time zone null default now(),
  hidden boolean null default false,
  display_order integer null default 0,
  linkedin text null,
  github text null,
  instagram text null,
  constraint members_core_team_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists idx_members_core_display_order on public.members_core_team using btree (display_order) TABLESPACE pg_default;



-- Executive Team Members Table
-- Stores information about executive team members
create table public.members_executive (
  id bigserial not null,
  name text not null,
  position text not null,
  image text not null,
  email text null,
  created_at timestamp with time zone null default now(),
  hidden boolean null default false,
  display_order integer null default 0,
  linkedin text null,
  github text null,
  instagram text null,
  constraint members_executive_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists idx_members_executive_display_order on public.members_executive using btree (display_order) TABLESPACE pg_default;


-- Faculty Members Table
-- Stores information about faculty advisors
create table public.members_faculty (
  id bigserial not null,
  name text not null,
  title text not null,
  image text not null,
  description text not null,
  created_at timestamp with time zone null default now(),
  hidden boolean null default false,
  display_order integer null default 0,
  linkedin text null,
  github text null,
  instagram text null,
  constraint members_faculty_pkey primary key (id)
) TABLESPACE pg_default;

-- Post Holders Table
-- Stores information about post holder members
create table public.members_post_holders (
  id bigserial not null,
  name text not null,
  position text not null,
  image text not null,
  email text null,
  created_at timestamp with time zone null default now(),
  hidden boolean null default false,
  display_order integer null default 0,
  linkedin text null,
  github text null,
  instagram text null,
  constraint members_post_holders_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists idx_members_post_holders_display_order on public.members_post_holders using btree (display_order) TABLESPACE pg_default;


-- Notices Table
-- Stores notice board items with rich content support
create table public.notices (
  id bigserial not null,
  title text not null,
  date text not null,
  time text not null,
  type text not null,
  status text not null,
  description text not null,
  created_at timestamp with time zone null default now(),
  rich_description text null,
  poster_url text null,
  attachments jsonb null default '[]'::jsonb,
  external_link text null,
  hidden boolean null default false,
  display_order integer null,
  constraint notices_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists idx_notices_display_order on public.notices using btree (display_order) TABLESPACE pg_default;

create index IF not exists idx_notices_hidden on public.notices using btree (hidden) TABLESPACE pg_default;

create index IF not exists idx_notices_type on public.notices using btree (type) TABLESPACE pg_default;

create index IF not exists idx_notices_status on public.notices using btree (status) TABLESPACE pg_default;


-- Projects Table
-- Stores student project showcase information
create table public.projects (
  id serial not null,
  title text not null,
  description text not null,
  image_url text not null,
  technologies text[] not null default '{}'::text[],
  github_link text null,
  demo_link text null,
  status text not null default 'ongoing'::text,
  category text not null,
  featured boolean null default false,
  hidden boolean null default false,
  display_order integer null,
  created_at timestamp with time zone null default now(),
  constraint projects_pkey primary key (id)
) TABLESPACE pg_default;

-- Chapter Awards Table
-- Stores annual Best Student Chapter awards
create table public.chapter_awards (
  id bigserial not null,
  award_title text not null,
  year text not null,
  description text not null,
  certificate_image text not null,
  created_at timestamp with time zone null default now(),
  hidden boolean null default false,
  display_order integer null,
  constraint chapter_awards_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists idx_chapter_awards_display_order on public.chapter_awards using btree (display_order) TABLESPACE pg_default;

create index IF not exists idx_chapter_awards_hidden on public.chapter_awards using btree (hidden) TABLESPACE pg_default;


-- Past Convenors Table
-- Stores past convenor information with tenure period
create table public.past_convenors (
  id bigserial not null,
  name text not null,
  image text not null,
  tenure_start text not null,
  tenure_end text not null,
  description text null,
  created_at timestamp with time zone null default now(),
  hidden boolean null default false,
  display_order integer null,
  constraint past_convenors_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists idx_past_convenors_display_order on public.past_convenors using btree (display_order) TABLESPACE pg_default;

create index IF not exists idx_past_convenors_hidden on public.past_convenors using btree (hidden) TABLESPACE pg_default;


-- Student Achievements Table
-- Stores individual student achievements
create table public.student_achievements (
  id bigserial not null,
  student_name text not null,
  event_name text not null,
  position text not null,
  date text not null,
  organized_by text not null,
  description text not null,
  achievement_image text not null,
  created_at timestamp with time zone null default now(),
  hidden boolean null default false,
  display_order integer null,
  constraint student_achievements_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists idx_student_achievements_display_order on public.student_achievements using btree (display_order) TABLESPACE pg_default;

create index IF not exists idx_student_achievements_hidden on public.student_achievements using btree (hidden) TABLESPACE pg_default;


-- Site Settings Table
-- Stores application configuration settings
create table public.site_settings (
  id serial not null,
  setting_key text not null,
  setting_value boolean not null default false,
  updated_at timestamp with time zone null default now(),
  constraint site_settings_pkey primary key (id),
  constraint site_settings_setting_key_key unique (setting_key)
) TABLESPACE pg_default;

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_events_display_order ON public.events(display_order);
CREATE INDEX IF NOT EXISTS idx_events_hidden ON public.events(hidden);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);

CREATE INDEX IF NOT EXISTS idx_gallery_display_order ON public.gallery(display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_hidden ON public.gallery(hidden);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON public.gallery(category);

CREATE INDEX IF NOT EXISTS idx_notices_display_order ON public.notices(display_order);
CREATE INDEX IF NOT EXISTS idx_notices_hidden ON public.notices(hidden);
CREATE INDEX IF NOT EXISTS idx_notices_type ON public.notices(type);
CREATE INDEX IF NOT EXISTS idx_notices_status ON public.notices(status);

CREATE INDEX IF NOT EXISTS idx_projects_display_order ON public.projects(display_order);
CREATE INDEX IF NOT EXISTS idx_projects_hidden ON public.projects(hidden);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);

CREATE INDEX IF NOT EXISTS idx_event_highlights_display_order ON public.event_highlights(display_order);
CREATE INDEX IF NOT EXISTS idx_event_highlights_hidden ON public.event_highlights(hidden);

CREATE INDEX IF NOT EXISTS idx_members_core_display_order ON public.members_core_team(display_order);
CREATE INDEX IF NOT EXISTS idx_members_executive_display_order ON public.members_executive(display_order);
CREATE INDEX IF NOT EXISTS idx_members_faculty_display_order ON public.members_faculty(display_order);
CREATE INDEX IF NOT EXISTS idx_members_post_holders_display_order ON public.members_post_holders(display_order);

CREATE INDEX IF NOT EXISTS idx_chapter_awards_display_order ON public.chapter_awards(display_order);
CREATE INDEX IF NOT EXISTS idx_chapter_awards_hidden ON public.chapter_awards(hidden);

CREATE INDEX IF NOT EXISTS idx_past_convenors_display_order ON public.past_convenors(display_order);
CREATE INDEX IF NOT EXISTS idx_past_convenors_hidden ON public.past_convenors(hidden);

CREATE INDEX IF NOT EXISTS idx_student_achievements_display_order ON public.student_achievements(display_order);
CREATE INDEX IF NOT EXISTS idx_student_achievements_hidden ON public.student_achievements(hidden);

-- Comments for documentation
COMMENT ON TABLE public.events IS 'Stores event information including upcoming, ongoing, and past events';
COMMENT ON TABLE public.notices IS 'Notice board items with support for rich content, attachments, and external links';
COMMENT ON TABLE public.gallery IS 'Photo galleries organized by categories';
COMMENT ON TABLE public.projects IS 'Student project showcase with technologies and demo links';
COMMENT ON TABLE public.event_highlights IS 'Completed event highlights with Instagram integration';
COMMENT ON TABLE public.members_core_team IS 'Core team member profiles';
COMMENT ON TABLE public.members_executive IS 'Executive team member profiles';
COMMENT ON TABLE public.members_faculty IS 'Faculty advisor profiles';
COMMENT ON TABLE public.members_post_holders IS 'Post holder member profiles';
COMMENT ON TABLE public.chapter_awards IS 'Annual Best Student Chapter awards';
COMMENT ON TABLE public.past_convenors IS 'Past convenor profiles with tenure information';
COMMENT ON TABLE public.student_achievements IS 'Individual student achievements and awards';
COMMENT ON TABLE public.site_settings IS 'Application-wide configuration settings';
