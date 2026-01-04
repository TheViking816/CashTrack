<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>
# Run and deploy your AI Studio app
This contains everything you need to run your app locally.
View your app in AI Studio: https://ai.studio/apps/drive/1zZ-Fvo-wR7WKh9nVlFA3cAlYeiBFIfgI

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Create `.env.local` with your Supabase project values:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Apply the database schema in Supabase using `sql/schema.sql`.
4. Run the app:
   `npm run dev`