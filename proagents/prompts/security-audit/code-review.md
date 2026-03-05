# Security Code Review

Comprehensive security review for code.

---

## Prompt Template

```
Review this code for security vulnerabilities:

{code}

Check for:
1. Injection vulnerabilities (SQL, NoSQL, Command, LDAP)
2. Authentication/Authorization issues
3. Sensitive data exposure
4. XSS vulnerabilities
5. CSRF vulnerabilities
6. Insecure deserialization
7. Security misconfiguration
8. Hardcoded secrets/credentials
9. Insufficient logging
10. Using components with known vulnerabilities

For each issue found:
- Describe the vulnerability
- Explain the risk (with CWE reference)
- Provide severity rating
- Show secure code fix
```

---

## OWASP Top 10 Checks

### A01: Broken Access Control

```typescript
// ❌ Vulnerable: No authorization check
app.get('/api/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

// ✅ Secure: Authorization check
app.get('/api/users/:id', authenticate, async (req, res) => {
  // Check if user can access this resource
  if (req.user.id !== req.params.id && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const user = await User.findById(req.params.id);
  res.json(user);
});
```

### A02: Cryptographic Failures

```typescript
// ❌ Vulnerable: Weak hashing
const hashedPassword = md5(password);

// ❌ Vulnerable: Hardcoded secret
const token = jwt.sign(payload, 'my-secret-key');

// ✅ Secure: Strong hashing with bcrypt
const hashedPassword = await bcrypt.hash(password, 12);

// ✅ Secure: Environment variable secret
const token = jwt.sign(payload, process.env.JWT_SECRET);
```

### A03: Injection

```typescript
// ❌ Vulnerable: SQL injection
const query = `SELECT * FROM users WHERE email = '${email}'`;
db.query(query);

// ❌ Vulnerable: NoSQL injection
User.find({ email: req.body.email });

// ✅ Secure: Parameterized query
const query = 'SELECT * FROM users WHERE email = $1';
db.query(query, [email]);

// ✅ Secure: Input validation
const email = z.string().email().parse(req.body.email);
User.find({ email });
```

### A04: Insecure Design

```typescript
// ❌ Vulnerable: No rate limiting
app.post('/api/login', async (req, res) => {
  const user = await authenticate(req.body);
  res.json(user);
});

// ✅ Secure: Rate limiting
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts',
});

app.post('/api/login', loginLimiter, async (req, res) => {
  const user = await authenticate(req.body);
  res.json(user);
});
```

### A05: Security Misconfiguration

```typescript
// ❌ Vulnerable: Verbose errors in production
app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message,
    stack: err.stack, // Exposes internal details
  });
});

// ✅ Secure: Generic errors in production
app.use((err, req, res, next) => {
  logger.error(err);

  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ error: 'Internal server error' });
  } else {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});
```

### A07: XSS

```typescript
// ❌ Vulnerable: Direct HTML insertion
function Comment({ content }) {
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}

// ✅ Secure: Text content only
function Comment({ content }) {
  return <div>{content}</div>;
}

// ✅ Secure: Sanitize if HTML needed
import DOMPurify from 'dompurify';

function Comment({ content }) {
  const sanitized = DOMPurify.sanitize(content);
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
```

---

## Secret Detection

```typescript
// ❌ Vulnerable: Hardcoded secrets
const API_KEY = 'sk_live_abc123xyz';
const DB_PASSWORD = 'admin123';
const JWT_SECRET = 'super-secret-key';

// ❌ Vulnerable: Committed to repo
// .env (should be in .gitignore)
API_KEY=sk_live_abc123xyz

// ✅ Secure: Environment variables
const API_KEY = process.env.API_KEY;
const DB_PASSWORD = process.env.DB_PASSWORD;

// Validate secrets exist
if (!process.env.API_KEY) {
  throw new Error('API_KEY environment variable required');
}
```

---

## Security Headers

```typescript
import helmet from 'helmet';

app.use(helmet());

// Or configure individually
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'https:'],
  },
}));

app.use(helmet.hsts({
  maxAge: 31536000,
  includeSubDomains: true,
}));
```

---

## Input Validation

```typescript
import { z } from 'zod';

// Define strict schemas
const userSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(100),
  name: z.string().min(1).max(100).regex(/^[a-zA-Z\s]+$/),
});

// Validate all inputs
app.post('/api/users', async (req, res) => {
  const result = userSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: result.error.issues,
    });
  }

  const user = await createUser(result.data);
  res.json(user);
});
```

---

## Security Commands

```bash
# Full security audit
/security audit ./src

# Check for OWASP Top 10
/security owasp ./src/api

# Find secrets
/security secrets ./

# Check dependencies
/security deps

# Generate security report
/security report
```
