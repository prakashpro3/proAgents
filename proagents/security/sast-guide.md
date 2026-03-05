# Static Application Security Testing (SAST) Guide

Integrate static code analysis for security vulnerabilities into the development workflow.

---

## Overview

SAST analyzes source code to find security vulnerabilities before runtime. This guide covers:
- Tool integration
- Common vulnerability patterns
- Automated scanning
- Remediation guidance

---

## SAST Tools Integration

### 1. ESLint Security Plugins

```bash
# Install security plugins
npm install -D eslint-plugin-security eslint-plugin-no-secrets
```

```javascript
// .eslintrc.js
module.exports = {
  plugins: ['security', 'no-secrets'],
  extends: ['plugin:security/recommended'],
  rules: {
    'security/detect-object-injection': 'error',
    'security/detect-non-literal-regexp': 'warn',
    'security/detect-unsafe-regex': 'error',
    'security/detect-buffer-noassert': 'error',
    'security/detect-child-process': 'warn',
    'security/detect-disable-mustache-escape': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
    'security/detect-possible-timing-attacks': 'warn',
    'security/detect-pseudoRandomBytes': 'error',
    'no-secrets/no-secrets': ['error', { tolerance: 4.5 }],
  },
};
```

### 2. SonarQube Integration

```yaml
# sonar-project.properties
sonar.projectKey=myapp
sonar.projectName=MyApp
sonar.sources=src
sonar.tests=tests
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.coverage.exclusions=**/*.test.ts,**/*.spec.ts

# Security-specific rules
sonar.issue.ignore.multicriteria=e1
sonar.issue.ignore.multicriteria.e1.ruleKey=typescript:S1234
sonar.issue.ignore.multicriteria.e1.resourceKey=**/*.mock.ts
```

```bash
# Run SonarQube scanner
npx sonar-scanner
```

### 3. Semgrep Configuration

```yaml
# .semgrep.yml
rules:
  - id: hardcoded-secret
    pattern: |
      $KEY = "..."
    message: "Potential hardcoded secret detected"
    severity: ERROR
    languages: [typescript, javascript]

  - id: sql-injection
    patterns:
      - pattern: |
          $QUERY = `... ${$VAR} ...`
      - pattern-inside: |
          $DB.query($QUERY)
    message: "Potential SQL injection vulnerability"
    severity: ERROR
    languages: [typescript, javascript]

  - id: xss-danger
    pattern: dangerouslySetInnerHTML={{__html: $VAR}}
    message: "Potential XSS vulnerability with dangerouslySetInnerHTML"
    severity: WARNING
    languages: [typescript, javascript]
```

```bash
# Run semgrep
semgrep --config .semgrep.yml src/
```

### 4. Snyk Code Analysis

```bash
# Install and authenticate
npm install -g snyk
snyk auth

# Run code analysis
snyk code test

# Monitor continuously
snyk monitor
```

---

## Common Vulnerability Patterns

### 1. Injection Vulnerabilities

**SQL Injection:**
```typescript
// ❌ VULNERABLE
const query = `SELECT * FROM users WHERE id = '${userId}'`;
await db.execute(query);

// ✅ SAFE
const query = 'SELECT * FROM users WHERE id = $1';
await db.execute(query, [userId]);

// ✅ SAFE with Prisma
await prisma.user.findUnique({ where: { id: userId } });
```

**Command Injection:**
```typescript
// ❌ VULNERABLE
exec(`ls ${userInput}`);

// ✅ SAFE
execFile('ls', [userInput]);

// ✅ SAFE with validation
const safeInput = userInput.replace(/[^a-zA-Z0-9]/g, '');
execFile('ls', [safeInput]);
```

**NoSQL Injection:**
```typescript
// ❌ VULNERABLE
const user = await User.findOne({ email: req.body.email });

// ✅ SAFE - validate input type
if (typeof req.body.email !== 'string') {
  throw new ValidationError('Invalid email');
}
const user = await User.findOne({ email: req.body.email });
```

### 2. Cross-Site Scripting (XSS)

**React XSS:**
```tsx
// ❌ VULNERABLE
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ SAFE - sanitize first
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userContent) }} />

// ✅ SAFE - use text content
<div>{userContent}</div>
```

**URL-based XSS:**
```typescript
// ❌ VULNERABLE
const url = `https://api.example.com?callback=${userInput}`;

// ✅ SAFE
const url = new URL('https://api.example.com');
url.searchParams.set('callback', userInput);
```

### 3. Authentication Issues

**Timing Attack:**
```typescript
// ❌ VULNERABLE
if (userToken === expectedToken) {
  // ...
}

// ✅ SAFE - constant-time comparison
import { timingSafeEqual } from 'crypto';
const isValid = timingSafeEqual(
  Buffer.from(userToken),
  Buffer.from(expectedToken)
);
```

**Weak Password Storage:**
```typescript
// ❌ VULNERABLE
const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

// ✅ SAFE
import bcrypt from 'bcrypt';
const hashedPassword = await bcrypt.hash(password, 12);
```

### 4. Sensitive Data Exposure

**Logging Sensitive Data:**
```typescript
// ❌ VULNERABLE
console.log('User login:', { email, password });

// ✅ SAFE
console.log('User login:', { email, password: '[REDACTED]' });

// ✅ SAFE with logger
logger.info('User login', { email, userId });
```

**Error Information Leakage:**
```typescript
// ❌ VULNERABLE
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.stack });
});

// ✅ SAFE
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).json({ error: 'Internal server error' });
});
```

### 5. Insecure Dependencies

```bash
# Check for vulnerabilities
npm audit

# Fix automatically where possible
npm audit fix

# Check specific package
npm audit --package-lock-only
```

---

## Automated SAST Pipeline

### GitHub Actions Integration

```yaml
# .github/workflows/security.yml
name: Security Scan

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  sast:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint security rules
        run: npm run lint:security

      - name: Run Semgrep
        uses: returntocorp/semgrep-action@v1
        with:
          config: .semgrep.yml

      - name: Run npm audit
        run: npm audit --audit-level=high

      - name: Run Snyk
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  dependency-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/dependency-review-action@v3
        with:
          fail-on-severity: high
```

### Pre-commit Hooks

```yaml
# .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      - id: security-lint
        name: Security Lint
        entry: npm run lint:security
        language: system
        pass_filenames: false

      - id: secrets-check
        name: Check for secrets
        entry: npx secretlint
        language: system
        types: [text]

  - repo: https://github.com/zricethezav/gitleaks
    rev: v8.18.0
    hooks:
      - id: gitleaks
```

---

## Severity Levels and Actions

| Severity | Definition | Action Required |
|----------|------------|-----------------|
| Critical | Exploitable, high impact | Block merge, fix immediately |
| High | Likely exploitable | Block merge, fix before release |
| Medium | Potentially exploitable | Fix within sprint |
| Low | Theoretical risk | Track in backlog |
| Info | Best practice violation | Optional improvement |

---

## SAST Report Template

```markdown
# Security Scan Report

**Project:** MyApp
**Date:** YYYY-MM-DD
**Branch:** feature/user-auth

---

## Summary

| Severity | Count | Status |
|----------|-------|--------|
| Critical | 0 | ✅ |
| High | 2 | ⚠️ Action Required |
| Medium | 5 | 📋 Tracked |
| Low | 12 | ℹ️ Info |

---

## Critical/High Issues

### SAST-001: SQL Injection
**Severity:** High
**File:** src/services/userService.ts:45
**Rule:** sql-injection

**Code:**
```typescript
const query = `SELECT * FROM users WHERE email = '${email}'`;
```

**Fix:**
```typescript
const query = 'SELECT * FROM users WHERE email = $1';
await db.query(query, [email]);
```

**Status:** 🔴 Not Fixed

---

### SAST-002: Hardcoded Secret
**Severity:** High
**File:** src/config/api.ts:12
**Rule:** no-secrets/no-secrets

**Code:**
```typescript
const API_KEY = 'sk_live_abc123...';
```

**Fix:**
Use environment variables:
```typescript
const API_KEY = process.env.API_KEY;
```

**Status:** 🔴 Not Fixed

---

## Medium Issues

[List medium severity issues...]

---

## Recommendations

1. Enable strict mode for all security linters
2. Add pre-commit hooks for secret detection
3. Schedule weekly full scans
4. Review and update dependency versions
```

---

## Configuration

```yaml
# proagents.config.yaml

security:
  sast:
    enabled: true

    tools:
      eslint_security: true
      semgrep: true
      snyk: true
      sonarqube: false  # Enterprise only

    scan_on:
      - pre_commit
      - pull_request
      - weekly_full_scan

    severity_threshold:
      block_merge: ["critical", "high"]
      require_review: ["medium"]
      track_only: ["low", "info"]

    ignore:
      paths:
        - "**/*.test.ts"
        - "**/*.mock.ts"
        - "scripts/"
      rules:
        - "security/detect-object-injection"  # Too many false positives
```

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `/security-scan` | Run full SAST scan |
| `/security-scan --quick` | Run quick security lint |
| `/security-scan --file [path]` | Scan specific file |
| `/security-report` | Generate security report |
| `/security-fix [issue-id]` | Get fix guidance |
