# Webhook Events Reference

Complete reference of all webhook events.

---

## Event Categories

### Feature Events

| Event | Description | Trigger |
|-------|-------------|---------|
| `feature.started` | New feature started | `pa:feature start` |
| `feature.paused` | Feature paused | `pa:feature pause` |
| `feature.resumed` | Feature resumed | `pa:feature resume` |
| `feature.completed` | Feature completed | All phases done |
| `feature.abandoned` | Feature abandoned | Manual cancellation |

**Example Payload:**
```json
{
  "event": "feature.completed",
  "timestamp": "2024-01-15T14:30:00Z",
  "data": {
    "feature_id": "feat-123",
    "feature_name": "User Authentication",
    "branch": "feature/user-auth",
    "duration_minutes": 240,
    "phases_completed": 9,
    "files_changed": 15,
    "lines_added": 450,
    "lines_removed": 20
  }
}
```

---

### Phase Events

| Event | Description | Trigger |
|-------|-------------|---------|
| `phase.started` | Phase began | Phase transition |
| `phase.completed` | Phase finished | Phase completion |
| `phase.skipped` | Phase skipped | Manual skip or config |
| `phase.failed` | Phase failed | Error during phase |

**Example Payload:**
```json
{
  "event": "phase.completed",
  "timestamp": "2024-01-15T14:30:00Z",
  "data": {
    "feature_id": "feat-123",
    "phase": "testing",
    "phase_number": 6,
    "duration_minutes": 45,
    "status": "success",
    "details": {
      "tests_run": 150,
      "tests_passed": 148,
      "tests_failed": 2,
      "coverage": 85.5
    }
  }
}
```

---

### Analysis Events

| Event | Description | Trigger |
|-------|-------------|---------|
| `analysis.started` | Codebase analysis began | Phase 1 start |
| `analysis.completed` | Analysis finished | Phase 1 complete |
| `analysis.cached` | Using cached analysis | Cache hit |
| `analysis.invalidated` | Cache invalidated | Code changes |

**Example Payload:**
```json
{
  "event": "analysis.completed",
  "timestamp": "2024-01-15T14:30:00Z",
  "data": {
    "feature_id": "feat-123",
    "duration_seconds": 45,
    "files_analyzed": 234,
    "patterns_detected": 18,
    "dependencies_mapped": 45,
    "cached": false
  }
}
```

---

### Testing Events

| Event | Description | Trigger |
|-------|-------------|---------|
| `test.started` | Test suite began | Test phase start |
| `test.passed` | All tests passed | Test success |
| `test.failed` | Tests failed | Test failures |
| `test.skipped` | Tests skipped | Manual skip |
| `coverage.changed` | Coverage changed | Coverage delta |
| `coverage.below_threshold` | Coverage too low | Below minimum |

**Example Payload:**
```json
{
  "event": "test.failed",
  "timestamp": "2024-01-15T14:30:00Z",
  "data": {
    "feature_id": "feat-123",
    "test_type": "unit",
    "total_tests": 150,
    "passed": 145,
    "failed": 5,
    "skipped": 0,
    "coverage": 82.5,
    "failures": [
      {
        "test": "UserService.login.should_validate_email",
        "file": "src/services/__tests__/UserService.test.ts",
        "line": 45,
        "error": "Expected validation error, received success"
      }
    ]
  }
}
```

---

### Review Events

| Event | Description | Trigger |
|-------|-------------|---------|
| `review.requested` | Review requested | PR created |
| `review.approved` | Review approved | Reviewer approval |
| `review.rejected` | Changes requested | Reviewer rejection |
| `review.comment` | Review comment added | Comment posted |

**Example Payload:**
```json
{
  "event": "review.approved",
  "timestamp": "2024-01-15T14:30:00Z",
  "data": {
    "feature_id": "feat-123",
    "pr_number": 456,
    "reviewer": "john.doe",
    "review_type": "code_review",
    "comments_count": 3,
    "approved_at": "2024-01-15T14:30:00Z"
  }
}
```

---

### Deployment Events

| Event | Description | Trigger |
|-------|-------------|---------|
| `deploy.started` | Deployment began | Deploy start |
| `deploy.success` | Deployment successful | Deploy complete |
| `deploy.failed` | Deployment failed | Deploy error |
| `deploy.cancelled` | Deployment cancelled | Manual cancel |
| `rollback.triggered` | Rollback initiated | Auto or manual |
| `rollback.completed` | Rollback finished | Rollback done |

**Example Payload:**
```json
{
  "event": "deploy.success",
  "timestamp": "2024-01-15T14:30:00Z",
  "data": {
    "feature_id": "feat-123",
    "environment": "production",
    "version": "1.5.0",
    "commit": "abc123def",
    "duration_seconds": 180,
    "artifacts": [
      "web-app:1.5.0",
      "api-server:1.5.0"
    ]
  }
}
```

---

### Git Events

| Event | Description | Trigger |
|-------|-------------|---------|
| `branch.created` | Branch created | New branch |
| `branch.deleted` | Branch deleted | Branch cleanup |
| `commit.pushed` | Commits pushed | Git push |
| `pr.created` | PR created | New PR |
| `pr.updated` | PR updated | PR changes |
| `pr.merged` | PR merged | Merge complete |
| `pr.closed` | PR closed | PR closed without merge |

**Example Payload:**
```json
{
  "event": "pr.created",
  "timestamp": "2024-01-15T14:30:00Z",
  "data": {
    "feature_id": "feat-123",
    "pr_number": 456,
    "title": "feat(auth): add user authentication",
    "branch": "feature/user-auth",
    "base_branch": "develop",
    "author": "jane.smith",
    "url": "https://github.com/org/repo/pull/456",
    "files_changed": 15,
    "additions": 450,
    "deletions": 20
  }
}
```

---

### Security Events

| Event | Description | Trigger |
|-------|-------------|---------|
| `security.scan.started` | Security scan began | Scan start |
| `security.scan.completed` | Security scan done | Scan complete |
| `vulnerability.found` | Vulnerability detected | New vulnerability |
| `vulnerability.fixed` | Vulnerability fixed | Fix applied |
| `dependency.vulnerable` | Vulnerable dependency | Dependency scan |

**Example Payload:**
```json
{
  "event": "vulnerability.found",
  "timestamp": "2024-01-15T14:30:00Z",
  "data": {
    "feature_id": "feat-123",
    "severity": "high",
    "type": "dependency",
    "package": "lodash",
    "version": "4.17.20",
    "cve": "CVE-2021-23337",
    "description": "Command injection vulnerability",
    "fix_available": true,
    "fixed_version": "4.17.21"
  }
}
```

---

### Approval Events

| Event | Description | Trigger |
|-------|-------------|---------|
| `approval.requested` | Approval requested | Approval needed |
| `approval.granted` | Approval granted | Approver approved |
| `approval.denied` | Approval denied | Approver rejected |
| `approval.expired` | Approval expired | Timeout |
| `approval.bypassed` | Emergency bypass | Emergency procedure |

**Example Payload:**
```json
{
  "event": "approval.granted",
  "timestamp": "2024-01-15T14:30:00Z",
  "data": {
    "feature_id": "feat-123",
    "approval_type": "deployment",
    "environment": "production",
    "approver": "tech-lead",
    "approver_email": "lead@company.com",
    "requested_at": "2024-01-15T14:00:00Z",
    "granted_at": "2024-01-15T14:30:00Z"
  }
}
```

---

## Event Filtering Patterns

### Subscribe to Specific Events

```yaml
events: ["feature.completed", "deploy.success"]
```

### Subscribe to Category

```yaml
events: ["feature.*"]   # All feature events
events: ["deploy.*"]    # All deployment events
events: ["security.*"]  # All security events
```

### Subscribe to All

```yaml
events: ["*"]
```

### Exclude Events

```yaml
events: ["*"]
exclude_events: ["phase.started", "phase.completed"]
```
