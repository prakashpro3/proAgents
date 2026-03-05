# OWASP Top 10 Security Checklist

Verify your application against OWASP Top 10 vulnerabilities.

---

## A01:2021 - Broken Access Control

### Checklist

- [ ] Deny by default (except public resources)
- [ ] Implement access control mechanisms once, reuse everywhere
- [ ] Enforce record ownership
- [ ] Disable directory listing
- [ ] Log access control failures
- [ ] Rate limit API access
- [ ] Invalidate JWT tokens on logout
- [ ] Implement proper CORS policy

### Code Review Points

```javascript
// BAD: Direct object reference without authorization
app.get('/api/users/:id', (req, res) => {
  const user = db.getUser(req.params.id);  // No auth check!
  res.json(user);
});

// GOOD: Check authorization
app.get('/api/users/:id', authMiddleware, (req, res) => {
  if (req.user.id !== req.params.id && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const user = db.getUser(req.params.id);
  res.json(user);
});
```

---

## A02:2021 - Cryptographic Failures

### Checklist

- [ ] Classify data by sensitivity
- [ ] Don't store sensitive data unnecessarily
- [ ] Encrypt all sensitive data at rest
- [ ] Use strong, up-to-date encryption algorithms
- [ ] Encrypt all data in transit (TLS)
- [ ] Disable caching for sensitive responses
- [ ] Don't use deprecated crypto (MD5, SHA1, DES)
- [ ] Use authenticated encryption
- [ ] Generate crypto keys using secure RNG

### Code Review Points

```javascript
// BAD: Weak hashing
const hash = crypto.createHash('md5').update(password).digest('hex');

// GOOD: Strong password hashing
const hash = await bcrypt.hash(password, 12);

// BAD: Storing sensitive data in localStorage
localStorage.setItem('creditCard', cardNumber);

// GOOD: Don't store, or use secure storage
// Server-side tokenization instead
```

---

## A03:2021 - Injection

### Checklist

- [ ] Use parameterized queries (prepared statements)
- [ ] Use ORM/ODM with proper escaping
- [ ] Validate and sanitize all input
- [ ] Escape special characters in output
- [ ] Use LIMIT in SQL queries
- [ ] Implement input validation server-side

### Code Review Points

```javascript
// BAD: SQL Injection vulnerable
const query = `SELECT * FROM users WHERE id = ${userId}`;

// GOOD: Parameterized query
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]);

// BAD: Command injection
exec(`ls ${userInput}`);

// GOOD: Avoid shell, use APIs
fs.readdir(validatedPath);
```

---

## A04:2021 - Insecure Design

### Checklist

- [ ] Use secure design patterns
- [ ] Establish secure development lifecycle
- [ ] Use threat modeling
- [ ] Write security user stories
- [ ] Implement defense in depth
- [ ] Limit resource consumption
- [ ] Segregate tenants properly

### Design Principles

```markdown
1. Defense in Depth
   - Multiple security layers
   - Don't rely on single control

2. Least Privilege
   - Minimum necessary permissions
   - Role-based access control

3. Fail Securely
   - Default to deny
   - Secure error handling

4. Trust Nothing
   - Validate all input
   - Verify all claims
```

---

## A05:2021 - Security Misconfiguration

### Checklist

- [ ] Remove unnecessary features/frameworks
- [ ] Configure security headers
- [ ] Update all software regularly
- [ ] Review cloud storage permissions
- [ ] Send security directives to clients
- [ ] Remove default credentials
- [ ] Disable detailed error messages in production

### Security Headers

```javascript
// Express security headers
const helmet = require('helmet');
app.use(helmet());

// Or manually:
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});
```

---

## A06:2021 - Vulnerable Components

### Checklist

- [ ] Remove unused dependencies
- [ ] Continuously inventory components
- [ ] Monitor for vulnerabilities (CVE)
- [ ] Obtain components from official sources
- [ ] Monitor unmaintained libraries
- [ ] Have update/patch plan

### Dependency Management

```bash
# Check for vulnerabilities
npm audit

# Update packages
npm update

# Check outdated
npm outdated

# Use lockfile
# Always commit package-lock.json
```

---

## A07:2021 - Identification and Authentication Failures

### Checklist

- [ ] Implement multi-factor authentication
- [ ] Don't ship with default credentials
- [ ] Implement weak password checks
- [ ] Limit failed login attempts
- [ ] Use secure session management
- [ ] Generate new session on login
- [ ] Properly invalidate sessions on logout
- [ ] Use secure, random session IDs

### Code Review Points

```javascript
// BAD: Weak password requirements
if (password.length >= 4) { /* OK */ }

// GOOD: Strong password validation
const strongPassword = (password) => {
  return password.length >= 12 &&
         /[A-Z]/.test(password) &&
         /[a-z]/.test(password) &&
         /[0-9]/.test(password) &&
         /[^A-Za-z0-9]/.test(password);
};

// GOOD: Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // 5 attempts
});
app.post('/login', limiter, loginHandler);
```

---

## A08:2021 - Software and Data Integrity Failures

### Checklist

- [ ] Use digital signatures for updates
- [ ] Verify integrity of dependencies
- [ ] Use trusted CI/CD pipeline
- [ ] Ensure CI/CD has proper access control
- [ ] Don't send unsigned/unencrypted serialized data
- [ ] Validate serialized data

### Code Review Points

```javascript
// BAD: Deserializing untrusted data
const data = JSON.parse(userInput);
eval(data.code);

// GOOD: Validate and sanitize
const data = JSON.parse(userInput);
const validated = schema.validate(data);
if (!validated.error) {
  processData(validated.value);
}
```

---

## A09:2021 - Security Logging and Monitoring Failures

### Checklist

- [ ] Log all login attempts
- [ ] Log all access control failures
- [ ] Log input validation failures
- [ ] Log with sufficient context
- [ ] Ensure logs are in consumable format
- [ ] Don't log sensitive data
- [ ] Set up alerting for suspicious activities
- [ ] Have incident response plan

### Logging Best Practices

```javascript
// GOOD: Structured logging with context
logger.warn('Login failure', {
  event: 'authentication_failure',
  userId: attemptedUser,
  ip: req.ip,
  userAgent: req.headers['user-agent'],
  timestamp: new Date().toISOString(),
  // DON'T log password!
});

// BAD: Logging sensitive data
logger.info(`Login attempt with password: ${password}`);  // NEVER!
```

---

## A10:2021 - Server-Side Request Forgery (SSRF)

### Checklist

- [ ] Sanitize and validate all client-supplied input
- [ ] Enforce URL schema, port, and destination
- [ ] Don't send raw responses to clients
- [ ] Disable HTTP redirects
- [ ] Use allowlist for URLs
- [ ] Don't deploy security-relevant services on same network

### Code Review Points

```javascript
// BAD: SSRF vulnerable
app.get('/fetch', async (req, res) => {
  const response = await fetch(req.query.url);  // User controls URL!
  res.send(await response.text());
});

// GOOD: Validate URL against allowlist
const ALLOWED_HOSTS = ['api.trusted.com', 'data.trusted.com'];

app.get('/fetch', async (req, res) => {
  const url = new URL(req.query.url);
  if (!ALLOWED_HOSTS.includes(url.host)) {
    return res.status(403).json({ error: 'Host not allowed' });
  }
  const response = await fetch(url.toString());
  res.send(await response.text());
});
```

---

## Security Review Checklist

```markdown
## Security Review: [Feature Name]

### Access Control (A01)
- [ ] Authorization checked for all endpoints
- [ ] Proper access control on resources
- [ ] CORS configured correctly

### Cryptography (A02)
- [ ] Sensitive data encrypted
- [ ] Strong algorithms used
- [ ] Proper key management

### Injection (A03)
- [ ] Input validated
- [ ] Parameterized queries used
- [ ] Output encoded

### Design (A04)
- [ ] Threat model reviewed
- [ ] Defense in depth

### Configuration (A05)
- [ ] Security headers set
- [ ] No default credentials
- [ ] Minimal attack surface

### Components (A06)
- [ ] Dependencies updated
- [ ] No known vulnerabilities

### Authentication (A07)
- [ ] Strong password policy
- [ ] Rate limiting enabled
- [ ] Session management secure

### Integrity (A08)
- [ ] Signed updates/packages
- [ ] CI/CD secured

### Logging (A09)
- [ ] Security events logged
- [ ] No sensitive data in logs
- [ ] Alerting configured

### SSRF (A10)
- [ ] External requests validated
- [ ] URL allowlisting used
```

---

## Commands

| Command | Description |
|---------|-------------|
| `pa:owasp-check` | Run OWASP checklist |
| `pa:security-review` | Full security review |
