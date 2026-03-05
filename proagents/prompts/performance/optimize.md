# Performance Optimization Prompt

Identify and fix performance issues in code.

---

## Prompt Template

```markdown
## Performance Optimization Review

Analyze the following code for performance issues:

```{{language}}
{{code}}
```

### Check For:

**Rendering Performance (React)**
- [ ] Unnecessary re-renders
- [ ] Missing memoization
- [ ] Expensive calculations in render
- [ ] Large component trees

**Data Fetching**
- [ ] N+1 queries
- [ ] Missing caching
- [ ] Unoptimized payloads
- [ ] Waterfall requests

**Memory**
- [ ] Memory leaks
- [ ] Large object retention
- [ ] Event listener cleanup

**Bundle Size**
- [ ] Large imports
- [ ] Tree shaking issues
- [ ] Unnecessary dependencies

### Output Format:
For each issue:
1. Performance impact (High/Medium/Low)
2. Current behavior
3. Issue explanation
4. Optimized solution
5. Expected improvement
```

---

## React Optimization Patterns

### Prevent Unnecessary Re-renders

```tsx
// ❌ Re-renders on every parent render
function UserList({ users }) {
  return users.map(user => <UserCard user={user} />);
}

// ✅ Memoized - only re-renders when user changes
const UserCard = memo(function UserCard({ user }) {
  return <div>{user.name}</div>;
});

// ✅ With custom comparison
const UserCard = memo(
  function UserCard({ user }) {
    return <div>{user.name}</div>;
  },
  (prevProps, nextProps) => prevProps.user.id === nextProps.user.id
);
```

### Memoize Expensive Calculations

```tsx
// ❌ Recalculates on every render
function DataTable({ data, filter }) {
  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(filter.toLowerCase())
  );

  return <Table data={filteredData} />;
}

// ✅ Only recalculates when dependencies change
function DataTable({ data, filter }) {
  const filteredData = useMemo(
    () => data.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    ),
    [data, filter]
  );

  return <Table data={filteredData} />;
}
```

### Stable Callback References

```tsx
// ❌ New function on every render
function SearchForm({ onSearch }) {
  return (
    <input onChange={(e) => onSearch(e.target.value)} />
  );
}

// ✅ Stable reference
function SearchForm({ onSearch }) {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => onSearch(e.target.value),
    [onSearch]
  );

  return <input onChange={handleChange} />;
}
```

### Virtualize Long Lists

```tsx
// ❌ Renders all 10,000 items
function UserList({ users }) {
  return (
    <div>
      {users.map(user => <UserCard key={user.id} user={user} />)}
    </div>
  );
}

// ✅ Only renders visible items
import { FixedSizeList } from 'react-window';

function UserList({ users }) {
  return (
    <FixedSizeList
      height={400}
      itemCount={users.length}
      itemSize={50}
    >
      {({ index, style }) => (
        <div style={style}>
          <UserCard user={users[index]} />
        </div>
      )}
    </FixedSizeList>
  );
}
```

---

## Data Fetching Optimization

### Avoid N+1 Queries

```typescript
// ❌ N+1 queries
async function getPostsWithAuthors() {
  const posts = await db.post.findMany();
  for (const post of posts) {
    post.author = await db.user.findUnique({
      where: { id: post.authorId }
    });
  }
  return posts;
}

// ✅ Single query with include
async function getPostsWithAuthors() {
  return db.post.findMany({
    include: { author: true }
  });
}
```

### Parallel Fetching

```typescript
// ❌ Sequential - slow
async function getDashboardData() {
  const users = await getUsers();
  const orders = await getOrders();
  const stats = await getStats();
  return { users, orders, stats };
}

// ✅ Parallel - fast
async function getDashboardData() {
  const [users, orders, stats] = await Promise.all([
    getUsers(),
    getOrders(),
    getStats()
  ]);
  return { users, orders, stats };
}
```

### Response Caching

```typescript
// React Query with caching
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 30 * 60 * 1000, // 30 minutes
});

// Server-side caching
import { unstable_cache } from 'next/cache';

const getCachedUsers = unstable_cache(
  async () => db.user.findMany(),
  ['users'],
  { revalidate: 60 } // 1 minute
);
```

---

## Bundle Optimization

### Dynamic Imports

```tsx
// ❌ Loads on initial bundle
import { HeavyChart } from 'heavy-chart-library';

// ✅ Loads only when needed
const HeavyChart = dynamic(() => import('heavy-chart-library'), {
  loading: () => <Spinner />,
  ssr: false
});
```

### Tree Shaking

```typescript
// ❌ Imports entire library
import _ from 'lodash';
const result = _.debounce(fn, 300);

// ✅ Imports only needed function
import debounce from 'lodash/debounce';
const result = debounce(fn, 300);

// ✅ Or use lodash-es for better tree shaking
import { debounce } from 'lodash-es';
```

### Analyze Bundle

```bash
# Next.js bundle analyzer
npm install @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({});

# Run analysis
ANALYZE=true npm run build
```

---

## Memory Optimization

### Cleanup Effects

```tsx
// ❌ Memory leak - no cleanup
useEffect(() => {
  window.addEventListener('resize', handleResize);
}, []);

// ✅ Proper cleanup
useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

### Avoid Closures Over Large Objects

```tsx
// ❌ Keeps large array in memory
function DataProcessor({ largeData }) {
  const processedData = useMemo(() => {
    return largeData.map(item => ({ ...item, processed: true }));
  }, [largeData]);

  // Handler keeps reference to largeData
  const handleClick = () => {
    console.log(largeData.length);
  };

  return <button onClick={handleClick}>Process</button>;
}

// ✅ Only store what's needed
function DataProcessor({ largeData }) {
  const dataLength = largeData.length;

  const handleClick = () => {
    console.log(dataLength);
  };

  return <button onClick={handleClick}>Process</button>;
}
```

---

## Performance Testing

```typescript
// Measure component render time
import { Profiler } from 'react';

function onRender(id, phase, actualDuration) {
  console.log(`${id} ${phase}: ${actualDuration}ms`);
}

<Profiler id="UserList" onRender={onRender}>
  <UserList users={users} />
</Profiler>

// Benchmark test
describe('Performance', () => {
  it('should render 1000 items in under 100ms', () => {
    const start = performance.now();
    render(<UserList users={generateUsers(1000)} />);
    const duration = performance.now() - start;

    expect(duration).toBeLessThan(100);
  });
});
```
