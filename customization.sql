-- Customization Settings (Singleton)
CREATE TABLE IF NOT EXISTS customization_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  default_theme TEXT DEFAULT 'gruvbox-dark',
  default_background TEXT DEFAULT 'none',
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Insert default row if not exists
INSERT OR IGNORE INTO customization_settings (id, default_theme, default_background) 
VALUES (1, 'gruvbox-dark', 'none');
