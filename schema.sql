-- ============================================================
-- Stockholmsbytarn – Databassschema
-- Kör detta i Supabase SQL Editor
-- ============================================================

-- Aktivera UUID-extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABELLER
-- ============================================================

-- Profiler (utökar Supabase auth.users)
create table public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  email       text not null,
  name        text,
  phone       text,
  avatar_url  text,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

-- Stadsdelar i Stockholm
create type public.stadsdel as enum (
  'Södermalm',
  'Östermalm',
  'Kungsholmen',
  'Vasastan',
  'Norrmalm',
  'Gamla Stan',
  'Lidingö',
  'Nacka',
  'Solna',
  'Sundbyberg',
  'Bromma',
  'Hägersten',
  'Skarpnäck',
  'Farsta',
  'Enskede',
  'Spånga',
  'Hässelby',
  'Vällingby',
  'Övrigt'
);

-- Annonsstatus
create type public.listing_status as enum ('active', 'paused', 'swapped', 'deleted');

-- Annonser
create table public.listings (
  id            uuid default uuid_generate_v4() primary key,
  user_id       uuid references public.profiles(id) on delete cascade not null,
  title         text not null,
  description   text not null,
  address       text not null,
  stadsdel      public.stadsdel not null,
  floor         int,
  total_floors  int,
  size_sqm      int not null,
  rooms         numeric(3,1) not null,   -- 1, 1.5, 2, 2.5 osv
  monthly_rent  int not null,            -- kr/månad
  floor_plan    text,                    -- beskrivning av planlösning
  move_in_date  date,
  wants_desc    text,                    -- vad man söker i byte
  images        text[] default '{}',    -- Supabase Storage-URLer
  balcony       boolean,               -- Har balkong
  elevator      boolean,               -- Hiss i huset
  pets_allowed  boolean,               -- Husdjur tillåtet
  lat           double precision,       -- Geocodad latitud (Nominatim)
  lng           double precision,       -- Geocodad longitud (Nominatim)
  status        public.listing_status default 'active' not null,
  views         int default 0 not null,
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null
);

-- Sparade annonser (bokmärken)
create table public.saved_listings (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references public.profiles(id) on delete cascade not null,
  listing_id  uuid references public.listings(id) on delete cascade not null,
  created_at  timestamptz default now() not null,
  unique(user_id, listing_id)
);

-- Meddelanden mellan användare (kopplade till en annons)
create table public.messages (
  id           uuid default uuid_generate_v4() primary key,
  listing_id   uuid references public.listings(id) on delete cascade not null,
  sender_id    uuid references public.profiles(id) on delete cascade not null,
  receiver_id  uuid references public.profiles(id) on delete cascade not null,
  body         text not null,
  read_at      timestamptz,
  created_at   timestamptz default now() not null
);

-- ============================================================
-- INDEX
-- ============================================================

create index listings_user_id_idx       on public.listings(user_id);
create index listings_stadsdel_idx      on public.listings(stadsdel);
create index listings_status_idx        on public.listings(status);
create index listings_rooms_idx         on public.listings(rooms);
create index listings_monthly_rent_idx  on public.listings(monthly_rent);
create index messages_listing_id_idx    on public.messages(listing_id);
create index messages_sender_id_idx     on public.messages(sender_id);
create index messages_receiver_id_idx   on public.messages(receiver_id);
create index saved_listings_user_id_idx on public.saved_listings(user_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles       enable row level security;
alter table public.listings       enable row level security;
alter table public.saved_listings enable row level security;
alter table public.messages       enable row level security;

-- PROFILES
create policy "Profiler är synliga för alla"
  on public.profiles for select using (true);

create policy "Användare kan uppdatera sin profil"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Profil skapas automatiskt vid registrering"
  on public.profiles for insert
  with check (auth.uid() = id);

-- LISTINGS
create policy "Aktiva annonser är synliga för alla"
  on public.listings for select
  using (status = 'active' or auth.uid() = user_id);

create policy "Inloggade användare kan skapa annonser"
  on public.listings for insert
  with check (auth.uid() = user_id);

create policy "Annonsägare kan uppdatera sina annonser"
  on public.listings for update
  using (auth.uid() = user_id);

create policy "Annonsägare kan radera sina annonser"
  on public.listings for delete
  using (auth.uid() = user_id);

-- SAVED LISTINGS
create policy "Användare ser sina egna sparade annonser"
  on public.saved_listings for select
  using (auth.uid() = user_id);

create policy "Användare kan spara annonser"
  on public.saved_listings for insert
  with check (auth.uid() = user_id);

create policy "Användare kan ta bort sparade annonser"
  on public.saved_listings for delete
  using (auth.uid() = user_id);

-- MESSAGES
create policy "Användare ser sina egna meddelanden"
  on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Inloggade användare kan skicka meddelanden"
  on public.messages for insert
  with check (auth.uid() = sender_id);

create policy "Mottagare kan markera meddelanden som lästa"
  on public.messages for update
  using (auth.uid() = receiver_id);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Uppdatera updated_at automatiskt
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger listings_updated_at
  before update on public.listings
  for each row execute function public.handle_updated_at();

-- Räkna visningar
create or replace function public.increment_views(listing_id uuid)
returns void language plpgsql security definer as $$
begin
  update public.listings set views = views + 1 where id = listing_id;
end;
$$;

-- Skapa profil automatiskt när ny användare registreras
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- STORAGE BUCKET
-- ============================================================

-- Kör i Supabase Dashboard → Storage → New Bucket
-- Namn: listing-images, Public: true
-- Eller kör via SQL:

insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict (id) do nothing;

create policy "Bilder är publika"
  on storage.objects for select
  using (bucket_id = 'listing-images');

create policy "Inloggade kan ladda upp bilder"
  on storage.objects for insert
  with check (bucket_id = 'listing-images' and auth.role() = 'authenticated');

create policy "Ägare kan ta bort sina bilder"
  on storage.objects for delete
  using (bucket_id = 'listing-images' and auth.uid()::text = (storage.foldername(name))[1]);
