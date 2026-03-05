# ProAgents

**AI-Agnostic Development Workflow Framework**

A portable, universal development workflow framework that automates the full software development lifecycle. Works with **any AI platform** (Claude, ChatGPT, Gemini, Copilot, etc.) and **any IDE**.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/proagents.svg)](https://www.npmjs.com/package/proagents)

---

## Installation

```bash
# Install globally
npm install -g proagents

# Or use directly with npx
npx proagents init
```

---

## Why ProAgents?

- **No vendor lock-in** - Switch AI platforms without changing your workflow
- **Full lifecycle automation** - From requirements to deployment
- **Self-learning** - Adapts to your coding patterns and preferences
- **Flexible entry points** - Full workflow, bug fix mode, or quick changes

---

## Quick Start

### 1. Initialize ProAgents in your project

```bash
cd your-project
npx proagents init
```

### 2. Start a feature

**Using CLI:**
```bash
proagents feature start "Add user authentication"
```

**Using AI assistant (Claude, ChatGPT, etc.):**
```
pa:feature "Add user authentication"
```

### 3. Follow the guided workflow

The AI guides you through 10 phases:

```
Init → Analysis → Requirements → Design → Planning →
Implementation → Testing → Review → Documentation → Deployment
```

---

## CLI Commands

```bash
proagents init                      # Initialize in current project
proagents feature start "name"      # Start a new feature
proagents feature status            # Check feature status
proagents fix "bug description"     # Quick bug fix mode
proagents status                    # Show ProAgents status
proagents docs                      # Open documentation
proagents commands                  # Show all commands
```

---

## Key Features

| Feature | Description |
|---------|-------------|
| **AI Agnostic** | Works with Claude, ChatGPT, Gemini, Copilot, and more |
| **IDE Agnostic** | VS Code, JetBrains, Cursor, Neovim, any editor |
| **10-Phase Workflow** | Complete SDLC from analysis to deployment |
| **Self-Learning** | Learns your patterns, conventions, and preferences |
| **Flexible Modes** | Full workflow, bug fix fast-track, or quick changes |
| **Parallel Development** | Work on multiple features with conflict detection |
| **Git Integration** | Branching, commits, PRs, and rollback strategies |
| **PM Integration** | Jira, Linear, GitHub Issues, Notion, and more |

---

## Commands

Type `pa:` in your AI assistant to use ProAgents commands:

| Command | Description |
|---------|-------------|
| `pa:init` | Initialize ProAgents in your project |
| `pa:feature` | Start a new feature |
| `pa:fix` | Quick bug fix mode |
| `pa:doc` | Generate documentation |
| `pa:qa` | Quality assurance checks |
| `pa:test` | Run test workflows |
| `pa:deploy` | Deployment preparation |
| `pa:status` | Check current status |
| `pa:help` | Show all commands |

---

## Documentation

| Document | Description |
|----------|-------------|
| [Getting Started Story](./proagents/GETTING-STARTED-STORY.md) | Narrative walkthrough of a typical day |
| [Complete Workflow Guide](./proagents/WORKFLOW.md) | Detailed 10-phase workflow documentation |
| [Configuration Reference](./proagents/config/README.md) | Configuration options |
| [Examples](./proagents/examples/) | Project-specific walkthroughs |
| [Prompts](./proagents/prompts/) | AI prompts for each phase |

---

## Project Structure

```
proagents/
├── README.md                 # Quick start guide
├── WORKFLOW.md               # Complete workflow documentation
├── proagents.config.yaml     # Configuration template
├── prompts/                  # AI prompts for each phase
├── templates/                # Output document templates
├── checklists/               # Quality checklists
├── standards/                # Customizable coding standards
├── examples/                 # Project type walkthroughs
├── config/                   # Integration configurations
└── ...                       # Additional modules
```

---

## Supported Integrations

**Project Management:** Jira, Linear, GitHub Issues, GitLab Issues, Asana, Trello, Notion

**Version Control:** GitHub, GitLab

**Communication:** Slack

**CI/CD:** GitHub Actions, GitLab CI, Jenkins, Azure DevOps

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

Built for developers who want to automate their workflow without vendor lock-in.

**Co-authored with Claude (Anthropic)**
