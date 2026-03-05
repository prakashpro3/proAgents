# ProAgents CLI Tool

Command-line interface for all ProAgents workflow operations.

---

## Overview

The ProAgents CLI provides direct access to all workflow features from your terminal. It works alongside any AI platform and integrates with your existing development tools.

```
┌─────────────────────────────────────────────────────────────┐
│                    ProAgents CLI                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Terminal ──────────────────────────────────────────────   │
│  $ proagents feature start "User Authentication"           │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Starting feature: User Authentication               │   │
│  │ Branch: feature/user-authentication                 │   │
│  │ Mode: Full Workflow                                 │   │
│  │                                                     │   │
│  │ Phase 1: Analysis ━━━━━━━━━━━━━━━ [In Progress]    │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Installation

### NPM (Recommended)

```bash
# Install globally
npm install -g proagents-cli

# Verify installation
proagents --version
```

### Yarn

```bash
yarn global add proagents-cli
```

### NPX (No Installation)

```bash
# Run without installing
npx proagents <command>
```

### Manual Installation

```bash
# Clone repository
git clone https://github.com/proagents/cli.git

# Install dependencies
cd cli && npm install

# Link globally
npm link
```

---

## Quick Start

### 1. Initialize in Your Project

```bash
cd your-project
proagents init
```

This creates:
```
/proagents/
├── proagents.config.yaml    # Configuration
├── prompts/                 # AI prompts
├── templates/               # Output templates
├── checklists/              # Quality checklists
└── active-features/         # Feature tracking
```

### 2. Start Your First Feature

```bash
# Start a new feature
proagents feature start "Add user authentication"

# Or quick bug fix
proagents fix "Login button not working"

# Or quick change
proagents quick "Update API endpoint URL"
```

### 3. Check Status

```bash
proagents status
```

---

## Command Categories

| Category | Commands | Description |
|----------|----------|-------------|
| **Core** | `init`, `status`, `help` | Setup and information |
| **Feature** | `feature start/status/pause/resume/complete` | Feature development |
| **Bug Fix** | `fix`, `hotfix` | Bug fixing workflows |
| **Analysis** | `analyze` | Codebase analysis |
| **Testing** | `test` | Run tests |
| **Documentation** | `docs` | Generate documentation |
| **Quality** | `qa`, `lint`, `security` | Quality assurance |
| **Git** | `commit`, `branch`, `pr` | Git operations |
| **Deploy** | `deploy`, `rollback` | Deployment operations |
| **Config** | `config` | Configuration management |
| **Reports** | `report` | Generate reports |

---

## Global Options

These options work with all commands:

| Option | Short | Description |
|--------|-------|-------------|
| `--help` | `-h` | Show help for command |
| `--version` | `-v` | Show CLI version |
| `--verbose` | `-V` | Verbose output |
| `--quiet` | `-q` | Minimal output |
| `--config` | `-c` | Use specific config file |
| `--json` | | Output as JSON |
| `--no-color` | | Disable colored output |

---

## Configuration

### CLI Configuration File

```yaml
# ~/.proagents/cli.yaml

cli:
  # Default AI model for operations
  default_ai_model: "claude-3-sonnet"

  # Output format
  output_format: "pretty"  # pretty, json, yaml

  # Enable colored output
  color: true

  # Verbose by default
  verbose: false

  # Default project path
  default_project: "."

# Shell integration
shell:
  # Enable auto-completion
  completion: true

  # Enable shortcuts
  shortcuts: true

# Notifications
notifications:
  # Desktop notifications
  desktop: true

  # Sound on completion
  sound: false
```

### Project Configuration

```yaml
# proagents.config.yaml (in project root)

project:
  name: "My Project"
  type: "fullstack"

cli:
  # Project-specific CLI settings
  default_mode: "full-workflow"
  auto_commit: false
```

---

## Shell Completion

### Bash

```bash
# Add to ~/.bashrc
source <(proagents completion bash)
```

### Zsh

```bash
# Add to ~/.zshrc
source <(proagents completion zsh)
```

### Fish

```bash
# Add to ~/.config/fish/config.fish
proagents completion fish | source
```

### PowerShell

```powershell
# Add to profile
proagents completion powershell | Out-String | Invoke-Expression
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PROAGENTS_CONFIG` | Path to config file | `./proagents.config.yaml` |
| `PROAGENTS_HOME` | ProAgents home directory | `~/.proagents` |
| `PROAGENTS_AI_MODEL` | Default AI model | `claude-3-sonnet` |
| `PROAGENTS_VERBOSE` | Enable verbose output | `false` |
| `PROAGENTS_NO_COLOR` | Disable colors | `false` |

---

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | General error |
| 2 | Invalid arguments |
| 3 | Configuration error |
| 4 | Feature not found |
| 5 | Git operation failed |
| 6 | Test failure |
| 7 | Deployment failed |
| 8 | User cancelled |

---

## Documentation Files

| File | Description |
|------|-------------|
| [commands-reference.md](./commands-reference.md) | Complete command reference |
| [shortcuts.md](./shortcuts.md) | Shell shortcuts and aliases |
| [ide-integration.md](./ide-integration.md) | IDE integrations |
| [slash-commands.md](./slash-commands.md) | AI slash commands |

---

## Examples

### Complete Feature Workflow

```bash
# Start feature
proagents feature start "User dashboard"

# Check status
proagents status

# Run analysis
proagents analyze

# Generate docs
proagents docs --mode moderate

# Run tests
proagents test --coverage

# Create PR
proagents pr create

# Complete feature
proagents feature complete
```

### Quick Bug Fix

```bash
# Start bug fix
proagents fix "Fix login validation error"

# Run tests for affected files
proagents test --affected

# Commit fix
proagents commit --type fix

# Create PR
proagents pr create --draft
```

### Daily Workflow

```bash
# Morning: Check status
proagents status --all

# View active features
proagents feature list

# Continue work
proagents feature resume user-dashboard

# End of day: Save progress
proagents feature pause --note "Completed auth module"
```

---

## Troubleshooting

### Common Issues

**Command not found**
```bash
# Check if installed
which proagents

# Reinstall
npm install -g proagents-cli
```

**Permission denied**
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
npm install -g proagents-cli
```

**Configuration not loading**
```bash
# Check config location
proagents config --path

# Validate config
proagents config validate
```

### Debug Mode

```bash
# Run with debug output
DEBUG=proagents* proagents feature start "Test"

# Check system health
proagents doctor
```

---

## Getting Help

```bash
# General help
proagents help

# Command-specific help
proagents help feature
proagents feature --help

# Show all commands
proagents commands

# Show examples
proagents examples
```
