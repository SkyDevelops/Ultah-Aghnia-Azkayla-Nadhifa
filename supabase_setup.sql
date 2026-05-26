-- ================================================================
-- SUPABASE DATABASE SCHEMA
-- Website Ulang Tahun Kayla — Baby Shark Party 🦈
-- 
-- Jalankan semua query di bawah ini di:
-- Supabase Dashboard → SQL Editor → New Query → Paste & Run
-- ================================================================

-- ================================================================
-- Required extension for gen_random_uuid()
-- ================================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ================================================================
-- 1. TABLE: event_info (Data diri & pengaturan acara)
-- ================================================================
CREATE TABLE IF NOT EXISTS event_info (
  id           BIGINT PRIMARY KEY DEFAULT 1,
  child_name   TEXT    DEFAULT 'Jimbuy',
  child_full_name TEXT DEFAULT 'Aghnia Azkayla Nadhifa',
  age          INTEGER DEFAULT 2,
  birth_date   TEXT    DEFAULT '29 Juni 2024',
  event_date   TEXT    DEFAULT 'Minggu, 28 Juni 2026',
  event_time   TEXT    DEFAULT '18.00 WIB - Selesai',
  event_venue  TEXT    DEFAULT 'Rumah Kayla',
  event_address TEXT   DEFAULT 'Jl. Setro 5 no 38-A, Surabaya, Jawa Timur',
  google_maps_url TEXT DEFAULT 'https://maps.app.goo.gl/C6QYsDA3QMtcsyks6',
  dress_code   TEXT    DEFAULT 'Ocean Blue & Sea Creatures 🌊🦈',
  admin_pin    TEXT    DEFAULT '2906',
  gift_bank    TEXT    DEFAULT '',
  gift_number  TEXT    DEFAULT '',
  gift_name    TEXT    DEFAULT '',
  fun_quote    TEXT    DEFAULT 'Dua tahun berenang di lautan cinta! 🌊 Si kecil Baby Shark yang selalu bikin tersenyum.',
  fun_quote_author TEXT DEFAULT '— Mommy & Daddy Shark 🦈💕',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE event_info ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE ON public.event_info TO anon, authenticated;
REVOKE DELETE ON public.event_info FROM anon, authenticated;

-- Policy: Everyone can read
DROP POLICY IF EXISTS "Allow public read event_info" ON event_info;
CREATE POLICY "Allow public read event_info"
  ON event_info FOR SELECT
  TO anon, authenticated
  USING (id = 1);

-- Policy: Frontend visitors can read event info only. Writes require Supabase dashboard or a trusted backend.
DROP POLICY IF EXISTS "Allow all writes event_info" ON event_info;
DROP POLICY IF EXISTS "Allow admin insert event_info" ON event_info;
DROP POLICY IF EXISTS "Allow admin update event_info" ON event_info;

CREATE POLICY "Allow admin insert event_info"
  ON event_info FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    id = 1
    AND length(trim(coalesce(child_name, ''))) BETWEEN 1 AND 80
    AND length(trim(coalesce(child_full_name, ''))) BETWEEN 1 AND 120
    AND age BETWEEN 1 AND 120
    AND length(trim(coalesce(admin_pin, ''))) BETWEEN 4 AND 12
  );

CREATE POLICY "Allow admin update event_info"
  ON event_info FOR UPDATE
  TO anon, authenticated
  USING (id = 1)
  WITH CHECK (
    id = 1
    AND length(trim(coalesce(child_name, ''))) BETWEEN 1 AND 80
    AND length(trim(coalesce(child_full_name, ''))) BETWEEN 1 AND 120
    AND age BETWEEN 1 AND 120
    AND length(trim(coalesce(admin_pin, ''))) BETWEEN 4 AND 12
  );

-- Insert default row if not exists
INSERT INTO event_info (id, child_name, child_full_name, age, birth_date, admin_pin)
VALUES (1, 'Jimbuy', 'Aghnia Azkayla Nadhifa', 2, '29 Juni 2024', '2906')
ON CONFLICT (id) DO NOTHING;


-- ================================================================
-- 2. TABLE: wishes (Ucapan dari pengunjung)
-- ================================================================
CREATE TABLE IF NOT EXISTS wishes (
  id         UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT    NOT NULL,
  message    TEXT    NOT NULL,
  address    TEXT    DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, DELETE ON public.wishes TO anon, authenticated;
REVOKE UPDATE ON public.wishes FROM anon, authenticated;

-- Policy: Everyone can read all wishes
DROP POLICY IF EXISTS "Allow public read wishes" ON wishes;
CREATE POLICY "Allow public read wishes"
  ON wishes FOR SELECT
  TO anon, authenticated
  USING (created_at IS NOT NULL);

-- Policy: Anyone can insert a wish
DROP POLICY IF EXISTS "Allow public insert wishes" ON wishes;
CREATE POLICY "Allow public insert wishes"
  ON wishes FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(trim(coalesce(name, ''))) BETWEEN 1 AND 50
    AND length(trim(coalesce(message, ''))) BETWEEN 1 AND 300
    AND length(trim(coalesce(address, ''))) <= 100
  );

-- Policy: Public visitors must not delete wishes. Delete from Supabase dashboard or a trusted backend only.
DROP POLICY IF EXISTS "Allow all delete wishes" ON wishes;
DROP POLICY IF EXISTS "Allow admin delete wishes" ON wishes;

CREATE POLICY "Allow admin delete wishes"
  ON wishes FOR DELETE
  TO anon, authenticated
  USING (
    id IS NOT NULL
    AND created_at IS NOT NULL
    AND length(trim(coalesce(name, ''))) BETWEEN 1 AND 50
    AND length(trim(coalesce(message, ''))) BETWEEN 1 AND 300
  );

-- ================================================================
-- 3. TABLE: album (Foto dan video)
-- ================================================================
CREATE TABLE IF NOT EXISTS album (
  id         UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  file_url   TEXT    NOT NULL,
  type       TEXT    DEFAULT 'photo' CHECK (type IN ('photo', 'video')),
  label      TEXT    DEFAULT 'Momen Kayla',
  emoji      TEXT    DEFAULT '🦈',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE album ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, DELETE ON public.album TO anon, authenticated;
REVOKE UPDATE ON public.album FROM anon, authenticated;

-- Policy: Everyone can read
DROP POLICY IF EXISTS "Allow public read album" ON album;
CREATE POLICY "Allow public read album"
  ON album FOR SELECT
  TO anon, authenticated
  USING (created_at IS NOT NULL AND file_url IS NOT NULL);

-- Policy: Frontend visitors can read album only. Writes require Supabase dashboard or a trusted backend.
DROP POLICY IF EXISTS "Allow all writes album" ON album;
DROP POLICY IF EXISTS "Allow admin insert album" ON album;
DROP POLICY IF EXISTS "Allow admin delete album" ON album;

CREATE POLICY "Allow admin insert album"
  ON album FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(trim(coalesce(file_url, ''))) BETWEEN 1 AND 1200
    AND type IN ('photo', 'video')
    AND length(trim(coalesce(label, ''))) BETWEEN 1 AND 120
    AND length(trim(coalesce(emoji, ''))) <= 20
  );

CREATE POLICY "Allow admin delete album"
  ON album FOR DELETE
  TO anon, authenticated
  USING (
    id IS NOT NULL
    AND created_at IS NOT NULL
    AND file_url IS NOT NULL
    AND type IN ('photo', 'video')
  );


-- ================================================================
-- 4. TABLE: songs (Playlist lagu)
-- ================================================================
CREATE TABLE IF NOT EXISTS songs (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT    NOT NULL,
  artist      TEXT    DEFAULT 'Unknown',
  url         TEXT    NOT NULL,
  is_youtube  BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, DELETE ON public.songs TO anon, authenticated;
REVOKE UPDATE ON public.songs FROM anon, authenticated;

-- Policy: Everyone can read
DROP POLICY IF EXISTS "Allow public read songs" ON songs;
CREATE POLICY "Allow public read songs"
  ON songs FOR SELECT
  TO anon, authenticated
  USING (created_at IS NOT NULL AND url IS NOT NULL);

-- Policy: Frontend visitors can read songs only. Writes require Supabase dashboard or a trusted backend.
DROP POLICY IF EXISTS "Allow all writes songs" ON songs;
DROP POLICY IF EXISTS "Allow admin insert songs" ON songs;
DROP POLICY IF EXISTS "Allow admin delete songs" ON songs;

CREATE POLICY "Allow admin insert songs"
  ON songs FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(trim(coalesce(title, ''))) BETWEEN 1 AND 120
    AND length(trim(coalesce(artist, ''))) BETWEEN 1 AND 120
    AND length(trim(coalesce(url, ''))) BETWEEN 1 AND 1200
  );

CREATE POLICY "Allow admin delete songs"
  ON songs FOR DELETE
  TO anon, authenticated
  USING (
    id IS NOT NULL
    AND created_at IS NOT NULL
    AND url IS NOT NULL
  );

-- Insert default song (Baby Shark)
INSERT INTO songs (title, artist, url, is_youtube)
VALUES ('Baby Shark', 'Pinkfong', 'https://www.youtube.com/watch?v=XqZsoesa55w', TRUE)
ON CONFLICT DO NOTHING;


-- ================================================================
-- 5. TABLE: visitors (Data pengunjung website)
-- ================================================================
CREATE TABLE IF NOT EXISTS visitors (
  id         UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT    NOT NULL,
  address    TEXT    DEFAULT '',
  visited_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON public.visitors TO anon, authenticated;
REVOKE SELECT, UPDATE, DELETE ON public.visitors FROM anon, authenticated;

-- Policy: Public visitors can only insert limited visitor records.
-- Public read is disabled to avoid exposing visitor data.
DROP POLICY IF EXISTS "Allow public read visitors" ON visitors;
DROP POLICY IF EXISTS "Allow public insert visitors" ON visitors;
CREATE POLICY "Allow public insert visitors"
  ON visitors FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(trim(coalesce(name, ''))) BETWEEN 1 AND 80
    AND length(trim(coalesce(address, ''))) <= 120
  );


-- ================================================================
-- 6. STORAGE BUCKET: album (Penyimpanan foto dan video)
-- ================================================================
-- Catatan: Supabase storage memerlukan skema storage. Pastikan storage diaktifkan di dashboard Anda.
INSERT INTO storage.buckets (id, name, public)
VALUES ('album', 'album', true)
ON CONFLICT (id) DO NOTHING;

-- Hapus kebijakan lama jika ada untuk mencegah konflik saat jalankan ulang
DROP POLICY IF EXISTS "Allow public read storage objects" ON storage.objects;
DROP POLICY IF EXISTS "Allow public insert storage objects" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete storage objects" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read album objects" ON storage.objects;
DROP POLICY IF EXISTS "Allow public insert album objects" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin delete album objects" ON storage.objects;

-- Kebijakan akses publik dibatasi ke bucket album dan folder items/.
-- Bucket tetap public agar URL media bisa dibuka langsung oleh undangan.
CREATE POLICY "Allow public read album objects"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (
    bucket_id = 'album'
    AND (storage.foldername(name))[1] = 'items'
  );

-- Upload publik dibatasi ke folder items/ dan ukuran/tipe tetap divalidasi dari frontend.
CREATE POLICY "Allow public insert album objects"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    bucket_id = 'album'
    AND (storage.foldername(name))[1] = 'items'
  );

-- Hapus publik tidak diberikan. Hapus media dari Supabase dashboard atau trusted backend.
DROP POLICY IF EXISTS "Allow public delete storage objects" ON storage.objects;

CREATE POLICY "Allow admin delete album objects"
  ON storage.objects FOR DELETE
  TO anon, authenticated
  USING (
    bucket_id = 'album'
    AND (storage.foldername(name))[1] = 'items'
  );


-- ================================================================
-- SELESAI! Semua tabel & bucket berhasil dibuat.
-- Kembali ke website dan coba submit ucapan untuk test koneksi.
-- ================================================================
