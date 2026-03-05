# Entry Modes

Detailed documentation of each workflow entry mode.

---

## Mode 1: Full Workflow

The complete 10-phase development workflow for new features.

### When to Use
- New feature development
- Major refactoring
- Complex changes affecting multiple areas
- Features requiring design input
- Changes needing thorough documentation

### Workflow Phases

```
┌─────────────────────────────────────────────────────────────┐
│                    Full Workflow Phases                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Phase 0: Initialization                                    │
│  └── Create feature branch, gather context                  │
│                                                             │
│  Phase 1: Analysis                                          │
│  └── Deep codebase analysis, pattern detection              │
│                                                             │
│  Phase 2: Requirements                                      │
│  └── Gather requirements, acceptance criteria               │
│                                                             │
│  Phase 3: UI/UX Design                                      │
│  └── Design integration (Figma, sketches, etc.)            │
│                                                             │
│  Phase 4: Planning                                          │
│  └── Implementation plan, task breakdown                    │
│                                                             │
│  Phase 5: Implementation                                    │
│  └── Code implementation following patterns                 │
│                                                             │
│  Phase 6: Testing                                           │
│  └── Unit, integration, E2E tests                          │
│                                                             │
│  Phase 6.5: Code Review                                     │
│  └── AI + peer review                                       │
│                                                             │
│  Phase 7: Documentation                                     │
│  └── Code docs, user docs, API docs                        │
│                                                             │
│  Phase 8: Deployment                                        │
│  └── Deploy with rollback plan                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Starting Full Workflow

```bash
# Start new feature
/feature start "User Profile Management"

# With options
/feature start "User Profile" --skip-ui --checkpoint=critical
```

### Checkpoints

```yaml
full_workflow_checkpoints:
  after_analysis: true       # Review analysis results
  after_requirements: false  # Optional
  after_design: true         # Review design specs
  after_implementation: false
  after_testing: false
  before_deployment: true    # Final review
```

---

## Mode 2: Bug Fix (Fast Track)

Streamlined workflow for fixing bugs quickly without skipping quality.

### When to Use
- Bug fixes
- Small issues
- Performance fixes
- Security patches (non-critical)
- Regression fixes

### Workflow Phases

```
┌─────────────────────────────────────────────────────────────┐
│                    Bug Fix Fast Track                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Phase 1: Context Scan (2-5 min)                            │
│  ├── Identify affected files from bug description           │
│  ├── Scan recent changes (git history)                      │
│  ├── Check related components                               │
│  └── Load cached analysis if available                      │
│                                                             │
│  Phase 2: Root Cause Analysis                               │
│  ├── Identify the bug source                                │
│  ├── Check for similar issues                               │
│  └── Understand impact scope                                │
│                                                             │
│  Phase 3: Fix Implementation                                │
│  ├── Apply minimal fix                                      │
│  ├── Follow existing patterns                               │
│  └── Avoid scope creep                                      │
│                                                             │
│  Phase 4: Verification                                      │
│  ├── Test the fix                                           │
│  ├── Run regression tests                                   │
│  ├── Security scan if applicable                            │
│  └── Verify no new issues                                   │
│                                                             │
│  Phase 5: Commit & Document                                 │
│  ├── Commit with descriptive message                        │
│  ├── Link to issue/ticket                                   │
│  └── Quick documentation update                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Starting Bug Fix Mode

```bash
# Start bug fix
/fix "Login button not responding on mobile"

# With issue reference
/fix "Login button issue" --issue PROJ-123

# With urgency
/fix "Critical auth bypass" --priority critical
```

### Auto-Context Gathering

Even without full analysis, bug fix mode automatically:

```yaml
auto_context:
  # What it does automatically
  identify_files:
    from: "bug description"
    method: "keyword matching + AI analysis"

  scan_history:
    commits: "last 50"
    focus: "related files"

  check_related:
    components: true
    services: true
    tests: true

  load_cached:
    analysis: true
    patterns: true
```

### Guardrails

```yaml
bug_fix_guardrails:
  # Auto-upgrade to full workflow if:
  auto_upgrade_triggers:
    - files_changed: "> 3"
    - affects_critical_path: true
    - duration_exceeds: "2 hours"
    - touches_security_code: true
    - modifies_database: true
    - changes_api_contract: true

  # Always require
  always_required:
    - tests_for_fix: true
    - no_new_vulnerabilities: true
    - follows_conventions: true
```

---

## Mode 3: Quick Change

Minimal workflow for simple, low-risk changes.

### When to Use
- Configuration changes
- URL/endpoint updates
- Text/copy fixes
- Environment variable changes
- Simple CSS fixes
- Documentation typos

### Workflow Phases

```
┌─────────────────────────────────────────────────────────────┐
│                    Quick Change Mode                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Phase 1: Change                                            │
│  ├── Make the change                                        │
│  └── Ensure correct location                                │
│                                                             │
│  Phase 2: Verify                                            │
│  ├── Basic verification                                     │
│  ├── No breaking changes                                    │
│  └── Lint/format check                                      │
│                                                             │
│  Phase 3: Commit                                            │
│  ├── Commit with message                                    │
│  └── Minimal documentation                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Starting Quick Change Mode

```bash
# Quick change
/quick "Update API URL to production"

# With specific file
/quick "Fix typo in button" --file src/components/Button.tsx
```

### Restrictions

```yaml
quick_change_restrictions:
  # Only allowed for
  allowed_for:
    - config_files: true
    - environment_vars: true
    - text_content: true
    - single_file_changes: true
    - documentation: true

  # Not allowed for
  not_allowed_for:
    - business_logic: true
    - security_code: true
    - api_contracts: true
    - database_changes: true
    - multiple_files: true

  # Auto-upgrade if
  auto_upgrade_if:
    - "Change affects more than 1 file"
    - "Change is in restricted area"
```

---

## Mode 4: Resume Mode

Continue work on a previously started feature.

### When to Use
- Returning to in-progress work
- After a break or context switch
- When picking up someone else's work
- After resolving a blocker

### How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    Resume Mode                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Load Feature Context                                    │
│     ├── Load status.json                                    │
│     ├── Load requirements.md                                │
│     ├── Load implementation-plan.md                         │
│     └── Load any saved state                                │
│                                                             │
│  2. Display Current Status                                  │
│     ├── Current phase                                       │
│     ├── Completed tasks                                     │
│     ├── Remaining tasks                                     │
│     └── Any blockers                                        │
│                                                             │
│  3. Continue from Last Phase                                │
│     ├── Pick up where left off                              │
│     ├── Option to go back a phase                           │
│     └── Option to restart phase                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Starting Resume Mode

```bash
# Resume by feature name
/resume user-authentication

# Resume last feature
/resume --last

# Show all resumable features
/resume --list
```

### Resume Context

```json
{
  "feature": "user-authentication",
  "current_phase": "implementation",
  "phase_progress": 60,
  "last_activity": "2024-01-15T14:30:00Z",
  "completed_phases": [
    "init",
    "analysis",
    "requirements",
    "design",
    "planning"
  ],
  "current_task": "Implement login form validation",
  "remaining_tasks": [
    "Add password strength checker",
    "Implement remember me",
    "Add OAuth buttons"
  ],
  "blockers": [],
  "notes": "Using Zustand for auth state as discussed"
}
```

---

## Mode Comparison Table

| Aspect | Full Workflow | Bug Fix | Quick Change | Resume |
|--------|--------------|---------|--------------|--------|
| Phases | 10 | 4-5 | 3 | Varies |
| Analysis | Deep | Contextual | None | Loaded |
| Design | Yes | No | No | If needed |
| Testing | Comprehensive | Targeted | Basic | Continues |
| Documentation | Full | Minimal | Commit only | Continues |
| Checkpoints | Multiple | 1-2 | None | As configured |
| Time | Hours-Days | 30min-2hrs | Minutes | Varies |

---

## Configuration

```yaml
# proagents.config.yaml

entry_modes:
  # Enable/disable modes
  full_workflow:
    enabled: true
    default_checkpoints: ["after_analysis", "after_design", "before_deployment"]

  bug_fix:
    enabled: true
    max_files: 3
    max_duration: "2h"
    require_tests: true

  quick_change:
    enabled: true
    allowed_paths:
      - "config/**"
      - "*.env*"
      - "**/*.md"
    blocked_paths:
      - "src/auth/**"
      - "src/payment/**"

  resume:
    enabled: true
    max_age: "30d"  # Features older than this are archived
```

---

## Slash Commands

| Command | Mode | Description |
|---------|------|-------------|
| `/feature start` | Full | Start full workflow |
| `/fix` | Bug Fix | Start bug fix mode |
| `/quick` | Quick Change | Start quick change |
| `/resume` | Resume | Continue previous work |
| `/mode` | Any | Show/change current mode |
