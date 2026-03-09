# IDE Integration

Integrate ProAgents with your development environment.

---

## Overview

ProAgents integrates with popular IDEs to provide workflow actions directly in your editor.

```
┌─────────────────────────────────────────────────────────────┐
│ IDE Integration Options                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  VS Code          →  Extension + Commands + Tasks           │
│  JetBrains        →  External Tools + Run Configs           │
│  Vim/Neovim       →  Commands + Telescope                   │
│  Emacs            →  Projectile + Commands                  │
│  Sublime Text     →  Build Systems + Commands               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## VS Code

### Extension Installation

```bash
# Install VS Code extension
code --install-extension proagents.proagents-vscode
```

Or search "ProAgents" in VS Code Extensions marketplace.

### Command Palette

Access ProAgents commands via Command Palette (`Cmd/Ctrl + Shift + P`):

| Command | Description |
|---------|-------------|
| `ProAgents: Start Feature` | Start new feature |
| `ProAgents: Show Status` | Show current status |
| `ProAgents: Analyze Codebase` | Run analysis |
| `ProAgents: Run Tests` | Run tests |
| `ProAgents: Generate Docs` | Generate documentation |
| `ProAgents: Quality Check` | Run QA checks |
| `ProAgents: Deploy` | Deploy application |

### Keyboard Shortcuts

Default keybindings (customizable):

| Shortcut | Command |
|----------|---------|
| `Ctrl+Shift+P A` | ProAgents: Show Status |
| `Ctrl+Shift+P F` | ProAgents: Start Feature |
| `Ctrl+Shift+P T` | ProAgents: Run Tests |

### Custom Keybindings

Add to `keybindings.json`:

```json
[
  {
    "key": "ctrl+shift+a",
    "command": "proagents.status"
  },
  {
    "key": "ctrl+shift+f",
    "command": "proagents.feature.start"
  },
  {
    "key": "ctrl+shift+t",
    "command": "proagents.test"
  },
  {
    "key": "ctrl+shift+d",
    "command": "proagents.deploy.staging"
  }
]
```

### Tasks

Add to `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "ProAgents: Status",
      "type": "shell",
      "command": "proagents status",
      "problemMatcher": []
    },
    {
      "label": "ProAgents: Analyze",
      "type": "shell",
      "command": "proagents analyze",
      "problemMatcher": []
    },
    {
      "label": "ProAgents: Test All",
      "type": "shell",
      "command": "proagents test --all",
      "group": {
        "kind": "test",
        "isDefault": true
      },
      "problemMatcher": ["$tsc"]
    },
    {
      "label": "ProAgents: Test Affected",
      "type": "shell",
      "command": "proagents test --affected",
      "group": "test",
      "problemMatcher": ["$tsc"]
    },
    {
      "label": "ProAgents: QA Quick",
      "type": "shell",
      "command": "proagents qa --quick",
      "problemMatcher": []
    },
    {
      "label": "ProAgents: Deploy Staging",
      "type": "shell",
      "command": "proagents deploy staging",
      "problemMatcher": []
    }
  ]
}
```

### Status Bar

The VS Code extension adds a status bar item showing:
- Current feature name
- Current phase
- Progress percentage

Click to open detailed status view.

### Settings

Configure in VS Code settings:

```json
{
  "proagents.enabled": true,
  "proagents.showStatusBar": true,
  "proagents.autoAnalyze": true,
  "proagents.testOnSave": false,
  "proagents.notifications": true
}
```

---

## JetBrains IDEs

Works with IntelliJ IDEA, WebStorm, PyCharm, etc.

### External Tools Setup

1. Go to **Settings → Tools → External Tools**
2. Click **+** to add new tool
3. Configure each tool:

**Status Tool:**
```
Name: ProAgents Status
Program: proagents
Arguments: status
Working directory: $ProjectFileDir$
```

**Analyze Tool:**
```
Name: ProAgents Analyze
Program: proagents
Arguments: analyze
Working directory: $ProjectFileDir$
```

**Test Tool:**
```
Name: ProAgents Test
Program: proagents
Arguments: test --all
Working directory: $ProjectFileDir$
```

### Run Configurations

Create run configurations for common tasks:

1. Go to **Run → Edit Configurations**
2. Click **+** → **Shell Script**
3. Configure:

```
Name: ProAgents - Start Feature
Script path: /usr/local/bin/proagents
Script options: feature start
Working directory: $ProjectFileDir$
```

### Keyboard Shortcuts

Map external tools to keyboard shortcuts:

1. Go to **Settings → Keymap**
2. Search for "External Tools"
3. Right-click tool → Add Keyboard Shortcut

Suggested mappings:
| Shortcut | Action |
|----------|--------|
| `Ctrl+Alt+S` | ProAgents Status |
| `Ctrl+Alt+A` | ProAgents Analyze |
| `Ctrl+Alt+T` | ProAgents Test |

### Tool Windows

Add ProAgents as a tool window:

1. **View → Tool Windows → Terminal**
2. Create new terminal tab named "ProAgents"
3. Use for all ProAgents commands

---

## Vim / Neovim

### Plugin Installation

**With vim-plug:**
```vim
Plug 'proagents/vim-proagents'
```

**With Packer (Neovim):**
```lua
use 'proagents/vim-proagents'
```

**With lazy.nvim:**
```lua
{
  'proagents/vim-proagents',
  config = function()
    require('proagents').setup({
      auto_status = true,
      keymaps = true,
    })
  end
}
```

### Commands

```vim
:ProAgentsStatus          " Show status
:ProAgentsFeatureStart    " Start feature (prompts for name)
:ProAgentsAnalyze         " Analyze codebase
:ProAgentsTest            " Run tests
:ProAgentsDocs            " Generate docs
:ProAgentsQA              " Quality check
:ProAgentsDeploy staging  " Deploy to staging
```

### Keymappings

Default keymaps (with `<leader>` = `\`):

```vim
" Status
nnoremap <leader>ps :ProAgentsStatus<CR>

" Feature
nnoremap <leader>pf :ProAgentsFeatureStart<CR>
nnoremap <leader>pl :ProAgentsFeatureList<CR>

" Testing
nnoremap <leader>pt :ProAgentsTest<CR>
nnoremap <leader>pa :ProAgentsTest --affected<CR>

" Quality
nnoremap <leader>pq :ProAgentsQA<CR>
```

### Custom Configuration

In `init.vim` or `init.lua`:

```lua
-- Neovim with Lua
require('proagents').setup({
  auto_status = true,
  keymaps = true,
  status_position = 'bottom',

  commands = {
    status = '<leader>ps',
    feature_start = '<leader>pf',
    test = '<leader>pt',
    qa = '<leader>pq',
  }
})
```

### Telescope Integration (Neovim)

```lua
-- Use Telescope to browse features
require('telescope').extensions.proagents.features()

-- Keymap
vim.keymap.set('n', '<leader>pF', require('telescope').extensions.proagents.features)
```

---

## Emacs

### Package Installation

**With use-package:**
```elisp
(use-package proagents
  :ensure t
  :config
  (proagents-mode 1))
```

**With straight.el:**
```elisp
(straight-use-package 'proagents)
```

### Commands

```elisp
M-x proagents-status
M-x proagents-feature-start
M-x proagents-analyze
M-x proagents-test
M-x proagents-qa
M-x proagents-deploy
```

### Keybindings

```elisp
;; Prefix: C-c p
(global-set-key (kbd "C-c p s") 'proagents-status)
(global-set-key (kbd "C-c p f") 'proagents-feature-start)
(global-set-key (kbd "C-c p t") 'proagents-test)
(global-set-key (kbd "C-c p q") 'proagents-qa)
(global-set-key (kbd "C-c p d") 'proagents-deploy)
```

### Projectile Integration

```elisp
(with-eval-after-load 'projectile
  (define-key projectile-mode-map (kbd "C-c p P") 'proagents-project-menu))
```

### Doom Emacs

Add to `packages.el`:
```elisp
(package! proagents)
```

Add to `config.el`:
```elisp
(use-package! proagents
  :config
  (map! :leader
        (:prefix ("p" . "project")
         :desc "ProAgents status" "s" #'proagents-status
         :desc "ProAgents feature" "f" #'proagents-feature-start)))
```

---

## Sublime Text

### Package Installation

1. Open Command Palette (`Cmd/Ctrl + Shift + P`)
2. Select "Package Control: Install Package"
3. Search "ProAgents"

### Build Systems

Create `.sublime-build` files:

**ProAgents-Status.sublime-build:**
```json
{
  "shell_cmd": "proagents status",
  "working_dir": "$project_path",
  "selector": "source"
}
```

**ProAgents-Test.sublime-build:**
```json
{
  "shell_cmd": "proagents test --all",
  "working_dir": "$project_path",
  "selector": "source"
}
```

### Key Bindings

Add to Preferences → Key Bindings:

```json
[
  { "keys": ["ctrl+shift+s"], "command": "proagents_status" },
  { "keys": ["ctrl+shift+f"], "command": "proagents_feature_start" },
  { "keys": ["ctrl+shift+t"], "command": "proagents_test" }
]
```

---

## Terminal Integration

### tmux

Add to `~/.tmux.conf`:

```bash
# ProAgents status in status bar
set -g status-right '#(proagents status --short 2>/dev/null || echo "No PA")'

# Keybindings
bind-key P run-shell "proagents status"
bind-key F run-shell "proagents feature list"
```

### iTerm2 (macOS)

Create Profile Badge showing status:
1. Profiles → Edit Profiles → General
2. Badge: `\(proagents status --badge)`

### Warp

Warp terminal native integration coming soon. For now, use aliases.

---

## Git Hooks Integration

### Husky Setup

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "proagents qa --quick",
      "pre-push": "proagents test --all"
    }
  }
}
```

### Custom Git Hooks

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash
echo "Running ProAgents pre-commit checks..."
proagents lint --staged
proagents qa --quick
```

---

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/proagents.yml
name: ProAgents CI

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install -g proagents-cli
      - run: proagents qa --full
      - run: proagents test --all --coverage
```

### GitLab CI

```yaml
# .gitlab-ci.yml
proagents:
  image: node:18
  script:
    - npm install -g proagents-cli
    - proagents qa --full
    - proagents test --all
```

---

## Notifications

### Desktop Notifications

```yaml
# ~/.proagents/cli.yaml
notifications:
  desktop: true
  on_complete: true
  on_error: true
  on_deploy: true
```

### Slack Integration

```yaml
notifications:
  slack:
    enabled: true
    webhook: "https://hooks.slack.com/..."
    events:
      - deploy_complete
      - deploy_failed
      - feature_complete
```

---

## Troubleshooting

### IDE Not Finding Commands

```bash
# Check installation
which proagents

# Add to PATH if needed
export PATH="$PATH:/usr/local/bin"
```

### Extension Not Loading

1. Restart IDE
2. Check extension logs
3. Verify ProAgents CLI is installed

### Permission Issues

```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm

# Reinstall
npm install -g proagents-cli
```
