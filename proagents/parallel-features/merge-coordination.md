# Merge Coordination

Coordinate merging of multiple parallel features.

---

## Overview

Merge coordination ensures:
- Correct merge order based on dependencies
- Conflict resolution before merge
- Smooth integration of parallel features
- Minimal disruption to main branch

---

## Merge Order Determination

### Automatic Order Calculation

```typescript
// Calculate optimal merge order
function calculateMergeOrder(features: Feature[]): MergeOrder[] {
  const order: MergeOrder[] = [];
  const merged = new Set<string>();

  while (merged.size < features.length) {
    // Find features with all dependencies merged
    const ready = features.filter(f =>
      !merged.has(f.id) &&
      f.depends_on.every(dep => merged.has(dep.feature))
    );

    if (ready.length === 0 && merged.size < features.length) {
      throw new Error('Circular dependency detected');
    }

    // Sort by priority, then by completion date
    ready.sort((a, b) => {
      if (a.priority !== b.priority) {
        return priorityValue(b.priority) - priorityValue(a.priority);
      }
      return new Date(a.completed_at) - new Date(b.completed_at);
    });

    for (const feature of ready) {
      order.push({
        feature: feature.id,
        position: order.length + 1,
        dependencies: feature.depends_on.map(d => d.feature),
        conflicts: detectConflicts(feature, features),
      });
      merged.add(feature.id);
    }
  }

  return order;
}
```

### Merge Order Output

```yaml
merge_order:
  generated: "2024-01-15T14:00:00Z"
  base_branch: "develop"

  order:
    - position: 1
      feature: "feature-user-auth"
      branch: "feature/user-auth"
      reason: "No dependencies"
      conflicts: []
      estimated_merge_time: "15 minutes"
      pre_merge_checks:
        - "All tests passing"
        - "Code review approved"

    - position: 2
      feature: "feature-dashboard"
      branch: "feature/dashboard"
      reason: "Depends on user-auth"
      conflicts:
        - file: "src/lib/api.ts"
          type: "minor"
          resolution: "auto-mergeable"
      estimated_merge_time: "30 minutes"
      pre_merge_checks:
        - "Rebase after user-auth merge"
        - "Resolve api.ts conflict"

    - position: 3
      feature: "feature-notifications"
      branch: "feature/notifications"
      reason: "Depends on dashboard"
      conflicts: []
      estimated_merge_time: "15 minutes"

  total_estimated_time: "1 hour"
  recommended_window: "Low traffic period"
```

---

## Conflict Pre-Check

### Before Merge

```bash
#!/bin/bash
# scripts/pre-merge-check.sh

FEATURE_BRANCH=$1
BASE_BRANCH=${2:-develop}

echo "=== Pre-Merge Conflict Check ==="
echo "Feature: $FEATURE_BRANCH"
echo "Base: $BASE_BRANCH"
echo ""

# Fetch latest
git fetch origin

# Check if branch exists
if ! git show-ref --verify --quiet refs/remotes/origin/$FEATURE_BRANCH; then
  echo "❌ Branch not found: $FEATURE_BRANCH"
  exit 1
fi

# Simulate merge
echo "Checking for conflicts..."
git checkout -B merge-test origin/$BASE_BRANCH
MERGE_RESULT=$(git merge --no-commit --no-ff origin/$FEATURE_BRANCH 2>&1)

if echo "$MERGE_RESULT" | grep -q "CONFLICT"; then
  echo "⚠️  CONFLICTS DETECTED:"
  echo ""
  git diff --name-only --diff-filter=U
  echo ""
  echo "Resolution required before merge."
  git merge --abort
  git checkout -
  exit 1
else
  echo "✅ No conflicts detected"
  git merge --abort
  git checkout -
fi

# Check for outdated branch
BEHIND=$(git rev-list --count origin/$FEATURE_BRANCH..origin/$BASE_BRANCH)
if [ "$BEHIND" -gt 0 ]; then
  echo "⚠️  Branch is $BEHIND commits behind $BASE_BRANCH"
  echo "   Consider rebasing before merge"
fi
```

### Conflict Report

```markdown
# Merge Conflict Report

## Feature: feature-dashboard
## Target: develop

### Conflicts Found: 2

#### 1. src/lib/api.ts

**Type:** Content conflict
**Sections:**
- Lines 45-60: Error handling
- Lines 120-130: Request interceptor

**Changes in feature-dashboard:**
```typescript
// Added new error type
if (error.response?.status === 403) {
  return handleForbidden(error);
}
```

**Changes in develop (from user-auth):**
```typescript
// Added auth error handling
if (error.response?.status === 401) {
  return handleUnauthorized(error);
}
```

**Resolution:** Manual merge required - both changes needed

#### 2. src/types/index.ts

**Type:** Addition conflict
**Both branches:** Added new types at same location

**Resolution:** Auto-mergeable - combine both additions

### Recommended Actions

1. Checkout feature-dashboard
2. Rebase onto latest develop
3. Resolve conflicts manually
4. Run tests
5. Push rebased branch
6. Proceed with merge
```

---

## Merge Workflow

### Standard Merge Process

```yaml
merge_workflow:
  phases:
    pre_merge:
      - name: "Conflict Check"
        command: "/merge-check [feature]"
        required: true

      - name: "Test Verification"
        command: "npm test"
        required: true

      - name: "Code Review"
        check: "PR approved"
        required: true

      - name: "Rebase if needed"
        condition: "behind_base > 5"
        command: "git rebase develop"

    merge:
      - name: "Create Merge PR"
        command: "gh pr create --base develop"

      - name: "Squash or Merge"
        strategy: "squash"  # squash | merge | rebase

      - name: "Delete Feature Branch"
        command: "git push origin --delete [branch]"

    post_merge:
      - name: "Notify Dependent Features"
        action: "Update dependency status"

      - name: "Trigger Dependent Rebases"
        action: "Notify to rebase"

      - name: "Update Tracking"
        action: "Mark feature as merged"
```

### Automated Merge Script

```bash
#!/bin/bash
# scripts/merge-feature.sh

set -e

FEATURE=$1
BASE=${2:-develop}

echo "╔══════════════════════════════════════════════════╗"
echo "║              Merging Feature                      ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""
echo "Feature: $FEATURE"
echo "Base: $BASE"
echo ""

# Step 1: Pre-merge checks
echo "Step 1: Running pre-merge checks..."
./scripts/pre-merge-check.sh "feature/$FEATURE" "$BASE"

# Step 2: Update feature branch
echo ""
echo "Step 2: Updating feature branch..."
git checkout "feature/$FEATURE"
git pull origin "feature/$FEATURE"
git rebase "origin/$BASE"

# Step 3: Run tests
echo ""
echo "Step 3: Running tests..."
npm test

# Step 4: Merge
echo ""
echo "Step 4: Merging..."
git checkout "$BASE"
git pull origin "$BASE"
git merge --squash "feature/$FEATURE"
git commit -m "feat: merge feature/$FEATURE

Merged feature: $FEATURE
"

# Step 5: Push
echo ""
echo "Step 5: Pushing..."
git push origin "$BASE"

# Step 6: Cleanup
echo ""
echo "Step 6: Cleanup..."
git push origin --delete "feature/$FEATURE"

# Step 7: Update tracking
echo ""
echo "Step 7: Updating tracking..."
# Update feature status to merged

echo ""
echo "✅ Feature merged successfully!"
```

---

## Batch Merge Coordination

When merging multiple features:

```yaml
batch_merge:
  features:
    - "feature-user-auth"
    - "feature-dashboard"
    - "feature-notifications"

  strategy: "sequential"  # sequential | parallel-test

  sequential_process:
    - merge: "feature-user-auth"
      then:
        - rebase: "feature-dashboard"
        - rebase: "feature-notifications"

    - merge: "feature-dashboard"
      then:
        - rebase: "feature-notifications"

    - merge: "feature-notifications"

  checkpoints:
    after_each_merge:
      - run_tests: true
      - check_build: true
      - verify_deployment: false

  rollback_on_failure:
    enabled: true
    strategy: "revert_all"
```

### Batch Merge Visualization

```
┌─────────────────────────────────────────────────────────────┐
│                    Batch Merge Progress                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐     ┌─────────────────┐               │
│  │   user-auth     │────▶│   MERGED ✅     │               │
│  │                 │     │   14:30         │               │
│  └─────────────────┘     └─────────────────┘               │
│           │                                                 │
│           ▼ trigger rebase                                  │
│  ┌─────────────────┐     ┌─────────────────┐               │
│  │   dashboard     │────▶│   MERGING 🔄    │               │
│  │   (rebased)     │     │   14:35         │               │
│  └─────────────────┘     └─────────────────┘               │
│           │                                                 │
│           ▼ waiting                                         │
│  ┌─────────────────┐     ┌─────────────────┐               │
│  │  notifications  │────▶│   PENDING ⏳    │               │
│  │   (queued)      │     │                 │               │
│  └─────────────────┘     └─────────────────┘               │
│                                                             │
│  Progress: 1/3 merged                                       │
│  Estimated completion: 14:50                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Merge Notifications

```yaml
notifications:
  pre_merge:
    recipients: ["feature_owner", "team"]
    message: "🔀 Preparing to merge {{feature}} to {{base}}"

  merge_started:
    recipients: ["team"]
    message: "🔄 Merging {{feature}} to {{base}}..."

  merge_complete:
    recipients: ["feature_owner", "dependent_owners", "team"]
    message: |
      ✅ {{feature}} merged successfully!

      Next in queue: {{next_feature}}
      Dependent features notified to rebase.

  merge_failed:
    recipients: ["feature_owner", "team_lead"]
    priority: "high"
    message: |
      ❌ Merge failed for {{feature}}

      Error: {{error}}
      Action required: {{resolution}}

  rebase_required:
    recipients: ["dependent_feature_owners"]
    message: |
      🔄 {{merged_feature}} has been merged.

      Your feature {{your_feature}} needs to rebase.
      Command: git rebase origin/develop
```

---

## Merge Schedule

```yaml
merge_schedule:
  # Preferred merge windows
  preferred_windows:
    - day: "weekday"
      time: "10:00-12:00"
      reason: "Team available for issues"

    - day: "weekday"
      time: "14:00-16:00"
      reason: "After lunch, before EOD"

  # Avoid these times
  blackout_periods:
    - day: "friday"
      time: "16:00-24:00"
      reason: "Weekend approaching"

    - day: "weekend"
      reason: "Limited support"

  # Auto-schedule based on readiness
  auto_schedule:
    enabled: true
    check_interval: "1h"
    notify_before: "30m"
```

---

## Configuration

```yaml
# proagents.config.yaml

merge:
  coordination:
    enabled: true

  strategy:
    default: "squash"  # squash | merge | rebase
    delete_branch_after: true

  checks:
    require_tests: true
    require_review: true
    require_rebase: true

  batch:
    enabled: true
    max_concurrent: 1  # Sequential for safety

  notifications:
    slack_channel: "#merges"
    notify_on: ["start", "complete", "fail"]

  schedule:
    auto_schedule: true
    respect_blackout: true
```

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `pa:merge-order` | View recommended merge order |
| `pa:merge-check [feature]` | Pre-merge conflict check |
| `pa:merge [feature]` | Start merge process |
| `pa:merge-batch` | Merge all ready features |
| `pa:merge-status` | View merge progress |
| `pa:merge-schedule` | View/set merge schedule |
