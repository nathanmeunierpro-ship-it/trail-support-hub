-- Extend benevoles with profile fields
ALTER TABLE benevoles
  ADD COLUMN IF NOT EXISTS region text,
  ADD COLUMN IF NOT EXISTS sports_pratiques text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS dispo_text text,
  ADD COLUMN IF NOT EXISTS bio text;

-- Favoris
CREATE TABLE IF NOT EXISTS favoris (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  benevole_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(benevole_id, event_id)
);
ALTER TABLE favoris ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Benevole can manage own favoris" ON favoris
  FOR ALL USING (auth.uid() = benevole_id);

-- Avis
CREATE TABLE IF NOT EXISTS avis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user uuid REFERENCES auth.users(id),
  to_user uuid REFERENCES auth.users(id),
  event_id uuid REFERENCES events(id),
  note integer CHECK (note BETWEEN 1 AND 5),
  commentaire text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(from_user, to_user, event_id)
);
ALTER TABLE avis ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Users can insert own avis" ON avis
  FOR INSERT WITH CHECK (auth.uid() = from_user);
CREATE POLICY IF NOT EXISTS "Avis are public" ON avis
  FOR SELECT USING (true);
