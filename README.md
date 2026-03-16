## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/migrations/20260315000000_initial.sql` in the SQL Editor
3. Set your admin user: `update profiles set role='admin', approved=true where email='YOUR_EMAIL';`
4. In **Auth → URL Configuration**: confirm Site URL is set to your production URL (e.g. `https://your-app.vercel.app`)

### 2. Resend (custom email domain)

1. Create an account at [resend.com](https://resend.com)
2. **Add your domain** → follow the DNS verification steps (TXT + MX records)
3. **Create an API key** and copy it to `RESEND_API_KEY`
4. Set `RESEND_FROM_EMAIL=OpenStay <noreply@yourdomain.com>` (must match your verified domain)

### 3. Supabase Custom SMTP (auth emails from your domain)

In **Supabase Dashboard → Auth → SMTP Settings**, enable Custom SMTP:
- **Host:** `smtp.resend.com`
- **Port:** `465`
- **Username:** `resend`
- **Password:** your `RESEND_API_KEY`
- **Sender name:** `OpenStay`
- **Sender email:** value from `RESEND_FROM_EMAIL`

Then in **Auth → Email Templates**, paste the HTML from `supabase/email-templates/confirmation.html` (confirmation) and `supabase/email-templates/password-reset.html` (password reset).

### 4. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in all values.

In Vercel: add the same variables under **Settings → Environment Variables**.

### 5. First Admin

After deploying, register with your admin email, then run in Supabase SQL Editor:
```sql
update profiles set role='admin', approved=true where email='YOUR_EMAIL';
```

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
