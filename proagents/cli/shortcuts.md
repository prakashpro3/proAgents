# CLI Shortcuts & Aliases

Shell shortcuts and aliases for faster ProAgents workflow.

---

## Overview

ProAgents provides shortcut commands to speed up common operations. All shortcuts are designed to avoid conflicts with existing tools.

---

## Built-in Shortcuts

### Primary Shortcuts

| Shortcut | Full Command | Description |
|----------|--------------|-------------|
| `pa` | `proagents` | Main CLI alias |
| `pa f` | `proagents feature` | Feature commands |
| `pa s` | `proagents status` | Show status |
| `pa a` | `proagents analyze` | Analyze codebase |
| `pa t` | `proagents test` | Run tests |
| `pa d` | `proagents docs` | Generate docs |
| `pa q` | `proagents qa` | Quality checks |

### Feature Shortcuts

| Shortcut | Full Command | Description |
|----------|--------------|-------------|
| `pa fs` | `proagents feature start` | Start feature |
| `pa fl` | `proagents feature list` | List features |
| `pa fp` | `proagents feature pause` | Pause feature |
| `pa fr` | `proagents feature resume` | Resume feature |
| `pa fc` | `proagents feature complete` | Complete feature |

### Quick Actions

| Shortcut | Full Command | Description |
|----------|--------------|-------------|
| `pa fix` | `proagents fix` | Bug fix mode |
| `pa hot` | `proagents hotfix` | Emergency hotfix |
| `pa quick` | `proagents quick` | Quick change |

---

## Setting Up Aliases

### Bash

Add to `~/.bashrc`:

```bash
# ProAgents shell integration
source <(proagents completion bash)

# Main alias
alias pa='proagents'

# Feature shortcuts
alias paf='proagents feature'
alias pafs='proagents feature start'
alias pafl='proagents feature list'
alias pafp='proagents feature pause'
alias pafr='proagents feature resume'
alias pafc='proagents feature complete'

# Quick actions
alias pas='proagents status'
alias paa='proagents analyze'
alias pat='proagents test'
alias pad='proagents docs'
alias paq='proagents qa'

# Bug fix
alias pafix='proagents fix'
alias pahot='proagents hotfix'

# Git operations
alias pac='proagents commit'
alias papr='proagents pr create'

# Workflow
alias pastart='proagents feature start'
alias padone='proagents feature complete'
```

### Zsh

Add to `~/.zshrc`:

```zsh
# ProAgents shell integration
source <(proagents completion zsh)

# Aliases
alias pa='proagents'
alias pas='proagents status'
alias paf='proagents feature'
alias pafs='proagents feature start'
alias pafl='proagents feature list'
alias pat='proagents test'
alias pad='proagents docs'
alias paq='proagents qa'
alias pac='proagents commit'

# Functions for common workflows
function pawork() {
  proagents feature start "$1" && proagents analyze
}

function padeploy() {
  proagents test --all && proagents deploy "$1"
}
```

### Fish

Add to `~/.config/fish/config.fish`:

```fish
# ProAgents completion
proagents completion fish | source

# Abbreviations (auto-expand)
abbr -a pa proagents
abbr -a pas 'proagents status'
abbr -a paf 'proagents feature'
abbr -a pafs 'proagents feature start'
abbr -a pat 'proagents test'

# Functions
function pawork
    proagents feature start $argv[1]
    and proagents analyze
end
```

### PowerShell

Add to PowerShell profile:

```powershell
# ProAgents completion
proagents completion powershell | Out-String | Invoke-Expression

# Aliases
Set-Alias pa proagents

function pas { proagents status $args }
function paf { proagents feature $args }
function pafs { proagents feature start $args }
function pat { proagents test $args }
```

---

## Custom Shortcuts

### Configuration

Define custom shortcuts in config:

```yaml
# ~/.proagents/cli.yaml

shortcuts:
  enabled: true

  custom:
    # Daily workflow
    "morning": "status --all"
    "standup": "feature list --active"

    # Development
    "wip": "feature status"
    "done": "feature complete"
    "ship": "test --all && deploy staging"

    # Quick actions
    "fixup": "commit --type fix --all"
    "quickfix": "fix --priority high"

    # Reports
    "weekly": "report velocity --period week"
```

### Using Custom Shortcuts

```bash
# Use defined shortcuts
pa morning      # proagents status --all
pa standup      # proagents feature list --active
pa ship         # proagents test --all && deploy staging
```

---

## Workflow Functions

### Bash/Zsh Functions

```bash
# Start and analyze a feature
pawork() {
  local name="$1"
  echo "Starting feature: $name"
  proagents feature start "$name" && \
  proagents analyze --depth moderate
}

# Complete daily work
padaily() {
  echo "=== Morning Status ==="
  proagents status --all
  echo ""
  echo "=== Active Features ==="
  proagents feature list --active
  echo ""
  echo "=== Quality Check ==="
  proagents qa --quick
}

# Full deployment workflow
padeploy() {
  local env="${1:-staging}"
  echo "Deploying to $env..."
  proagents test --all && \
  proagents qa --full && \
  proagents deploy "$env" --rollback-on-fail
}

# Complete feature and create PR
pafinish() {
  proagents test --all && \
  proagents docs --update-only && \
  proagents feature complete && \
  proagents pr create
}

# Quick fix workflow
paquickfix() {
  local desc="$1"
  proagents fix "$desc" && \
  proagents test --affected && \
  proagents commit --type fix
}

# End of week cleanup
paweekend() {
  proagents report velocity --period week
  proagents clean --cache
  proagents feature list --paused
}
```

---

## Avoiding Conflicts

### Reserved Commands

These shortcuts are NOT used by ProAgents to avoid conflicts:

| Avoided | Reason | Alternative |
|---------|--------|-------------|
| `g` | Common git alias | Use `pa` prefix |
| `f` | fzf, find aliases | Use `paf` |
| `t` | tmux aliases | Use `pat` |
| `c` | Common aliases | Use `pac` |
| `d` | Docker aliases | Use `pad` |
| `s` | ssh aliases | Use `pas` |

### Conflict Detection

```bash
# Check for conflicts
proagents doctor --check-conflicts

# Output shows any conflicts with existing commands
```

### Disabling Conflicting Shortcuts

```yaml
# ~/.proagents/cli.yaml

shortcuts:
  disabled:
    - "f"    # Conflicts with my fuzzy finder
    - "c"    # Conflicts with my custom tool
    - "t"    # Conflicts with tmux

  alternatives:
    # Use these instead
    feature: "ft"
    commit: "cm"
    test: "ts"
```

---

## Quick Reference Card

### Feature Development

```
pa fs "name"  →  Start new feature
pa s          →  Check status
pa a          →  Analyze codebase
pa t          →  Run tests
pa d          →  Generate docs
pa fc         →  Complete feature
pa pr         →  Create PR
```

### Bug Fixing

```
pa fix "desc"  →  Start bug fix
pa t --affected →  Test affected files
pa c --type fix →  Commit fix
```

### Daily Workflow

```
pa s --all    →  Morning status check
pa fl         →  List all features
pa fr         →  Resume last feature
pa fp         →  Pause current work
```

### Quality & Deploy

```
pa q          →  Quality check
pa q --security →  Security scan
pa deploy staging →  Deploy to staging
pa rollback   →  Rollback deployment
```

---

## Command Chaining

### Sequential Execution

```bash
# Run in sequence (stop on error)
pa t && pa d && pa deploy staging

# Run in sequence (continue on error)
pa lint; pa test; pa qa
```

### Pipeline Examples

```bash
# Test, build, deploy pipeline
pa t --all && pa qa --full && pa deploy production

# Feature completion pipeline
pa t && pa d --update-only && pa fc && pa pr create

# Morning workflow
pa s --all && pa fl --active && pa fr
```

### Using Functions for Complex Workflows

```bash
# Define in shell config
ci-pipeline() {
  echo "=== Running CI Pipeline ==="
  proagents lint --strict && \
  proagents test --all --coverage && \
  proagents qa --security && \
  proagents build
}

# Use it
ci-pipeline && proagents deploy staging
```

---

## Tips

1. **Start simple**: Use just `pa` alias initially
2. **Add as needed**: Only add shortcuts you'll actually use
3. **Stay consistent**: Use the same shortcuts across all projects
4. **Document**: Keep notes on your custom shortcuts
5. **Test conflicts**: Run `proagents doctor --check-conflicts` after setup
