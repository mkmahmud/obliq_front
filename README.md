# Obliq Admin Dashboard

A simple admin dashboard built with Next.js and TypeScript.

The app includes authentication, role/permission-based access, and core management modules like users, tasks, leads, reports, and audit logs.

## Live Links

- Frontend: https://obliq-front.vercel.app
- Backend API: https://obliq-back.vercel.app/api/v1
- Backend Repo: https://github.com/mkmahmud/obliq_baack.git

## Demo Credentials

- Admin: admin@obliq.local
- Manager: manager@obliq.local
- Agent: agent@obliq.local
- Customer: customer@obliq.local
- Password (all accounts): Temp123!

## Tech Stack

- Next.js (App Router)
- TypeScript
- React Query
- Axios
- Tailwind CSS

## Features

- Login / Register
- Protected dashboard routes
- Permission-based sidebar and page access
- Users + permission assignment
- Tasks (including Assigned to Me)
- Leads and Reports modules
- Audit logs with pagination

## Local Setup

1. Install dependencies

   `pnpm install`

2. Create `.env.local`

   `NEXT_PUBLIC_API_BASE_URL=http://localhost:3001`

3. Start the app

   `pnpm dev`

4. Open in browser

   `http://localhost:3000`

## Scripts

- `pnpm dev` - run development server
- `pnpm build` - build for production
- `pnpm start` - start production build
- `pnpm lint` - run lint checks

## Notes

- This frontend expects the backend auth and permission endpoints to be available.
- Route protection and sidebar rendering are permission-driven.

