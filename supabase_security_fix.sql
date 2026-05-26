-- ================================================================
-- SUPABASE SECURITY + ADMIN FIX
-- Jalankan di Supabase Dashboard -> SQL Editor -> New Query -> Run
--
-- Tujuan:
-- 1. Admin frontend bisa menyimpan pengaturan, album, lagu, dan hapus ucapan.
-- 2. Policy tidak memakai USING (true) / WITH CHECK (true).
-- 3. Storage album bisa upload, dibaca publik, dan dihapus dari admin frontend.
--
-- Catatan:
-- Website ini memakai Supabase anon key di browser. PIN admin hanya proteksi UI,
-- bukan proteksi backend yang kuat. Untuk keamanan produksi penuh, pindahkan
-- operasi admin ke Edge Function / backend dengan service role.
-- ================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- ================================================================
-- event_info
-- ================================================================
ALTER TABLE public.event_info ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE ON public.event_info TO anon, authenticated;
REVOKE DELETE ON public.event_info FROM anon, authenticated;

DROP POLICY IF EXISTS "Allow public read event_info" ON public.event_info;
DROP POLICY IF EXISTS "Allow all writes event_info" ON public.event_info;
DROP POLICY IF EXISTS "Allow admin insert event_info" ON public.event_info;
DROP POLICY IF EXISTS "Allow admin update event_info" ON public.event_info;

CREATE POLICY "Allow public read event_info"
  ON public.event_info
  FOR SELECT
  TO anon, authenticated
  USING (id = 1);

CREATE POLICY "Allow admin insert event_info"
  ON public.event_info
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    id = 1
    AND length(trim(coalesce(child_name, ''))) BETWEEN 1 AND 80
    AND length(trim(coalesce(child_full_name, ''))) BETWEEN 1 AND 120
    AND age BETWEEN 1 AND 120
    AND length(trim(coalesce(admin_pin, ''))) BETWEEN 4 AND 12
  );

CREATE POLICY "Allow admin update event_info"
  ON public.event_info
  FOR UPDATE
  TO anon, authenticated
  USING (id = 1)
  WITH CHECK (
    id = 1
    AND length(trim(coalesce(child_name, ''))) BETWEEN 1 AND 80
    AND length(trim(coalesce(child_full_name, ''))) BETWEEN 1 AND 120
    AND age BETWEEN 1 AND 120
    AND length(trim(coalesce(admin_pin, ''))) BETWEEN 4 AND 12
  );

-- ================================================================
-- wishes
-- ================================================================
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, DELETE ON public.wishes TO anon, authenticated;
REVOKE UPDATE ON public.wishes FROM anon, authenticated;

DROP POLICY IF EXISTS "Allow public read wishes" ON public.wishes;
DROP POLICY IF EXISTS "Allow public insert wishes" ON public.wishes;
DROP POLICY IF EXISTS "Allow all delete wishes" ON public.wishes;
DROP POLICY IF EXISTS "Allow admin delete wishes" ON public.wishes;

CREATE POLICY "Allow public read wishes"
  ON public.wishes
  FOR SELECT
  TO anon, authenticated
  USING (created_at IS NOT NULL);

CREATE POLICY "Allow public insert wishes"
  ON public.wishes
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(trim(coalesce(name, ''))) BETWEEN 1 AND 50
    AND length(trim(coalesce(message, ''))) BETWEEN 1 AND 300
    AND length(trim(coalesce(address, ''))) <= 100
  );

CREATE POLICY "Allow admin delete wishes"
  ON public.wishes
  FOR DELETE
  TO anon, authenticated
  USING (
    id IS NOT NULL
    AND created_at IS NOT NULL
    AND length(trim(coalesce(name, ''))) BETWEEN 1 AND 50
    AND length(trim(coalesce(message, ''))) BETWEEN 1 AND 300
  );

-- ================================================================
-- album
-- ================================================================
ALTER TABLE public.album ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, DELETE ON public.album TO anon, authenticated;
REVOKE UPDATE ON public.album FROM anon, authenticated;

DROP POLICY IF EXISTS "Allow public read album" ON public.album;
DROP POLICY IF EXISTS "Allow all writes album" ON public.album;
DROP POLICY IF EXISTS "Allow admin insert album" ON public.album;
DROP POLICY IF EXISTS "Allow admin delete album" ON public.album;

CREATE POLICY "Allow public read album"
  ON public.album
  FOR SELECT
  TO anon, authenticated
  USING (
    created_at IS NOT NULL
    AND file_url IS NOT NULL
    AND type IN ('photo', 'video')
  );

CREATE POLICY "Allow admin insert album"
  ON public.album
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(trim(coalesce(file_url, ''))) BETWEEN 1 AND 1200
    AND type IN ('photo', 'video')
    AND length(trim(coalesce(label, ''))) BETWEEN 1 AND 120
    AND length(trim(coalesce(emoji, ''))) <= 20
  );

CREATE POLICY "Allow admin delete album"
  ON public.album
  FOR DELETE
  TO anon, authenticated
  USING (
    id IS NOT NULL
    AND created_at IS NOT NULL
    AND file_url IS NOT NULL
    AND type IN ('photo', 'video')
  );

-- ================================================================
-- songs
-- ================================================================
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, DELETE ON public.songs TO anon, authenticated;
REVOKE UPDATE ON public.songs FROM anon, authenticated;

DROP POLICY IF EXISTS "Allow public read songs" ON public.songs;
DROP POLICY IF EXISTS "Allow all writes songs" ON public.songs;
DROP POLICY IF EXISTS "Allow admin insert songs" ON public.songs;
DROP POLICY IF EXISTS "Allow admin delete songs" ON public.songs;

CREATE POLICY "Allow public read songs"
  ON public.songs
  FOR SELECT
  TO anon, authenticated
  USING (
    created_at IS NOT NULL
    AND url IS NOT NULL
  );

CREATE POLICY "Allow admin insert songs"
  ON public.songs
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(trim(coalesce(title, ''))) BETWEEN 1 AND 120
    AND length(trim(coalesce(artist, ''))) BETWEEN 1 AND 120
    AND length(trim(coalesce(url, ''))) BETWEEN 1 AND 1200
  );

CREATE POLICY "Allow admin delete songs"
  ON public.songs
  FOR DELETE
  TO anon, authenticated
  USING (
    id IS NOT NULL
    AND created_at IS NOT NULL
    AND url IS NOT NULL
  );

-- ================================================================
-- visitors
-- ================================================================
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
GRANT INSERT ON public.visitors TO anon, authenticated;
REVOKE SELECT, UPDATE, DELETE ON public.visitors FROM anon, authenticated;

DROP POLICY IF EXISTS "Allow public read visitors" ON public.visitors;
DROP POLICY IF EXISTS "Allow public insert visitors" ON public.visitors;

CREATE POLICY "Allow public insert visitors"
  ON public.visitors
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(trim(coalesce(name, ''))) BETWEEN 1 AND 80
    AND length(trim(coalesce(address, ''))) <= 120
  );

-- ================================================================
-- storage album
-- ================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('album', 'album', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Allow public read storage objects" ON storage.objects;
DROP POLICY IF EXISTS "Allow public insert storage objects" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete storage objects" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read album objects" ON storage.objects;
DROP POLICY IF EXISTS "Allow public insert album objects" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin delete album objects" ON storage.objects;

CREATE POLICY "Allow public read album objects"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (
    bucket_id = 'album'
    AND (storage.foldername(name))[1] = 'items'
  );

CREATE POLICY "Allow public insert album objects"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    bucket_id = 'album'
    AND (storage.foldername(name))[1] = 'items'
  );

CREATE POLICY "Allow admin delete album objects"
  ON storage.objects
  FOR DELETE
  TO anon, authenticated
  USING (
    bucket_id = 'album'
    AND (storage.foldername(name))[1] = 'items'
  );
