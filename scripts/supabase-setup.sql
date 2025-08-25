-- Supabase Setup Script for Warzone Tournament System
-- Run this in your Supabase SQL Editor

-- Create storage bucket for evidence files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'evidence',
  'evidence',
  false,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm', 'application/pdf']
) ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for storage
CREATE POLICY "Evidence files are accessible by authenticated users" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'evidence' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can upload evidence files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'evidence' AND 
    auth.role() = 'authenticated'
  );

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_kills ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE score_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE obs_overlays ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id);

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid()::text AND role = 'ADMIN'
    )
  );

-- Tournaments table policies
CREATE POLICY "Anyone can view public tournaments" ON tournaments
  FOR SELECT USING (true);

CREATE POLICY "Admins and managers can create tournaments" ON tournaments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid()::text AND role IN ('ADMIN', 'MANAGER')
    )
  );

CREATE POLICY "Tournament owners can update their tournaments" ON tournaments
  FOR UPDATE USING (
    owner_id = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid()::text AND role = 'ADMIN'
    )
  );

-- Teams table policies
CREATE POLICY "Anyone can view teams" ON teams
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create teams" ON teams
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Team owners can update their teams" ON teams
  FOR UPDATE USING (
    user_id = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid()::text AND role IN ('ADMIN', 'MANAGER')
    )
  );

-- Matches table policies
CREATE POLICY "Anyone can view matches" ON matches
  FOR SELECT USING (true);

CREATE POLICY "Team members can submit matches" ON matches
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM teams 
      WHERE code = team_code AND user_id = auth.uid()::text
    )
  );

CREATE POLICY "Admins and managers can update matches" ON matches
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid()::text AND role IN ('ADMIN', 'MANAGER')
    )
  );

-- Submissions table policies
CREATE POLICY "Users can view their own submissions" ON submissions
  FOR SELECT USING (
    user_id = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid()::text AND role IN ('ADMIN', 'MANAGER')
    )
  );

CREATE POLICY "Users can create submissions" ON submissions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Score adjustments table policies
CREATE POLICY "Anyone can view score adjustments" ON score_adjustments
  FOR SELECT USING (true);

CREATE POLICY "Admins and managers can create score adjustments" ON score_adjustments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid()::text AND role IN ('ADMIN', 'MANAGER')
    )
  );

-- Audit logs table policies
CREATE POLICY "Admins and managers can view audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid()::text AND role IN ('ADMIN', 'MANAGER')
    )
  );

CREATE POLICY "System can create audit logs" ON audit_logs
  FOR INSERT WITH CHECK (true);

-- Player stats table policies
CREATE POLICY "Anyone can view player stats" ON player_stats
  FOR SELECT USING (true);

CREATE POLICY "Admins and managers can update player stats" ON player_stats
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid()::text AND role IN ('ADMIN', 'MANAGER')
    )
  );

-- OBS overlays table policies
CREATE POLICY "Anyone can view OBS overlays" ON obs_overlays
  FOR SELECT USING (true);

CREATE POLICY "Admins and managers can manage OBS overlays" ON obs_overlays
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid()::text AND role IN ('ADMIN', 'MANAGER')
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON tournaments(status);
CREATE INDEX IF NOT EXISTS idx_tournaments_owner ON tournaments(owner_id);
CREATE INDEX IF NOT EXISTS idx_teams_tournament ON teams(tournament_id);
CREATE INDEX IF NOT EXISTS idx_matches_tournament ON matches(tournament_id);
CREATE INDEX IF NOT EXISTS idx_matches_team ON matches(team_code);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tournament ON audit_logs(tournament_id);
CREATE INDEX IF NOT EXISTS idx_player_stats_tournament ON player_stats(tournament_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Enable realtime for leaderboard updates
ALTER PUBLICATION supabase_realtime ADD TABLE tournaments;
ALTER PUBLICATION supabase_realtime ADD TABLE teams;
ALTER PUBLICATION supabase_realtime ADD TABLE matches;
ALTER PUBLICATION supabase_realtime ADD TABLE player_stats;

SELECT '✅ Supabase setup completed successfully!' as status;
