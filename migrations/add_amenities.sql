-- ============================================================
-- Migration: Lägg till balkong, hiss och husdjur-kolumner
-- Kör detta i Supabase SQL Editor om du redan har tabellen skapad
-- ============================================================

alter table public.listings
  add column if not exists balcony      boolean,
  add column if not exists elevator     boolean,
  add column if not exists pets_allowed boolean;
