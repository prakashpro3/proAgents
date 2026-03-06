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
