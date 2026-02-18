# 🚀 Elite Rivals: Production Deployment (Crypto Core)

## Phase 1: Deployment
1. **Push to GitHub**: Commit all files.
2. **Import to Vercel**: Create a new project from your repo.
3. **Environment Variables (Vercel)**:
   - `API_KEY`: Your Google Gemini API Key.
   - `NOWPAYMENTS_API_KEY`: Your NOWPayments API Key.
   - `VITE_SUPABASE_URL`: Your Supabase Project URL.
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key (Public).
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key (Private - **CRITICAL for Webhooks**).
   - `NOWPAYMENTS_IPN_SECRET`: Your NOWPayments IPN Secret (for signature verification).
   - `GAME_SERVER_SECRET`: A string token you invent (e.g., "super-secure-token-123") to authenticate your Game Server's access to `api/gsi`.

## Phase 2: Database Setup (Supabase)
Currently, the app uses Supabase for Auth, Wallet, and Match storage.

1. Create a project at [Supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Copy the contents of `db/schema.sql` AND `db/migration_01.sql` and run them.

## Phase 3: The Payment Loop
To automatically credit users when they pay crypto:

1. **Backend**: The app now includes `api/webhook.ts`.
2. **NOWPayments Dashboard**: Set your "IPN Callback URL" to `https://your-app.vercel.app/api/webhook`.
3. **Gen Key**: Generate an IPN Secret in NOWPayments and add it to Vercel env vars.

## Phase 4: Game Server Integration (GSI)
To feed live scores:
1. Configure your game server plugin to POST to: `https://your-app.vercel.app/api/gsi`.
2. Header: `x-server-token: [Your GAME_SERVER_SECRET]`.
3. Payload: `{"matchId": "...", "score": {"teamA": 1, "teamB": 2}, "event": "kill", "payload": "User X killed User Y"}`.

## Architecture
- **Frontend**: React + Vite (clientside).
- **Backend**: Vercel Functions (`/api`).
- **AI**: Gemini Pro (Arbitration) + Flash (Anti-Cheat).
- **Database**: PostgreSQL (Supabase).
- **Payments**: NOWPayments (Crypto).
