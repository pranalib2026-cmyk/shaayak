-- COMPLAINTS SYSTEM SCHEMA

-- Complaints Table
create table public.complaints (
  id uuid default gen_random_uuid() primary key,
  complaint_id text unique not null,
  user_id uuid references public.profiles(id),
  category text not null,
  description text not null,
  language text default 'EN',
  location_lat double precision,
  location_lng double precision,
  location_address text,
  status text default 'pending',
  priority text default 'medium',
  is_anonymous boolean default false,
  trust_score integer default 50,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.complaints enable row level security;

-- Policies for Complaints
create policy "Complaints viewable by everyone" on public.complaints
  for select using (true);

create policy "Users can insert their own complaints" on public.complaints
  for insert with check (auth.uid() = user_id OR user_id IS NULL);

create policy "Users can update their own complaints" on public.complaints
  for update using (auth.uid() = user_id);

create policy "Admins can update any complaint" on public.complaints
  for update using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Complaint Media Table
create table public.complaint_media (
  id uuid default gen_random_uuid() primary key,
  complaint_id uuid references public.complaints(id) on delete cascade not null,
  media_url text not null,
  media_type text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.complaint_media enable row level security;

create policy "Complaint media viewable by everyone" on public.complaint_media
  for select using (true);

create policy "Anyone can insert complaint media" on public.complaint_media
  for insert with check (true);

-- Complaint Updates Table
create table public.complaint_updates (
  id uuid default gen_random_uuid() primary key,
  complaint_id uuid references public.complaints(id) on delete cascade not null,
  update_text text not null,
  updated_by uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.complaint_updates enable row level security;

create policy "Complaint updates viewable by everyone" on public.complaint_updates
  for select using (true);

create policy "Admins can insert complaint updates" on public.complaint_updates
  for insert with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Storage bucket for complaint media
insert into storage.buckets (id, name, public) values ('complaints', 'complaints', true) on conflict do nothing;

create policy "Complaint media is publicly accessible" on storage.objects
  for select using (bucket_id = 'complaints');

create policy "Authenticated users can upload complaint media" on storage.objects
  for insert with check (bucket_id = 'complaints' AND auth.role() = 'authenticated');

create policy "Anonymous users can upload complaint media" on storage.objects
  for insert with check (bucket_id = 'complaints' AND auth.role() = 'anon');
