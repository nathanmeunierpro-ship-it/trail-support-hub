ALTER TABLE candidatures ADD COLUMN IF NOT EXISTS telephone text;
ALTER TABLE candidatures ADD COLUMN IF NOT EXISTS disponibilite_horaire text;
ALTER TABLE candidatures ADD COLUMN IF NOT EXISTS transport text;
ALTER TABLE candidatures ADD COLUMN IF NOT EXISTS niveau text;
ALTER TABLE candidatures ADD COLUMN IF NOT EXISTS message_perso text;
