# Security Audit Prompts

AI-assisted security review and vulnerability detection.

---

## Overview

These prompts help identify and fix security vulnerabilities in your code. ProAgents integrates security checks throughout the development workflow, with special focus on OWASP Top 10 vulnerabilities.

---

## Available Prompts

| Prompt | Use Case | When to Use |
|--------|----------|-------------|
| [vulnerability-scan.md](./vulnerability-scan.md) | Comprehensive vulnerability scan | During reviews, before deployment |
| [code-review.md](./code-review.md) | Security-focused code review | During Phase 6.5 |
| [owasp-check.md](./owasp-check.md) | OWASP Top 10 compliance | Regular audits |
| [auth-review.md](./auth-review.md) | Authentication flow review | Auth features |
| [data-handling.md](./data-handling.md) | Data security review | Data processing code |

---

## Quick Commands

```bash
# Full security audit
/security audit <file_or_directory>

# OWASP Top 10 check
/security owasp <code>

# Find hardcoded secrets
/security secrets <path>

# Check dependency vulnerabilities
/security deps

# Review authentication code
/security auth <file>

# Check for injection vulnerabilities
/security injection <code>
```

---

## OWASP Top 10 (2021)

| # | Category | Risk Level | Common Examples |
|---|----------|------------|-----------------|
| A01 | Broken Access Control | Critical | IDOR, privilege escalation |
| A02 | Cryptographic Failures | Critical | Weak encryption, exposed data |
| A03 | Injection | Critical | SQL, XSS, command injection |
| A04 | Insecure Design | High | Missing threat modeling |
| A05 | Security Misconfiguration | High | Default credentials, verbose errors |
| A06 | Vulnerable Components | High | Outdated dependencies |
| A07 | Authentication Failures | High | Weak passwords, broken sessions |
| A08 | Data Integrity Failures | Medium | Insecure deserialization |
| A09 | Logging Failures | Medium | Missing audit logs |
| A10 | SSRF | Medium | User-controlled URLs |

---

## Integration with Workflow

### During Analysis (Phase 1)
- Identify existing security patterns
- Note potential vulnerability areas
- Assess authentication/authorization

### During Implementation (Phase 5)
- Real-time security suggestions
- Injection prevention
- Secure coding practices

### During Testing (Phase 6)
- Security test generation
- Penetration testing guidance
- Vulnerability scanning

### Before Deployment (Phase 8)
- Final security audit
- Dependency vulnerability check
- Configuration review

---

## Security Severity Levels

| Severity | Response Time | Examples |
|----------|--------------|----------|
| **Critical** | Immediate | RCE, authentication bypass, data breach |
| **High** | Within 24h | SQL injection, XSS, CSRF |
| **Medium** | Within 1 week | Information disclosure, missing headers |
| **Low** | Next sprint | Minor misconfigurations |

---

## Common Vulnerabilities

### Injection Attacks

```typescript
// ❌ Vulnerable
const query = `SELECT * FROM users WHERE id = ${userId}`;

// ✅ Secure
const query = 'SELECT * FROM users WHERE id = $1';
await db.query(query, [userId]);
```

### XSS Prevention

```tsx
// ❌ Vulnerable
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Secure
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />
```

### Authentication

```typescript
// ❌ Vulnerable
const token = jwt.sign(payload, 'hardcoded-secret');

// ✅ Secure
const token = jwt.sign(payload, process.env.JWT_SECRET, {
  expiresIn: '1h',
  algorithm: 'RS256'
});
```

---

## Security Headers

Essential headers for web applications:

```typescript
const securityHeaders = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Content-Security-Policy': "default-src 'self'",
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};
```

---

## Automated Security Tools

### Static Analysis (SAST)
- **SonarQube**: Code quality and security
- **Semgrep**: Pattern-based scanning
- **ESLint security plugins**: JavaScript/TypeScript

### Dependency Scanning
- **npm audit**: Built-in npm scanner
- **Snyk**: Dependency vulnerabilities
- **Dependabot**: Automated updates

### Dynamic Analysis (DAST)
- **OWASP ZAP**: Web app scanner
- **Burp Suite**: Penetration testing
- **Nikto**: Web server scanner

---

## Security Checklist

### Before Deployment
- [ ] No hardcoded secrets in code
- [ ] Dependencies up to date
- [ ] Input validation on all user inputs
- [ ] Output encoding/escaping
- [ ] Authentication properly implemented
- [ ] Authorization checks in place
- [ ] Security headers configured
- [ ] HTTPS enforced
- [ ] Sensitive data encrypted
- [ ] Logging configured (no sensitive data)

---

## Resources

- [OWASP Top 10](https://owasp.org/Top10/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
