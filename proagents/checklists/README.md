# Checklists

Quality checklists for each phase of the development workflow.

---

## Overview

Structured checklists ensure consistency and completeness at each stage of development. ProAgents automatically presents relevant checklists during the workflow and tracks completion.

---

## Available Checklists

| Checklist | Phase | Description |
|-----------|-------|-------------|
| [Pre-Implementation](./pre-implementation.md) | Before coding | Requirements verified, design approved |
| [Code Quality](./code-quality.md) | During coding | Style, patterns, best practices |
| [Testing](./testing.md) | Testing phase | Coverage, test types, edge cases |
| [Code Review](./code-review.md) | Review phase | Review criteria, security checks |
| [PR Checklist](./pr-checklist.md) | Pull request | PR requirements, documentation |
| [Pre-Deployment](./pre-deployment.md) | Before deploy | Final verification, rollback ready |

---

## When Checklists Are Used

```
Feature Start
     │
     ▼
┌─────────────────┐
│ Pre-Implementation │ ← Checklist: requirements, design, dependencies
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Implementation  │ ← Checklist: code quality (continuous)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Testing      │ ← Checklist: test coverage, edge cases
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Code Review   │ ← Checklist: review criteria, security
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Pull Request   │ ← Checklist: PR requirements
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Deployment    │ ← Checklist: pre-deployment verification
└─────────────────┘
```

---

## Commands

```bash
# Run specific checklist
proagents checklist pre-deployment

# Run all checklists for current phase
proagents checklist current

# Show checklist status for feature
proagents checklist status

# Mark item as complete
proagents checklist complete pre-deployment.tests-pass

# Generate checklist report
proagents checklist report
```

---

## Checklist Structure

Each checklist item includes:

```yaml
- id: "unique-identifier"
  title: "Human-readable title"
  description: "Detailed description of what to check"
  category: "security | quality | testing | documentation"
  severity: "blocker | warning | info"
  automated: true  # Can be automatically verified
  manual: true     # Requires manual verification
```

---

## Customization

### Add Custom Items

```yaml
# proagents.config.yaml
checklists:
  pre_deployment:
    custom_items:
      - id: "security-scan"
        title: "Security scan completed"
        description: "Run SAST and dependency scan"
        severity: "blocker"

      - id: "performance-check"
        title: "Performance benchmarks met"
        description: "Response times within SLA"
        severity: "warning"
```

### Disable Items

```yaml
checklists:
  code_review:
    disabled_items:
      - "documentation-updated"  # Skip for hotfixes
```

### Environment-Specific

```yaml
checklists:
  pre_deployment:
    environments:
      production:
        required_items:
          - "security-audit"
          - "load-test-passed"
      staging:
        required_items:
          - "basic-smoke-test"
```

---

## Checklist Summaries

### Pre-Implementation

- [ ] Requirements documented and approved
- [ ] Design reviewed and approved
- [ ] Dependencies identified
- [ ] Test strategy defined
- [ ] No blockers from other features

### Code Quality

- [ ] Follows project coding standards
- [ ] No linting errors
- [ ] No TypeScript errors
- [ ] Functions are small and focused
- [ ] No hardcoded values
- [ ] Error handling in place

### Testing

- [ ] Unit tests written (>80% coverage)
- [ ] Integration tests written
- [ ] Edge cases covered
- [ ] Error scenarios tested
- [ ] Tests are passing

### Code Review

- [ ] Code is readable and maintainable
- [ ] No security vulnerabilities
- [ ] No performance issues
- [ ] Documentation updated
- [ ] Follows team patterns

### Pre-Deployment

- [ ] All tests passing
- [ ] No critical bugs
- [ ] Rollback plan ready
- [ ] Monitoring configured
- [ ] Stakeholders notified

---

## Automated Verification

Many checklist items can be automatically verified:

| Item | Verification Method |
|------|---------------------|
| Tests passing | CI pipeline |
| Coverage > 80% | Coverage report |
| No lint errors | ESLint output |
| No type errors | TypeScript compilation |
| Dependencies secure | npm audit |
| No secrets in code | Secret scanner |

---

## Blocking vs Non-Blocking

### Blocker Items
Must be completed before proceeding:
- Tests passing
- No security vulnerabilities
- Required approvals

### Warning Items
Should be completed, but can proceed with justification:
- Documentation updated
- Performance benchmarks

### Info Items
Nice to have, for tracking:
- Code comments added
- README updated

---

## Reporting

```bash
# Generate markdown report
proagents checklist report --format markdown

# Generate JSON for integration
proagents checklist report --format json

# Show completion percentage
proagents checklist progress
```

### Sample Report

```
Feature: user-authentication
Phase: Pre-Deployment

Checklist Progress: 8/10 (80%)

✅ Completed:
  - Requirements documented
  - Design approved
  - Unit tests passing (92% coverage)
  - Integration tests passing
  - No lint errors
  - No security vulnerabilities
  - Rollback plan documented
  - Monitoring configured

⚠️ Pending:
  - Performance benchmarks (in progress)
  - Final stakeholder sign-off (waiting)
```
