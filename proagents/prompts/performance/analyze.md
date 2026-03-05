# Performance Analysis

Systematic approach to identifying performance issues.

---

## Prompt Template

```
Analyze the performance of this code:

{code}

Context:
- This code runs: {frequency - once/per request/continuously}
- Expected data size: {size}
- Current performance: {metrics if available}
- Target performance: {target}

Please analyze:
1. Time complexity (Big O)
2. Space complexity
3. Potential bottlenecks
4. Unnecessary operations
5. Optimization opportunities

Provide:
- Performance assessment
- Specific issues found
- Optimized version with explanations
- Benchmarking approach
```

---

## Analysis Categories

### Time Complexity

```typescript
// ❌ O(n²) - Nested loops
function findDuplicates(arr: number[]) {
  const duplicates = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        duplicates.push(arr[i]);
      }
    }
  }
  return duplicates;
}

// ✅ O(n) - Using Set
function findDuplicates(arr: number[]) {
  const seen = new Set();
  const duplicates = new Set();

  for (const num of arr) {
    if (seen.has(num)) {
      duplicates.add(num);
    }
    seen.add(num);
  }

  return [...duplicates];
}
```

### Space Complexity

```typescript
// ❌ O(n) space - Creating new arrays
function transform(arr: number[]) {
  return arr
    .filter(x => x > 0)    // New array
    .map(x => x * 2)       // New array
    .filter(x => x < 100); // New array
}

// ✅ O(1) space - In-place or single pass
function* transform(arr: number[]) {
  for (const x of arr) {
    if (x > 0) {
      const doubled = x * 2;
      if (doubled < 100) {
        yield doubled;
      }
    }
  }
}
```

### Memory Leaks

```typescript
// ❌ Memory leak - Event listener not removed
useEffect(() => {
  window.addEventListener('resize', handleResize);
  // Missing cleanup!
}, []);

// ✅ Proper cleanup
useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);
```

### Unnecessary Renders

```typescript
// ❌ Rerenders on every parent render
function Child({ items, onClick }) {
  return items.map(item => (
    <button onClick={() => onClick(item.id)}> // New function each render
      {item.name}
    </button>
  ));
}

// ✅ Memoized callback
const Child = memo(function Child({ items, onClick }) {
  const handleClick = useCallback((id: string) => {
    onClick(id);
  }, [onClick]);

  return items.map(item => (
    <button onClick={() => handleClick(item.id)}>
      {item.name}
    </button>
  ));
});
```

---

## Optimization Techniques

### Caching/Memoization

```typescript
// Cache expensive computations
const expensiveResult = useMemo(() => {
  return items.reduce((acc, item) => {
    // Complex calculation
    return acc + complexCalculation(item);
  }, 0);
}, [items]);

// Cache function references
const handleSubmit = useCallback((data) => {
  submitForm(data);
}, [submitForm]);
```

### Lazy Loading

```typescript
// Lazy load components
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  );
}

// Lazy load data
function useData() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Only load when needed
    if (shouldLoadData) {
      fetchData().then(setData);
    }
  }, [shouldLoadData]);
}
```

### Debouncing/Throttling

```typescript
// Debounce search input
const debouncedSearch = useMemo(
  () => debounce((query: string) => {
    searchApi(query);
  }, 300),
  []
);

// Throttle scroll handler
const throttledScroll = useMemo(
  () => throttle(() => {
    updateScrollPosition();
  }, 100),
  []
);
```

### Virtualization

```typescript
// Virtual list for large datasets
import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
  return (
    <FixedSizeList
      height={400}
      width={300}
      itemCount={items.length}
      itemSize={50}
    >
      {({ index, style }) => (
        <div style={style}>{items[index].name}</div>
      )}
    </FixedSizeList>
  );
}
```

---

## Benchmarking

```typescript
// Simple benchmark
function benchmark(fn: () => void, iterations = 1000) {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = performance.now();
  return (end - start) / iterations;
}

// Compare implementations
const timeA = benchmark(() => implementationA(testData));
const timeB = benchmark(() => implementationB(testData));
console.log(`A: ${timeA}ms, B: ${timeB}ms`);
```

---

## Performance Commands

```bash
# Analyze function complexity
/perf complexity <function>

# Find memory leaks
/perf memory-leak <component>

# Suggest optimizations
/perf optimize <code>

# Generate benchmark
/perf benchmark <function>
```
