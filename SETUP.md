# Merged Project Setup

## What changed
This is the live codebase merged with the GitHub architecture improvements:

- **Live UI kept**: ThemeStyles, theme switcher (Comic/Colour/Modern), expanded FundingSection 
  with donation modal + creator edit mode, avatar in Header
- **GitHub architecture added**: `lib/` folder with real Supabase API layer
  - `lib/supabase.ts` — Supabase client
  - `lib/api.ts` — all DB operations (users, clubs, posts, comments, players, follows)
  - `lib/auth.ts` — Google OAuth + email/password auth with proper redirect handling
  - `db-supabase.ts` — cached database layer that calls `lib/api.ts`
- **App.tsx** — merged: live UI imports + github's robust async auth flow

## Environment Variables
Create/update `.env.local` with your Supabase credentials:
```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Supabase DB — New columns needed
The live `Funding` type has 3 new fields vs github. Run this SQL in Supabase:
```sql
ALTER TABLE clubs
  ADD COLUMN IF NOT EXISTS funding_title TEXT DEFAULT 'General Fund',
  ADD COLUMN IF NOT EXISTS funding_description TEXT DEFAULT 'Support our club!',
  ADD COLUMN IF NOT EXISTS funding_deadline DATE DEFAULT (NOW() + INTERVAL '1 year');
```

## Install & run
```bash
npm install
npm run dev
```

## Files you can remove (replaced)
- `supabaseClient.ts` — was the mock Supabase client, now replaced by `lib/supabase.ts`
- `db.ts` — was the localStorage mock DB, now replaced by `db-supabase.ts`
