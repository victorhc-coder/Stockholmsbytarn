-- ============================================================
-- Migration: Lägg till lat/lng-kolumner för geocodning
-- Kör detta i Supabase SQL Editor om du redan har tabellen skapad
-- ============================================================

alter table public.listings
  add column if not exists lat double precision,
  add column if not exists lng double precision;

-- Valfritt: index för geografiska frågor
create index if not exists listings_lat_lng_idx on public.listings(lat, lng)
  where lat is not null and lng is not null;
