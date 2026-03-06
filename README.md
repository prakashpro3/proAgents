# ProAgents

**AI-Agnostic Development Workflow Framework**

A portable, universal development workflow framework that works with **any AI platform** (Claude, ChatGPT, Gemini, Cursor, Copilot, etc.) and enables **multi-AI collaboration** on the same project.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/proagents.svg)](https://www.npmjs.com/package/proagents)

---

## Installation

```bash
# Initialize in your project
npx proagents init

# Or with a template
npx proagents init --template nextjs-saas

# Install globally (optional)
npm install -g proagents
```

---

## Quick Start

### 1. Initialize ProAgents

```bash
cd your-project
npx proagents init
```

This creates a `./proagents/` folder with workflow files, and prompts for:
- Project name and type (auto-detected)
- Tech stack (API style, database, styling, auth, etc.)
- AI platforms to use (Claude, Cursor, Gemini, etc.)

### 2. Use Commands in Any AI

Type `pa:` commands in your AI assistant:

```
pa:feature "Add user authentication"
pa:fix "Login button not working"
pa:status
```

### 3. AI Follows the Guided Workflow

```
Init → Analysis → Requirements → Design → Planning →
Implementation → Testing → Review → Documentation → Deployment
```

---

## Features

### Multi-AI Collaboration

Multiple AIs can work on the same project without conflicts:

| Feature | Description |
|---------|-------------|
| **Activity Log** | Track what each AI does with model name |
| **Lock File** | Prevent conflicts during major work |
| **Handoff Notes** | Pass context between AI sessions |
| **Conflict Detection** | Warn before overwriting another AI's changes |
| **Session Summaries** | Auto-generate summary at session end |

### Project Templates

Pre-configured settings for common stacks:

```bash
npx proagents init --template nextjs-saas      # Next.js SaaS
npx proagents init --template react-spa        # React SPA
npx proagents init --template react-native-app # React Native
npx proagents init --template express-api      # Express API
npx proagents init --template nestjs-api       # NestJS API
npx proagents init --template vue-spa          # Vue.js SPA
npx proagents init --template python-fastapi   # Python FastAPI

npx proagents init --list-templates            # Show all templates
```

### AI Learning & Feedback

- **Feedback Log** - AI learns from corrections, doesn't repeat mistakes
- **Error Tracker** - Log errors and solutions for future reference
- **Decision Log** - Track architectural decisions with reasoning
- **Context File** - Persistent project knowledge AI reads every session

### File Protection

- **Watch List** - Critical files require confirmation before AI modifies
- Never auto-modify `.env`, config files, migrations, etc.

---

## CLI Commands

```bash
# Initialization
npx proagents init                    # Initialize in project
npx proagents init --template <name>  # Use a project template
npx proagents init --list-templates   # List available templates

# Features & Fixes
proagents feature start "name"        # Start a new feature
proagents feature status              # Check feature status
proagents fix "bug description"       # Quick bug fix mode

# Maintenance
proagents doctor                      # Health check installation
proagents upgrade                     # Upgrade to latest version
proagents status                      # Show ProAgents status

# AI Platforms
proagents ai list                     # List installed AI platforms
proagents ai add                      # Add more platforms
proagents ai remove                   # Remove platforms

# Configuration
proagents config show                 # Show current config
proagents config setup                # Interactive config wizard

# Other
proagents docs                        # Open documentation
proagents commands                    # Show all commands
proagents uninstall                   # Remove ProAgents
```

---

## AI Commands (pa:)

Type these in any AI assistant (Claude, ChatGPT, Gemini, Cursor, etc.):

### Quick Aliases
| Alias | Expands To |
|-------|------------|
| `pa:f` | `pa:feature` |
| `pa:s` | `pa:status` |
| `pa:h` | `pa:help` |
| `pa:d` | `pa:doc` |
| `pa:t` | `pa:test` |
| `pa:q` | `pa:qa` |
| `pa:a` | `pa:analyze` |
| `pa:r` | `pa:requirements` |
| `pa:p` | `pa:plan` |
| `pa:i` | `pa:implement` |

### Core Commands
| Command | Description |
|---------|-------------|
| `pa:feature "name"` | Start new feature workflow (all phases) |
| `pa:fix "description"` | Quick bug fix mode |
| `pa:status` | Show current progress |
| `pa:help` | Show all commands |

### Workflow Phase Commands
| Command | Phase | Description |
|---------|-------|-------------|
| `pa:analyze` | Analysis | Deep codebase analysis |
| `pa:requirements` | Requirements | Gather feature requirements |
| `pa:design` | Design | UI/Architecture design |
| `pa:plan` | Planning | Create implementation plan |
| `pa:implement` | Implementation | Execute code changes |
| `pa:test` | Testing | Create and run tests |
| `pa:review` | Review | Code review workflow |
| `pa:doc` | Documentation | Generate documentation |
| `pa:deploy` | Deployment | Deployment preparation |

### Documentation
| Command | Description |
|---------|-------------|
| `pa:doc` | Generate documentation |
| `pa:changelog` | Update CHANGELOG.md |
| `pa:release` | Generate release notes |

### Quality & Testing
| Command | Description |
|---------|-------------|
| `pa:qa` | Run quality assurance checks |
| `pa:rollback` | Rollback procedures |

### Multi-AI Collaboration
| Command | Description |
|---------|-------------|
| `pa:activity` | Show recent AI activity |
| `pa:lock` | Show/check lock status |
| `pa:lock-release` | Release your lock |
| `pa:handoff` | Create handoff notes for next AI |
| `pa:handoff-read` | Read handoff notes |
| `pa:session-end` | Generate session summary |

### Learning & Tracking
| Command | Description |
|---------|-------------|
| `pa:decision "title"` | Log architectural decision |
| `pa:decisions` | Show all decisions |
| `pa:error "description"` | Log error and solution |
| `pa:errors` | Search past errors |
| `pa:feedback "description"` | Log feedback for AI learning |

### AI Platform Management
| Command | Description |
|---------|-------------|
| `pa:ai-list` | List installed AI platforms |
| `pa:ai-add` | Add more AI platforms |
| `pa:ai-sync` | Sync config with files |

### Navigation & Flow
| Command | Description |
|---------|-------------|
| `pa:next` | Show next step in workflow |
| `pa:resume` | Resume paused feature |
| `pa:skip` | Skip current phase |
| `pa:back` | Go to previous phase |
| `pa:progress` | Show visual progress bar |

### Context & History
| Command | Description |
|---------|-------------|
| `pa:context` | View project context |
| `pa:diff` | Show changes since last session |
| `pa:history` | Show command history |
| `pa:checkpoint` | Create restore point |
| `pa:undo` | Undo last action |

### Sprint & Estimation
| Command | Description |
|---------|-------------|
| `pa:sprint-start` | Start new sprint |
| `pa:sprint-end` | End sprint with summary |
| `pa:estimate` | Estimate task complexity |
| `pa:velocity` | Show velocity metrics |

### Integration
| Command | Description |
|---------|-------------|
| `pa:github` | GitHub integration |
| `pa:github-pr` | Create pull request |
| `pa:jira` | Sync with Jira |
| `pa:notify` | Send notification |

### Code Quality
| Command | Description |
|---------|-------------|
| `pa:metrics` | Code quality metrics |
| `pa:coverage` | Test coverage report |
| `pa:deps` | Analyze dependencies |
| `pa:deps-outdated` | Find outdated packages |
| `pa:deps-security` | Security scan |

### Code Generation
| Command | Description |
|---------|-------------|
| `pa:generate` | Show generation options |
| `pa:generate-component` | Generate component |
| `pa:generate-api` | Generate API endpoint |
| `pa:generate-test` | Generate test file |

### Refactoring
| Command | Description |
|---------|-------------|
| `pa:refactor` | Suggest refactoring |
| `pa:rename` | Rename across codebase |
| `pa:extract` | Extract function/component |
| `pa:cleanup` | Remove dead code |

### Time Tracking
| Command | Description |
|---------|-------------|
| `pa:time-start` | Start time tracking |
| `pa:time-stop` | Stop tracking |
| `pa:time-report` | Show time report |

### Environment & Database
| Command | Description |
|---------|-------------|
| `pa:env-check` | Verify environment |
| `pa:secrets-scan` | Scan for secrets |
| `pa:db-migrate` | Run migrations |
| `pa:db-seed` | Seed database |

### Accessibility & Performance
| Command | Description |
|---------|-------------|
| `pa:a11y` | Accessibility audit |
| `pa:lighthouse` | Lighthouse audit |
| `pa:perf` | Performance analysis |

### Export & Learning
| Command | Description |
|---------|-------------|
| `pa:export` | Export config/data |
| `pa:import` | Import data |
| `pa:backup` | Backup proagents |
| `pa:learn` | Teach AI a pattern |
| `pa:suggestions` | Show AI suggestions |

### API & Documentation
| Command | Description |
|---------|-------------|
| `pa:api-docs` | Generate OpenAPI/Swagger docs |
| `pa:storybook` | Generate Storybook stories |
| `pa:readme` | Auto-generate/update README |
| `pa:types` | Generate TypeScript types |

### Git Advanced
| Command | Description |
|---------|-------------|
| `pa:branch` | Branch management |
| `pa:merge` | Smart merge with conflict preview |
| `pa:conflict` | Resolve merge conflicts with AI |
| `pa:changelog-gen` | Auto-generate changelog |

### Search & Code Navigation
| Command | Description |
|---------|-------------|
| `pa:find` | Find code patterns/usage |
| `pa:todo` | Find all TODOs in code |
| `pa:fixme` | Find FIXMEs and critical issues |
| `pa:unused` | Find unused code/exports |

### Code Analysis
| Command | Description |
|---------|-------------|
| `pa:complexity` | Cyclomatic complexity analysis |
| `pa:duplication` | Find duplicate code blocks |
| `pa:hotspots` | Find frequently changed files |

### Testing Advanced
| Command | Description |
|---------|-------------|
| `pa:test-e2e` | Create/run E2E tests |
| `pa:test-unit` | Generate unit tests |
| `pa:mock` | Generate mocks/stubs |
| `pa:snapshot` | Snapshot testing management |

### DevOps & Infrastructure
| Command | Description |
|---------|-------------|
| `pa:docker` | Docker commands |
| `pa:ci` | CI/CD pipeline management |
| `pa:deploy-preview` | Deploy preview environment |

### Release Management
| Command | Description |
|---------|-------------|
| `pa:version` | Show/bump version |
| `pa:tag` | Create git tag |
| `pa:publish` | Publish package to registry |

### Code Review & PR
| Command | Description |
|---------|-------------|
| `pa:review-request` | Request code review from team |
| `pa:review-comments` | Show PR review comments |
| `pa:review-approve` | Approve current PR |

### Architecture
| Command | Description |
|---------|-------------|
| `pa:architecture` | Show architecture overview |
| `pa:architecture-diagram` | Generate diagram (Mermaid) |
| `pa:architecture-export` | Export diagram (SVG/PNG) |

### API Testing
| Command | Description |
|---------|-------------|
| `pa:api-test` | Test API endpoints |
| `pa:curl` | Generate curl commands |
| `pa:postman` | Generate Postman collection |

### Health & Monitoring
| Command | Description |
|---------|-------------|
| `pa:health` | Project health check |
| `pa:monitor` | Show monitoring status |
| `pa:uptime` | Service uptime check |

### Quick Actions
| Command | Description |
|---------|-------------|
| `pa:quick` | Show quick actions menu |
| `pa:alias` | Manage command aliases |
| `pa:alias-add` | Add custom alias |
| `pa:alias-remove` | Remove custom alias |

### Custom Commands
| Command | Description |
|---------|-------------|
| `pa:standup` | Generate daily standup |
| `pa:tech-debt` | Scan for technical debt |
| `pa:security-scan` | Run security checklist |

Define your own in `./proagents/custom-commands.yaml`

---

## Key Files

After initialization, these files help AI understand your project:

| File | Purpose | AI Should |
|------|---------|-----------|
| `proagents/context.md` | Persistent project knowledge | **Read first every session!** |
| `proagents/feedback.md` | Past corrections & preferences | Learn from mistakes |
| `proagents/watchlist.yaml` | Protected files list | Ask before modifying |
| `proagents/activity.log` | AI activity history | Check for conflicts |
| `proagents/decisions.md` | Architectural decisions | Understand why choices were made |
| `proagents/errors.md` | Past errors & solutions | Find solutions faster |
| `proagents/handoff.md` | Handoff notes | Continue where another AI left off |

---

## Project Structure

```
your-project/
├── proagents/
│   ├── proagents.config.yaml   # Project configuration
│   ├── AI_INSTRUCTIONS.md      # Instructions for all AIs
│   ├── PROAGENTS.md            # Quick command reference
│   ├── context.md              # Persistent project context
│   ├── feedback.md             # AI learning from corrections
│   ├── watchlist.yaml          # Protected files
│   ├── activity.log            # AI activity log
│   ├── decisions.md            # Decision log
│   ├── errors.md               # Error tracker
│   ├── handoff.md              # Handoff notes
│   ├── custom-commands.yaml    # Custom pa: commands
│   ├── sessions/               # Session summaries
│   ├── active-features/        # Feature tracking
│   ├── prompts/                # Workflow prompts
│   ├── templates/              # Document templates
│   ├── checklists/             # Quality checklists
│   └── ...
├── CLAUDE.md                   # Claude-specific instructions
├── .cursorrules                # Cursor-specific instructions
├── GEMINI.md                   # Gemini-specific instructions
└── proagents.config.yaml       # Main config (project root)
```

---

## Configuration

`proagents.config.yaml` stores your project settings:

```yaml
project:
  name: my-app
  type: nextjs

automation:
  decisions:
    architecture:
      api_style: rest
      state_management: zustand
      styling: tailwind
      database: postgresql
      orm: prisma
      auth_method: jwt
    testing:
      framework: vitest
      coverage_target: 80

platforms:
  - claude
  - cursor
  - copilot
```

---

## Supported AI Platforms

| Platform | Instruction File |
|----------|-----------------|
| Claude Code | `CLAUDE.md` |
| Cursor | `.cursorrules` |
| Windsurf | `.windsurfrules` |
| GitHub Copilot | `.github/copilot-instructions.md` |
| ChatGPT | `CHATGPT.md` |
| Gemini | `GEMINI.md` |
| Bolt | `BOLT.md` |
| Lovable | `LOVABLE.md` |
| Replit | `REPLIT.md` |
| Kiro | `KIRO.md` |
| Groq | `GROQ.md` |

---

## Integrations

**Project Management:** Jira, Linear, GitHub Issues, GitLab Issues, Asana, Trello, Notion

**Version Control:** GitHub, GitLab

**Communication:** Slack

**CI/CD:** GitHub Actions, GitLab CI, Jenkins, Azure DevOps

---

## Documentation

| Document | Description |
|----------|-------------|
| [Getting Started Story](./proagents/GETTING-STARTED-STORY.md) | Narrative walkthrough |
| [Complete Workflow](./proagents/WORKFLOW.md) | 10-phase workflow guide |
| [AI Instructions](./proagents/AI_INSTRUCTIONS.md) | Full AI command reference |
| [Examples](./proagents/examples/) | Project-specific walkthroughs |

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## License

MIT License - see [LICENSE](LICENSE) file.

---

**Built for developers who want AI collaboration without vendor lock-in.**

*Co-authored with Claude (Anthropic)*
