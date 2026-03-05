# Secret Access Control

Managing who and what can access secrets.

---

## Access Principles

| Principle | Description |
|-----------|-------------|
| **Least Privilege** | Grant minimum necessary access |
| **Need to Know** | Only those who need it get access |
| **Separation of Duties** | No single person has all access |
| **Audit Everything** | Log all access attempts |

---

## Role-Based Access

### Configuration

```yaml
# proagents.config.yaml
secrets:
  access_control:
    enabled: true

    roles:
      # Read-only access
      viewer:
        permissions:
          - "secrets:read"
        allowed_secrets:
          - "public/*"

      # Developer access
      developer:
        permissions:
          - "secrets:read"
        allowed_secrets:
          - "development/*"
          - "staging/*"
        denied_secrets:
          - "*/credentials"
          - "*/api-keys"

      # Operations access
      operator:
        permissions:
          - "secrets:read"
          - "secrets:rotate"
        allowed_secrets:
          - "*"
        environments:
          - "staging"
          - "production"

      # Admin access
      admin:
        permissions:
          - "secrets:*"
        allowed_secrets:
          - "*"
```

### User Assignment

```yaml
secrets:
  access_control:
    users:
      "developer@company.com":
        roles: ["developer"]
        teams: ["frontend"]

      "ops@company.com":
        roles: ["operator"]
        teams: ["platform"]

      "admin@company.com":
        roles: ["admin"]
        mfa_required: true

    # Team-based access
    teams:
      frontend:
        allowed_secrets:
          - "frontend/*"

      backend:
        allowed_secrets:
          - "backend/*"
          - "database/*"

      platform:
        allowed_secrets:
          - "*"
```

---

## Service Access

### Service Accounts

```yaml
secrets:
  access_control:
    services:
      # API service
      api-service:
        allowed_secrets:
          - "database/connection-string"
          - "redis/url"
          - "jwt/signing-key"
        environments:
          - "${ENVIRONMENT}"

      # Worker service
      worker-service:
        allowed_secrets:
          - "database/connection-string"
          - "queue/credentials"
        environments:
          - "${ENVIRONMENT}"

      # CI/CD pipeline
      ci-pipeline:
        allowed_secrets:
          - "ci/*"
          - "npm/token"
        allowed_operations:
          - "read"
```

### Kubernetes Service Accounts

```yaml
secrets:
  access_control:
    kubernetes:
      # Bind service accounts to secret access
      bindings:
        - service_account: "api-service"
          namespace: "production"
          secrets:
            - "database-credentials"
            - "api-keys"

        - service_account: "worker"
          namespace: "production"
          secrets:
            - "database-credentials"
            - "queue-credentials"
```

---

## Access Policies

### Policy Definition

```yaml
secrets:
  access_control:
    policies:
      # Time-based access
      production_access:
        name: "Production Access"
        conditions:
          - type: "time_window"
            days: ["monday", "tuesday", "wednesday", "thursday", "friday"]
            hours: ["09:00", "18:00"]
            timezone: "America/New_York"

          - type: "ip_range"
            ranges:
              - "10.0.0.0/8"
              - "192.168.1.0/24"

      # Emergency access
      emergency_access:
        name: "Emergency Access"
        conditions:
          - type: "requires_approval"
            approvers: ["security-team", "on-call-manager"]

          - type: "time_limited"
            duration: "4h"

          - type: "audit_required"
            notify: ["security@company.com"]
```

### Vault Policies

```hcl
# vault/policies/api-service.hcl
path "secret/data/api/*" {
  capabilities = ["read"]
}

path "secret/data/database/connection" {
  capabilities = ["read"]
}

path "database/creds/api-role" {
  capabilities = ["read"]
}

# Deny access to admin secrets
path "secret/data/admin/*" {
  capabilities = ["deny"]
}
```

### AWS IAM Policies

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowReadSecrets",
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": [
        "arn:aws:secretsmanager:*:*:secret:myapp/production/*"
      ],
      "Condition": {
        "StringEquals": {
          "aws:PrincipalTag/Environment": "production"
        }
      }
    },
    {
      "Sid": "DenyAdminSecrets",
      "Effect": "Deny",
      "Action": [
        "secretsmanager:*"
      ],
      "Resource": [
        "arn:aws:secretsmanager:*:*:secret:myapp/admin/*"
      ]
    }
  ]
}
```

---

## Access Auditing

### Audit Configuration

```yaml
secrets:
  access_control:
    audit:
      enabled: true

      # Events to log
      events:
        - "secret_accessed"
        - "secret_created"
        - "secret_updated"
        - "secret_deleted"
        - "access_denied"
        - "policy_changed"

      # Log details
      log_details:
        - "timestamp"
        - "user"
        - "service"
        - "secret_name"
        - "action"
        - "ip_address"
        - "user_agent"

      # Storage
      destinations:
        - type: "cloudwatch"
          log_group: "/security/secret-access"

        - type: "siem"
          endpoint: "${SIEM_ENDPOINT}"

      # Retention
      retention: "2 years"
```

### Audit Alerts

```yaml
secrets:
  access_control:
    alerts:
      # Suspicious access
      - name: "Unusual Secret Access"
        condition: |
          access_count > normal_baseline * 3
          AND time_of_day NOT IN business_hours
        severity: "warning"
        notify: ["security-team"]

      # Access denied spike
      - name: "Multiple Access Denied"
        condition: "access_denied_count > 10 IN 5m"
        severity: "critical"
        notify: ["security-team", "pagerduty"]

      # Sensitive secret access
      - name: "Sensitive Secret Accessed"
        condition: "secret_path MATCHES 'admin/*'"
        severity: "info"
        notify: ["security-team"]
```

---

## Emergency Access

### Break-Glass Procedure

```yaml
secrets:
  access_control:
    emergency:
      enabled: true

      # Break-glass accounts
      break_glass:
        accounts:
          - id: "emergency-1"
            stored_in: "physical_safe"
            access_log: "mandatory"

          - id: "emergency-2"
            stored_in: "cto_vault"
            access_log: "mandatory"

      # Procedure
      procedure:
        steps:
          - "Contact security team"
          - "Document incident number"
          - "Retrieve break-glass credentials"
          - "Access required secrets"
          - "Complete incident report"
          - "Rotate compromised credentials"

      # Automatic actions
      on_use:
        - "alert_security_team"
        - "start_audit_recording"
        - "expire_in_4_hours"
        - "require_followup_report"
```

---

## Implementation

### Access Check Middleware

```typescript
// middleware/secretAccess.ts
import { SecretAccessPolicy } from '../policies';

export function checkSecretAccess(
  user: User,
  secretPath: string,
  operation: 'read' | 'write' | 'delete'
): boolean {
  // Get user's roles and policies
  const policies = getUserPolicies(user);

  // Check each policy
  for (const policy of policies) {
    if (policy.allows(secretPath, operation)) {
      // Log access
      auditLog.record({
        user: user.id,
        secret: secretPath,
        operation,
        allowed: true,
        timestamp: new Date(),
      });
      return true;
    }
  }

  // Access denied
  auditLog.record({
    user: user.id,
    secret: secretPath,
    operation,
    allowed: false,
    timestamp: new Date(),
  });

  return false;
}
```

---

## Commands

```bash
# Check access for user
proagents secrets check-access --user developer@company.com --secret database/password

# List user permissions
proagents secrets permissions --user developer@company.com

# Grant access
proagents secrets grant --user developer@company.com --secret api/key --permission read

# Revoke access
proagents secrets revoke --user developer@company.com --secret api/key

# View audit log
proagents secrets audit-log --last 24h

# Request emergency access
proagents secrets emergency-access --reason "Production incident" --duration 4h
```

---

## Best Practices

1. **Least Privilege**: Start with no access, grant as needed
2. **Regular Reviews**: Audit access quarterly
3. **Separation of Duties**: No one person has all keys
4. **Time-Based Access**: Limit access to business hours when possible
5. **Audit Everything**: Log all access, successful or not
6. **Emergency Procedures**: Document and test break-glass access
7. **Automate Reviews**: Use tools to flag excessive permissions
