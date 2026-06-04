ALTER TABLE events ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';
UPDATE events SET status = 'active' WHERE status IS NULL;
