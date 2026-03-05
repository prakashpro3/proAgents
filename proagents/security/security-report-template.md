# Security Report Template

Standardized template for security assessment reports.

---

## Security Assessment Report

```markdown
# Security Assessment Report

## Project Information

| Field | Value |
|-------|-------|
| **Project** | [Project Name] |
| **Version** | [Version Number] |
| **Assessment Date** | [YYYY-MM-DD] |
| **Assessed By** | [Name/Team] |
| **Report Version** | 1.0 |

---

## Executive Summary

### Overall Security Score: [X/100]

| Category | Score | Status |
|----------|-------|--------|
| Authentication | X/100 | [Good/Needs Work/Critical] |
| Authorization | X/100 | [Good/Needs Work/Critical] |
| Data Protection | X/100 | [Good/Needs Work/Critical] |
| Input Validation | X/100 | [Good/Needs Work/Critical] |
| Dependencies | X/100 | [Good/Needs Work/Critical] |
| Configuration | X/100 | [Good/Needs Work/Critical] |

### Key Findings

- **Critical Issues:** [X]
- **High Issues:** [X]
- **Medium Issues:** [X]
- **Low Issues:** [X]
- **Informational:** [X]

### Immediate Actions Required

1. [Critical action 1]
2. [Critical action 2]
3. [High priority action]

---

## Methodology

### Scope
- Source code analysis
- Dependency scanning
- Configuration review
- Authentication/Authorization testing
- API security testing

### Tools Used
- ESLint security plugins
- Semgrep
- Snyk
- npm audit
- [Other tools]

### Excluded from Scope
- Infrastructure security
- Network security
- Physical security

---

## Detailed Findings

### Critical Severity

#### [SEC-001] [Vulnerability Title]

| Field | Value |
|-------|-------|
| **Severity** | Critical |
| **Category** | [Injection/XSS/Auth/etc.] |
| **OWASP** | [A01/A02/etc.] |
| **CWE** | [CWE-XXX] |
| **Location** | [File:Line] |
| **Status** | [Open/In Progress/Fixed] |

**Description:**
[Detailed description of the vulnerability]

**Evidence:**
```
[Code snippet or proof of concept]
```

**Impact:**
[Description of potential impact if exploited]

**Remediation:**
```
[Fixed code or remediation steps]
```

**References:**
- [Link to relevant documentation]
- [OWASP reference]

---

### High Severity

#### [SEC-002] [Vulnerability Title]

[Same format as Critical...]

---

### Medium Severity

#### [SEC-003] [Vulnerability Title]

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **Category** | [Category] |
| **Location** | [File:Line] |
| **Status** | [Open/In Progress/Fixed] |

**Description:**
[Brief description]

**Remediation:**
[Fix recommendation]

---

### Low Severity

| ID | Title | Location | Status |
|----|-------|----------|--------|
| SEC-004 | [Title] | [Location] | [Status] |
| SEC-005 | [Title] | [Location] | [Status] |
| SEC-006 | [Title] | [Location] | [Status] |

---

## OWASP Top 10 Compliance

| Category | Status | Notes |
|----------|--------|-------|
| A01: Broken Access Control | [Pass/Fail/Partial] | [Notes] |
| A02: Cryptographic Failures | [Pass/Fail/Partial] | [Notes] |
| A03: Injection | [Pass/Fail/Partial] | [Notes] |
| A04: Insecure Design | [Pass/Fail/Partial] | [Notes] |
| A05: Security Misconfiguration | [Pass/Fail/Partial] | [Notes] |
| A06: Vulnerable Components | [Pass/Fail/Partial] | [Notes] |
| A07: Auth Failures | [Pass/Fail/Partial] | [Notes] |
| A08: Data Integrity Failures | [Pass/Fail/Partial] | [Notes] |
| A09: Logging Failures | [Pass/Fail/Partial] | [Notes] |
| A10: SSRF | [Pass/Fail/Partial] | [Notes] |

---

## Dependency Analysis

### Vulnerable Dependencies

| Package | Version | Vulnerability | Severity | Fix Version |
|---------|---------|---------------|----------|-------------|
| [pkg] | [ver] | [CVE-XXXX] | [Sev] | [Fix ver] |

### Outdated Dependencies

| Package | Current | Latest | Risk |
|---------|---------|--------|------|
| [pkg] | [ver] | [ver] | [Risk] |

---

## Configuration Security

### Environment Variables

| Variable | Properly Secured | Notes |
|----------|------------------|-------|
| DATABASE_URL | [Yes/No] | [Notes] |
| API_KEY | [Yes/No] | [Notes] |
| JWT_SECRET | [Yes/No] | [Notes] |

### Security Headers

| Header | Implemented | Value |
|--------|-------------|-------|
| Content-Security-Policy | [Yes/No] | [Value] |
| X-Frame-Options | [Yes/No] | [Value] |
| X-Content-Type-Options | [Yes/No] | [Value] |
| Strict-Transport-Security | [Yes/No] | [Value] |

---

## Remediation Plan

### Immediate (24-48 hours)

| Issue | Owner | Due Date | Status |
|-------|-------|----------|--------|
| SEC-001 | [Name] | [Date] | [Status] |
| SEC-002 | [Name] | [Date] | [Status] |

### Short-term (1-2 weeks)

| Issue | Owner | Due Date | Status |
|-------|-------|----------|--------|
| SEC-003 | [Name] | [Date] | [Status] |

### Long-term (This Quarter)

| Issue | Owner | Due Date | Status |
|-------|-------|----------|--------|
| SEC-004+ | [Name] | [Date] | [Status] |

---

## Recommendations

### Security Improvements

1. **Implement Content Security Policy**
   - Add CSP headers to prevent XSS
   - Configure report-uri for violations

2. **Enable Security Monitoring**
   - Set up dependency vulnerability alerts
   - Configure SAST in CI/CD pipeline

3. **Strengthen Authentication**
   - Implement rate limiting on auth endpoints
   - Add MFA support

### Best Practices

- Regular security training for developers
- Quarterly security assessments
- Automated security testing in CI/CD
- Security-focused code review guidelines

---

## Appendices

### A. Full Scan Output

[Attach or link to detailed scan outputs]

### B. Test Cases

[List of security test cases executed]

### C. References

- OWASP Top 10: https://owasp.org/Top10/
- CWE Database: https://cwe.mitre.org/
- [Project security documentation]

---

## Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Security Assessor | [Name] | [Date] | _________ |
| Technical Lead | [Name] | [Date] | _________ |
| Project Manager | [Name] | [Date] | _________ |
```

---

## Quick Security Check Template

For rapid assessments:

```markdown
# Quick Security Check

**Feature:** [Feature Name]
**Date:** [Date]
**Checked by:** [Name]

## Checklist

### Authentication
- [ ] Endpoints require proper authentication
- [ ] Tokens validated correctly
- [ ] Session management secure

### Authorization
- [ ] Role-based access enforced
- [ ] Resource ownership verified
- [ ] No privilege escalation possible

### Input Validation
- [ ] All inputs validated
- [ ] No SQL injection vectors
- [ ] No XSS vulnerabilities
- [ ] File uploads validated (if applicable)

### Data Protection
- [ ] Sensitive data encrypted
- [ ] No secrets in code
- [ ] Proper logging (no PII)

### Dependencies
- [ ] npm audit clean
- [ ] No known vulnerabilities

## Issues Found

| Issue | Severity | Status |
|-------|----------|--------|
| [None / List issues] | | |

## Approval

- [ ] Ready for deployment
- [ ] Needs fixes before deployment

**Approver:** _____________
**Date:** _____________
```

---

## Commands

| Command | Description |
|---------|-------------|
| `pa:security-report` | Generate full security report |
| `pa:security-report --quick` | Generate quick check |
| `pa:security-report --template` | Get blank template |
| `pa:security-report --export pdf` | Export as PDF |
