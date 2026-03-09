# Error Analysis Prompt

Analyze and resolve specific error types.

---

## Prompt Template

```markdown
## Error Analysis Request

I'm encountering the following error:

```
{{error_message}}
```

**Context:**
- File: {{file_path}}
- Line: {{line_number}}
- Framework: {{framework}}
- Last working state: {{description}}

### Please Analyze:

1. **Error Type Classification**
   - Runtime vs Compile-time
   - Syntax vs Logic vs Runtime
   - Category (Type, Reference, Range, etc.)

2. **Root Cause Analysis**
   - Direct cause
   - Underlying issues
   - Contributing factors

3. **Resolution Steps**
   - Immediate fix
   - Proper solution
   - Prevention measures

4. **Similar Issues**
   - Related error patterns
   - Common mistakes that cause this
```

---

## Error Type Reference

### JavaScript/TypeScript Errors

#### TypeError

```typescript
// Error: Cannot read properties of undefined (reading 'name')
const user = undefined;
console.log(user.name); // TypeError!

// Analysis:
// - Type: TypeError
// - Cause: Accessing property on undefined/null
// - Pattern: Missing null check

// Fix:
console.log(user?.name);  // Optional chaining
// OR
if (user) {
  console.log(user.name);
}
```

#### ReferenceError

```typescript
// Error: x is not defined
console.log(myVariable); // ReferenceError!

// Analysis:
// - Type: ReferenceError
// - Cause: Variable not declared before use
// - Pattern: Typo, scope issue, or missing import

// Fix:
// 1. Check spelling
// 2. Verify import
// 3. Check scope (let/const are block-scoped)
```

#### SyntaxError

```typescript
// Error: Unexpected token ';'
const obj = { name: 'John', };; // SyntaxError!

// Analysis:
// - Type: SyntaxError
// - Cause: Invalid syntax
// - Pattern: Extra punctuation, missing brackets

// Fix: Remove extra semicolon
const obj = { name: 'John' };
```

---

### React-Specific Errors

#### Invalid Hook Call

```tsx
// Error: Invalid hook call. Hooks can only be called inside
// of the body of a function component.

// ❌ Wrong: Hook in regular function
function helper() {
  const [state, setState] = useState(0); // Error!
}

// ❌ Wrong: Hook in class component
class MyComponent extends React.Component {
  render() {
    const [state] = useState(0); // Error!
  }
}

// ❌ Wrong: Hook called conditionally
function MyComponent({ show }) {
  if (show) {
    const [state] = useState(0); // Error!
  }
}

// ✅ Correct: Hook at top level of function component
function MyComponent() {
  const [state, setState] = useState(0); // Correct!
  return <div>{state}</div>;
}
```

#### Cannot Update During Render

```tsx
// Error: Cannot update a component while rendering a different component

// ❌ Wrong: Setting state during render
function Parent() {
  const [value, setValue] = useState(0);
  return <Child onChange={setValue(1)} />; // Calls immediately!
}

// ✅ Correct: Pass callback
function Parent() {
  const [value, setValue] = useState(0);
  return <Child onChange={() => setValue(1)} />;
}
```

#### Memory Leak Warning

```tsx
// Warning: Can't perform a React state update on an unmounted component

// ❌ Problem: No cleanup
useEffect(() => {
  fetchData().then(data => setState(data)); // May update after unmount
}, []);

// ✅ Fix: Add cleanup
useEffect(() => {
  let isMounted = true;
  fetchData().then(data => {
    if (isMounted) setState(data);
  });
  return () => { isMounted = false; };
}, []);

// ✅ Better: Use AbortController
useEffect(() => {
  const controller = new AbortController();
  fetchData({ signal: controller.signal })
    .then(data => setState(data))
    .catch(err => {
      if (err.name !== 'AbortError') throw err;
    });
  return () => controller.abort();
}, []);
```

---

### API/Network Errors

#### CORS Errors

```typescript
// Error: Access to fetch at 'https://api.example.com' from origin
// 'http://localhost:3000' has been blocked by CORS policy

// Analysis:
// - Type: CORS (Cross-Origin Resource Sharing) Error
// - Cause: Server doesn't allow cross-origin requests
// - Location: Server-side configuration

// Solutions:

// 1. Server-side: Add CORS headers
// Express.js
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// 2. Development: Use proxy
// package.json
{
  "proxy": "https://api.example.com"
}

// 3. Next.js: API routes as proxy
// pages/api/proxy.ts
export default async function handler(req, res) {
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  res.json(data);
}
```

#### 401/403 Errors

```typescript
// Error: 401 Unauthorized / 403 Forbidden

// 401 Analysis:
// - Cause: Missing or invalid authentication
// - Check: Token present? Token valid? Token expired?

// 403 Analysis:
// - Cause: Authenticated but not authorized
// - Check: User role? Resource permissions?

// Debug steps:
async function debugAuthError(response) {
  console.log('Status:', response.status);
  console.log('Headers:', Object.fromEntries(response.headers));

  // Check token
  const token = localStorage.getItem('token');
  console.log('Token exists:', !!token);

  if (token) {
    // Decode JWT (without verification)
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Token payload:', payload);
    console.log('Expired:', payload.exp < Date.now() / 1000);
  }
}
```

---

### Database Errors

#### Connection Errors

```typescript
// Error: ECONNREFUSED 127.0.0.1:5432

// Analysis:
// - Type: Connection Error
// - Cause: Database not running or wrong host/port

// Debug checklist:
// 1. Is database running?
//    docker ps | grep postgres
//
// 2. Correct host/port?
//    console.log(process.env.DATABASE_URL);
//
// 3. Firewall blocking?
//    telnet localhost 5432
//
// 4. Connection pool exhausted?
//    Check max connections setting
```

#### Query Errors

```typescript
// Error: relation "users" does not exist

// Analysis:
// - Type: Query Error
// - Cause: Table doesn't exist or wrong schema

// Debug:
// 1. Check table exists
//    SELECT * FROM information_schema.tables WHERE table_name = 'users';
//
// 2. Check schema
//    \dt (PostgreSQL)
//    SHOW TABLES; (MySQL)
//
// 3. Run migrations
//    npx prisma migrate dev
//    npx knex migrate:latest
```

---

## Error Analysis Checklist

```markdown
## Quick Error Diagnosis

### Step 1: Identify Error Type
- [ ] What type of error? (Type, Reference, Syntax, Runtime)
- [ ] Client-side or server-side?
- [ ] Consistent or intermittent?

### Step 2: Gather Context
- [ ] Full error message and stack trace
- [ ] When did it start happening?
- [ ] What changed recently?
- [ ] Can you reproduce it?

### Step 3: Isolate
- [ ] Which file/function?
- [ ] Which line of code?
- [ ] What data triggers it?

### Step 4: Research
- [ ] Search error message
- [ ] Check documentation
- [ ] Look for similar issues

### Step 5: Fix
- [ ] Apply fix
- [ ] Test fix
- [ ] Add test to prevent regression
```

---

## Error Pattern Matching

```typescript
// Automated error pattern detection
const errorPatterns = {
  'Cannot read prop': {
    type: 'TypeError',
    cause: 'Null/undefined access',
    fix: 'Add optional chaining or null check'
  },
  'is not defined': {
    type: 'ReferenceError',
    cause: 'Missing declaration or import',
    fix: 'Check imports and variable declarations'
  },
  'is not a function': {
    type: 'TypeError',
    cause: 'Calling non-function as function',
    fix: 'Verify the value is a function before calling'
  },
  'CORS': {
    type: 'NetworkError',
    cause: 'Cross-origin request blocked',
    fix: 'Configure CORS on server or use proxy'
  },
  'ECONNREFUSED': {
    type: 'ConnectionError',
    cause: 'Service not running or unreachable',
    fix: 'Check service is running and port is correct'
  }
};

function analyzeError(errorMessage: string) {
  for (const [pattern, analysis] of Object.entries(errorPatterns)) {
    if (errorMessage.includes(pattern)) {
      return analysis;
    }
  }
  return { type: 'Unknown', cause: 'Requires manual analysis' };
}
```
