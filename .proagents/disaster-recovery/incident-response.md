# Incident Response

Incident response procedures and runbooks for development teams.

---

## Overview

Structured incident response ensures rapid detection, response, and recovery from issues.

```
┌─────────────────────────────────────────────────────────────┐
│                  Incident Response Flow                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Detection ──► Triage ──► Response ──► Resolution ──► Review│
│      │          │           │            │            │     │
│      ▼          ▼           ▼            ▼            ▼     │
│   Alerts    Severity    Containment   Fix/Rollback  Postmortem
│   Monitor   Assessment  Communication  Verification  Learning
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Severity Levels

| Level | Name | Description | Response Time | Examples |
|-------|------|-------------|---------------|----------|
| SEV1 | Critical | Complete outage | < 15 min | System down, data breach |
| SEV2 | Major | Significant impact | < 30 min | Core feature broken |
| SEV3 | Minor | Limited impact | < 2 hours | Non-critical bug |
| SEV4 | Low | Minimal impact | < 24 hours | UI glitch |

### Severity Decision Matrix

```
┌─────────────────────────────────────────────────────────────┐
│                  Severity Assessment                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Impact: How many users affected?                          │
│  ├── All users ─────────────────────────► SEV1/SEV2        │
│  ├── Many users (>10%) ─────────────────► SEV2/SEV3        │
│  ├── Some users (<10%) ─────────────────► SEV3/SEV4        │
│  └── Few users (<1%) ───────────────────► SEV4             │
│                                                             │
│  Urgency: Is it getting worse?                             │
│  ├── Yes, rapidly ──────────────────────► Escalate         │
│  ├── Yes, slowly ───────────────────────► Monitor          │
│  └── No, stable ────────────────────────► Normal priority  │
│                                                             │
│  Data: Is data at risk?                                    │
│  ├── Data loss/corruption ──────────────► SEV1             │
│  ├── Data exposure ─────────────────────► SEV1             │
│  └── No data impact ────────────────────► Continue assess  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Incident Response Phases

### Phase 1: Detection

```yaml
detection:
  sources:
    automated:
      - monitoring_alerts
      - error_rate_spikes
      - health_check_failures
      - security_events

    manual:
      - user_reports
      - support_tickets
      - team_observations

  initial_actions:
    - acknowledge_alert
    - create_incident_ticket
    - notify_on_call
```

### Phase 2: Triage

```markdown
## Triage Checklist

☐ Confirm the issue is real (not false positive)
☐ Assess severity level
☐ Identify affected systems/users
☐ Determine if it's getting worse
☐ Assign incident commander

## Key Questions

1. What is broken?
2. Who is affected?
3. When did it start?
4. Is it getting worse?
5. What changed recently?
```

### Phase 3: Response

```yaml
response:
  immediate_actions:
    sev1:
      - "Page incident commander"
      - "Start incident channel"
      - "Begin customer communication"
      - "Consider immediate rollback"

    sev2:
      - "Alert on-call team"
      - "Create incident channel"
      - "Begin investigation"

    sev3:
      - "Assign to engineer"
      - "Track in ticket system"
      - "Schedule fix"

  communication:
    internal:
      - incident_channel
      - status_updates
    external:
      - status_page
      - customer_notification
```

### Phase 4: Resolution

```markdown
## Resolution Steps

1. **Contain** - Stop the bleeding
   - Rollback if needed
   - Disable affected features
   - Block problematic traffic

2. **Fix** - Address root cause
   - Identify root cause
   - Implement fix
   - Test fix

3. **Verify** - Confirm resolution
   - Check metrics normalized
   - Verify user reports stopped
   - Confirm monitoring green

4. **Communicate** - Update stakeholders
   - Update status page
   - Notify affected users
   - Close incident channel
```

### Phase 5: Review

```markdown
## Post-Incident Review

**Within 24-48 hours:**
- Document timeline
- Identify root cause
- List contributing factors

**Within 1 week:**
- Hold blameless postmortem
- Document learnings
- Create action items
- Update runbooks
```

---

## Incident Runbooks

### SEV1: Complete System Outage

```markdown
## SEV1 Runbook: Complete System Outage

**Time Target:** Resolution within 1 hour

### Immediate Actions (0-5 minutes)

1. ☐ Acknowledge alert
2. ☐ Page incident commander
3. ☐ Create incident channel (#incident-YYYYMMDD)
4. ☐ Update status page: "Investigating"

### Triage (5-15 minutes)

1. ☐ Verify outage scope
2. ☐ Check recent deployments
3. ☐ Check infrastructure status
4. ☐ Check external dependencies

### Response (15-30 minutes)

1. ☐ If deployment related:
   ```bash
   proagents rollback production --emergency
   ```

2. ☐ If infrastructure related:
   ```bash
   proagents dr failover
   ```

3. ☐ Update status page: "Identified"

### Resolution (30-60 minutes)

1. ☐ Verify services recovering
2. ☐ Monitor error rates
3. ☐ Run smoke tests
4. ☐ Update status page: "Resolved"

### Post-Incident

1. ☐ Close incident channel
2. ☐ Schedule postmortem
3. ☐ Document timeline
```

### SEV1: Security Breach

```markdown
## SEV1 Runbook: Security Breach

**Time Target:** Containment within 30 minutes

### Immediate Actions (0-5 minutes)

1. ☐ Page security team
2. ☐ Page incident commander
3. ☐ Create secure incident channel
4. ☐ DO NOT communicate externally yet

### Containment (5-30 minutes)

1. ☐ Identify breach scope
   - What data was accessed?
   - What systems are affected?
   - Is the attack ongoing?

2. ☐ Contain the breach
   ```bash
   # Isolate affected systems
   proagents security isolate --system affected-service

   # Rotate credentials
   proagents security rotate-credentials --scope affected
   ```

3. ☐ Preserve evidence
   ```bash
   proagents security preserve-logs --incident INC-XXX
   ```

### Investigation (30-120 minutes)

1. ☐ Determine attack vector
2. ☐ Identify all affected data
3. ☐ Assess legal obligations (GDPR, etc.)
4. ☐ Engage legal/compliance if needed

### Communication

1. ☐ Internal stakeholders
2. ☐ Legal assessment
3. ☐ Regulatory notification (if required)
4. ☐ Customer notification (if required)
```

### SEV2: Database Issues

```markdown
## SEV2 Runbook: Database Issues

**Time Target:** Resolution within 2 hours

### Symptoms

- Slow queries
- Connection errors
- Replication lag
- Lock contention

### Triage

1. ☐ Check database metrics
   ```bash
   proagents db status
   ```

2. ☐ Check recent changes
   - New deployments?
   - Schema migrations?
   - Query changes?

### Response

1. **Connection Issues**
   ```bash
   # Check connection pool
   proagents db connections

   # Kill long-running queries
   proagents db kill-queries --older-than 300s
   ```

2. **Performance Issues**
   ```bash
   # Identify slow queries
   proagents db slow-queries

   # Check for locks
   proagents db locks
   ```

3. **Replication Issues**
   ```bash
   # Check replication status
   proagents db replication-status

   # If severely lagged, consider failover
   proagents db failover --dry-run
   ```

### If Rollback Needed

```bash
proagents db rollback --steps 1
```
```

---

## Communication Templates

### Status Page Update

```markdown
**[INVESTIGATING]** - Service Degradation

We are currently investigating reports of slow performance.

**Affected Services:** [list services]
**Impact:** [describe impact]
**Started:** [time]

Updates will be provided every 30 minutes.
```

### Resolution Communication

```markdown
**[RESOLVED]** - Service Degradation

The service issues have been resolved. All services are operating normally.

**Duration:** [start time] - [end time]
**Root Cause:** [brief description]
**Resolution:** [what was done]

We apologize for any inconvenience. A full postmortem will be conducted.
```

### Customer Notification

```markdown
Subject: Service Incident Notification

Dear Customer,

We experienced a service disruption on [date] from [time] to [time].

**What happened:** [description]
**Impact to you:** [specific impact]
**What we did:** [resolution]
**Prevention:** [what we're doing to prevent recurrence]

We apologize for any inconvenience this may have caused.

[Name]
[Company]
```

---

## Incident Management Tools

### CLI Commands

```bash
# Create incident
proagents incident create --severity SEV2 --title "API errors"

# Update incident
proagents incident update INC-123 --status investigating

# Add timeline entry
proagents incident timeline INC-123 "Identified root cause"

# Close incident
proagents incident close INC-123 --resolution "Rolled back to v2.3.1"

# Generate postmortem template
proagents incident postmortem INC-123
```

### Integration Configuration

```yaml
incident:
  integrations:
    pagerduty:
      enabled: true
      api_key: "${PAGERDUTY_API_KEY}"
      service_id: "SERVICE123"

    slack:
      enabled: true
      webhook: "${SLACK_WEBHOOK}"
      channels:
        incidents: "#incidents"
        status: "#status-updates"

    status_page:
      enabled: true
      provider: "statuspage.io"
      page_id: "${STATUSPAGE_ID}"

    jira:
      enabled: true
      project: "INC"
      issue_type: "Incident"
```

---

## Postmortem Template

```markdown
# Incident Postmortem: [Incident Title]

**Date:** [Date]
**Duration:** [Start time] - [End time]
**Severity:** [SEV level]
**Incident Commander:** [Name]

## Summary

[2-3 sentence summary of what happened]

## Impact

- Users affected: [number]
- Duration: [time]
- Revenue impact: [if applicable]
- SLA impact: [if applicable]

## Timeline

| Time | Event |
|------|-------|
| HH:MM | Issue detected |
| HH:MM | Incident declared |
| HH:MM | Root cause identified |
| HH:MM | Fix deployed |
| HH:MM | Issue resolved |

## Root Cause

[Detailed explanation of what caused the incident]

## Contributing Factors

1. [Factor 1]
2. [Factor 2]
3. [Factor 3]

## What Went Well

- [Positive 1]
- [Positive 2]

## What Could Be Improved

- [Improvement 1]
- [Improvement 2]

## Action Items

| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| [Action 1] | [Name] | [Date] | [ ] |
| [Action 2] | [Name] | [Date] | [ ] |

## Lessons Learned

[Key takeaways from this incident]
```

---

## On-Call Configuration

```yaml
oncall:
  schedules:
    primary:
      rotation: "weekly"
      members:
        - "engineer1@company.com"
        - "engineer2@company.com"
        - "engineer3@company.com"

    secondary:
      rotation: "weekly"
      offset: 1  # Day offset from primary
      members:
        - "senior1@company.com"
        - "senior2@company.com"

  escalation:
    - level: 1
      delay: 5  # minutes
      target: "primary"

    - level: 2
      delay: 15
      target: "secondary"

    - level: 3
      delay: 30
      target: "engineering_manager"

  handoff:
    time: "09:00"
    timezone: "America/New_York"
    reminder: 1  # hour before
```

---

## Best Practices

1. **Blameless Culture**: Focus on systems, not individuals
2. **Clear Ownership**: Always have an incident commander
3. **Communication**: Over-communicate during incidents
4. **Documentation**: Document everything in real-time
5. **Practice**: Run regular incident simulations
6. **Automate**: Automate detection and response where possible
7. **Learn**: Always conduct postmortems
8. **Improve**: Turn learnings into concrete actions
