# Next.js (Full-stack) Scaffold

Project structure and configuration for Next.js applications with App Router.

---

## Directory Structure

```
project-root/
├── app/                     # App Router (Next.js 13+)
│   ├── (auth)/             # Auth route group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── (dashboard)/        # Dashboard route group
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── api/                # API routes
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.ts
│   │   │   └── register/
│   │   │       └── route.ts
│   │   ├── users/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   └── health/
│   │       └── route.ts
│   │
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── loading.tsx         # Loading UI
│   ├── error.tsx           # Error UI
│   ├── not-found.tsx       # 404 page
│   └── globals.css         # Global styles
│
├── components/             # React components
│   ├── ui/                # shadcn/ui or base components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── index.ts
│   ├── forms/             # Form components
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── layout/            # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   └── index.ts
│
├── lib/                   # Utility libraries
│   ├── api.ts            # API client
│   ├── auth.ts           # Auth utilities
│   ├── db.ts             # Database client
│   ├── utils.ts          # Helper functions
│   └── validations.ts    # Zod schemas
│
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts
│   ├── useUser.ts
│   └── index.ts
│
├── services/              # Business logic / API handlers
│   ├── authService.ts
│   ├── userService.ts
│   └── index.ts
│
├── types/                 # TypeScript types
│   ├── api.types.ts
│   ├── user.types.ts
│   └── index.ts
│
├── prisma/                # Prisma schema and migrations
│   ├── schema.prisma
│   └── migrations/
│
├── public/                # Static files
│   ├── favicon.ico
│   └── images/
│
├── tests/                 # Test files
│   ├── setup.ts
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .husky/                # Git hooks
│
├── proagents/             # ProAgents configuration
│
├── middleware.ts          # Next.js middleware
├── next.config.js
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── jest.config.js
├── playwright.config.ts
└── proagents.config.yaml
```

---

## Configuration Files

### package.json
```json
{
  "name": "{{project-name}}",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio",
    "prepare": "husky install"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@prisma/client": "^5.7.0",
    "next-auth": "^5.0.0-beta.4",
    "@tanstack/react-query": "^5.0.0",
    "zod": "^3.22.0",
    "bcryptjs": "^2.4.3",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "lucide-react": "^0.294.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/bcryptjs": "^2.4.0",
    "typescript": "^5.3.0",
    "prisma": "^5.7.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "eslint": "^8.55.0",
    "eslint-config-next": "^14.0.0",
    "prettier": "^3.1.0",
    "prettier-plugin-tailwindcss": "^0.5.0",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.0",
    "ts-jest": "^29.1.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@playwright/test": "^1.40.0",
    "husky": "^8.0.0",
    "@commitlint/cli": "^18.4.0",
    "@commitlint/config-conventional": "^18.4.0"
  }
}
```

### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['example.com'],
  },
  experimental: {
    typedRoutes: true,
  },
};

module.exports = nextConfig;
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/hooks/*": ["./hooks/*"],
      "@/services/*": ["./services/*"],
      "@/types/*": ["./types/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### tailwind.config.ts
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## Starter Files

### app/layout.tsx
```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/Providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '{{project-name}}',
  description: 'Built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### app/page.tsx
```tsx
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Welcome to {{project-name}}</h1>
      <p className="mt-4 text-lg text-gray-600">
        Start building something amazing!
      </p>
    </main>
  );
}
```

### app/api/health/route.ts
```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
}
```

### app/api/users/route.ts
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/services/userService';
import { createUserSchema } from '@/lib/validations';

export async function GET() {
  try {
    const users = await userService.getAll();
    return NextResponse.json({ data: users });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createUserSchema.parse(body);
    const user = await userService.create(validatedData);
    return NextResponse.json({ data: user }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 400 }
    );
  }
}
```

### lib/db.ts
```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

### lib/utils.ts
```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));
}
```

### middleware.ts
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Add authentication check here
  // const token = request.cookies.get('token');

  // Example: Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // Check authentication
    // if (!token) {
    //   return NextResponse.redirect(new URL('/login', request.url));
    // }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};
```

### components/Providers.tsx
```tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
```

---

## ProAgents Configuration

### proagents.config.yaml (Next.js-specific)
```yaml
project:
  name: "{{project-name}}"
  type: "fullstack"
  framework: "nextjs"
  language: "typescript"
  router: "app"

phases:
  analysis:
    enabled: true
    focus:
      - "app-router-structure"
      - "server-components"
      - "api-routes"
  ui_design:
    enabled: true
    guidelines: ["react-patterns", "accessibility"]
  api_design:
    enabled: true
    location: "app/api"
  database:
    enabled: true
    orm: "prisma"
  testing:
    coverage_target: 80
    types: ["unit", "integration", "e2e"]

patterns:
  rendering:
    default: "server"  # server, client, static
    streaming: true
  data_fetching:
    client: "react-query"
    server: "fetch"
  components:
    server_components: true
    client_directive: "use client"
  api_routes:
    style: "route-handlers"
    validation: "zod"
  styling:
    approach: "tailwind"
  state:
    server: "react-query"
    client: "zustand"

testing:
  unit:
    framework: "jest"
    library: "testing-library"
  e2e:
    framework: "playwright"

deployment:
  target: "vercel"
  edge_runtime: true
```

---

## Route File Templates

### Page Component Template (app/[route]/page.tsx)
```tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description',
};

interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ params, searchParams }: PageProps) {
  // Server component - can fetch data directly
  // const data = await fetchData(params.id);

  return (
    <div>
      <h1>Page Content</h1>
    </div>
  );
}
```

### API Route Template (app/api/[route]/route.ts)
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  // Define your schema
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Implementation
    return NextResponse.json({ data: {} });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = schema.parse(body);
    // Implementation
    return NextResponse.json({ data: {} }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 400 });
  }
}
```

---

## Slash Commands (Next.js-specific)

| Command | Description |
|---------|-------------|
| `pa:page [route]` | Generate new page |
| `pa:api [route]` | Generate API route |
| `pa:component [name]` | Generate component |
| `pa:layout [route]` | Generate layout |
| `pa:loading [route]` | Generate loading UI |
| `pa:error [route]` | Generate error UI |
| `pa:hook [name]` | Generate custom hook |
| `pa:service [name]` | Generate service |
| `pa:model [name]` | Generate Prisma model |
