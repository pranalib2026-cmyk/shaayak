-- Create a table for public profiles
create table public.profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  age integer,
  gender text,
  phone text,
  occupation text,
  address text,
  district text,
  preferred_language text,
  anonymous_mode boolean default false,
  role text default 'citizen',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Create a function to handle new user signups
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id, 
    full_name, 
    age, 
    gender, 
    phone, 
    occupation, 
    address, 
    district, 
    preferred_language, 
    anonymous_mode, 
    role
  )
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    NULLIF(new.raw_user_meta_data->>'age', '')::integer,
    new.raw_user_meta_data->>'gender',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'occupation',
    new.raw_user_meta_data->>'address',
    new.raw_user_meta_data->>'district',
    new.raw_user_meta_data->>'preferred_language',
    COALESCE((new.raw_user_meta_data->>'anonymous_mode')::boolean, false),
    COALESCE(new.raw_user_meta_data->>'role', 'citizen')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create a trigger that calls the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
