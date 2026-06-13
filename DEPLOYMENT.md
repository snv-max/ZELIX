# Deployment Instructions - ZELIX E-commerce

Follow these steps to deploy **ZELIX** to production with Next.js 15, Supabase, Stripe, and Vercel.

---

## 1. Supabase Setup
1. **Create Project**: Go to [Supabase](https://supabase.com) and spin up a new PostgreSQL project.
2. **Execute Schema SQL**:
   - Go to the **SQL Editor** in the Supabase Dashboard.
   - Click "New Query".
   - Copy the contents of [`supabase/schema.sql`](file:///C:/Users/nazal/.gemini/antigravity/scratch/zelix-ecommerce/supabase/schema.sql) and paste them in.
   - Click **Run** to build tables (`profiles`, `categories`, `products`, `orders`, `order_items`, `wishlists`), trigger functions, and security policies (RLS).
3. **Obtain API Keys**:
   - Go to **Project Settings** > **API**.
   - Copy the **Project URL** (`NEXT_PUBLIC_SUPABASE_URL`) and the **anon public key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY`).

---

## 2. Stripe Setup
1. **Create Account**: Go to [Stripe](https://stripe.com) and create or login to your dashboard. Enable **Test Mode**.
2. **Obtain API Credentials**:
   - Go to **Developers** > **API Keys**.
   - Copy the **Publishable key** (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`) and **Secret key** (`STRIPE_SECRET_KEY`).
3. **Configure Webhook**:
   - For local testing, install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and run:
     ```bash
     stripe listen --forward-to localhost:3000/api/webhooks/stripe
     ```
     Copy the signing secret (`whsec_...`) printed by the command and save as `STRIPE_WEBHOOK_SECRET`.
   - For production, go to **Developers** > **Webhooks** in the Stripe Dashboard:
     - Add endpoint: `https://your-vercel-domain.vercel.app/api/webhooks/stripe`
     - Select events to listen to: `checkout.session.completed`
     - Copy the signing secret (`whsec_...`) and save as `STRIPE_WEBHOOK_SECRET`.

---

## 3. Environment Variables Configuration
Create a `.env.local` file at the root of the project (refer to [`env.example`](file:///C:/Users/nazal/.gemini/antigravity/scratch/zelix-ecommerce/.env.example)):
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-public-key

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 4. Vercel Deployment
1. **Push Code**: Commit the repository and push to GitHub, GitLab, or Bitbucket.
2. **Import Project**:
   - Login to [Vercel](https://vercel.com) and click **Add New** > **Project**.
   - Import your ZELIX repository.
3. **Configure Settings**:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Add all 5 environment variables from your `.env.local` file in the **Environment Variables** accordion.
4. **Deploy**: Click **Deploy**. Vercel will build, optimize images, and deploy the serverless routes.

---

## 5. Promote First User to Admin (Local/Prod)
When the first user registers, they are promoted to `admin` automatically by the DB trigger. To manually promote any other email, run this in the Supabase SQL editor:
```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```
Now, logging in as this user will unlock the **Admin Dashboard** in the navigation header.
