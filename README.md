# ProAgents

**AI-Agnostic Development Workflow Framework**

A portable, universal development workflow framework that works with **any AI platform** (Claude, ChatGPT, Gemini, Cursor, Copilot, etc.) and enables **multi-AI collaboration** on the same project.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/proagents.svg)](https://www.npmjs.com/package/proagents)

---

## Why ProAgents?

- **AI-Agnostic**: Works with Claude, ChatGPT, Gemini, Cursor, Copilot - switch AI tools anytime without losing context
- **Multi-AI Collaboration**: Multiple AIs can work on the same project with shared context and conflict detection
- **Guided Workflow**: 10-phase development process from Analysis to Deployment with quality gates
- **Learning System**: AI learns from your corrections and never repeats the same mistakes

---

## Installation

No install required. Just run:

```bash
npx proagents init
```

Or with a template:

```bash
npx proagents init --template nextjs-saas
```

---

## Quick Start

### 1. Initialize ProAgents

```bash
cd your-project
npx proagents init
```

**What happens:**
- Creates `./.proagents/` folder with workflow files
- Prompts for project name and type (auto-detected)
- Prompts for tech stack (API style, database, styling, auth)
- Creates AI instruction files (CLAUDE.md, .cursorrules, etc.)

### 2. Use Commands in Any AI

Open your AI assistant (Claude, ChatGPT, Cursor, etc.) and type:

```
pa:feature "Add user authentication"
```

**What happens:**
- AI loads project context automatically
- Guides you through 10-phase workflow
- Logs all changes for other AIs to see

### 3. See Progress

```
pa:status
```

**Example output:**
```
Feature: Add user authentication
Phase: Implementation (5/10)
Progress: ████████░░░░ 50%
Next: pa:test
```

---

## Features

### Multi-AI Collaboration & Cross-AI Continuity

Multiple AIs can work on the same project with full context sharing:

| Feature | Description |
|---------|-------------|
| **Auto Context Loading** | AI automatically loads context on first command |
| **Auto Change Logging** | Every code change logged automatically |
| **Feature Changelogs** | Per-feature change history |
| **Module Changelogs** | Per-module change history |
| **Conflict Detection** | Warns if files modified by other AI |
| **Activity Log** | Track what each AI does with model name |
| **Smart Context Summary** | Auto-generated 5-line summary at top of context |
| **Context Changed Alert** | Warns if another AI worked since your last session |
| **Test Status Tracking** | Auto-updates test status after every test run |
| **Feature Progress** | Auto-calculates progress from tasks |
| **AI Performance Stats** | Tracks sessions, tasks, reverts per AI platform |
| **Quick Undo (pa:undo-last)** | Revert last AI's entire session changes |
| **Auto-Archive Old Logs** | Automatically archives logs older than 7 days |

```bash
# Just start working - context loads automatically!
pa:feature "add login"    # AI auto-loads context, then works
pa:fix "bug in auth"      # AI auto-loads context, then fixes

# No manual pa:sync needed - it's automatic
# No manual pa:session-end needed - changes logged automatically

# Undo another AI's work if needed
pa:undo-last              # Revert last AI's entire session
```

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

### Full Automation

ProAgents follows **"ALWAYS DO, NEVER JUST TELL"** principle:

| Instead of | ProAgents does |
|------------|----------------|
| "Run `npm test`" | Actually runs the tests |
| "Create a test file" | Creates the file |
| "Fix the bug by..." | Fixes the bug directly |
| "Next steps: 1. 2. 3." | Does all steps automatically |

**Auto-fix intelligence:**
- Learns from previous fixes
- Applies known patterns automatically
- Stores successful fixes in `.proagents/.learning/`

### File Protection

- **Watch List** - Critical files require confirmation before AI modifies
- Never auto-modify `.env`, config files, migrations, etc.

---

## CLI Commands

```bash
# Initialize
npx proagents init                    # Initialize or update ProAgents
npx proagents init --template <name>  # Use a project template

# Daily Use
proagents status                      # Show ProAgents status
proagents doctor                      # Health check installation
proagents stats                       # Show project & AI usage stats

# AI Platforms
proagents ai list                     # List installed AI platforms
proagents ai add                      # Add more platforms

# Release
proagents release                     # Generate release notes
proagents release --changelog         # Update CHANGELOG.md
```

Run `proagents commands` for the full list of CLI commands.

---

## Essential AI Commands (pa:)

Type these in any AI assistant (Claude, ChatGPT, Gemini, Cursor, etc.):

| Command | Description |
|---------|-------------|
| `pa:feature "name"` | Start new feature workflow (all phases) |
| `pa:fix "description"` | Quick bug fix mode |
| `pa:status` | Show current progress |
| `pa:sync` | Load project context (usually auto) |
| `pa:test` | Run tests |
| `pa:review` | Code review workflow |
| `pa:deploy` | Deployment preparation |
| `pa:help` | Show all commands |
| `pa:undo-last` | Revert last AI's changes |
| `pa:handoff` | Create notes for another AI |

**Quick aliases:** `pa:f` (feature), `pa:s` (status), `pa:t` (test), `pa:h` (help)

For the complete command reference (100+ commands), see **[COMMANDS.md](COMMANDS.md)**.

---

## Key Files

After initialization, these files help AI understand your project:

| File | Purpose | AI Should |
|------|---------|-----------|
| `.proagents/context.md` | Persistent project knowledge | **Read first every session!** |
| `.proagents/feedback.md` | Past corrections & preferences | Learn from mistakes |
| `.proagents/watchlist.yaml` | Protected files list | Ask before modifying |
| `.proagents/activity.log` | AI activity history | Check for conflicts |
| `.proagents/decisions.md` | Architectural decisions | Understand why choices were made |
| `.proagents/errors.md` | Past errors & solutions | Find solutions faster |
| `.proagents/handoff.md` | Handoff notes | Continue where another AI left off |

---

## Supported AI Platforms

ProAgents works with **any AI that has agentic capability** (can read files and execute commands). Pre-configured instruction files are available for:

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

**Using a different AI?** Point it to `.proagents/AI_INSTRUCTIONS.md` - it contains everything needed to work with ProAgents.

---

## Documentation

| Document | Description |
|----------|-------------|
| [Getting Started Story](./.proagents/GETTING-STARTED-STORY.md) | Narrative walkthrough |
| [Complete Workflow](./.proagents/WORKFLOW.md) | 10-phase workflow guide |
| [AI Instructions](./.proagents/AI_INSTRUCTIONS.md) | Full AI command reference |
| [Examples](./.proagents/examples/) | Project-specific walkthroughs |

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## License

MIT License - see [LICENSE](LICENSE) file.

---

**Built for developers who want AI collaboration without vendor lock-in.**

*Co-authored with Claude (Anthropic)*
