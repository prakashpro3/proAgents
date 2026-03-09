# Runbooks

Standard operating procedures for common operational scenarios.

---

## Overview

Runbooks provide step-by-step procedures for handling incidents, debugging production issues, managing vulnerabilities, and responding to performance problems.

---

## Available Runbooks

| Runbook | Scenario |
|---------|----------|
| [Incident Response](./incident-response.md) | Production incident handling |
| [Production Debugging](./production-debugging.md) | Debugging live issues |
| [Dependency Vulnerability](./dependency-vulnerability.md) | Security vulnerability response |
| [Performance Degradation](./performance-degradation.md) | Performance issue response |

---

## Quick Reference

### Severity Levels

| Level | Description | Response Time | Examples |
|-------|-------------|---------------|----------|
| **SEV1** | Critical - System down | 15 minutes | Complete outage, data loss |
| **SEV2** | High - Major feature broken | 1 hour | Auth broken, payments failing |
| **SEV3** | Medium - Degraded service | 4 hours | Slow performance, partial outage |
| **SEV4** | Low - Minor issue | 24 hours | UI glitch, non-critical bug |

---

## Incident Response Quick Start

```bash
# 1. Assess the situation
pa:runbook incident assess

# 2. Start incident response
pa:runbook incident start --severity SEV2 --description "Login failures"

# 3. Follow guided steps
pa:runbook incident guide

# 4. Close incident
pa:runbook incident close --resolution "Fixed auth service timeout"
```

---

## Runbook Commands

```bash
# List available runbooks
pa:runbook list

# Start a runbook
pa:runbook start <runbook-name>

# View runbook steps
pa:runbook view <runbook-name>

# Log runbook execution
pa:runbook log --action "Restarted service"

# Generate post-mortem
pa:runbook postmortem --incident INC-123
```

---

## Runbook Structure

Each runbook follows this structure:

```markdown
# Runbook: [Name]

## Overview
[Description and when to use]

## Prerequisites
[Required access, tools, knowledge]

## Steps
[Numbered step-by-step procedure]

## Verification
[How to confirm resolution]

## Escalation
[When and how to escalate]

## Post-Incident
[Cleanup and documentation]
```

---

## On-Call Responsibilities

### Before On-Call

- [ ] Review recent deployments
- [ ] Check monitoring dashboards
- [ ] Verify access to all systems
- [ ] Confirm notification settings
- [ ] Review open incidents/issues

### During On-Call

- [ ] Respond to alerts within SLA
- [ ] Follow runbooks for known issues
- [ ] Escalate when necessary
- [ ] Document all actions
- [ ] Hand off to next on-call

### After Incident

- [ ] Update incident timeline
- [ ] Create post-mortem if needed
- [ ] Update runbooks with learnings
- [ ] Follow up on action items

---

## Creating Custom Runbooks

```yaml
# runbooks/custom/my-runbook.yaml
name: "My Custom Runbook"
description: "Handle specific scenario"
severity: "SEV3"
tags: ["custom", "my-service"]

prerequisites:
  - access: "production-ssh"
  - tool: "kubectl"

steps:
  - name: "Assess situation"
    description: "Check service status"
    command: "kubectl get pods -n my-service"
    expected: "All pods running"

  - name: "Check logs"
    description: "Review recent errors"
    command: "kubectl logs -n my-service --tail=100"
    look_for:
      - "ERROR"
      - "Exception"

  - name: "Apply fix"
    description: "Restart affected pods"
    command: "kubectl rollout restart deployment/my-service -n my-service"
    requires_confirmation: true

verification:
  - "All pods are Running"
  - "No errors in logs"
  - "Health checks passing"

escalation:
  after: "30 minutes"
  to: "#platform-team"
```

---

## Integration

### With PagerDuty/OpsGenie

```yaml
# proagents.config.yaml
runbooks:
  integration:
    pagerduty:
      enabled: true
      auto_attach: true

    opsgenie:
      enabled: true
      auto_create_alert: true

  auto_trigger:
    - alert: "High CPU Usage"
      runbook: "performance-degradation"
    - alert: "Auth Service Down"
      runbook: "incident-response"
```

### With Slack/Teams

```yaml
runbooks:
  notifications:
    slack:
      channel: "#incidents"
      notify_on:
        - "incident_started"
        - "escalation"
        - "resolution"
```

---

## Best Practices

1. **Keep Updated**: Review runbooks after each incident
2. **Test Regularly**: Run drills to verify procedures work
3. **Be Specific**: Include exact commands, not vague instructions
4. **Include Context**: Explain why each step is needed
5. **Version Control**: Track runbook changes in git
6. **Cross-Train**: Ensure multiple team members can execute
