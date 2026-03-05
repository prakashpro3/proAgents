# Systematic Debugging

A structured approach to finding and fixing bugs.

---

## Prompt Template

```
Help me debug this issue:

**Symptom:**
{description of what's happening}

**Expected Behavior:**
{what should happen}

**Steps to Reproduce:**
1. {step 1}
2. {step 2}
3. {step 3}

**Environment:**
- Node version: {version}
- Browser: {browser if applicable}
- OS: {operating system}

**Relevant Code:**
{code snippet}

**Error Message (if any):**
{error message}

**What I've Tried:**
- {attempt 1}
- {attempt 2}

Please help me:
1. Analyze the issue
2. Identify potential root causes
3. Suggest debugging steps
4. Propose fixes
```

---

## Debugging Steps

### Step 1: Reproduce Consistently

**Questions to Answer:**
- Can you reproduce it every time?
- What's the minimal reproduction case?
- Does it happen in all environments?

**Template:**
```
Reproduction Steps:
1. Start the application with `npm run dev`
2. Navigate to /users
3. Click "Add User" button
4. Submit form with empty fields
5. Error appears: {error}

Frequency: Always / Sometimes / Rarely
Environment: Development / Staging / Production
```

### Step 2: Gather Information

**Data Collection:**
```typescript
// Add temporary logging
console.log('Function called with:', args);
console.log('State before:', state);

// Result of operation
const result = suspectFunction();
console.log('Result:', result);

// Check type
console.log('Type:', typeof result);
console.log('Is array:', Array.isArray(result));
```

**Network Issues:**
```typescript
// Log request/response
const response = await fetch(url);
console.log('Status:', response.status);
console.log('Headers:', Object.fromEntries(response.headers));
const data = await response.json();
console.log('Response data:', data);
```

### Step 3: Form Hypotheses

**Hypothesis Template:**
```markdown
## Hypothesis 1: Race Condition
**Reasoning:** The error occurs intermittently after user action
**Evidence:** Logs show state update after component unmount
**Test:** Add await before state update
**Expected Result:** Error should not occur

## Hypothesis 2: Null Reference
**Reasoning:** Error mentions "undefined is not an object"
**Evidence:** User data may not be loaded when accessed
**Test:** Add null check before accessing
**Expected Result:** Should handle missing data gracefully
```

### Step 4: Test Hypotheses

**Binary Search Debugging:**
```typescript
// Find which part fails
async function complexProcess() {
  console.log('Step 1 - Starting');
  const data = await fetchData();
  console.log('Step 2 - Data fetched:', data);

  const processed = processData(data);
  console.log('Step 3 - Processed:', processed);

  const result = formatResult(processed);
  console.log('Step 4 - Formatted:', result);

  return result;
}
```

**Isolation Testing:**
```typescript
// Test function in isolation
import { processData } from './utils';

// Test with known inputs
console.log(processData(null));        // Edge case
console.log(processData([]));          // Empty
console.log(processData([1, 2, 3]));   // Normal
console.log(processData(undefined));   // Missing
```

### Step 5: Implement Fix

**Fix Template:**
```typescript
// Before: Bug
function getUser(id) {
  return users.find(u => u.id === id).name;
}

// After: Fix with null check
function getUser(id) {
  const user = users.find(u => u.id === id);
  if (!user) {
    return null; // or throw new Error(`User ${id} not found`)
  }
  return user.name;
}
```

### Step 6: Prevent Regression

**Add Tests:**
```typescript
describe('getUser', () => {
  it('should return user name when found', () => {
    const result = getUser('123');
    expect(result).toBe('John');
  });

  it('should return null when user not found', () => {
    const result = getUser('nonexistent');
    expect(result).toBeNull();
  });

  it('should handle undefined id', () => {
    const result = getUser(undefined);
    expect(result).toBeNull();
  });
});
```

---

## Common Bug Patterns

### Async/Await Issues

```typescript
// ❌ Bug: Missing await
async function loadData() {
  const data = fetchData(); // Missing await!
  console.log(data); // Logs Promise, not data
}

// ✅ Fix
async function loadData() {
  const data = await fetchData();
  console.log(data);
}
```

### State Race Conditions

```typescript
// ❌ Bug: State used after unmount
useEffect(() => {
  fetchData().then(data => {
    setData(data); // Component may be unmounted
  });
}, []);

// ✅ Fix: Cleanup
useEffect(() => {
  let cancelled = false;
  fetchData().then(data => {
    if (!cancelled) setData(data);
  });
  return () => { cancelled = true; };
}, []);
```

### Closure Issues

```typescript
// ❌ Bug: Stale closure
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setInterval(() => {
      console.log(count); // Always logs initial value
    }, 1000);
  }, []);
}

// ✅ Fix: Use ref or include in deps
function Counter() {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);
  countRef.current = count;

  useEffect(() => {
    setInterval(() => {
      console.log(countRef.current);
    }, 1000);
  }, []);
}
```

---

## Debugging Commands

```bash
# Analyze error message
pa:debug error "TypeError: Cannot read property 'name' of undefined"

# Trace execution
pa:debug trace "User registration fails after email validation"

# Get fix suggestions
pa:debug fix "Form resets on blur"

# Generate debugging test
pa:debug test "API returns 500 on large payload"
```
