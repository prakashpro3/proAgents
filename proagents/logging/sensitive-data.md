# Sensitive Data in Logs

Protecting PII and secrets from appearing in logs.

---

## What Is Sensitive Data?

| Category | Examples | Risk Level |
|----------|----------|------------|
| **Credentials** | Passwords, API keys, tokens | Critical |
| **PII** | Names, emails, phone numbers | High |
| **Financial** | Credit cards, bank accounts | Critical |
| **Health** | Medical records, conditions | High |
| **Location** | GPS coordinates, addresses | Medium |
| **Business** | Trade secrets, internal metrics | Variable |

---

## Data Classification

### Classification Configuration

```yaml
# proagents.config.yaml
logging:
  sensitive_data:
    classification:
      critical:
        patterns:
          - name: "password"
            regex: '(?i)(password|passwd|pwd|secret)["\s:=]+["\']?[\w\S]+'

          - name: "api_key"
            regex: '(?i)(api[_-]?key|apikey|api[_-]?secret)["\s:=]+["\']?[\w\S]+'

          - name: "credit_card"
            regex: '\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b'

          - name: "jwt"
            regex: 'eyJ[A-Za-z0-9-_=]+\.eyJ[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*'

      high:
        patterns:
          - name: "email"
            regex: '\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b'

          - name: "phone"
            regex: '\b\d{3}[-.]?\d{3}[-.]?\d{4}\b'

          - name: "ssn"
            regex: '\b\d{3}-\d{2}-\d{4}\b'

      medium:
        patterns:
          - name: "ip_address"
            regex: '\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b'

          - name: "uuid"
            regex: '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'
```

### Field Classification

```yaml
logging:
  sensitive_data:
    fields:
      # Always redact
      always_redact:
        - "password"
        - "secret"
        - "token"
        - "api_key"
        - "authorization"
        - "cookie"
        - "credit_card"
        - "cvv"
        - "ssn"

      # Mask partially
      partial_mask:
        - field: "email"
          show_chars: 3
          mask_domain: false

        - field: "phone"
          show_chars: 4
          position: "end"

        - field: "ip_address"
          show_octets: 2

      # Hash for correlation
      hash:
        - field: "user_id"
          algorithm: "sha256"
          salt: "${HASH_SALT}"
```

---

## Redaction Strategies

### Full Redaction

```yaml
logging:
  sensitive_data:
    redaction:
      full:
        # Replace with placeholder
        placeholder: "[REDACTED]"

        # Fields to fully redact
        fields:
          - "password"
          - "secret"
          - "private_key"

        # Patterns to fully redact
        patterns:
          - '(?i)bearer\s+[A-Za-z0-9-._~+/]+'
          - 'sk_live_[A-Za-z0-9]+'
```

### Partial Masking

```yaml
logging:
  sensitive_data:
    redaction:
      partial:
        # Email: show first 3 chars and domain
        email:
          pattern: '([^@]{3})[^@]*(@.*)'
          replacement: '$1***$2'
          # john.doe@example.com → joh***@example.com

        # Phone: show last 4 digits
        phone:
          pattern: '(\d{3})[-.]?(\d{3})[-.]?(\d{4})'
          replacement: '***-***-$3'
          # 555-123-4567 → ***-***-4567

        # Credit card: show last 4
        credit_card:
          pattern: '(\d{4})[\s-]?(\d{4})[\s-]?(\d{4})[\s-]?(\d{4})'
          replacement: '****-****-****-$4'
          # 1234-5678-9012-3456 → ****-****-****-3456

        # IP: show first two octets
        ip:
          pattern: '(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})'
          replacement: '$1.$2.xxx.xxx'
```

### Hashing for Correlation

```yaml
logging:
  sensitive_data:
    redaction:
      hash:
        # Hash user ID for privacy but maintain correlation
        user_id:
          algorithm: "sha256"
          truncate: 12
          prefix: "user:"
          # user-123 → user:a1b2c3d4e5f6

        # Hash with salt for added security
        email:
          algorithm: "sha256"
          salt_env: "LOG_HASH_SALT"
          truncate: 16
```

---

## Implementation

### Automatic Redaction

```yaml
logging:
  sensitive_data:
    automatic:
      enabled: true

      # Scan all log fields
      scan_all_fields: true

      # Performance optimization
      max_field_length: 10000
      max_depth: 5

      # Cache compiled patterns
      cache_patterns: true

      # Fail-safe behavior
      on_error: "redact_entire_message"
```

### Code Integration

```typescript
// Automatic redaction via logger
import { createLogger, sensitiveFields } from '@proagents/logging';

const logger = createLogger({
  sensitiveData: {
    // Fields to automatically redact
    fields: ['password', 'token', 'apiKey'],

    // Custom redactors
    redactors: {
      email: (value) => maskEmail(value),
      creditCard: (value) => maskCreditCard(value),
    },
  },
});

// Safe to log - sensitive data automatically redacted
logger.info('User login', {
  email: 'user@example.com',    // Will be masked
  password: 'secret123',         // Will be [REDACTED]
  action: 'login',               // Not redacted
});
```

### Validation

```yaml
logging:
  sensitive_data:
    validation:
      # Pre-commit hook
      pre_commit:
        enabled: true
        scan_for:
          - "hardcoded_secrets"
          - "logging_sensitive_fields"

      # CI check
      ci_check:
        enabled: true
        fail_on: "high_or_above"

      # Runtime monitoring
      runtime:
        sample_rate: 0.01
        alert_on_detection: true
```

---

## Compliance

### GDPR

```yaml
logging:
  sensitive_data:
    compliance:
      gdpr:
        enabled: true

        # PII fields
        pii_fields:
          - "name"
          - "email"
          - "phone"
          - "address"
          - "ip_address"

        # Actions
        actions:
          production:
            - "hash_pii"
            - "limit_retention"

          development:
            - "redact_pii"

        # Retention
        retention:
          pii_logs: "30d"
          anonymized_logs: "2y"
```

### HIPAA

```yaml
logging:
  sensitive_data:
    compliance:
      hipaa:
        enabled: true

        # PHI fields
        phi_fields:
          - "patient_id"
          - "medical_record"
          - "diagnosis"
          - "treatment"

        # Requirements
        requirements:
          - "encrypt_at_rest"
          - "encrypt_in_transit"
          - "access_logging"
          - "audit_trail"
```

### PCI-DSS

```yaml
logging:
  sensitive_data:
    compliance:
      pci_dss:
        enabled: true

        # Card data
        card_fields:
          - "card_number"
          - "cvv"
          - "expiry"
          - "cardholder_name"

        # Requirements
        requirements:
          never_log:
            - "cvv"
            - "pin"
            - "full_card_number"

          mask_required:
            - "card_number"  # Show only last 4
```

---

## Monitoring & Alerts

### Detection Alerts

```yaml
logging:
  sensitive_data:
    monitoring:
      # Alert on potential leaks
      alerts:
        - name: "Potential Secret Leak"
          pattern: '(?i)(password|secret|key)["\s:=]+["\']?[A-Za-z0-9/+=]+'
          severity: "critical"
          notify: ["security@company.com", "#security-alerts"]

        - name: "Potential PII Leak"
          pattern: '\b\d{3}-\d{2}-\d{4}\b'  # SSN pattern
          severity: "high"
          notify: ["compliance@company.com"]

      # Metrics
      metrics:
        - name: "sensitive_data_detections"
          type: "counter"
          labels: ["type", "severity"]
```

### Audit Logging

```yaml
logging:
  sensitive_data:
    audit:
      # Log redaction events
      log_redactions: true

      # Track access to sensitive logs
      access_logging:
        enabled: true
        log_queries: true
        log_exports: true

      # Retention
      retention: "2y"
```

---

## Commands

```bash
# Scan logs for sensitive data
proagents logs scan --type secrets

# Validate redaction rules
proagents logs validate-redaction

# Test redaction on sample
proagents logs test-redact --input sample.log

# Generate compliance report
proagents logs compliance-report --standard gdpr

# Audit log access
proagents logs audit --last 30d
```

---

## Best Practices

1. **Never Log Secrets**: No passwords, API keys, or tokens
2. **Mask PII**: Email, phone, addresses should be masked
3. **Hash for Correlation**: Use hashing when you need to correlate
4. **Validate Automatically**: Use pre-commit hooks and CI checks
5. **Monitor for Leaks**: Alert on potential sensitive data
6. **Regular Audits**: Review logs periodically for compliance
7. **Retention Policies**: Delete logs containing sensitive data
8. **Encryption**: Encrypt logs at rest and in transit
