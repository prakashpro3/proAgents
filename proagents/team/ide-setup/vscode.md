# VS Code Setup Guide

Complete VS Code configuration for ProAgents development.

---

## Required Extensions

### Essential

```bash
# Install via command line
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension ms-vscode.vscode-typescript-next
```

| Extension | Purpose |
|-----------|---------|
| ESLint | Linting |
| Prettier | Formatting |
| TypeScript Next | Enhanced TS support |
| Tailwind CSS IntelliSense | Tailwind autocomplete |

### Recommended

```bash
code --install-extension streetsidesoftware.code-spell-checker
code --install-extension usernamehw.errorlens
code --install-extension eamodio.gitlens
code --install-extension gruntfuggly.todo-tree
code --install-extension formulahendry.auto-rename-tag
```

### AI Integration

```bash
# Choose one:
code --install-extension GitHub.copilot          # GitHub Copilot
code --install-extension Continue.continue       # Continue
code --install-extension Codeium.codeium         # Codeium
```

---

## Workspace Settings

Create `.vscode/settings.json`:

```json
{
  // Editor
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  "editor.tabSize": 2,
  "editor.detectIndentation": false,

  // TypeScript
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "typescript.preferences.importModuleSpecifier": "relative",

  // Files
  "files.exclude": {
    "**/node_modules": true,
    "**/.next": true,
    "**/dist": true,
    "**/.git": true
  },
  "files.watcherExclude": {
    "**/node_modules/**": true,
    "**/.next/**": true
  },

  // Search
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.next": true,
    "**/coverage": true
  },

  // ESLint
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],

  // Prettier
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },

  // Tailwind
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"],
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ],

  // Git
  "git.enableSmartCommit": true,
  "git.confirmSync": false,

  // Terminal
  "terminal.integrated.defaultProfile.osx": "zsh",
  "terminal.integrated.defaultProfile.windows": "PowerShell"
}
```

---

## Keyboard Shortcuts

Add to `.vscode/keybindings.json`:

```json
[
  // ProAgents shortcuts (example using terminal)
  {
    "key": "cmd+shift+p",
    "command": "workbench.action.tasks.runTask",
    "args": "proagents: status"
  },

  // Quick file navigation
  {
    "key": "cmd+p",
    "command": "workbench.action.quickOpen"
  },

  // Toggle terminal
  {
    "key": "cmd+`",
    "command": "workbench.action.terminal.toggleTerminal"
  },

  // Quick fix
  {
    "key": "cmd+.",
    "command": "editor.action.quickFix"
  },

  // Go to definition
  {
    "key": "cmd+click",
    "command": "editor.action.revealDefinition"
  }
]
```

---

## Tasks Configuration

Create `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "dev",
      "type": "npm",
      "script": "dev",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "build",
      "type": "npm",
      "script": "build",
      "group": "build",
      "problemMatcher": ["$tsc"]
    },
    {
      "label": "test",
      "type": "npm",
      "script": "test",
      "group": "test",
      "problemMatcher": []
    },
    {
      "label": "lint",
      "type": "npm",
      "script": "lint",
      "problemMatcher": ["$eslint-stylish"]
    },
    {
      "label": "proagents: status",
      "type": "shell",
      "command": "proagents status",
      "problemMatcher": []
    },
    {
      "label": "proagents: feature list",
      "type": "shell",
      "command": "proagents feature list",
      "problemMatcher": []
    }
  ]
}
```

---

## Debug Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    },
    {
      "name": "Debug Tests",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "test", "--", "--runInBand"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

---

## Snippets

Create `.vscode/snippets.code-snippets`:

```json
{
  "React Functional Component": {
    "prefix": "rfc",
    "body": [
      "import { FC } from 'react';",
      "",
      "interface ${1:Component}Props {",
      "  $2",
      "}",
      "",
      "export const ${1:Component}: FC<${1:Component}Props> = ({ $3 }) => {",
      "  return (",
      "    <div>",
      "      $0",
      "    </div>",
      "  );",
      "};"
    ],
    "description": "React Functional Component with TypeScript"
  },
  "useState Hook": {
    "prefix": "us",
    "body": "const [${1:state}, set${1/(.*)/${1:/capitalize}/}] = useState<${2:type}>($3);",
    "description": "useState hook"
  },
  "useEffect Hook": {
    "prefix": "ue",
    "body": [
      "useEffect(() => {",
      "  $1",
      "  return () => {",
      "    $2",
      "  };",
      "}, [$3]);"
    ],
    "description": "useEffect hook with cleanup"
  },
  "Console Log": {
    "prefix": "cl",
    "body": "console.log('${1:label}:', $2);",
    "description": "Console log with label"
  }
}
```

---

## Extensions Workspace Recommendations

Create `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "streetsidesoftware.code-spell-checker",
    "usernamehw.errorlens",
    "eamodio.gitlens",
    "gruntfuggly.todo-tree"
  ],
  "unwantedRecommendations": []
}
```

---

## Troubleshooting

### TypeScript Not Recognizing Types
1. Run `npm install`
2. Restart TS Server: `Cmd+Shift+P` → "TypeScript: Restart TS Server"

### ESLint Not Working
1. Check ESLint output: `Cmd+Shift+U` → Select "ESLint"
2. Verify `.eslintrc` exists
3. Run `npm install eslint`

### Formatting Conflicts
1. Disable other formatters
2. Set Prettier as default: Settings → Default Formatter
3. Restart VS Code
