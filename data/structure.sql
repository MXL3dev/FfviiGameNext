-- =============================================================
-- FFVII Game : schéma Supabase (Postgres) + RLS + données de jeu
-- À coller dans Supabase > SQL Editor > New query > Run
-- =============================================================

-- ---------- TABLES ----------

-- Remplace `users` + `acces` : l'email et le mot de passe sont gérés
-- par Supabase Auth (auth.users). Ici, seulement les infos du jeu.
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text not null unique check (char_length(username) between 3 and 25),
  role        text not null default 'user' check (role in ('user', 'admin')),
  high_score  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- Remplace `score` : un historique des parties (une ligne par partie)
create table public.scores (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  score       integer not null check (score >= 0),
  created_at  timestamptz not null default now()
);
create index scores_user_id_idx on public.scores(user_id);

create table public.chocobos (
  id          bigint generated always as identity primary key,
  name        text not null,
  speed       integer not null,
  endurance   integer not null
);

-- Remplace `question` + `reponse` : les 4 propositions dans un tableau
create table public.questions (
  id          bigint generated always as identity primary key,
  question    text not null,
  choices     text[] not null
);

-- La bonne réponse est séparée : invisible depuis le navigateur (pas de policy de lecture)
create table public.question_answers (
  question_id bigint primary key references public.questions(id) on delete cascade,
  answer      text not null
);

-- ---------- FONCTIONS ET TRIGGERS ----------

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

-- Crée automatiquement un profil à chaque inscription
-- (le pseudo est passé dans options.data.username du signUp)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', 'joueur_' || left(new.id::text, 8))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Met à jour le meilleur score après chaque partie enregistrée
create or replace function public.update_high_score()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles
  set high_score = greatest(high_score, new.score)
  where id = new.user_id;
  return new;
end;
$$;

create trigger on_score_inserted
  after insert on public.scores
  for each row execute function public.update_high_score();

-- Vérifie une réponse sans jamais l'exposer au navigateur
-- Usage côté Next : supabase.rpc('check_answer', { p_question_id: 1, p_answer: 'cloud' })
create or replace function public.check_answer(p_question_id bigint, p_answer text)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.question_answers
    where question_id = p_question_id
      and lower(trim(answer)) = lower(trim(p_answer))
  );
$$;

-- Les fonctions internes ne doivent pas être appelables depuis l'API
revoke execute on function public.handle_new_user()  from public, anon, authenticated;
revoke execute on function public.update_high_score() from public, anon, authenticated;
revoke execute on function public.is_admin()          from public, anon;

-- ---------- RLS ----------

alter table public.profiles         enable row level security;
alter table public.scores           enable row level security;
alter table public.chocobos         enable row level security;
alter table public.questions        enable row level security;
alter table public.question_answers enable row level security;

-- profiles : classement public (pas d'email ici), chacun modifie son propre pseudo
create policy "profiles_select_all" on public.profiles
  for select using (true);

create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Empêche un joueur de se mettre admin ou de modifier son high_score :
-- seule la colonne username est modifiable depuis le navigateur
revoke update on public.profiles from authenticated;
grant  update (username) on public.profiles to authenticated;

-- scores : lecture publique, chacun n'insère que ses propres scores
create policy "scores_select_all" on public.scores
  for select using (true);

create policy "scores_insert_own" on public.scores
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

-- chocobos et questions : lecture publique, écriture réservée aux admins
create policy "chocobos_select_all" on public.chocobos
  for select using (true);
create policy "chocobos_admin_all" on public.chocobos
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "questions_select_all" on public.questions
  for select using (true);
create policy "questions_admin_all" on public.questions
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- question_answers : AUCUNE lecture pour les joueurs, admins seulement
create policy "answers_admin_all" on public.question_answers
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ---------- DONNÉES DE JEU ----------

insert into public.chocobos (name, speed, endurance) values
  ('Bolt',  8,  60),
  ('Blaze', 7,  70),
  ('Dash',  6,  90),
  ('Storm', 5, 100),
  ('Cloud', 5, 100),
  ('Rocky', 4, 120),
  ('Tank',  3, 140),
  ('Turbo', 6,  80);

-- Les ids 1 à 10 sont générés dans l'ordre sur une table vide
insert into public.questions (question, choices) values
  ('Quel est le nom du héros de Final Fantasy VII ? (singulier)',
    array['noctis', 'cloud', 'tidus', 'linoa']),
  ('Comment s''appelle le groupe que le protagoniste rejoint pour attaquer un réacteur d''énergie ? (singulier)',
    array['avalanche', 'ecolo', 'montagne', 'verdatre']),
  ('Comment s''appelle l''énergie vitale qui se manifeste sous forme liquide ? (singulier)',
    array['chi', 'wakfu', 'mako', 'chacra']),
  ('C''est quoi un chocobo ? (singulier)',
    array['oiseau', 'chevre', 'poisson', 'ecureil']),
  ('Comment s''appelle la monnaie de Final Fantasy VII ? (pluriel)',
    array['kamas', 'zenis', 'credits', 'gils']),
  ('Que vend Aerith lors de la première rencontre avec le protagoniste ? (pluriel)',
    array['armes', 'fleurs', 'chats', 'journeaux']),
  ('Pendant les combats, une jauge se remplit et indique quand les personnages peuvent agir. Comment s''appelle-t-elle ? (singulier)',
    array['limit', 'overdrive', 'temps', 'ultime']),
  ('Quel est le nom de l''idole et adversaire principal du protagoniste de Final Fantasy VII ? (singulier)',
    array['sephiroth', 'sin', 'tifa', 'shinra']),
  ('Quelle organisation forme les SOLDATs et contrôle les réacteurs ? (singulier)',
    array['wutai', 'shinra', 'riviere', 'avalanche']),
  ('Les cellules d''une entité ont été placées dans le corps de Sephiroth. Comment s''appelle-t-elle ? (singulier)',
    array['sin', 'cloud', 'jenova', 'yuna']);

insert into public.question_answers (question_id, answer) values
  (1,  'cloud'),
  (2,  'avalanche'),
  (3,  'mako'),
  (4,  'oiseau'),
  (5,  'gils'),
  (6,  'fleurs'),
  (7,  'temps'),
  (8,  'sephiroth'),
  (9,  'shinra'),
  (10, 'jenova');

-- ---------- APRÈS TON PREMIER SIGNUP ----------
-- Pour te donner le rôle admin (remplace par ton pseudo) :
-- update public.profiles set role = 'admin' where username = 'MXL3';