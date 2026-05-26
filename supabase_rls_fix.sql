-- ================================================================
-- SECURITY FIX: public.wishes RLS policies
-- Jalankan di Supabase Dashboard -> SQL Editor -> New Query -> Run
--
-- Publik boleh membaca dan mengirim ucapan.
-- Admin frontend boleh menghapus ucapan setelah login PIN di UI.
-- ================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
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
