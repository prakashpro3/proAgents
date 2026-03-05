# ProAgents - AI Development Workflow

> **IMPORTANT:** Read this file completely before starting any development task.
> This file enables you (the AI) to understand and execute ProAgents commands.

---

## What is ProAgents?

ProAgents is a development workflow framework. When the user types a command like `/feature-start` or `/fix`, you should execute the corresponding workflow defined below.

---

## Available Commands

### Feature Development

| Command | Action |
|---------|--------|
| `/init` | Initialize ProAgents (already done if you're reading this) |
| `/feature-start "name"` | Start a new feature with full workflow |
| `/feature-status` | Show current feature progress |
| `/feature-list` | List all active features |
| `/feature-complete` | Mark current feature as complete |

### Bug Fixes & Quick Changes

| Command | Action |
|---------|--------|
| `/fix "description"` | Quick bug fix mode |
| `/hotfix "description"` | Emergency fix (minimal process) |

### Quality & Testing

| Command | Action |
|---------|--------|
| `/qa` | Run quality assurance checks |
| `/test` | Run/create tests for current work |
| `/review` | Code review current changes |

### Documentation

| Command | Action |
|---------|--------|
| `/doc` | Generate documentation |
| `/doc-release` | Generate release notes (saves to ./RELEASE_NOTES.md) |
| `/doc-changelog` | Update changelog (saves to ./CHANGELOG.md) |

### Status & Help

| Command | Action |
|---------|--------|
| `/status` | Show ProAgents and project status |
| `/help` | Show available commands |

---

## Workflow Phases

When user starts a feature with `/feature-start`, follow these 10 phases:

```
Phase 1: Init          → Create feature branch, setup tracking
Phase 2: Analysis      → Analyze existing codebase
Phase 3: Requirements  → Gather and document requirements
Phase 4: Design        → UI/UX and architecture design
Phase 5: Planning      → Create implementation plan
Phase 6: Implementation → Write code following project patterns
Phase 7: Testing       → Create and run tests
Phase 8: Review        → Code review and quality checks
Phase 9: Documentation → Update docs, changelog
Phase 10: Deployment   → Prepare for deployment
```

### Phase Execution

For each phase:
1. Read the detailed prompt from `./proagents/prompts/XX-phase.md`
2. Execute the phase
3. Save outputs to `./proagents/active-features/[feature-name]/`
4. Move to next phase

---

## Command Execution Guide

### /feature-start "feature name"

```
1. Create feature directory: ./proagents/active-features/feature-[slug]/
2. Create status.json with: {name, current_phase: "init", started: now}
3. Analyze existing codebase (check ./proagents/cache/ for cached analysis)
4. Ask user for requirements or extract from feature name
5. Proceed through phases, updating status.json at each step
```

### /fix "bug description"

```
1. Identify affected files from description
2. Analyze the bug (check recent changes if needed)
3. Implement minimal fix
4. Test the fix
5. Update ./CHANGELOG.md with fix entry
6. Commit changes
```

### /qa

```
1. Check code quality (linting, formatting)
2. Run existing tests
3. Check for security issues
4. Review for common problems
5. Report findings
```

### /status

```
1. Check ./proagents/active-features/ for active features
2. Read status.json from each feature
3. Report:
   - Active features and their phases
   - Overall project status
   - Any blockers or issues
```

### /doc-release

```
1. Gather changes since last release (git log, changelog)
2. Generate client-friendly release notes
3. Save to ./RELEASE_NOTES.md (root - shareable with clients)
4. Also save version-specific notes to ./docs/releases/v[VERSION].md
```

### /help

```
Show available commands (list from this file)
```

---

## Project Structure

```
project/
├── PROAGENTS.md              ← This file (AI instructions)
├── CHANGELOG.md              ← Client-facing changelog
├── RELEASE_NOTES.md          ← Client-facing release notes
├── docs/
│   └── releases/             ← Version-specific release notes
│
└── proagents/
    ├── active-features/      ← Feature tracking
    │   └── feature-xxx/
    │       ├── status.json   ← Current phase, progress
    │       ├── requirements.md
    │       └── ...
    ├── prompts/              ← Detailed prompts for each phase
    ├── templates/            ← Document templates
    ├── cache/                ← Codebase analysis cache
    └── .learning/            ← AI learning data
```

---

## Configuration

Check `./proagents/proagents.config.yaml` for:
- Checkpoint settings (which phases need user approval)
- Testing requirements
- Git conventions
- Team preferences

---

## Important Rules

1. **Follow existing patterns:** Before writing code, analyze existing codebase
2. **Document everything:** Update changelog and docs for all changes
3. **Test your work:** Create tests for new features and fixes
4. **Client-facing docs at root:** CHANGELOG.md, RELEASE_NOTES.md go in project root
5. **Internal docs in proagents/:** Feature tracking, analysis, learning data

---

## Quick Reference

**Start working:**
```
User: /feature-start "add user authentication"
AI: [Creates feature, starts Phase 1, guides through workflow]
```

**Fix a bug:**
```
User: /fix "login button not responding"
AI: [Analyzes, fixes, tests, updates changelog]
```

**Check status:**
```
User: /status
AI: [Shows active features, current phases, project health]
```

**Generate release notes:**
```
User: /doc-release
AI: [Creates client-friendly release notes at ./RELEASE_NOTES.md]
```

---

*ProAgents - AI-Agnostic Development Workflow Framework*
*https://github.com/prakashpro3/proAgents*
