# Emergency Bypass

Override approval requirements for critical situations.

---

## Overview

Emergency bypass allows authorized personnel to skip normal approval workflows when immediate action is required.

```
┌─────────────────────────────────────────────────────────────┐
│                    Emergency Bypass Flow                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Critical Issue Detected                                    │
│       │                                                     │
│       ▼                                                     │
│  ┌─────────────────────────────────────────┐               │
│  │  Request Emergency Bypass               │               │
│  │  • Provide justification               │               │
│  │  • Specify incident/ticket             │               │
│  └──────────────────┬──────────────────────┘               │
│                     │                                       │
│       ┌─────────────┼─────────────┐                        │
│       ▼             ▼             ▼                        │
│  [Auto-Approve] [Quick-Approve] [Full Audit]               │
│   (P1 incident)  (On-call auth)  (Post-hoc)                │
│       │             │             │                        │
│       └─────────────┴─────────────┘                        │
│                     │                                       │
│                     ▼                                       │
│            Deploy Immediately                               │
│                     │                                       │
│                     ▼                                       │
│            Post-Incident Review                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Emergency Bypass Configuration

### Enable Emergency Bypass

```yaml
approvals:
  emergency_bypass:
    enabled: true

    # Who can trigger bypass
    authorized_users:
      - "@team/on-call"
      - "@team/tech-leads"
      - "@team/executives"

    # Require incident ticket
    require_incident: true
    incident_systems:
      - "pagerduty"
      - "opsgenie"
      - "jira"

    # Post-bypass requirements
    post_bypass:
      require_review: true
      review_within: "24h"
      notify: ["@team/managers", "@team/security"]
```

### Bypass Levels

```yaml
approvals:
  emergency_bypass:
    levels:
      # Level 1: Auto-approved for P1 incidents
      critical:
        conditions:
          - "active_p1_incident"
          - "system_down"
        auto_approve: true
        max_scope: "hotfix"
        audit: "immediate"

      # Level 2: Quick approval from on-call
      urgent:
        conditions:
          - "active_p2_incident"
          - "significant_degradation"
        require_approval_from: "on_call"
        approval_timeout: "15m"
        audit: "within_4h"

      # Level 3: Expedited normal approval
      expedited:
        conditions:
          - "business_critical"
        require_approval_from: "tech_lead"
        approval_timeout: "1h"
        audit: "within_24h"
```

---

## Triggering Emergency Bypass

### Command Line

```bash
# Request emergency bypass
proagents approval bypass --reason "P1: Payment system down" --incident INC-12345

# With specific scope
proagents approval bypass \
  --reason "Critical security patch" \
  --incident INC-12345 \
  --scope hotfix \
  --level critical
```

### Required Information

```yaml
emergency_bypass:
  required_fields:
    - field: "reason"
      description: "Why is bypass needed?"
      required: true

    - field: "incident_id"
      description: "Incident ticket number"
      required: true

    - field: "impact"
      description: "What's affected?"
      required: true

    - field: "rollback_plan"
      description: "How to rollback if needed"
      required: true

    - field: "estimated_duration"
      description: "How long until normal process resumes"
      required: false
```

---

## Bypass Audit Trail

### Automatic Logging

```yaml
emergency_bypass:
  audit:
    # What to log
    log:
      - timestamp
      - user
      - reason
      - incident_id
      - changes_deployed
      - approvals_bypassed
      - rollback_plan

    # Where to store
    storage:
      - "audit_log"
      - "incident_system"

    # Retention
    retention: "7y"  # Compliance requirement
```

### Audit Entry Example

```json
{
  "bypass_id": "bypass_2024_01_15_001",
  "timestamp": "2024-01-15T03:45:00Z",
  "user": "alice@company.com",
  "level": "critical",
  "reason": "P1: Payment gateway returning 500 errors",
  "incident_id": "INC-12345",
  "pagerduty_incident": "PXYZ789",
  "changes": {
    "commit": "abc123",
    "files_changed": 2,
    "description": "Rollback payment gateway to v2.3.4"
  },
  "bypassed_approvals": [
    "tech_lead_review",
    "deployment_approval"
  ],
  "rollback_plan": "Revert commit abc123",
  "post_review": {
    "completed": true,
    "reviewed_by": "bob@company.com",
    "reviewed_at": "2024-01-15T10:30:00Z",
    "outcome": "approved"
  }
}
```

---

## Post-Bypass Review

### Review Requirements

```yaml
emergency_bypass:
  post_review:
    required: true
    review_within: "24h"

    reviewers:
      - "manager"
      - "tech_lead"
      - "security"  # For security-related bypasses

    review_checklist:
      - "Was bypass justified?"
      - "Were proper procedures followed?"
      - "Any security implications?"
      - "Process improvements needed?"
      - "Documentation updated?"

    outcomes:
      - "approved"       # Bypass was justified
      - "approved_with_action"  # Approved but improvements needed
      - "violation"      # Bypass was not justified
```

### Review Process

```bash
# View pending bypass reviews
proagents approval bypass-reviews

# Complete review
proagents approval bypass-review bypass_2024_01_15_001 \
  --outcome approved \
  --notes "Justified P1 response, proper rollback executed"
```

---

## Notifications

### Bypass Notifications

```yaml
emergency_bypass:
  notifications:
    # When bypass is triggered
    on_bypass:
      channels:
        - "slack:#incidents"
        - "slack:#security"
        - "pagerduty"
      template: |
        🚨 *Emergency Bypass Triggered*

        User: {{user}}
        Reason: {{reason}}
        Incident: {{incident_id}}
        Level: {{level}}

        Post-review required within {{review_deadline}}

    # When bypass is used for deployment
    on_deploy:
      channels:
        - "slack:#deployments"
      template: |
        ⚡ *Emergency Deployment*

        Bypassing normal approvals due to: {{reason}}
        Deploying: {{commit}}

    # Review reminder
    review_reminder:
      after: ["4h", "12h", "20h"]
      channels: ["slack", "email"]
```

---

## Safeguards

### Bypass Limits

```yaml
emergency_bypass:
  safeguards:
    # Limit bypass frequency
    limits:
      per_user_per_day: 3
      per_team_per_day: 10
      per_user_per_week: 10

    # Scope limits
    scope:
      max_files_changed: 20
      max_lines_changed: 500
      prohibited_paths:
        - "infrastructure/production/**"
        - "secrets/**"

    # Require multi-person for certain changes
    require_pair:
      paths:
        - "src/auth/**"
        - "src/payments/**"
```

### Automatic Alerts

```yaml
emergency_bypass:
  alerts:
    # Too many bypasses
    - condition: "bypasses_today > 5"
      alert: "High bypass frequency - review process"
      channels: ["slack:#management"]

    # Same user multiple times
    - condition: "user_bypasses_week > 3"
      alert: "User {{user}} has multiple bypasses this week"
      channels: ["slack:#security"]

    # Large scope bypass
    - condition: "files_changed > 10"
      alert: "Large emergency change deployed"
      channels: ["slack:#tech-leads"]
```

---

## Best Practices

1. **Document Everything**: Always provide detailed justification
2. **Link Incidents**: Every bypass should have an incident ticket
3. **Minimal Scope**: Only bypass what's absolutely necessary
4. **Complete Reviews**: Always complete post-bypass review
5. **Learn from Bypasses**: Use bypass patterns to improve normal process
6. **Regular Audits**: Review bypass history monthly
7. **Train Team**: Ensure everyone knows when bypass is appropriate
