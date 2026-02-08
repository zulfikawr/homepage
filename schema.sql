-- =============================================================================
-- DATABASE SCHEMA
-- =============================================================================
-- This file defines the complete database schema for the application.
-- All tables use TEXT for primary keys (UUIDs) except singleton tables which use INTEGER.
-- Timestamps are stored as Unix epoch integers.
-- JSON arrays are stored as TEXT and parsed in application code.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- AUTHENTICATION & USERS
-- -----------------------------------------------------------------------------

-- Users / Auth
-- Stores user authentication and profile information
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,                              -- UUID
  email TEXT UNIQUE,                                -- User email (unique)
  password_hash TEXT,                               -- Hashed password
  role TEXT DEFAULT 'user',                         -- User role (user, admin)
  created_at INTEGER DEFAULT (unixepoch())          -- Account creation timestamp
);

-- -----------------------------------------------------------------------------
-- ANALYTICS
-- -----------------------------------------------------------------------------

-- Analytics Events
-- Tracks page views and user interactions
CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY,                              -- UUID
  path TEXT,                                        -- Page path visited
  country TEXT,                                     -- Visitor country
  referrer TEXT,                                    -- Referrer URL
  user_agent TEXT,                                  -- Browser user agent
  is_bot BOOLEAN,                                   -- Whether visitor is a bot
  created_at INTEGER DEFAULT (unixepoch())          -- Event timestamp
);
CREATE INDEX IF NOT EXISTS idx_analytics_path ON analytics_events(path);
CREATE INDEX IF NOT EXISTS idx_analytics_is_bot ON analytics_events(is_bot);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at);

-- -----------------------------------------------------------------------------
-- CONTENT - BOOKS
-- -----------------------------------------------------------------------------

-- Books
-- Reading list with current, completed, and to-read books
CREATE TABLE IF NOT EXISTS books (
  id TEXT PRIMARY KEY,                              -- UUID
  slug TEXT UNIQUE,                                 -- URL-friendly identifier
  type TEXT,                                        -- 'currently_reading' | 'read' | 'to_read'
  title TEXT,                                       -- Book title
  author TEXT,                                      -- Book author
  image_url TEXT,                                   -- Book cover image
  link TEXT,                                        -- External link (e.g., Goodreads)
  date_added TEXT,                                  -- Date added to list
  created_at INTEGER DEFAULT (unixepoch())          -- Record creation timestamp
);

-- -----------------------------------------------------------------------------
-- CONTENT - CERTIFICATES
-- -----------------------------------------------------------------------------

-- Certificates
-- Professional certifications and credentials
CREATE TABLE IF NOT EXISTS certificates (
  id TEXT PRIMARY KEY,                              -- UUID
  slug TEXT UNIQUE,                                 -- URL-friendly identifier
  title TEXT,                                       -- Certificate title
  issued_by TEXT,                                   -- Issuing organization
  date_issued TEXT,                                 -- Issue date
  credential_id TEXT,                               -- Credential ID
  image_url TEXT,                                   -- Certificate image
  organization_logo_url TEXT,                       -- Organization logo
  link TEXT,                                        -- Verification link
  created_at INTEGER DEFAULT (unixepoch())          -- Record creation timestamp
);

-- -----------------------------------------------------------------------------
-- CONTENT - COMMENTS
-- -----------------------------------------------------------------------------

-- Comments
-- User comments on posts with nested reply support
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,                              -- UUID
  post_id TEXT,                                     -- Associated post ID
  author TEXT,                                      -- Comment author name
  content TEXT,                                     -- Comment content
  likes INTEGER DEFAULT 0,                          -- Number of likes
  avatar_url TEXT,                                  -- Author avatar URL
  parent_id TEXT,                                   -- Parent comment ID (for nested comments)
  path TEXT,                                        -- Hierarchy helper
  created_at INTEGER DEFAULT (unixepoch())          -- Comment timestamp
);

-- -----------------------------------------------------------------------------
-- CONTENT - EMPLOYMENTS
-- -----------------------------------------------------------------------------

-- Employments
-- Work history and employment records
CREATE TABLE IF NOT EXISTS employments (
  id TEXT PRIMARY KEY,                              -- UUID
  slug TEXT UNIQUE,                                 -- URL-friendly identifier
  organization TEXT,                                -- Organization name
  organization_industry TEXT,                       -- Industry sector
  job_title TEXT,                                   -- Job title
  job_type TEXT,                                    -- 'full_time' | 'part_time' | 'contract' | 'freelance' | 'internship'
  responsibilities TEXT,                            -- JSON array of responsibilities
  date_string TEXT,                                 -- Employment period
  organization_logo_url TEXT,                       -- Organization logo
  organization_location TEXT,                       -- Work location
  created_at INTEGER DEFAULT (unixepoch())          -- Record creation timestamp
);

-- -----------------------------------------------------------------------------
-- CONTENT - FEEDBACK
-- -----------------------------------------------------------------------------

-- Feedback
-- User feedback and contact messages
CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY,                              -- UUID
  feedback TEXT,                                    -- Feedback message
  contact TEXT,                                     -- Contact information
  created_at INTEGER DEFAULT (unixepoch())          -- Submission timestamp
);

-- -----------------------------------------------------------------------------
-- CONTENT - INTERESTS & OBJECTIVES
-- -----------------------------------------------------------------------------

-- Interests and Objectives (Singleton)
-- Personal interests and career objectives
CREATE TABLE IF NOT EXISTS interests_objectives (
  id INTEGER PRIMARY KEY DEFAULT 1,                 -- Singleton ID
  description TEXT,                                 -- Interest description
  objectives TEXT,                                  -- JSON array of objectives
  conclusion TEXT,                                  -- Concluding statement
  updated_at INTEGER DEFAULT (unixepoch())          -- Last update timestamp
);

-- -----------------------------------------------------------------------------
-- CONTENT - MOVIES
-- -----------------------------------------------------------------------------

-- Movies
-- Movie watchlist and ratings
CREATE TABLE IF NOT EXISTS movies (
  id TEXT PRIMARY KEY,                              -- UUID
  slug TEXT UNIQUE,                                 -- URL-friendly identifier
  title TEXT,                                       -- Movie title
  release_date TEXT,                                -- Release date
  imdb_id TEXT,                                     -- IMDb ID
  poster_url TEXT,                                  -- Movie poster URL
  imdb_link TEXT,                                   -- IMDb link
  rating REAL,                                      -- Personal rating
  created_at INTEGER DEFAULT (unixepoch())          -- Record creation timestamp
);

-- -----------------------------------------------------------------------------
-- CONTENT - PERSONAL INFO
-- -----------------------------------------------------------------------------

-- Personal Info (Singleton)
-- Personal profile information
CREATE TABLE IF NOT EXISTS personal_info (
  id INTEGER PRIMARY KEY DEFAULT 1,                 -- Singleton ID
  name TEXT,                                        -- Full name
  title TEXT,                                       -- Professional title
  avatar_url TEXT,                                  -- Avatar image URL
  updated_at INTEGER DEFAULT (unixepoch())          -- Last update timestamp
);

-- -----------------------------------------------------------------------------
-- CONTENT - POSTS
-- -----------------------------------------------------------------------------

-- Posts
-- Blog posts and articles
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,                              -- UUID
  slug TEXT UNIQUE,                                 -- URL-friendly identifier
  title TEXT,                                       -- Post title
  content TEXT,                                     -- Post content (markdown)
  excerpt TEXT,                                     -- Short excerpt
  image_url TEXT,                                   -- Featured image URL
  audio_url TEXT,                                   -- Audio file URL (optional)
  categories TEXT,                                  -- JSON array of categories
  date_string TEXT,                                 -- Publication date
  created_at INTEGER DEFAULT (unixepoch())          -- Record creation timestamp
);

-- -----------------------------------------------------------------------------
-- CONTENT - PROJECTS
-- -----------------------------------------------------------------------------

-- Projects
-- Portfolio projects and work samples
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,                              -- UUID
  slug TEXT UNIQUE,                                 -- URL-friendly identifier
  name TEXT,                                        -- Project name
  date_string TEXT,                                 -- Project date/period
  image_url TEXT,                                   -- Project image URL
  description TEXT,                                 -- Short description
  tools TEXT,                                       -- JSON array of tools/technologies
  readme TEXT,                                      -- Detailed README (markdown)
  status TEXT,                                      -- 'in_progress' | 'completed' | 'upcoming'
  link TEXT,                                        -- Project URL
  favicon_url TEXT,                                 -- Project favicon
  github_repo_url TEXT,                             -- GitHub repository URL
  pinned BOOLEAN DEFAULT 0,                         -- Whether project is pinned
  created_at INTEGER DEFAULT (unixepoch())          -- Record creation timestamp
);

-- -----------------------------------------------------------------------------
-- CONTENT - PUBLICATIONS
-- -----------------------------------------------------------------------------

-- Publications
-- Academic publications and research papers
CREATE TABLE IF NOT EXISTS publications (
  id TEXT PRIMARY KEY,                              -- UUID
  slug TEXT UNIQUE,                                 -- URL-friendly identifier
  title TEXT,                                       -- Publication title
  authors TEXT,                                     -- JSON array of authors
  publisher TEXT,                                   -- Publisher name
  excerpt TEXT,                                     -- Abstract/excerpt
  keywords TEXT,                                    -- JSON array of keywords
  open_access BOOLEAN DEFAULT 0,                    -- Whether open access
  link TEXT,                                        -- Publication URL
  created_at INTEGER DEFAULT (unixepoch())          -- Record creation timestamp
);

-- -----------------------------------------------------------------------------
-- CONTENT - RESUME
-- -----------------------------------------------------------------------------

-- Resume (Singleton)
-- Resume/CV file storage
CREATE TABLE IF NOT EXISTS resume (
  id INTEGER PRIMARY KEY DEFAULT 1,                 -- Singleton ID
  file_url TEXT,                                    -- Resume file URL
  updated_at INTEGER DEFAULT (unixepoch())          -- Last update timestamp
);

-- -----------------------------------------------------------------------------
-- CONTENT - SECTIONS
-- -----------------------------------------------------------------------------

-- Sections
-- Website sections configuration
CREATE TABLE IF NOT EXISTS sections (
  id TEXT PRIMARY KEY,                              -- UUID
  name TEXT,                                        -- Section identifier
  title TEXT,                                       -- Display title
  enabled BOOLEAN DEFAULT 1,                        -- Whether section is enabled
  sort_order INTEGER,                               -- Display order
  created_at INTEGER DEFAULT (unixepoch())          -- Record creation timestamp
);

-- -----------------------------------------------------------------------------
-- INTEGRATIONS - SPOTIFY
-- -----------------------------------------------------------------------------

-- Spotify Tokens
-- OAuth tokens for Spotify integration
CREATE TABLE IF NOT EXISTS spotify_tokens (
  id TEXT PRIMARY KEY DEFAULT 'spotify',            -- Fixed ID
  access_token TEXT,                                -- OAuth access token
  refresh_token TEXT,                               -- OAuth refresh token
  timestamp INTEGER,                                -- Token timestamp
  updated_at INTEGER DEFAULT (unixepoch())          -- Last update timestamp
);

-- -----------------------------------------------------------------------------
-- SETTINGS - CUSTOMIZATION
-- -----------------------------------------------------------------------------

-- Customization Settings (Singleton)
-- User interface customization preferences
CREATE TABLE IF NOT EXISTS customization_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,                 -- Singleton ID
  default_theme TEXT DEFAULT 'gruvbox-dark',        -- Default theme
  default_background TEXT DEFAULT 'none',           -- Default background
  updated_at INTEGER DEFAULT (unixepoch())          -- Last update timestamp
);

-- Insert default customization settings
INSERT OR IGNORE INTO customization_settings (id, default_theme, default_background) 
VALUES (1, 'gruvbox-dark', 'none');
