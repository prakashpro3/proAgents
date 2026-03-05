# Performance Debugging Prompt

Identify and resolve performance issues.

---

## Prompt Template

```markdown
## Performance Issue Analysis

My application has the following performance issue:

**Symptom:**
{{description of slow behavior}}

**Metrics:**
- Load time: {{time}}
- Response time: {{time}}
- Memory usage: {{amount}}
- CPU usage: {{percentage}}

**When it occurs:**
- [ ] On initial load
- [ ] During user interaction
- [ ] Over time (memory leak)
- [ ] With large data sets
- [ ] Intermittently

**Code/Component:**
```{{language}}
{{relevant code}}
```

### Analyze For:
1. Performance bottlenecks
2. Resource-intensive operations
3. Memory leaks
4. Unnecessary re-renders (React)
5. Unoptimized queries/API calls
6. Bundle size issues
```

---

## Performance Debugging Tools

### Browser DevTools Profiling

```markdown
## Chrome DevTools Performance Tab

### Recording a Profile
1. Open DevTools (F12)
2. Go to Performance tab
3. Click Record
4. Perform the slow action
5. Click Stop

### What to Look For
- Long tasks (red triangles)
- JavaScript execution time
- Layout thrashing
- Paint events
- Network waterfall
```

### React DevTools Profiler

```tsx
// Wrap components to profile
import { Profiler } from 'react';

function onRenderCallback(
  id,           // Component name
  phase,        // "mount" or "update"
  actualDuration,   // Time spent rendering
  baseDuration,     // Estimated time without memoization
  startTime,        // When React started rendering
  commitTime        // When React committed updates
) {
  console.log(`${id} (${phase}): ${actualDuration.toFixed(2)}ms`);

  if (actualDuration > 16) {
    console.warn(`Slow render detected in ${id}`);
  }
}

<Profiler id="UserList" onRenderCallback={onRenderCallback}>
  <UserList users={users} />
</Profiler>
```

---

## Common Performance Issues

### 1. Unnecessary Re-renders

```tsx
// ❌ Problem: Object/array created on every render
function UserList({ users }) {
  return (
    <List
      items={users}
      style={{ margin: 10 }}  // New object every render!
      onSelect={(id) => console.log(id)}  // New function every render!
    />
  );
}

// ✅ Solution: Memoize values
function UserList({ users }) {
  const style = useMemo(() => ({ margin: 10 }), []);
  const handleSelect = useCallback((id) => console.log(id), []);

  return (
    <List
      items={users}
      style={style}
      onSelect={handleSelect}
    />
  );
}
```

### 2. Expensive Calculations in Render

```tsx
// ❌ Problem: Filtering on every render
function DataTable({ data, searchTerm }) {
  // This runs on EVERY render, even unrelated state changes
  const filtered = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return <Table data={filtered} />;
}

// ✅ Solution: Memoize calculation
function DataTable({ data, searchTerm }) {
  const filtered = useMemo(() =>
    data.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [data, searchTerm]  // Only recalculate when these change
  );

  return <Table data={filtered} />;
}
```

### 3. Memory Leaks

```tsx
// ❌ Problem: Event listener not cleaned up
useEffect(() => {
  window.addEventListener('resize', handleResize);
  // Missing cleanup!
}, []);

// ❌ Problem: Interval not cleared
useEffect(() => {
  setInterval(pollData, 1000);
  // Missing cleanup!
}, []);

// ✅ Solution: Always cleanup
useEffect(() => {
  window.addEventListener('resize', handleResize);
  const interval = setInterval(pollData, 1000);

  return () => {
    window.removeEventListener('resize', handleResize);
    clearInterval(interval);
  };
}, []);
```

### 4. Large List Rendering

```tsx
// ❌ Problem: Rendering all 10,000 items
function UserList({ users }) {
  return (
    <div>
      {users.map(user => <UserCard key={user.id} user={user} />)}
    </div>
  );
}

// ✅ Solution: Virtualization
import { FixedSizeList } from 'react-window';

function UserList({ users }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <UserCard user={users[index]} />
    </div>
  );

  return (
    <FixedSizeList
      height={600}
      itemCount={users.length}
      itemSize={80}
    >
      {Row}
    </FixedSizeList>
  );
}
```

### 5. Network Waterfall

```typescript
// ❌ Problem: Sequential requests
async function loadDashboard() {
  const users = await fetchUsers();
  const posts = await fetchPosts();
  const comments = await fetchComments();
  return { users, posts, comments };
}

// ✅ Solution: Parallel requests
async function loadDashboard() {
  const [users, posts, comments] = await Promise.all([
    fetchUsers(),
    fetchPosts(),
    fetchComments()
  ]);
  return { users, posts, comments };
}
```

### 6. Bundle Size

```typescript
// ❌ Problem: Importing entire library
import _ from 'lodash';
const result = _.debounce(fn, 300);

// ✅ Solution: Import specific function
import debounce from 'lodash/debounce';
const result = debounce(fn, 300);

// ✅ Better: Use lodash-es for tree shaking
import { debounce } from 'lodash-es';

// ✅ Or: Native implementation
function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
```

---

## Performance Measurement

### Console Timing

```typescript
// Simple timing
console.time('operation');
await expensiveOperation();
console.timeEnd('operation'); // Logs: operation: 234.56ms

// Performance API for precision
const start = performance.now();
await expensiveOperation();
const duration = performance.now() - start;
console.log(`Operation took ${duration}ms`);
```

### Performance Marks

```typescript
// Create marks for complex flows
performance.mark('fetch-start');
const data = await fetchData();
performance.mark('fetch-end');

performance.mark('process-start');
const processed = processData(data);
performance.mark('process-end');

// Measure between marks
performance.measure('fetch', 'fetch-start', 'fetch-end');
performance.measure('process', 'process-start', 'process-end');

// Get measurements
const measures = performance.getEntriesByType('measure');
measures.forEach(m => console.log(`${m.name}: ${m.duration}ms`));
```

### React Render Tracking

```tsx
// Track renders with useRef
function useRenderCount(name) {
  const count = useRef(0);
  count.current++;

  useEffect(() => {
    console.log(`${name} rendered ${count.current} times`);
  });

  return count.current;
}

// Usage
function MyComponent() {
  const renderCount = useRenderCount('MyComponent');
  // ...
}
```

---

## Performance Checklist

```markdown
## Performance Audit Checklist

### Initial Load
- [ ] Bundle size reasonable (< 250KB initial JS)
- [ ] Code splitting implemented
- [ ] Images optimized and lazy loaded
- [ ] Critical CSS inlined
- [ ] Third-party scripts deferred

### Runtime
- [ ] No unnecessary re-renders
- [ ] Expensive calculations memoized
- [ ] Large lists virtualized
- [ ] Event handlers throttled/debounced
- [ ] Animations use CSS or requestAnimationFrame

### Memory
- [ ] Event listeners cleaned up
- [ ] Intervals/timeouts cleared
- [ ] Subscriptions unsubscribed
- [ ] Large objects released when not needed

### Network
- [ ] API calls parallelized where possible
- [ ] Data cached appropriately
- [ ] No duplicate requests
- [ ] Pagination for large datasets

### Build
- [ ] Tree shaking working
- [ ] Dead code eliminated
- [ ] Dependencies minimized
- [ ] Compression enabled (gzip/brotli)
```

---

## Performance Debugging Commands

```bash
# Profile render performance
pa:perf profile --component UserList

# Find memory leaks
pa:perf memory --snapshot

# Analyze bundle
pa:perf bundle --analyze

# Check Core Web Vitals
pa:perf vitals

# Find slow API calls
pa:perf network --slow
```
