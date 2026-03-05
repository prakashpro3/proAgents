# IDE Setup Guides

Configure your development environment for optimal ProAgents integration.

---

## Overview

ProAgents works with any IDE, but optimal setup ensures:
- Seamless AI integration
- Consistent code formatting
- Automatic standard enforcement
- Efficient development workflow

---

## Available Guides

| IDE | Guide |
|-----|-------|
| VS Code | [vscode.md](./vscode.md) |
| JetBrains (WebStorm, IntelliJ) | [jetbrains.md](./jetbrains.md) |
| Cursor | [cursor.md](./cursor.md) |
| Neovim | [neovim.md](./neovim.md) |

---

## Universal Setup

Regardless of IDE, ensure these are configured:

### 1. EditorConfig

Create `.editorconfig` in project root:

```ini
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false

[Makefile]
indent_style = tab
```

### 2. Git Configuration

```bash
# Set up consistent line endings
git config core.autocrlf input  # Mac/Linux
git config core.autocrlf true   # Windows

# Set up commit hooks
npx husky install
```

### 3. Environment Variables

Create `.env.local` for local development:

```bash
# ProAgents
PROAGENTS_AI_MODEL=auto
PROAGENTS_VERBOSE=false

# Development
NODE_ENV=development
```

---

## Quick Start

1. **Install IDE extension/plugin** (if available)
2. **Run setup command**:
   ```bash
   proagents ide setup
   ```
3. **Verify installation**:
   ```bash
   proagents doctor
   ```

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Extensions not loading | Restart IDE after install |
| Formatting conflicts | Disable conflicting formatters |
| Slow performance | Exclude `node_modules` from indexing |
| TypeScript errors | Run `npm install` and restart TS server |
