# ProAgents Development Workflow

A portable, AI-agnostic development workflow framework that automates the full software development lifecycle.

**New to ProAgents?** Read [A Day in the Life](./GETTING-STARTED-STORY.md) - a narrative walkthrough showing how ProAgents transforms development.

## Quick Start (5 minutes)

### 1. Initialize in Your Project

```bash
# Using slash command (any AI)
/init

# Or CLI
npx proagents init
```

### 2. Start Your First Feature

```bash
# Using slash command
/feature-start "Add user authentication"

# Or CLI
proagents feature start "Add user authentication"
```

### 3. Follow the Workflow

The AI will guide you through:
1. **Analysis** - Understanding existing codebase
2. **Requirements** - Gathering feature requirements
3. **Design** - UI/Architecture design
4. **Planning** - Implementation planning
5. **Implementation** - Writing code
6. **Testing** - Comprehensive tests
7. **Review** - Code review
8. **Documentation** - Feature documentation
9. **Deployment** - Deploy preparation
10. **Rollback** - Rollback procedures (if needed)

## Key Features

| Feature | Description |
|---------|-------------|
| **AI Agnostic** | Works with Claude, ChatGPT, Gemini, Copilot, etc. |
| **IDE Agnostic** | VS Code, JetBrains, Vim, any editor |
| **Self-Learning** | Learns from your usage and adapts |
| **Flexible Entry** | Full workflow, Bug Fix, or Quick Change modes |
| **Slash Commands** | `/doc`, `/qa`, `/test`, `/deploy` with hints |

## Slash Commands

Type `/` to see available commands:

| Command | Description |
|---------|-------------|
| `/init` | Initialize ProAgents |
| `/feature-start` | Start new feature |
| `/fix-quick` | Quick bug fix |
| `/doc` | Generate documentation |
| `/qa` | Quality assurance |
| `/test` | Run tests |
| `/deploy` | Deploy workflow |
| `/status` | Check status |
| `/help` | Show all commands |

## Configuration

Edit `proagents.config.yaml` to customize:

```yaml
checkpoints:
  after_analysis: true
  after_design: true
  before_deployment: true

git:
  branch_prefix: "feature/"
  commit_convention: "conventional"
```

## Documentation

- [Complete Workflow Guide](./WORKFLOW.md)
- [Configuration Reference](./proagents.config.yaml)
- [Slash Commands](./prompts/00-init.md)
- [UI Integration](./ui-integration/)
- [Examples](./examples/)

## Support

- [GitHub Issues](https://github.com/proagents/proagents/issues)
- [Documentation](./WORKFLOW.md)

---

Built for developers who want to automate their workflow without vendor lock-in.
