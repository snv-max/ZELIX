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

---

## 6. Amazon SES Email Setup & Sandbox Release Guide

By default, newly created Amazon SES accounts are placed in the **SES Sandbox environment**. This introduces limitations on email sending to prevent abuse.

### Sandbox Mode Limitations
1. **Verified Senders Only**: You can only send emails from verified email addresses or domains.
2. **Verified Recipients Only**: You can only send emails to verified email addresses or domains. Sending to any unverified address (like a new customer registering during checkout) will result in a `554 Message rejected: Email address is not verified` error.
3. **Daily/Per-Second Limits**: Sending volumes are capped at 200 messages per 24 hours, and 1 message per second.

### Step 1: Verify Email Addresses for Sandbox Testing
If you are testing locally or in staging:
1. Go to the **Amazon SES Console** > **Verified identities**.
2. Click **Create identity**.
3. Select **Email address**, enter your sender email (e.g., `orders@yourdomain.com`), and click **Create identity**. Go to that inbox and click the verification link sent by AWS.
4. Select **Email address** again, enter your test recipient email address (e.g., your personal gmail), and verify it using the link.
5. In your `.env.local` or Vercel environment configurations, set `SMTP_FROM` to your verified sender address, and perform checkouts using your verified recipient address.

### Step 2: Request Sandbox Release (Move to Production)
To send emails to any unverified customer email address in production:
1. Open the **AWS Console** and navigate to the **Amazon SES Service**.
2. In the left navigation pane, select **Account dashboard**.
3. Under the warning banner "Your Amazon SES account is in the sandbox...", click **Request production access** (or click **Request sandbox release**).
4. Fill out the request form:
   - **Mail type**: Transactional (Order confirmations).
   - **Website URL**: `https://www.zelix.shop/` (or your active production URL).
   - **Use case description**: Provide a clear explanation of your application. E.g.:
     > "We run an e-commerce storefront called ZELIX. We use Amazon SES to send automated, transactional order confirmation invoices to customers immediately following a successful checkout via Stripe. Emails contain order details, itemized lists, and shipping tracking information. All recipients are opted-in users who have initiated a purchase."
   - **Bounce and Complaint Management**: Describe how you will monitor bounces (e.g., "We monitor bounce rates via AWS SNS notifications and remove invalid emails from our active subscriber list immediately").
5. Submit the request. AWS support typically reviews and approves sandbox release requests within 24 hours.

### Step 3: Local Testing & Fallbacks
- **To bypass emails completely**: Set `DISABLE_EMAIL=true` in your `.env.local`. Order confirmations will print to your terminal console instead of hitting SES.
- **To use a backup provider**: Configure fallback credentials in `.env.local`:
  - `FALLBACK_SMTP_HOST`, `FALLBACK_SMTP_PORT`, `FALLBACK_SMTP_USER`, `FALLBACK_SMTP_PASSWORD`, `FALLBACK_SMTP_FROM`
  - Or configure a Resend API key: `RESEND_API_KEY=re_...`

---

## 7. Clerk Authentication Setup

This application has been migrated from custom authentication/Auth0 to **Clerk**. Follow these steps to set up authentication for production:

1. **Create Clerk Application**: Go to the [Clerk Dashboard](https://dashboard.clerk.com/) and create a new application. Select the authentication methods you wish to support (e.g., Email, Google, etc.).
2. **Obtain API Keys**:
   - Navigate to **API Keys** in your Clerk Dashboard.
   - Copy the **Publishable Key** (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`) and **Secret Key** (`CLERK_SECRET_KEY`).
3. **Configure Environment Variables**:
   Add the following variables to your `.env.local` and your Vercel deployment:
   ```bash
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/account
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/account
   ```
4. **Granting Admin Access**:
   Access to `/admin` routes is protected on both client and server (via Next.js Middleware). To mark a user as an administrator:
   - Go to the **Clerk Dashboard** > **Users**.
   - Select the target user.
   - Scroll down to the **Metadata** section and click **Edit** next to **Public Metadata**.
   - Set the public metadata as:
     ```json
     {
       "role": "admin"
     }
     ```
   - Click **Save**. The user will now be authorized to access the `/admin` panel.

