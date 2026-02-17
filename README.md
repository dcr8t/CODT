# 🚀 Elite Rivals: Production Deployment (Crypto Core)

## Phase 1: Deployment
1. **Push to GitHub**: Commit all files.
2. **Import to Vercel**: Create a new project from your repo.
3. **Environment Variables**:
   - `API_KEY`: Your Google Gemini API Key.
   - `NOWPAYMENTS_API_KEY`: Your NOWPayments API Key.
4. **Deploy**: Vercel will build the frontend and deploy the `/api` serverless functions.

## Phase 2: Database Setup (Supabase)
Currently, the app uses local storage for demo purposes. To go live:

1. Create a project at [Supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Copy the contents of `db/schema.sql` and run it.
4. This creates your User Profiles, Wallet Ledger, and Transaction History tables.

## Phase 3: The Payment Loop
To automatically credit users when they pay crypto:

1. **Backend**: You need a Webhook Listener. 
2. **NOWPayments**: Set your "IPN Callback URL" to `https://your-app.vercel.app/api/webhook`.
3. **Logic**: When NOWPayments sends `payment_status: "finished"`, your webhook should run an SQL update:
   ```sql
   UPDATE wallets SET balance = balance + :amount WHERE user_id = :user;
   ```

## Architecture
- **Frontend**: React + Vite (clientside).
- **Backend**: Vercel Functions (`/api`).
- **AI**: Gemini Pro (Arbitration) + Flash (Anti-Cheat).
- **Database**: PostgreSQL (Supabase schema provided).
- **Payments**: NOWPayments (Crypto).
