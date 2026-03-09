# Troubleshooting Workflow Issues

Solutions for workflow, feature, and phase-related problems.

---

## Feature Management Issues

### Cannot Start New Feature

**Symptom:**
```
Error: Cannot start new feature
Reason: Feature 'user-auth' already in progress
```

**Solutions:**

```bash
# Check current feature status
proagents status

# Option 1: Resume current feature
proagents feature resume

# Option 2: Complete current feature
proagents feature complete

# Option 3: Abandon current feature (if stuck)
proagents feature abandon --confirm

# Option 4: Enable parallel features
parallel_features:
  enabled: true
  max_concurrent: 3

# Then start parallel feature
proagents feature start "new-feature" --parallel
```

---

### Feature State Corrupted

**Symptom:**
- Feature shows wrong phase
- Feature data doesn't match reality
- Inconsistent state messages

**Solutions:**

```bash
# Diagnose feature state
proagents feature diagnose user-auth

# Repair feature state
proagents feature repair user-auth

# Manual state reset
proagents feature reset-phase user-auth --to implementation

# If severely corrupted, recreate
proagents feature export user-auth > backup.json
proagents feature delete user-auth --force
proagents feature import backup.json --fix
```

---

### Lost Feature Context

**Symptom:**
- AI doesn't remember previous discussions
- Requirements seem forgotten
- Starting over each session

**Solutions:**

```bash
# Check if context is saved
proagents feature context show

# Reload context
proagents feature context reload

# Manually add context
proagents feature context add "Key requirement: must support SSO"

# Configure context persistence
feature_context:
  persist: true
  save_frequency: "on_phase_complete"
  include:
    - "requirements"
    - "decisions"
    - "ai_conversations"
```

---

## Phase Issues

### Phase Won't Complete

**Symptom:**
```
Error: Phase 'testing' cannot complete
Missing requirements:
- Test coverage below 80%
- 2 failing tests
```

**Solutions:**

```bash
# Check phase requirements
proagents phase requirements testing

# View detailed status
proagents phase status testing --verbose

# Fix the issues
npm test -- --coverage
# Fix failing tests

# Or override requirements (with justification)
proagents phase complete testing --override --reason "Tests verified externally"

# Or adjust thresholds
workflow:
  phases:
    testing:
      coverage_threshold: 70  # Lower temporarily
```

---

### Phase Stuck/Hanging

**Symptom:**
- Phase started but never completes
- No progress indicators
- System unresponsive

**Solutions:**

```bash
# Check for background processes
proagents phase status --processes

# Cancel stuck operation
proagents phase cancel

# Resume from last checkpoint
proagents phase resume --from-checkpoint

# Force restart phase
proagents phase restart implementation --force

# Set timeout to prevent future hangs
workflow:
  phases:
    implementation:
      timeout: 3600  # 1 hour max
      checkpoint_interval: 300  # Save every 5 min
```

---

### Wrong Phase Sequence

**Symptom:**
- Phases running out of order
- Skipped phases unexpectedly
- Dependencies not respected

**Solutions:**

```bash
# View phase order
proagents phase list --order

# Check dependencies
proagents phase dependencies

# Reset to correct phase
proagents phase goto requirements

# Fix configuration
workflow:
  phases:
    # Define correct order
    order:
      - "init"
      - "analysis"
      - "requirements"
      - "design"
      - "implementation"
      - "testing"
      - "review"
      - "documentation"
      - "deployment"

    # Define dependencies
    dependencies:
      testing:
        requires: ["implementation"]
      deployment:
        requires: ["testing", "review"]
```

---

## Checkpoint Issues

### Checkpoint Not Triggering

**Symptom:**
- Expected checkpoint didn't appear
- Automatic approvals when manual expected
- Missing review opportunities

**Solutions:**

```bash
# Check checkpoint configuration
proagents checkpoint list

# Verify checkpoint is enabled
checkpoints:
  after_design: true  # Should be true

# Check conditions
proagents checkpoint status after_design

# Force checkpoint
proagents checkpoint trigger after_design

# Debug checkpoint conditions
proagents checkpoint debug after_design
```

---

### Stuck at Checkpoint

**Symptom:**
```
Waiting for approval: before_deployment
Status: Pending for 48 hours
```

**Solutions:**

```bash
# Check who can approve
proagents approval who-can-approve

# Send reminder
proagents approval remind

# Check if approver is available
proagents team status

# Use delegate approver
proagents approval delegate @backup-approver

# Emergency bypass (if authorized)
proagents approval bypass --reason "Approver unavailable, tested externally"
```

---

### Checkpoint Data Lost

**Symptom:**
- Previous checkpoint decisions not saved
- Need to re-approve completed checkpoints
- Review comments missing

**Solutions:**

```bash
# Check checkpoint history
proagents checkpoint history

# Restore from backup
proagents checkpoint restore before_deployment --from backup

# Re-record decision manually
proagents checkpoint record before_deployment --approved --by @tech-lead --date "2024-01-15"

# Enable checkpoint persistence
checkpoints:
  persistence:
    enabled: true
    backup: true
    retention_days: 90
```

---

## Parallel Feature Issues

### Feature Conflicts

**Symptom:**
```
Warning: Conflict detected
Features: user-auth, user-profile
Conflicting files: src/types/user.ts
```

**Solutions:**

```bash
# View conflict details
proagents conflict show user-auth user-profile

# Resolve manually
proagents conflict resolve --strategy manual

# Use merge strategy
proagents conflict resolve --strategy auto-merge

# Coordinate with other developer
proagents feature lock src/types/user.ts --message "Modifying user types"

# Sequential development
proagents feature pause user-profile --until user-auth-complete
```

---

### Feature Dependencies Not Respected

**Symptom:**
- Dependent feature started before dependency complete
- Missing functionality from incomplete dependency
- Integration errors

**Solutions:**

```bash
# Check dependencies
proagents feature dependencies user-profile

# Set explicit dependency
proagents feature depends user-profile --on user-auth

# Wait for dependency
proagents feature wait user-profile --for user-auth

# Configuration
parallel_features:
  dependency_check: strict  # Block until dependencies met
  warn_on_conflict: true
```

---

### Merge Order Wrong

**Symptom:**
- Features merged in wrong order
- Dependent code merged before dependency
- Integration issues after merge

**Solutions:**

```bash
# View recommended merge order
proagents feature merge-order

# Set merge priority
proagents feature priority user-auth --level 1
proagents feature priority user-profile --level 2

# Force merge order
parallel_features:
  merge_order:
    strategy: "dependency_first"
    allow_override: false

# Rollback and re-merge
git revert HEAD~2
proagents feature merge user-auth
proagents feature merge user-profile
```

---

## Mode Issues

### Wrong Mode Detected

**Symptom:**
- Bug fix detected as full feature
- Quick change requiring full workflow
- Mode switch not working

**Solutions:**

```bash
# Check detected mode
proagents mode current

# Override mode
proagents mode set bug_fix

# Force mode for current operation
proagents fix "issue" --mode quick_change

# Configure detection
workflow:
  mode_detection:
    bug_fix:
      indicators:
        - "fix"
        - "bug"
        - "issue"
      max_files: 5

    quick_change:
      indicators:
        - "update"
        - "config"
        - "typo"
      max_files: 2
```

---

### Cannot Change Modes

**Symptom:**
```
Error: Cannot switch to full_workflow mode
Reason: In progress work would be lost
```

**Solutions:**

```bash
# Save current progress
proagents progress save

# Then switch
proagents mode switch full_workflow

# Or force switch (may lose progress)
proagents mode switch full_workflow --force --reason "Need full analysis"

# Configuration for smoother switching
workflow:
  mode_switching:
    auto_save: true
    confirm_on_data_loss: true
    preserve_context: true
```

---

## Recovery Procedures

### Reset Workflow State

```bash
# Soft reset (preserve work)
proagents workflow reset --soft

# Hard reset (start fresh)
proagents workflow reset --hard

# Reset specific feature
proagents feature reset user-auth

# Reset to specific phase
proagents feature reset user-auth --to analysis
```

### Export/Import Feature State

```bash
# Export current state
proagents feature export user-auth > feature-backup.json

# Import state
proagents feature import feature-backup.json

# Transfer to another machine
scp feature-backup.json other-machine:/path/
# On other machine:
proagents feature import feature-backup.json
```

### Recover from Corruption

```bash
# Diagnose issues
proagents doctor --workflow

# Auto-repair
proagents repair --workflow

# Manual recovery
cd .proagents/features/user-auth
# Review and fix JSON files manually

# Rebuild from git history
proagents feature rebuild user-auth --from-git
```

---

## Prevention

### Enable Auto-Save

```yaml
workflow:
  auto_save:
    enabled: true
    interval: 300  # Every 5 minutes
    on_phase_complete: true
    on_checkpoint: true

  backup:
    enabled: true
    frequency: "daily"
    retention: 30
```

### Configure Health Checks

```yaml
workflow:
  health_check:
    enabled: true
    interval: 3600  # Hourly
    auto_repair: true
    notify_on_issues: true
```

### Set Up Monitoring

```bash
# Enable workflow monitoring
proagents monitor enable workflow

# View workflow metrics
proagents monitor dashboard workflow

# Set up alerts
monitoring:
  workflow:
    alerts:
      - condition: "feature_stuck > 24h"
        action: "notify"
      - condition: "phase_timeout"
        action: "auto_checkpoint"
```

---

## Related Documentation

- [Workflow Guide](../WORKFLOW.md)
- [Parallel Features](../parallel-features/README.md)
- [Checkpoints](../WORKFLOW.md#checkpoints)
- [Approval Workflows](../approval-workflows/README.md)
