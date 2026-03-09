# Approval Workflow Examples

Practical examples of approval workflows for different scenarios.

---

## Example 1: Standard Feature Approval

Basic feature approval with tech lead review.

### Configuration

```yaml
# proagents.config.yaml

approvals:
  enabled: true

  feature_approval:
    stages:
      - name: "code_review"
        approvers: ["@team/tech-leads"]
        required: true
        timeout: "48h"
```

### Workflow

```
Developer                   Tech Lead                    System
    │                           │                           │
    │ Complete Feature          │                           │
    ├──────────────────────────►│                           │
    │                           │                           │
    │ Request Approval          │                           │
    │───────────────────────────┼──────────────────────────►│
    │                           │                           │
    │                           │◄───────Notification───────│
    │                           │                           │
    │                           │ Review Code               │
    │                           │                           │
    │                           │ Approve                   │
    │                           ├──────────────────────────►│
    │                           │                           │
    │◄───────────────────Approval Complete──────────────────│
    │                           │                           │
    │ Merge & Deploy            │                           │
    │                           │                           │
```

### Commands

```bash
# Developer requests approval
proagents approval request --stage code_review

# Tech lead reviews
proagents approval review feature/user-auth

# Tech lead approves
proagents approval approve feature/user-auth --comment "LGTM"

# Developer can now proceed
proagents status
# Output: ✅ Approved - Ready to merge
```

---

## Example 2: Multi-Stage Feature Approval

Feature requires both technical and product approval.

### Configuration

```yaml
approvals:
  enabled: true

  feature_approval:
    stages:
      # Stage 1: Technical Review
      - name: "tech_review"
        description: "Technical implementation review"
        approvers: ["@team/tech-leads"]
        required: true
        criteria:
          - "Code quality meets standards"
          - "Tests are comprehensive"
          - "No security issues"

      # Stage 2: Product Review
      - name: "product_review"
        description: "Feature meets requirements"
        approvers: ["@team/product-managers"]
        required: true
        criteria:
          - "Feature matches requirements"
          - "UX is acceptable"
          - "Ready for users"

      # Stage 3: Final Sign-off (Optional)
      - name: "final_signoff"
        description: "Final approval for release"
        approvers: ["@team/engineering-manager"]
        required: false
        condition: "major_feature"

    # Stages run sequentially
    sequential: true
```

### Workflow

```
Developer        Tech Lead        Product        Eng Manager
    │                │                │                │
    │ Request        │                │                │
    ├───────────────►│                │                │
    │                │                │                │
    │                │ Review         │                │
    │                │ Approve ✅     │                │
    │                ├───────────────►│                │
    │                │                │                │
    │                │                │ Review         │
    │                │                │ Approve ✅     │
    │                │                ├───────────────►│
    │                │                │                │
    │                │                │                │ (Optional)
    │                │                │                │ Sign-off ✅
    │◄───────────────┴────────────────┴────────────────┤
    │                                                   │
    │            All Approvals Complete                 │
    │                                                   │
```

### Commands

```bash
# Developer submits for approval
proagents approval request --all-stages

# Check current status
proagents approval status

# Output:
# Approval Status: feature/user-dashboard
# ─────────────────────────────────────────
# Stage 1: tech_review      ⏳ Pending
# Stage 2: product_review   ⏸  Waiting (blocked by Stage 1)
# Stage 3: final_signoff    ⏸  Waiting (blocked by Stage 2)

# After tech review approves:
# Stage 1: tech_review      ✅ Approved (by @tech-lead, 2h ago)
# Stage 2: product_review   ⏳ Pending
# Stage 3: final_signoff    ⏸  Waiting
```

---

## Example 3: Deployment Approval Gates

Different approval requirements for different environments.

### Configuration

```yaml
approvals:
  enabled: true

  deployment_approval:
    # Development - No approval needed
    development:
      required: false
      auto_approve: true

    # Staging - Single approval
    staging:
      required: true
      approvers: ["@team/developers"]
      min_approvals: 1
      self_approve: true  # Developer can approve their own

    # Production - Strict approval
    production:
      required: true
      approvers:
        - "@team/tech-leads"
        - "@team/devops"
      min_approvals: 2
      self_approve: false
      additional_checks:
        - "staging_verified"
        - "load_test_passed"
        - "security_scan_clear"

    # Hotfix - Expedited approval
    hotfix:
      required: true
      approvers:
        - "@team/tech-leads"
        - "@team/on-call"
      min_approvals: 1
      expedited: true
      timeout: "1h"
```

### Workflow Example: Production Deployment

```bash
# Step 1: Deploy to staging (auto-approved)
proagents deploy staging

# Step 2: Verify on staging
proagents test smoke --env staging
proagents test e2e --env staging

# Step 3: Request production deployment
proagents deploy production --request-approval

# Output:
# Production Deployment Approval Request
# ──────────────────────────────────────
# Feature: user-authentication
# Version: v2.3.0
#
# Pre-deployment Checks:
# ✅ Staging verified
# ✅ Load test passed
# ✅ Security scan clear
#
# Approvers Notified:
# - @tech-lead-1
# - @tech-lead-2
# - @devops-team
#
# Required: 2 approvals
# Timeout: 48 hours

# Step 4: Tech lead approves
proagents approval approve deploy/production/v2.3.0 --role tech-lead

# Step 5: DevOps approves
proagents approval approve deploy/production/v2.3.0 --role devops

# Step 6: Deployment proceeds
# Output:
# ✅ All approvals received (2/2)
# 🚀 Starting production deployment...
```

---

## Example 4: Conditional Approval Rules

Different approval requirements based on what changed.

### Configuration

```yaml
approvals:
  enabled: true

  conditional_rules:
    # High-risk paths need extra approval
    - name: "security_changes"
      condition:
        paths:
          - "src/auth/**"
          - "src/security/**"
          - "src/middleware/auth*"
      stages:
        - name: "security_review"
          approvers: ["@team/security"]
          required: true

    # Database changes need DBA review
    - name: "database_changes"
      condition:
        paths:
          - "prisma/schema.prisma"
          - "migrations/**"
      stages:
        - name: "dba_review"
          approvers: ["@team/dbas"]
          required: true

    # API changes need backend lead
    - name: "api_changes"
      condition:
        paths:
          - "src/api/**"
          - "openapi.yaml"
      stages:
        - name: "api_review"
          approvers: ["@team/backend-leads"]
          required: true

    # Large changes need additional review
    - name: "large_changes"
      condition:
        files_changed: ">20"
        lines_changed: ">500"
      stages:
        - name: "architecture_review"
          approvers: ["@team/architects"]
          required: true

    # Small changes - simplified approval
    - name: "small_changes"
      condition:
        files_changed: "<5"
        lines_changed: "<50"
        not_matching: ["security_changes", "database_changes"]
      stages:
        - name: "peer_review"
          approvers: ["@team/developers"]
          required: true
          self_approve: true
```

### How It Works

```bash
# Feature that touches auth code
proagents approval analyze feature/auth-improvements

# Output:
# Approval Analysis: feature/auth-improvements
# ────────────────────────────────────────────
# Files Changed: 8
# Lines Changed: 234
#
# Matching Rules:
# ✓ security_changes (touching src/auth/)
# ✓ api_changes (touching src/api/auth/)
#
# Required Approvals:
# 1. security_review - @team/security
# 2. api_review - @team/backend-leads
# 3. standard tech_review - @team/tech-leads

# Small documentation change
proagents approval analyze feature/update-docs

# Output:
# Approval Analysis: feature/update-docs
# ────────────────────────────────────────────
# Files Changed: 2
# Lines Changed: 25
#
# Matching Rules:
# ✓ small_changes (< 5 files, < 50 lines)
#
# Required Approvals:
# 1. peer_review - @team/developers (self-approve allowed)
```

---

## Example 5: Emergency Bypass Workflow

For critical production issues that need immediate deployment.

### Configuration

```yaml
approvals:
  enabled: true

  emergency_bypass:
    enabled: true

    # Who can trigger bypass
    authorized_users:
      - "@team/tech-leads"
      - "@team/on-call"
      - "@vp-engineering"

    # Required information
    require_justification: true
    require_incident_id: true

    # Post-bypass requirements
    post_bypass:
      retrospective_required: true
      retrospective_deadline: "48h"
      approval_required_after: true  # Still need approval post-facto

    # Audit
    audit:
      log_all_bypasses: true
      notify:
        - "@team/engineering-leadership"
        - "#security-alerts"
```

### Emergency Bypass Workflow

```bash
# During incident: Critical production bug found
# Normal approval would take too long

# Step 1: Initiate emergency bypass
proagents approval bypass --reason "critical" --incident INC-12345

# Output:
# ⚠️  EMERGENCY BYPASS REQUESTED
# ────────────────────────────────
# User: @senior-dev
# Time: 2024-01-15 03:30:00 UTC
# Incident: INC-12345
#
# Please provide justification:
> Production payments failing for all users. Fix identified and tested locally.

# Verification:
# ✅ User is authorized for bypass
# ✅ Justification provided
# ✅ Incident ID linked
#
# ⚠️  BYPASS APPROVED - Proceed with caution
#
# Required Actions:
# 1. Deploy fix immediately
# 2. Complete retrospective within 48 hours
# 3. Obtain approval post-deployment

# Step 2: Deploy without normal approval
proagents deploy production --emergency

# Step 3: After incident - complete retrospective
proagents bypass retrospective INC-12345

# Step 4: Post-deployment approval
proagents approval request --bypass-followup INC-12345
```

### Bypass Audit Log

```
┌─────────────────────────────────────────────────────────────┐
│ Emergency Bypass Audit Log                                  │
├─────────────────────────────────────────────────────────────┤
│ Bypass ID: BYP-2024-0015                                   │
│ Time: 2024-01-15 03:30:00 UTC                              │
│ User: @senior-dev                                           │
│ Incident: INC-12345                                         │
│                                                             │
│ Justification:                                              │
│ "Production payments failing for all users. Fix identified │
│ and tested locally. Estimated impact: $50K/hour"           │
│                                                             │
│ Changes Deployed:                                           │
│ - src/services/payment.ts (15 lines)                       │
│ - src/lib/stripe.ts (3 lines)                              │
│                                                             │
│ Post-Bypass Status:                                         │
│ ✅ Retrospective completed: 2024-01-16 09:00 UTC           │
│ ✅ Post-approval received: 2024-01-16 10:30 UTC            │
│                                                             │
│ Root Cause: Stripe API version mismatch                    │
│ Prevention: Added API version pinning                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Example 6: Team-Based Approval Routing

Route approvals to appropriate teams based on expertise.

### Configuration

```yaml
approvals:
  enabled: true

  # Define teams and their domains
  teams:
    frontend:
      members: ["@alice", "@bob", "@charlie"]
      domains:
        - "src/components/**"
        - "src/pages/**"
        - "src/styles/**"

    backend:
      members: ["@dave", "@eve", "@frank"]
      domains:
        - "src/api/**"
        - "src/services/**"
        - "src/models/**"

    infrastructure:
      members: ["@grace", "@henry"]
      domains:
        - "docker/**"
        - "terraform/**"
        - ".github/**"
        - "k8s/**"

    security:
      members: ["@ivan", "@julia"]
      domains:
        - "src/auth/**"
        - "src/middleware/security*"

  # Auto-route based on changes
  auto_routing:
    enabled: true
    rules:
      - match: "domains"
        assign: "team"
        require: 1

      - match: "cross_domain"  # Changes span multiple domains
        assign: ["primary_domain_team", "@team/tech-leads"]
        require: 2
```

### Auto-Routing in Action

```bash
# Feature changes frontend components
proagents approval request feature/new-dashboard

# Output:
# Auto-Routing Analysis
# ─────────────────────
# Changes:
# - src/components/Dashboard.tsx
# - src/components/Chart.tsx
# - src/styles/dashboard.css
#
# Detected Domains: frontend
#
# Auto-assigned Reviewers:
# - @alice (frontend)
# - @bob (frontend)
# - @charlie (frontend)
#
# Required: 1 approval from frontend team

# Feature changes both frontend and backend
proagents approval request feature/full-stack-feature

# Output:
# Auto-Routing Analysis
# ─────────────────────
# Changes:
# - src/components/UserProfile.tsx
# - src/api/users.ts
# - src/services/UserService.ts
#
# Detected Domains: frontend, backend (cross-domain)
#
# Auto-assigned Reviewers:
# - @alice (frontend - primary based on file count)
# - @dave (backend)
# - @team/tech-leads (cross-domain)
#
# Required: 2 approvals
```

---

## Example 7: Time-Based Approval Rules

Different approval rules based on timing.

### Configuration

```yaml
approvals:
  enabled: true

  time_based_rules:
    # Freeze periods
    freezes:
      - name: "code_freeze"
        schedule:
          - "friday 17:00 - monday 09:00"  # Weekends
          - "december 20 - january 2"       # Holiday freeze
        actions:
          - block_deployments: true
          - allow_emergency: true
          - require_bypass: ["@team/on-call", "@vp-engineering"]

    # Business hours - standard process
    business_hours:
      schedule: "monday-friday 09:00-17:00"
      timezone: "America/New_York"
      rules:
        production_deploy:
          required: true
          approvers: ["@team/tech-leads"]
          min_approvals: 1

    # Off-hours - stricter requirements
    off_hours:
      rules:
        production_deploy:
          required: true
          approvers:
            - "@team/tech-leads"
            - "@team/on-call"
          min_approvals: 2
          additional_notification: ["@team/engineering-leadership"]

    # Pre-release freeze
    release_freeze:
      trigger: "24h before scheduled_release"
      rules:
        all_changes:
          block: true
          allow: "release_fixes_only"
          require_approval: ["@release-manager"]
```

### Time-Based Behavior

```bash
# Attempt deployment on Saturday
proagents deploy production

# Output:
# ⚠️  DEPLOYMENT BLOCKED
# ─────────────────────────
# Reason: Code freeze in effect
# Period: Friday 17:00 - Monday 09:00
#
# Options:
# 1. Wait until Monday 09:00 EST
# 2. Request emergency bypass (requires @team/on-call approval)
#
# To request bypass:
# proagents approval bypass --freeze-override

# Deployment during off-hours (Tuesday 11pm)
proagents deploy production

# Output:
# ⚠️  Off-Hours Deployment
# ────────────────────────
# Current time: Tuesday 23:00 EST (off-hours)
#
# Additional requirements:
# - 2 approvals required (instead of 1)
# - On-call team notified
# - Engineering leadership notified
#
# Proceed with approval request? [y/N]
```

---

## Example 8: Approval with Automated Checks

Combine manual approval with automated verification.

### Configuration

```yaml
approvals:
  enabled: true

  automated_checks:
    # Checks must pass before approval can be granted
    pre_approval:
      - name: "tests_pass"
        type: "ci_status"
        required: true

      - name: "coverage_threshold"
        type: "metric"
        metric: "test_coverage"
        threshold: 80
        required: true

      - name: "security_scan"
        type: "ci_status"
        job: "security-scan"
        required: true

      - name: "build_success"
        type: "ci_status"
        job: "build"
        required: true

    # Checks displayed to approver
    informational:
      - name: "performance_impact"
        type: "metric"
        metric: "bundle_size_delta"
        display: true

      - name: "dependency_changes"
        type: "file_diff"
        files: ["package.json", "package-lock.json"]
        display: true

  feature_approval:
    stages:
      - name: "tech_review"
        approvers: ["@team/tech-leads"]
        required: true
        blocked_until:
          - "tests_pass"
          - "coverage_threshold"
          - "security_scan"
          - "build_success"
```

### Approval with Checks

```bash
# Request approval
proagents approval request

# Output:
# Approval Request: feature/payment-integration
# ─────────────────────────────────────────────
#
# Automated Checks:
# ✅ tests_pass - All 234 tests passing
# ✅ coverage_threshold - 85% (threshold: 80%)
# ✅ security_scan - No vulnerabilities found
# ✅ build_success - Build completed in 2m 34s
#
# Informational:
# ℹ️  performance_impact - Bundle size: +12KB (+2.4%)
# ℹ️  dependency_changes - 2 packages updated
#    - stripe: 10.0.0 → 11.0.0
#    - zod: 3.20.0 → 3.21.0
#
# Approval Status:
# Stage: tech_review - ⏳ Pending
# Approvers notified: @tech-lead-1, @tech-lead-2
#
# All automated checks passed ✅
# Ready for manual review

# If checks fail:
# Output:
# ⚠️  Approval Blocked
# ───────────────────
# The following checks must pass before approval:
#
# ❌ coverage_threshold - 72% (threshold: 80%)
# ❌ security_scan - 1 high severity issue found
#
# Fix these issues and push changes to continue.
```

---

## Example 9: Delegated Approval

Allow temporary delegation of approval authority.

### Configuration

```yaml
approvals:
  delegation:
    enabled: true

    # Rules for delegation
    rules:
      - role: "tech_lead"
        can_delegate_to: ["senior_developers"]
        max_duration: "14d"
        require_reason: true

      - role: "engineering_manager"
        can_delegate_to: ["tech_leads"]
        max_duration: "30d"
        require_reason: true

    # Audit
    audit:
      log_all_delegations: true
      notify_on_delegation: true
```

### Delegation Workflow

```bash
# Tech lead going on vacation, delegates authority
proagents approval delegate --to @senior-dev --duration 7d --reason "Vacation Jan 15-22"

# Output:
# Approval Authority Delegated
# ────────────────────────────
# From: @tech-lead
# To: @senior-dev
# Duration: 7 days (Jan 15 - Jan 22)
# Reason: Vacation Jan 15-22
#
# @senior-dev can now:
# ✅ Approve feature reviews
# ✅ Approve staging deployments
# ❌ Approve production deployments (not delegatable)
#
# Delegation logged and team notified.

# During delegation period
proagents approval status

# Output:
# Current Approvers for tech_review:
# - @tech-lead (delegated to @senior-dev until Jan 22)
# - @other-tech-lead

# Revoke delegation early
proagents approval delegate revoke --from @senior-dev

# Output:
# Delegation Revoked
# ──────────────────
# @senior-dev's delegated authority has been revoked.
# @tech-lead's approval authority is restored.
```

---

## Commands Quick Reference

| Command | Description |
|---------|-------------|
| `proagents approval request` | Request approval for current feature |
| `proagents approval status` | Check approval status |
| `proagents approval approve <id>` | Approve a request |
| `proagents approval reject <id>` | Reject with feedback |
| `proagents approval bypass` | Emergency bypass |
| `proagents approval delegate` | Delegate authority |
| `proagents approval analyze` | Analyze approval requirements |
| `proagents approval history` | View approval history |

---

## Best Practices

1. **Right-size approvals** - Don't require too many approvals for simple changes
2. **Use conditional rules** - Stricter rules for risky changes, simpler for safe ones
3. **Enable automation** - Combine automated checks with manual review
4. **Have bypass procedures** - Emergencies happen, plan for them
5. **Audit everything** - Keep records of all approvals and bypasses
6. **Delegate wisely** - Allow delegation for coverage, track it
7. **Review and iterate** - Regularly review approval rules for effectiveness

---

## Next Steps

- [Approval Configuration](./approval-config.md)
- [Emergency Bypass](./emergency-bypass.md)
- [Notifications Setup](./notifications.md)
