# IDE Setup Guide

Quick setup guides for configuring your IDE with ProAgents.

---

## Supported IDEs

| IDE | Guide | Status |
|-----|-------|--------|
| VS Code | [Full Guide](../team/ide-setup/vscode.md) | Recommended |
| JetBrains | [Full Guide](../team/ide-setup/jetbrains.md) | Supported |
| Cursor | [Full Guide](../team/ide-setup/cursor.md) | Supported |
| Neovim | [Full Guide](../team/ide-setup/neovim.md) | Supported |

---

## Quick Setup

### VS Code

1. **Install Extensions**
```bash
# Essential
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode

# AI Integration (choose one)
code --install-extension GitHub.copilot
code --install-extension Continue.continue
```

2. **Configure Settings**

Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

3. **Set Up Tasks**

Create `.vscode/tasks.json`:
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "ProAgents: Start Feature",
      "type": "shell",
      "command": "proagents feature start"
    },
    {
      "label": "ProAgents: Run Tests",
      "type": "shell",
      "command": "proagents test"
    }
  ]
}
```

---

### JetBrains (WebStorm/IntelliJ)

1. **Install Plugins**
   - Settings → Plugins → Marketplace
   - Search and install: ESLint, Prettier

2. **Configure ESLint**
   - Settings → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint
   - Enable "Automatic ESLint configuration"

3. **Configure Prettier**
   - Settings → Languages & Frameworks → JavaScript → Prettier
   - Enable "Run on save"

---

### Cursor

Cursor comes with AI features built-in. Additional setup:

1. **Configure AI Context**
```
Settings → AI → Context
Add: proagents/**/*.md
```

2. **Install Extensions**
   - Same as VS Code (Cursor supports VS Code extensions)

---

### Neovim

1. **Install LSP Support**
```lua
-- Using lazy.nvim
{
  'neovim/nvim-lspconfig',
  dependencies = {
    'williamboman/mason.nvim',
    'williamboman/mason-lspconfig.nvim',
  },
}
```

2. **Configure TypeScript**
```lua
require('lspconfig').tsserver.setup({})
require('lspconfig').eslint.setup({})
```

---

## AI Tool Integration

### GitHub Copilot
- Works with VS Code, JetBrains, Neovim
- Provides inline code suggestions
- No special ProAgents configuration needed

### Claude Code
- CLI-based, works with any editor
- Run `claude-code` in terminal alongside your IDE

### Continue
- VS Code extension
- Configure custom context with ProAgents prompts

### Codeium
- Free alternative to Copilot
- Works with most editors

---

## Common Tasks

### Setting Up Keyboard Shortcuts

**VS Code:**
```json
// keybindings.json
[
  {
    "key": "ctrl+shift+p f",
    "command": "workbench.action.terminal.sendSequence",
    "args": { "text": "proagents feature start\n" }
  }
]
```

### Terminal Integration

Most ProAgents commands run in the terminal. Configure your IDE's integrated terminal:

**VS Code:**
```json
{
  "terminal.integrated.defaultProfile.linux": "bash",
  "terminal.integrated.defaultProfile.osx": "zsh"
}
```

---

## Troubleshooting

### ESLint Not Working
1. Ensure `node_modules` is installed
2. Check ESLint extension is enabled
3. Verify `.eslintrc` exists

### Prettier Conflicts
1. Disable other formatters
2. Set Prettier as default formatter
3. Check for conflicting settings

### TypeScript Errors
1. Restart TS server: `Cmd/Ctrl+Shift+P` → "TypeScript: Restart TS Server"
2. Ensure correct TypeScript version

---

## Related Resources

- [VS Code Full Guide](../team/ide-setup/vscode.md)
- [JetBrains Full Guide](../team/ide-setup/jetbrains.md)
- [Team Onboarding](./team-onboarding.md)
