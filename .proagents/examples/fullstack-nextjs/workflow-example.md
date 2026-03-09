# Full-Stack Next.js Workflow Example

Complete workflow for adding a User Dashboard feature to a Next.js application.

---

## Feature Request

> "Add a user dashboard page that shows user statistics, recent activity, and quick actions."

---

## Phase 0: Initialization

### Mode Detection
```
Detected: Full Workflow Mode
Reason: New feature with UI, API, and database components
Project Type: Full-stack (Next.js)
```

### Branch Creation
```bash
git checkout -b feature/user-dashboard
```

---

## Phase 1: Codebase Analysis

### Project Structure
```
Existing structure detected:
├── app/
│   ├── (auth)/
│   ├── (main)/
│   ├── api/
│   └── layout.tsx
├── components/
├── lib/
├── prisma/
└── [configs]

Framework: Next.js 14 (App Router)
Database: PostgreSQL + Prisma
Auth: NextAuth.js
Styling: Tailwind CSS
State: React Query
```

### Existing Patterns
```yaml
patterns_detected:
  pages: "app/(group)/[route]/page.tsx"
  api_routes: "app/api/[resource]/route.ts"
  components: "components/[category]/[Name].tsx"
  data_fetching: "React Query with server components"
  auth: "NextAuth with session provider"
```

---

## Phase 2: Requirements

### User Stories
```markdown
1. As a user, I want to see my dashboard when I log in
   - Acceptance: Dashboard shows after successful login
   - Acceptance: Redirects to login if not authenticated

2. As a user, I want to see my activity statistics
   - Acceptance: Shows total posts, comments, likes
   - Acceptance: Shows activity trend chart

3. As a user, I want to see my recent activity
   - Acceptance: Lists last 10 activities
   - Acceptance: Shows activity type and timestamp

4. As a user, I want quick actions available
   - Acceptance: "New Post" button
   - Acceptance: "Edit Profile" button
   - Acceptance: "View Analytics" button
```

### Technical Requirements
```yaml
requirements:
  authentication: "Required - redirect if not logged in"
  database:
    - "Query user statistics"
    - "Query recent activities"
  api:
    - "GET /api/dashboard/stats"
    - "GET /api/dashboard/activity"
  performance:
    - "Initial load < 2s"
    - "Use server components where possible"
```

---

## Phase 3: UI Design

### Component Breakdown
```
DashboardPage
├── DashboardHeader
│   └── WelcomeMessage
├── StatsGrid
│   ├── StatCard (Posts)
│   ├── StatCard (Comments)
│   ├── StatCard (Likes)
│   └── StatCard (Views)
├── ActivityChart
│   └── LineChart (weekly activity)
├── RecentActivity
│   └── ActivityItem[] (list)
└── QuickActions
    ├── ActionButton (New Post)
    ├── ActionButton (Edit Profile)
    └── ActionButton (Analytics)
```

### Design Specifications
```yaml
layout:
  type: "responsive grid"
  desktop: "2 columns"
  mobile: "single column"

components:
  StatCard:
    size: "200px × 120px"
    content: "icon, value, label, trend"
    style: "card with shadow, hover effect"

  ActivityChart:
    type: "line chart"
    data: "7 days activity"
    library: "recharts"

  RecentActivity:
    items: 10
    content: "icon, description, timestamp"
    style: "list with hover"

  QuickActions:
    layout: "horizontal buttons"
    style: "primary, secondary variants"
```

---

## Phase 4: Implementation Plan

### File Structure
```
Create:
├── app/(main)/dashboard/
│   ├── page.tsx              # Dashboard page (server component)
│   ├── loading.tsx           # Loading skeleton
│   └── error.tsx             # Error boundary
├── app/api/dashboard/
│   ├── stats/route.ts        # Stats API
│   └── activity/route.ts     # Activity API
├── components/dashboard/
│   ├── StatsGrid.tsx
│   ├── StatCard.tsx
│   ├── ActivityChart.tsx
│   ├── RecentActivity.tsx
│   ├── QuickActions.tsx
│   └── index.ts
├── lib/
│   └── dashboard.ts          # Dashboard queries
└── types/
    └── dashboard.types.ts    # Type definitions
```

### Implementation Order
```
1. Types and interfaces
2. Database queries (lib/dashboard.ts)
3. API routes
4. UI components (bottom-up)
5. Page integration
6. Loading and error states
```

---

## Phase 5: Implementation

### Types (types/dashboard.types.ts)
```typescript
export interface DashboardStats {
  posts: number;
  comments: number;
  likes: number;
  views: number;
  trends: {
    posts: number;      // percentage change
    comments: number;
    likes: number;
    views: number;
  };
}

export interface ActivityItem {
  id: string;
  type: 'post' | 'comment' | 'like' | 'follow';
  description: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivity: ActivityItem[];
  chartData: ChartDataPoint[];
}

export interface ChartDataPoint {
  date: string;
  value: number;
}
```

### Database Queries (lib/dashboard.ts)
```typescript
import { prisma } from '@/lib/db';

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const [posts, comments, likes, views] = await Promise.all([
    prisma.post.count({ where: { authorId: userId } }),
    prisma.comment.count({ where: { authorId: userId } }),
    prisma.like.count({ where: { post: { authorId: userId } } }),
    prisma.postView.count({ where: { post: { authorId: userId } } }),
  ]);

  // Calculate trends (compare to last week)
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  const [prevPosts, prevComments] = await Promise.all([
    prisma.post.count({
      where: {
        authorId: userId,
        createdAt: { lt: lastWeek },
      },
    }),
    prisma.comment.count({
      where: {
        authorId: userId,
        createdAt: { lt: lastWeek },
      },
    }),
  ]);

  return {
    posts,
    comments,
    likes,
    views,
    trends: {
      posts: calculateTrend(prevPosts, posts),
      comments: calculateTrend(prevComments, comments),
      likes: 0,
      views: 0,
    },
  };
}

export async function getRecentActivity(
  userId: string,
  limit = 10
): Promise<ActivityItem[]> {
  const activities = await prisma.activity.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return activities.map((a) => ({
    id: a.id,
    type: a.type as ActivityItem['type'],
    description: a.description,
    timestamp: a.createdAt,
    metadata: a.metadata as Record<string, unknown>,
  }));
}

function calculateTrend(prev: number, current: number): number {
  if (prev === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - prev) / prev) * 100);
}
```

### API Routes (app/api/dashboard/stats/route.ts)
```typescript
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDashboardStats } from '@/lib/dashboard';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const stats = await getDashboardStats(session.user.id);
    return NextResponse.json({ data: stats });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
```

### StatCard Component (components/dashboard/StatCard.tsx)
```typescript
import { memo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number;
  trend?: number;
  icon: React.ReactNode;
}

export const StatCard = memo(function StatCard({
  title,
  value,
  trend,
  icon,
}: StatCardProps) {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground">{icon}</div>
        {trend !== undefined && (
          <div
            className={cn(
              'flex items-center text-sm',
              isPositive && 'text-green-600',
              isNegative && 'text-red-600'
            )}
          >
            {isPositive ? <TrendingUp className="h-4 w-4" /> : null}
            {isNegative ? <TrendingDown className="h-4 w-4" /> : null}
            <span className="ml-1">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold">{value.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </div>
  );
});
```

### Dashboard Page (app/(main)/dashboard/page.tsx)
```typescript
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDashboardStats, getRecentActivity } from '@/lib/dashboard';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { ActivityChart } from '@/components/dashboard/ActivityChart';

export const metadata = {
  title: 'Dashboard',
  description: 'Your personal dashboard',
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  const [stats, activity] = await Promise.all([
    getDashboardStats(session.user.id),
    getRecentActivity(session.user.id),
  ]);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">
        Welcome back, {session.user.name}
      </h1>

      <div className="grid gap-8">
        <StatsGrid stats={stats} />

        <div className="grid gap-8 lg:grid-cols-2">
          <Suspense fallback={<div>Loading chart...</div>}>
            <ActivityChart userId={session.user.id} />
          </Suspense>

          <RecentActivity activities={activity} />
        </div>

        <QuickActions />
      </div>
    </div>
  );
}
```

---

## Phase 6: Testing

### Test Files Created
```
tests/
├── components/dashboard/
│   ├── StatCard.test.tsx
│   ├── StatsGrid.test.tsx
│   └── RecentActivity.test.tsx
├── lib/
│   └── dashboard.test.ts
└── api/dashboard/
    └── stats.test.ts
```

### Sample Test (StatCard.test.tsx)
```typescript
import { render, screen } from '@testing-library/react';
import { FileText } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';

describe('StatCard', () => {
  it('renders value and title', () => {
    render(
      <StatCard
        title="Total Posts"
        value={42}
        icon={<FileText />}
      />
    );

    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('Total Posts')).toBeInTheDocument();
  });

  it('shows positive trend with green color', () => {
    render(
      <StatCard
        title="Posts"
        value={42}
        trend={15}
        icon={<FileText />}
      />
    );

    const trend = screen.getByText('15%');
    expect(trend).toHaveClass('text-green-600');
  });
});
```

### Coverage Report
```
File                    | % Stmts | % Branch | % Funcs | % Lines |
------------------------|---------|----------|---------|---------|
components/dashboard/   |   92.5  |   88.2   |  100    |   92.0  |
lib/dashboard.ts        |   95.0  |   90.0   |  100    |   94.5  |
api/dashboard/          |   88.0  |   85.0   |  100    |   87.5  |
------------------------|---------|----------|---------|---------|
All files               |   91.8  |   87.7   |  100    |   91.3  |
```

---

## Phase 7: Documentation

### Component Documentation
- README added to components/dashboard/
- Props documented with TypeScript interfaces
- Usage examples provided

### API Documentation
```yaml
# Added to docs/api/dashboard.yaml
paths:
  /api/dashboard/stats:
    get:
      summary: Get user dashboard statistics
      security:
        - bearerAuth: []
      responses:
        200:
          description: Dashboard statistics
        401:
          description: Unauthorized
```

---

## Phase 8: Deployment

### Pre-Deployment Checklist
- [x] All tests passing
- [x] TypeScript build succeeds
- [x] ESLint passes
- [x] Database migrations ready
- [x] Environment variables documented

### Deployment
```bash
# Merge to develop
git checkout develop
git merge feature/user-dashboard

# Deploy to staging
vercel --prod
```

---

## Summary

```
Feature: User Dashboard
Duration: 4 hours
Files Created: 15
Tests Added: 12
Coverage: 91.8%

Decisions Made:
- Used server components for initial data fetch
- Used React Query for client-side refetching
- Used Recharts for activity visualization
- Followed existing component patterns
```
