# ProAgents

**AI-Agnostic Development Workflow Framework**

A portable, universal development workflow framework that automates the full software development lifecycle. Works with **any AI platform** (Claude, ChatGPT, Gemini, Copilot, etc.) and **any IDE**.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Why ProAgents?

- **No vendor lock-in** - Switch AI platforms without changing your workflow
- **Full lifecycle automation** - From requirements to deployment
- **Self-learning** - Adapts to your coding patterns and preferences
- **Flexible entry points** - Full workflow, bug fix mode, or quick changes

---

## Quick Start

### 1. Copy the `proagents/` folder to your project

```bash
cp -r proagents/ /path/to/your/project/
```

### 2. Start a feature (with any AI)

```
/feature-start "Add user authentication"
```

### 3. Follow the guided workflow

The AI guides you through 10 phases:

```
Init → Analysis → Requirements → Design → Planning →
Implementation → Testing → Review → Documentation → Deployment
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

## Slash Commands

Type `/` in your AI assistant to see available commands:

| Command | Description |
|---------|-------------|
| `/init` | Initialize ProAgents in your project |
| `/feature-start` | Start a new feature |
| `/fix` | Quick bug fix mode |
| `/doc` | Generate documentation |
| `/qa` | Quality assurance checks |
| `/test` | Run test workflows |
| `/deploy` | Deployment preparation |
| `/status` | Check current status |
| `/help` | Show all commands |

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
