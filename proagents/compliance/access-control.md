# Access Control

Role-based access control for development workflows.

---

## Access Levels

| Level | Description | Typical Roles |
|-------|-------------|---------------|
| `viewer` | Read-only access | Stakeholders, auditors |
| `developer` | Code changes, feature development | Engineers |
| `reviewer` | Code review, approval rights | Senior engineers, tech leads |
| `deployer` | Deployment permissions | DevOps, SRE |
| `admin` | Full system access | Team leads, managers |

---

## Configuration

### Role Definition

```yaml
# proagents.config.yaml
access_control:
  enabled: true

  roles:
    viewer:
      permissions:
        - "read:code"
        - "read:docs"
        - "read:reports"

    developer:
      inherits: viewer
      permissions:
        - "write:code"
        - "write:tests"
        - "create:branch"
        - "create:pr"

    reviewer:
      inherits: developer
      permissions:
        - "approve:pr"
        - "review:code"
        - "comment:pr"

    deployer:
      inherits: reviewer
      permissions:
        - "deploy:staging"
        - "deploy:production"
        - "rollback:any"

    admin:
      permissions:
        - "*"  # All permissions
```

### User Assignment

```yaml
access_control:
  users:
    # Individual assignments
    "user@company.com":
      role: developer
      teams: ["frontend"]

    "lead@company.com":
      role: reviewer
      teams: ["frontend", "backend"]

  # Team-based assignments
  teams:
    frontend:
      members:
        - "dev1@company.com"
        - "dev2@company.com"
      default_role: developer

    devops:
      members:
        - "ops@company.com"
      default_role: deployer
```

---

## Resource-Level Permissions

### Path-Based Access

```yaml
access_control:
  resources:
    # Restrict sensitive paths
    "src/auth/**":
      allowed_roles: ["reviewer", "admin"]
      require_review: true

    "src/payments/**":
      allowed_roles: ["admin"]
      require_approval: ["security-team"]

    # Production configs
    "config/production/**":
      allowed_roles: ["deployer", "admin"]
      audit_all_changes: true

    # Documentation - open access
    "docs/**":
      allowed_roles: ["*"]
```

### Environment Permissions

```yaml
access_control:
  environments:
    development:
      deploy: ["developer", "reviewer", "deployer", "admin"]
      rollback: ["developer", "reviewer", "deployer", "admin"]

    staging:
      deploy: ["reviewer", "deployer", "admin"]
      rollback: ["deployer", "admin"]

    production:
      deploy: ["deployer", "admin"]
      rollback: ["admin"]
      require_approval: true
      approval_count: 2
```

---

## Approval Workflows

### Multi-Level Approval

```yaml
access_control:
  approvals:
    code_review:
      required_approvers: 1
      allowed_approvers: ["reviewer", "admin"]
      exclude_author: true

    production_deploy:
      required_approvers: 2
      allowed_approvers: ["deployer", "admin"]
      require_different_teams: true

    security_change:
      required_approvers: 1
      required_teams: ["security-team"]
      timeout: "48h"
```

### Emergency Access

```yaml
access_control:
  emergency:
    enabled: true

    # Break-glass procedure
    break_glass:
      allowed_users: ["cto@company.com", "vp-eng@company.com"]
      requires_reason: true
      auto_audit: true
      expires_after: "4h"

    # Notification on emergency access
    notify:
      - "security-team"
      - "management"
```

---

## Audit & Compliance

### Access Logging

```yaml
access_control:
  audit:
    enabled: true

    # What to log
    log_events:
      - "permission_granted"
      - "permission_denied"
      - "role_changed"
      - "emergency_access"
      - "deployment"
      - "rollback"

    # Where to send logs
    destinations:
      - type: "file"
        path: "./logs/access.log"
      - type: "siem"
        endpoint: "${SIEM_ENDPOINT}"

    # Retention
    retention: "2 years"
```

### Compliance Reports

```yaml
access_control:
  compliance:
    # Generate reports
    reports:
      - type: "access_review"
        schedule: "monthly"
        recipients: ["security-team", "management"]

      - type: "permission_audit"
        schedule: "quarterly"
        recipients: ["compliance-team"]

    # Alerts
    alerts:
      unusual_access:
        enabled: true
        notify: ["security-team"]

      failed_auth:
        threshold: 5
        window: "5m"
        notify: ["security-team"]
```

---

## Integration

### SSO Integration

```yaml
access_control:
  sso:
    provider: "okta"  # okta, auth0, azure-ad

    # Map SSO groups to roles
    group_mapping:
      "Engineering": "developer"
      "Tech Leads": "reviewer"
      "DevOps": "deployer"
      "Admins": "admin"

    # Auto-provision users
    auto_provision: true
    default_role: "viewer"
```

### LDAP/Active Directory

```yaml
access_control:
  ldap:
    server: "ldap://ldap.company.com"
    base_dn: "dc=company,dc=com"

    group_mapping:
      "cn=developers,ou=groups": "developer"
      "cn=leads,ou=groups": "reviewer"
```

---

## Commands

```bash
# View current permissions
proagents access list

# Check user permissions
proagents access check user@company.com

# Grant role
proagents access grant user@company.com --role reviewer

# Revoke role
proagents access revoke user@company.com --role admin

# View audit log
proagents access audit --last 7d

# Emergency access
proagents access emergency --reason "Production incident P1"
```

---

## Best Practices

1. **Least Privilege**: Grant minimum necessary permissions
2. **Regular Reviews**: Audit access quarterly
3. **Separation of Duties**: Different approvers for critical changes
4. **Audit Everything**: Log all access events
5. **Time-Bound Access**: Use expiring permissions for elevated access
6. **Emergency Procedures**: Document and test break-glass process
