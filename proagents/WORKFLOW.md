# ProAgents Development Workflow - Complete Guide

The comprehensive reference for the ProAgents AI-powered development automation workflow.

---

## Table of Contents

1. [Overview](#overview)
2. [Core Principles](#core-principles)
3. [Workflow Phases](#workflow-phases)
4. [Flexible Entry Modes](#flexible-entry-modes)
5. [Parallel Feature Development](#parallel-feature-development)
6. [Checkpoint System](#checkpoint-system)
7. [Self-Learning System](#self-learning-system)
8. [Configuration](#configuration)
9. [Commands Reference](#commands-reference)

---

## Overview

ProAgents is a 10-phase development workflow that guides you from idea to deployment. It's designed to be:

- **AI Agnostic**: Works with Claude, ChatGPT, Gemini, Copilot, or any AI
- **IDE Agnostic**: Works with VS Code, Cursor, JetBrains, Vim, or any editor
- **Project Agnostic**: Supports web, mobile, full-stack, and backend projects
- **Existing Project First**: Deep analysis before any changes

```
┌─────────────────────────────────────────────────────────────────────┐
│                     ProAgents Workflow Overview                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  pa:init ──► Phase 0: Initialization                                │
│              │                                                       │
│              ▼                                                       │
│         Phase 1: Deep Analysis (existing projects)                  │
│              │                                                       │
│              ▼                                                       │
│         Phase 2: Requirements Engineering                           │
│              │                                                       │
│              ▼                                                       │
│         Phase 3: UI/UX Design Integration                           │
│              │                                                       │
│              ▼                                                       │
│         Phase 4: Implementation Planning                            │
│              │                                                       │
│              ▼                                                       │
│         Phase 5: Code Implementation                                │
│              │                                                       │
│              ▼                                                       │
│         Phase 6: Comprehensive Testing                              │
│              │                                                       │
│              ▼                                                       │
│         Phase 6.5: Code Review                                      │
│              │                                                       │
│              ▼                                                       │
│         Phase 7: Documentation                                      │
│              │                                                       │
│              ▼                                                       │
│         Phase 8: Deployment Preparation                             │
│              │                                                       │
│              ▼                                                       │
│         Phase 9: Rollback Strategy ──► COMPLETE                     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Core Principles

### 1. Existing Project First
Before making any changes to an existing codebase, ProAgents performs deep analysis to understand:
- Project structure and architecture
- Code conventions and patterns
- Dependencies and integrations
- Existing features and components

### 2. Full Lifecycle Coverage
Every feature goes through all necessary phases:
- Requirements → Design → Code → Test → Deploy → Document

### 3. Configurable Checkpoints
Users define where they want approval gates:
- After analysis, after design, before deployment, etc.

### 4. Parallel Development Support
Multiple features can be developed simultaneously with:
- Conflict detection
- Dependency tracking
- Merge coordination

### 5. Self-Learning
The system continuously improves by learning:
- User preferences and patterns
- Project-specific conventions
- Common corrections and feedback

---

## Workflow Phases

### Phase 0: Initialization & Context Gathering

**Slash Command:** `pa:init` or `pa:feature "Feature name"`

**Purpose:** Set up the context for a new feature or task.

**Actions:**
1. Detect project type (new vs existing)
2. Load or run codebase analysis
3. Gather feature requirements from user
4. Identify affected areas/modules
5. Check for conflicts with active features
6. Create feature branch

**Inputs:**
- Feature description
- Project path (if not current directory)
- Priority level (optional)

**Outputs:**
- Project Context Document
- Feature branch created
- Feature tracking entry

**Example:**
```bash
pa:feature "Add user authentication with OAuth2"

# Output:
# ✓ Project type: Next.js full-stack
# ✓ Analysis loaded (cached from 2 hours ago)
# ✓ Branch created: feature/user-auth-oauth2
# ✓ Feature tracking initialized
#
# Affected areas detected:
# - src/app/api/auth/
# - src/components/auth/
# - src/lib/auth.ts
#
# Ready for Phase 1: Analysis (or skip with pa:skip-to requirements)
```

**Configuration:**
```yaml
phase_0:
  auto_create_branch: true
  branch_prefix: "feature/"
  check_conflicts: true
  load_cached_analysis: true
  cache_max_age: "24h"
```

---

### Phase 1: Deep Analysis (Existing Projects)

**Slash Command:** `pa:analyze` or `pa:analyze-full`

**Purpose:** Thoroughly understand the existing codebase before making changes.

**Analysis Categories:**

#### 1.1 Structure Analysis
```
Project structure mapping:
├── Directory hierarchy
├── Module organization
├── File naming patterns
└── Architecture pattern detection (MVC, Clean, Feature-based)
```

#### 1.2 Code Conventions
```
Convention detection:
├── Naming conventions (files, functions, variables)
├── Code style (indentation, quotes, semicolons)
├── Import ordering
├── Comment style
└── Documentation patterns
```

#### 1.3 Dependency Mapping
```
Dependency analysis:
├── External dependencies (npm, pip, etc.)
├── Internal module dependencies
├── Circular dependency detection
├── Outdated/vulnerable packages
└── Third-party integrations
```

#### 1.4 Feature Inventory
```
Existing features:
├── Component catalog
├── API endpoint mapping
├── Route definitions
├── State management patterns
└── Data models
```

#### 1.5 Pattern Recognition
```
Detected patterns:
├── State management (Redux, Zustand, Context)
├── Error handling approaches
├── Authentication patterns
├── Data fetching patterns
└── Testing patterns
```

**Analysis Depth Levels:**

| Level | Command | Use Case | Duration |
|-------|---------|----------|----------|
| Lite | `pa:analyze-lite` | Quick overview | 1-2 min |
| Moderate | `pa:analyze` | Standard analysis | 5-10 min |
| Full | `pa:analyze-full` | Comprehensive | 15-30 min |

**Caching:**
- Analysis results are cached for performance
- Cache invalidates on significant file changes
- Manual refresh: `pa:analyze --refresh`

**Output:** Codebase Analysis Report

**See:** [Analysis Prompt](./prompts/01-analysis.md)

---

### Phase 2: Requirements Engineering

**Slash Command:** `pa:requirements`

**Purpose:** Gather and document complete feature requirements.

**Requirements Categories:**

#### 2.1 Feature Specification
- Clear feature description
- User stories / use cases
- Acceptance criteria
- Success metrics

#### 2.2 Technical Requirements
- Performance requirements
- Security considerations
- Scalability needs
- Integration requirements

#### 2.3 Constraints
- Must align with existing patterns
- Technology constraints
- Time/resource constraints
- Regulatory requirements

#### 2.4 Edge Cases
- Error scenarios
- Boundary conditions
- Concurrent usage
- Offline behavior

**Requirements Template:**
```markdown
## Feature: [Name]

### User Stories
- As a [user type], I want [action] so that [benefit]

### Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

### Technical Requirements
- Performance: [targets]
- Security: [requirements]

### Edge Cases
- Case 1: [description] → [expected behavior]
```

**Output:** Feature Requirements Document

**See:** [Requirements Template](./templates/feature-requirements.md)

---

### Phase 3: UI/UX Design Integration

**Slash Command:** `pa:design`

**Purpose:** Integrate UI designs into implementation specifications.

**Design Input Methods:**

#### Option A: Figma Integration
```bash
pa:design-figma --url "https://figma.com/file/..."
```
- Extracts design tokens (colors, typography, spacing)
- Identifies components and variants
- Exports assets (icons, images)
- Maps to existing component library

#### Option B: Manual Export
```bash
pa:design-export --file "./designs/dashboard.png"
```
- AI analyzes design images
- Extracts layout structure
- Identifies UI components
- Suggests implementation approach

#### Option C: Sketches/Wireframes
```bash
pa:design-sketch --file "./sketches/login-flow.jpg"
```
- Interprets hand-drawn wireframes
- Generates component structure
- Creates basic layout specifications

**Design-to-Code Mapping:**
```
Design Element          →    Code Implementation
─────────────────────────────────────────────────
Button (primary)        →    <Button variant="primary" />
Card container          →    <Card> component
Form field              →    <Input> with validation
Navigation              →    <Nav> with routes
```

**Output:** UI Implementation Specification

**See:** [UI Integration Guides](./ui-integration/)

---

### Phase 4: Implementation Planning

**Slash Command:** `pa:plan`

**Purpose:** Create a detailed implementation plan before coding.

**Planning Components:**

#### 4.1 Architecture Design
- Component/module design
- Data model design
- API design (if applicable)
- State management plan

#### 4.2 File Structure Plan
```
Files to create:
├── src/components/Auth/LoginForm.tsx (new)
├── src/hooks/useAuth.ts (new)
├── src/services/authService.ts (new)
└── src/types/auth.ts (new)

Files to modify:
├── src/app/layout.tsx (add auth provider)
└── src/middleware.ts (add auth middleware)
```

#### 4.3 Implementation Order
```
1. Create types and interfaces
2. Implement service layer
3. Create hooks
4. Build UI components
5. Integrate with app
6. Add tests
```

#### 4.4 Risk Assessment
- Potential breaking changes
- Integration risks
- Performance impact areas
- Security considerations

**Output:** Implementation Plan Document

**See:** [Planning Prompt](./prompts/04-planning.md)

---

### Phase 5: Code Implementation

**Slash Command:** `pa:implement`

**Purpose:** Write the actual code following the plan.

**Pre-Implementation Checklist:**
- [ ] Designs approved
- [ ] Requirements clear
- [ ] Existing patterns understood
- [ ] Test strategy defined

**Implementation Guidelines:**

#### Follow Project Conventions
```typescript
// Match existing naming patterns
const getUserData = async () => { ... }  // camelCase functions

// Match existing component patterns
export const UserProfile: FC<UserProfileProps> = ({ user }) => {
  // Same structure as other components
}
```

#### Quality Gates
- Follows project linting rules
- Type safety (TypeScript)
- No hardcoded values (use constants/env vars)
- Proper error handling
- Accessibility considerations

#### Implementation Commands
```bash
pa:implement                    # Start implementing current plan
pa:implement --step 1           # Implement specific step
pa:implement --file auth.ts     # Implement specific file
pa:implement --continue         # Continue from last point
```

**Output:** Implemented Feature Code

---

### Phase 6: Comprehensive Testing

**Slash Command:** `pa:test` or `pa:test-all`

**Purpose:** Ensure code quality through thorough testing.

**Test Types:**

#### 6.1 Unit Tests
```bash
pa:test-unit
```
- Test individual functions/components
- Mock external dependencies
- Cover edge cases
- Aim for high coverage

#### 6.2 Integration Tests
```bash
pa:test-integration
```
- Test component interactions
- Test API integrations
- Test data flow
- Test state management

#### 6.3 End-to-End Tests
```bash
pa:test-e2e
```
- Test complete user flows
- Test critical paths
- Cross-browser testing
- Accessibility testing

**Coverage Requirements:**

| Project Type | Unit | Integration | E2E |
|-------------|------|-------------|-----|
| Web Frontend | 80% | 60% | Critical flows |
| Full-stack | 80% | 70% | Critical flows |
| Mobile | 75% | 60% | Smoke tests |
| Backend/API | 85% | 75% | N/A |

**Test Pattern Matching:**
Tests should follow existing project patterns:
```typescript
// If project uses describe/it pattern
describe('AuthService', () => {
  it('should authenticate user with valid credentials', async () => {
    // test implementation
  });
});
```

**Output:** Test Suite + Coverage Report

---

### Phase 6.5: Code Review

**Slash Command:** `pa:review`

**Purpose:** Ensure code quality before deployment.

**Review Types:**

#### Automated Review
```bash
pa:review --auto
```
- Linting checks
- Static analysis
- Security scanning
- Performance analysis
- Bundle size impact

#### AI-Assisted Review
```bash
pa:review --ai
```
- Code quality assessment
- Pattern consistency check
- Security vulnerability scan
- Performance optimization suggestions
- Accessibility compliance

#### Self-Review Checklist
```markdown
- [ ] Code follows project conventions
- [ ] No hardcoded secrets
- [ ] Error handling is comprehensive
- [ ] Edge cases are handled
- [ ] No commented-out code
- [ ] No debug statements
- [ ] Tests are meaningful
- [ ] Documentation is complete
```

#### Peer Review
```bash
pa:review --pr
```
- Creates pull request
- Assigns reviewers
- Includes review context

**Output:** Code Review Report

**See:** [Review Checklist](./checklists/code-review.md)

---

### Phase 7: Documentation

**Slash Command:** `pa:doc` or `pa:doc-full`

**Purpose:** Create comprehensive documentation.

**Documentation Modes:**

| Mode | Command | Content Level |
|------|---------|---------------|
| Full | `pa:doc-full` | Complete docs with examples |
| Moderate | `pa:doc` | Balanced coverage |
| Lite | `pa:doc-lite` | Quick reference |

**Documentation Scopes:**

```bash
pa:doc                          # Full project documentation
pa:doc-module auth              # Document auth module
pa:doc-file src/utils/api.ts    # Document specific file
pa:doc-api                      # API documentation only
pa:doc-component Button         # Component documentation
```

**Documentation Includes:**
- Code documentation (JSDoc, docstrings)
- API documentation
- User documentation
- Architecture documentation
- README updates

**Output:** Complete Documentation

---

### Phase 8: Deployment Preparation

**Slash Command:** `pa:deploy` or `pa:deploy-staging`

**Purpose:** Prepare for deployment.

**Pre-Deployment Checklist:**
```markdown
- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Documentation complete
- [ ] Environment variables documented
- [ ] Migration scripts ready (if needed)
- [ ] Rollback plan prepared
- [ ] Monitoring configured
```

**Deployment Strategies:**

| Strategy | Description | Use Case |
|----------|-------------|----------|
| Blue-Green | Two identical environments | Zero-downtime deploys |
| Canary | Gradual rollout | Risk mitigation |
| Rolling | Incremental updates | Standard deploys |
| Feature Flag | Deploy code, enable later | Decouple deploy from release |

**Deployment Commands:**
```bash
pa:deploy-staging               # Deploy to staging
pa:deploy-prod                  # Deploy to production
pa:deploy-check                 # Pre-deployment validation
pa:deploy-status                # Check deployment status
```

**Output:** Deployment-Ready Package

---

### Phase 9: Rollback Strategy

**Slash Command:** `pa:rollback-plan`

**Purpose:** Prepare for potential rollbacks.

**Rollback Triggers:**
- Error rate increases > 5%
- Response time degrades > 50%
- Critical health checks fail
- User-reported critical bugs

**Rollback Types:**

#### Code Rollback
```bash
pa:rollback --to previous       # Rollback to previous version
pa:rollback --to v1.2.3         # Rollback to specific version
```

#### Database Rollback
```bash
pa:rollback-db --to migration-5 # Rollback database migrations
```

#### Infrastructure Rollback
```bash
pa:rollback-infra               # Revert infrastructure changes
```

**Rollback Time Targets:**

| Component | Target Time |
|-----------|-------------|
| Frontend | < 5 minutes |
| Backend API | < 10 minutes |
| Database | < 30 minutes |
| Full System | < 1 hour |

**Output:** Rollback Plan Document

---

## Flexible Entry Modes

Not every task requires the full workflow. ProAgents supports multiple entry modes.

### Mode Detection

When you start a task, the system detects the appropriate mode:

```
User: "Fix the login button not working"
→ Detected: Bug Fix Mode (Fast Track)

User: "Add dark mode to the app"
→ Detected: Full Feature Mode

User: "Update the API endpoint URL"
→ Detected: Quick Change Mode
```

### Available Modes

#### 1. Full Workflow Mode (Default)
```bash
pa:feature "Feature name"
```
All 10 phases for new features:
```
Init → Analysis → Requirements → Design → Plan →
Implement → Test → Review → Doc → Deploy
```

#### 2. Bug Fix Mode (Fast Track)
```bash
pa:fix "Bug description"
pa:fix-quick "Bug description"
```
Streamlined workflow:
```
Context Scan → Root Cause → Fix → Test → Commit
```

**Guardrails:**
- If fix touches > 3 files → Suggest full workflow
- If fix affects critical paths → Require review
- If fix duration > 2 hours → Prompt for planning

#### 3. Quick Change Mode (Hotfix)
```bash
pa:hotfix "Change description"
pa:quick "Change description"
```
Minimal workflow:
```
Change → Verify → Commit
```

**Use Cases:**
- Config changes
- URL updates
- Text fixes
- Simple bug fixes

#### 4. Resume Mode
```bash
pa:resume
pa:resume feature-auth
```
Continue work on a paused feature with full context.

### Mode Switching

You can switch modes mid-workflow:

```bash
# Started in bug fix mode, realized it's bigger
pa:upgrade-to-full

# Started full workflow, can simplify
pa:downgrade-to-quick
```

### Mode Configuration

```yaml
# proagents.config.yaml
entry_modes:
  allow_direct_implementation: true
  allow_bug_fix_fast_track: true
  allow_quick_changes: true

  guardrails:
    require_tests_always: true
    require_review_for_critical: true
    max_files_without_planning: 3

  auto_upgrade_on:
    - "changes_exceed_3_files"
    - "touches_security_code"
    - "modifies_database"
    - "changes_api_contract"
```

---

## Parallel Feature Development

ProAgents supports developing multiple features simultaneously.

### Feature Tracking

```
/proagents/active-features/
├── _index.json                    # Master list
├── feature-user-auth/
│   ├── status.json               # Machine-readable
│   ├── status.md                 # Human-readable
│   ├── files-modified.json       # Changed files
│   └── dependencies.json         # Feature dependencies
└── feature-dashboard/
    └── ...
```

### Conflict Detection

#### File-Level Conflicts
```
Feature A wants to modify: [file1.ts, file2.ts, file3.ts]
Feature B already modifying: [file2.ts, file4.ts]

⚠️ CONFLICT DETECTED: file2.ts
```

#### Conflict Actions

| Risk Level | Description | Action |
|------------|-------------|--------|
| Low | Different sections of same file | Proceed with caution |
| Medium | Same component/module | Coordinate changes |
| High | Same functions/logic | Sequential development required |

### Dependency Management

Features can declare dependencies:
```json
{
  "feature": "dashboard",
  "depends_on": [
    {
      "feature": "user-auth",
      "reason": "Needs auth context",
      "required_phase": "implementation_complete"
    }
  ]
}
```

### Merge Coordination

```bash
pa:feature-status              # View all active features
pa:feature-conflicts           # Check for conflicts
pa:feature-merge-order         # Recommended merge order
```

**Recommended Merge Order:**
```
1. feature-user-auth (no dependencies)
2. feature-dashboard (depends on user-auth)
3. feature-notifications (depends on dashboard)
```

### Parallel Development Dashboard

```
┌─────────────────────────────────────────────────────────┐
│ ProAgents Feature Tracker                               │
├─────────────────────────────────────────────────────────┤
│ Active Features: 3 / 3 (max)                            │
├─────────────────────────────────────────────────────────┤
│ ✅ user-auth      │ Phase 6/9 │ 70% │ No blockers      │
│ 🔄 dashboard      │ Phase 4/9 │ 40% │ Waiting: auth    │
│ ⏸️ notifications  │ Phase 2/9 │ 20% │ Blocked: schema  │
├─────────────────────────────────────────────────────────┤
│ Conflicts: 1 file (file2.ts - auth vs dashboard)        │
│ Recommended merge order: auth → dashboard → notifications│
└─────────────────────────────────────────────────────────┘
```

---

## Checkpoint System

Checkpoints are approval gates where the workflow pauses for user review.

### Configurable Checkpoints

```yaml
# proagents.config.yaml
checkpoints:
  after_analysis: true        # Pause after codebase analysis
  after_requirements: false   # Skip requirements checkpoint
  after_design: true          # Pause after UI design
  after_planning: false       # Skip planning checkpoint
  after_implementation: false # Skip implementation checkpoint
  after_testing: false        # Skip testing checkpoint
  before_deployment: true     # Pause before deploying
```

### Checkpoint Behavior

When a checkpoint is enabled:
```
Phase 3: Design completed
════════════════════════════════════════

Design Summary:
- 5 new components identified
- 2 existing components to modify
- 12 new style tokens needed

[Continue to Planning] [Revise Design] [View Details]
```

### Runtime Overrides

Override checkpoints when starting a feature:
```bash
# Skip all optional checkpoints
/feature-start "Feature" --auto

# Stop at every phase
/feature-start "Feature" --checkpoint=all

# Only critical checkpoints
/feature-start "Feature" --checkpoint=critical
```

### Custom Checkpoints

Add custom checkpoints for specific needs:
```yaml
checkpoints:
  custom:
    - name: "Security Review"
      after_phase: "implementation"
      condition: "touches_security_code"
      required: true
      reviewers: ["@security-team"]

    - name: "Performance Review"
      after_phase: "testing"
      condition: "performance_sensitive"
      required: false
```

---

## Self-Learning System

ProAgents continuously improves based on usage.

### What Gets Learned

#### User Preferences
- Checkpoint patterns (which ones you skip)
- Detail level preferences
- Common corrections to AI output
- Preferred coding patterns

#### Project Patterns
- Naming conventions
- Code style preferences
- Architecture patterns
- Testing patterns
- Error handling approaches

#### Common Corrections
```json
{
  "pattern": "suggested X approach",
  "correction": "use Y instead",
  "frequency": 5,
  "apply_automatically": true
}
```

### Learning Storage

```
/.proagents/.learning/
├── global/                   # Cross-project learnings
│   ├── user-preferences.json
│   └── common-patterns.json
└── projects/                 # Per-project learnings
    └── [project-hash]/
        ├── patterns.json
        ├── corrections.json
        └── metrics.json
```

### Adaptive Behavior

**Before Learning (First Use):**
```
AI: "What state management approach should we use?"
User: "Use Zustand, that's our standard"
```

**After Learning (Subsequent Use):**
```
AI: "I see this project uses Zustand for state management.
     I'll follow that pattern."
```

### Learning Configuration

```yaml
# proagents.config.yaml
learning:
  enabled: true
  track_preferences: true
  track_patterns: true
  track_corrections: true
  auto_apply_corrections: true

  # Privacy
  share_learnings_globally: false
  anonymize_metrics: true
```

### Learning Reports

```bash
pa:learning report             # View learning summary
pa:learning patterns           # View learned patterns
pa:learning corrections        # View auto-corrections
pa:learning reset              # Reset learning data
```

---

## Configuration

### Main Configuration File

```yaml
# proagents.config.yaml

project:
  name: "My Project"
  type: "fullstack"          # web-frontend | fullstack | mobile | backend

# Checkpoint configuration
checkpoints:
  after_analysis: true
  after_requirements: false
  after_design: true
  after_implementation: false
  after_testing: false
  before_deployment: true

# Git integration
git:
  enabled: true
  branch_prefix: "feature/"
  commit_convention: "conventional"
  require_pr: true

# Entry modes
entry_modes:
  allow_direct_implementation: true
  allow_bug_fix_fast_track: true
  allow_quick_changes: true
  require_tests_always: true
  max_files_without_planning: 3

# Parallel features
parallel_features:
  enabled: true
  max_concurrent: 3

# Learning system
learning:
  enabled: true
  track_preferences: true
  track_patterns: true
  auto_apply_corrections: true

# Documentation
documentation:
  default_mode: "moderate"
  include_diagrams: true

# Testing
testing:
  minimum_coverage: 80
  require_e2e_for_critical: true
```

### Environment-Specific Configuration

```yaml
# proagents.config.yaml
environments:
  development:
    checkpoints:
      before_deployment: false

  staging:
    checkpoints:
      before_deployment: true

  production:
    checkpoints:
      before_deployment: true
      require_approval: true
```

---

## Commands Reference

### Initialization Commands

| Command | Description |
|---------|-------------|
| `pa:init` | Initialize ProAgents in project |
| `pa:feature "name"` | Start new feature |
| `pa:fix "description"` | Start bug fix mode |
| `pa:hotfix "description"` | Start quick change mode |
| `pa:resume` | Resume paused feature |

### Phase Commands

| Command | Description |
|---------|-------------|
| `pa:analyze` | Run codebase analysis |
| `pa:requirements` | Gather requirements |
| `pa:design` | Start design phase |
| `pa:plan` | Create implementation plan |
| `pa:implement` | Start implementation |
| `pa:test` | Run tests |
| `pa:review` | Code review |
| `pa:doc` | Generate documentation |
| `pa:deploy` | Deploy preparation |
| `pa:rollback-plan` | Create rollback plan |

### Navigation Commands

| Command | Description |
|---------|-------------|
| `pa:status` | View current status |
| `pa:next` | Move to next phase |
| `pa:back` | Go back to previous phase |
| `pa:skip` | Skip current phase |
| `pa:skip-to [phase]` | Skip to specific phase |

### Feature Management

| Command | Description |
|---------|-------------|
| `pa:feature-list` | List all features |
| `pa:feature-status` | Feature status dashboard |
| `pa:feature-conflicts` | Check for conflicts |
| `pa:feature-pause` | Pause current feature |
| `pa:feature-switch [name]` | Switch to another feature |

### Configuration Commands

| Command | Description |
|---------|-------------|
| `pa:config` | View configuration |
| `pa:config set [key] [value]` | Set config value |
| `pa:config reset` | Reset to defaults |

### Help Commands

| Command | Description |
|---------|-------------|
| `pa:help` | Show help |
| `pa:help [command]` | Help for specific command |
| `pa:commands` | List all commands |

---

## Best Practices

### 1. Always Analyze First
For existing projects, run analysis before making changes:
```bash
pa:analyze
```

### 2. Use Appropriate Entry Mode
- New features → Full Workflow
- Bug fixes → Bug Fix Mode
- Config changes → Quick Change Mode

### 3. Configure Meaningful Checkpoints
Enable checkpoints for phases that need human review:
```yaml
checkpoints:
  after_design: true      # Review designs
  before_deployment: true # Final verification
```

### 4. Follow Project Patterns
Let the AI learn and follow existing patterns rather than introducing new ones.

### 5. Document as You Go
Use `pa:doc` after significant changes, not just at the end.

### 6. Test Continuously
Run tests frequently during implementation:
```bash
pa:test --watch
```

### 7. Review Before Commit
Always run review before committing:
```bash
pa:review
```

---

## Troubleshooting

### Common Issues

**Issue:** Analysis is too slow
```bash
pa:analyze-lite    # Use lite analysis for quick overview
```

**Issue:** Conflicts with another feature
```bash
pa:feature-conflicts     # Check conflicts
pa:feature-merge-order   # Get recommended order
```

**Issue:** Wrong mode detected
```bash
pa:upgrade-to-full       # Switch to full workflow
pa:downgrade-to-quick    # Switch to quick mode
```

**Issue:** Learning gave wrong suggestion
```bash
pa:learning correct      # Provide correction
pa:learning reset        # Reset learned patterns
```

---

## Next Steps

1. **Configure:** Set up [proagents.config.yaml](./proagents.config.yaml)
2. **Learn Commands:** Review [Commands Reference](./cli/slash-commands.md)
3. **Start Building:** Run `pa:feature "Your first feature"`
4. **Customize:** Set up [Standards](./standards/) for your project

---

## Related Documentation

- [Getting Started Guide](./getting-started/)
- [Configuration Reference](./proagents.config.yaml)
- [Prompts Reference](./prompts/)
- [Templates](./templates/)
- [Examples](./examples/)
