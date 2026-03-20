# ProAgents Commands

Quick reference for all `pa:` commands.

## Quick Aliases

`pa:f` → feature | `pa:s` → status | `pa:h` → help | `pa:d` → doc | `pa:t` → test | `pa:q` → qa | `pa:a` → analyze | `pa:r` → requirements | `pa:p` → plan | `pa:i` → implement

---

## Core Commands

| Command | Description |
|---------|-------------|
| `pa:help` | Show all commands with examples |
| `pa:feature "name"` | Start new feature workflow |
| `pa:fix "description"` | Quick bug fix |
| `pa:status` | Show current progress |
| `pa:project-setup` | Interactive project setup |

## Workflow Phases

| Command | Description |
|---------|-------------|
| `pa:analyze` | Code analysis |
| `pa:requirements` | Gather requirements |
| `pa:design` | UI/Architecture design |
| `pa:plan` | Implementation plan |
| `pa:implement` | Write code |
| `pa:test` | Run tests |
| `pa:review` | Code review |
| `pa:doc` | Documentation |
| `pa:deploy` | Deployment checklist |

## AI Platform Management

| Command | Prompt File |
|---------|-------------|
| `pa:ai-list` | `./prompts/ai-list.md` |
| `pa:ai-add` | `./prompts/ai-add.md` |
| `pa:ai-remove` | `./prompts/ai-remove.md` |
| `pa:ai-sync` | `./prompts/ai-sync.md` |

## Navigation

| Command | Description |
|---------|-------------|
| `pa:next` | Next step in workflow |
| `pa:resume` | Resume last session |
| `pa:skip` | Skip current phase |
| `pa:back` | Go to previous phase |
| `pa:progress` | Show progress |

## Multi-AI Collaboration

| Command | Description |
|---------|-------------|
| `pa:activity` | Show all AI activity |
| `pa:lock` | Check lock status |
| `pa:lock-release` | Release lock |
| `pa:handoff` | Create handoff notes |
| `pa:session-end` | End session with summary |

## Quality & Testing

| Command | Description |
|---------|-------------|
| `pa:qa` | Quality dashboard |
| `pa:metrics` | Code metrics |
| `pa:coverage` | Test coverage |
| `pa:a11y` | Accessibility audit |
| `pa:perf` | Performance analysis |

## Code Generation

| Command | Description |
|---------|-------------|
| `pa:generate-component "name"` | Generate component |
| `pa:generate-api "name"` | Generate API endpoint |
| `pa:generate-test "file"` | Generate test file |

## Refactoring

| Command | Description |
|---------|-------------|
| `pa:refactor` | Suggest refactoring |
| `pa:rename "old" "new"` | Rename across codebase |
| `pa:cleanup` | Remove dead code |

## Git & Release

| Command | Description |
|---------|-------------|
| `pa:changelog` | Update CHANGELOG.md |
| `pa:release` | Generate release notes |
| `pa:version` | Show/bump version |
| `pa:github-pr` | Create pull request |

## Research & Development

| Command | Description |
|---------|-------------|
| `pa:rnd` | R&D workflow |
| `pa:rnd-compare` | Compare solutions |
| `pa:rnd-poc` | Build prototype |

## Learning & Feedback

| Command | Description |
|---------|-------------|
| `pa:learn "pattern"` | Teach AI a pattern |
| `pa:feedback "desc"` | Log feedback |
| `pa:decision "title"` | Log decision |
| `pa:error "desc"` | Log error & solution |

---

## Full Documentation

For complete instructions, auto-sync protocol, and workflows:

| File | Purpose |
|------|---------|
| `.proagents/AI_INSTRUCTIONS.md` | Complete AI instructions |
| `.proagents/WORKFLOW.md` | Full 10-phase workflow |
| `.proagents/prompts/` | Phase-specific prompts |
