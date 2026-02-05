-- Users / Auth
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  password_hash TEXT,
  role TEXT DEFAULT 'user',
  created_at INTEGER DEFAULT (unixepoch())
);

-- Analytics
CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY,
  path TEXT,
  country TEXT,
  referrer TEXT,
  user_agent TEXT,
  is_bot BOOLEAN,
  created_at INTEGER DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS idx_analytics_path ON analytics_events(path);
CREATE INDEX IF NOT EXISTS idx_analytics_is_bot ON analytics_events(is_bot);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at);

-- Books
CREATE TABLE IF NOT EXISTS books (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  type TEXT, -- 'currently_reading' | 'read' | 'to_read'
  title TEXT,
  author TEXT,
  image_url TEXT,
  link TEXT,
  date_added TEXT,
  created_at INTEGER DEFAULT (unixepoch())
);

-- Certificates
CREATE TABLE IF NOT EXISTS certificates (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  title TEXT,
  issued_by TEXT,
  date_issued TEXT,
  credential_id TEXT,
  image_url TEXT,
  organization_logo_url TEXT,
  link TEXT,
  created_at INTEGER DEFAULT (unixepoch())
);

-- Comments
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  post_id TEXT,
  author TEXT,
  content TEXT,
  likes INTEGER DEFAULT 0,
  avatar_url TEXT,
  parent_id TEXT, -- For nested comments
  path TEXT, -- Hierarchy helper
  created_at INTEGER DEFAULT (unixepoch())
);

-- Employments
CREATE TABLE IF NOT EXISTS employments (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  organization TEXT,
  organization_industry TEXT,
  job_title TEXT,
  job_type TEXT, -- 'full_time' | 'part_time' | 'contract' | 'freelance' | 'internship'
  responsibilities TEXT, -- JSON array
  date_string TEXT,
  organization_logo_url TEXT,
  organization_location TEXT,
  created_at INTEGER DEFAULT (unixepoch())
);

-- Feedback
CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY,
  feedback TEXT,
  contact TEXT,
  created_at INTEGER DEFAULT (unixepoch())
);

-- Interests and Objectives (Singleton)
CREATE TABLE IF NOT EXISTS interests_objectives (
  id INTEGER PRIMARY KEY DEFAULT 1,
  description TEXT,
  objectives TEXT, -- JSON array
  conclusion TEXT,
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Movies
CREATE TABLE IF NOT EXISTS movies (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  title TEXT,
  release_date TEXT,
  imdb_id TEXT,
  poster_url TEXT,
  imdb_link TEXT,
  rating REAL,
  created_at INTEGER DEFAULT (unixepoch())
);

-- Personal Info (Singleton)
CREATE TABLE IF NOT EXISTS personal_info (
  id INTEGER PRIMARY KEY DEFAULT 1,
  name TEXT,
  title TEXT,
  avatar_url TEXT,
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Posts
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  title TEXT,
  content TEXT,
  excerpt TEXT,
  image_url TEXT,
  audio_url TEXT,
  categories TEXT, -- JSON array
  date_string TEXT,
  created_at INTEGER DEFAULT (unixepoch())
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  name TEXT,
  date_string TEXT,
  image_url TEXT,
  description TEXT,
  tools TEXT, -- JSON array
  readme TEXT,
  status TEXT, -- 'in_progress' | 'completed' | 'upcoming'
  link TEXT,
  favicon_url TEXT,
  github_repo_url TEXT,
  pinned BOOLEAN DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch())
);

-- Publications
CREATE TABLE IF NOT EXISTS publications (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  title TEXT,
  authors TEXT, -- JSON array
  publisher TEXT,
  excerpt TEXT,
  keywords TEXT, -- JSON array
  open_access BOOLEAN DEFAULT 0,
  link TEXT,
  created_at INTEGER DEFAULT (unixepoch())
);

-- Resume (Singleton)
CREATE TABLE IF NOT EXISTS resume (
  id INTEGER PRIMARY KEY DEFAULT 1,
  file_url TEXT,
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Sections
CREATE TABLE IF NOT EXISTS sections (
  id TEXT PRIMARY KEY,
  name TEXT,
  title TEXT,
  enabled BOOLEAN DEFAULT 1,
  sort_order INTEGER,
  created_at INTEGER DEFAULT (unixepoch())
);

-- Spotify Tokens
CREATE TABLE IF NOT EXISTS spotify_tokens (
  id TEXT PRIMARY KEY DEFAULT 'spotify',
  access_token TEXT,
  refresh_token TEXT,
  timestamp INTEGER,
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Customization Settings
CREATE TABLE IF NOT EXISTS customization_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  default_theme TEXT DEFAULT 'gruvbox-dark',
  default_background TEXT DEFAULT 'none',
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Insert default row if not exists
INSERT OR IGNORE INTO customization_settings (id, default_theme, default_background) 
VALUES (1, 'gruvbox-dark', 'none');
