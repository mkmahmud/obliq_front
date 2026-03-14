This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## TanStack Query Setup

This project is configured with TanStack Query using a shared base API and feature-level injection.

- Query provider: `app/providers.tsx`
- Base API (Axios): `lib/api/base-api.ts`
- Feature API factory (injected base API): `lib/features/todos/todos.api.ts`
- Feature query hook: `lib/features/todos/use-todos-query.ts`
- Demo local endpoint: `app/api/todos/route.ts`
- Demo UI usage: `app/components/todos-list.tsx` and `app/page.tsx`

Pattern used:

1. Create a reusable base API client.
2. Create feature APIs as factories that accept the base API (`createFeatureApi(api)`).
3. Use TanStack Query hooks to call feature APIs.
4. Consume hooks in any client component.

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
