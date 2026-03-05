# JetBrains IDE Setup Guide

Configure WebStorm, IntelliJ IDEA, or other JetBrains IDEs for ProAgents development.

---

## Supported IDEs

- **WebStorm** - JavaScript/TypeScript development
- **IntelliJ IDEA** - Full-stack development
- **PhpStorm** - PHP with JS/TS
- **PyCharm** - Python with JS/TS frontend

---

## Essential Plugins

### Install via Settings → Plugins

| Plugin | Purpose |
|--------|---------|
| Prettier | Code formatting |
| ESLint | Linting |
| Tailwind CSS | Tailwind IntelliSense |
| GitToolBox | Enhanced Git features |
| String Manipulation | Text utilities |
| Rainbow Brackets | Bracket colorization |

### AI Plugins (Choose One)

| Plugin | Description |
|--------|-------------|
| GitHub Copilot | GitHub's AI assistant |
| JetBrains AI | Built-in AI features |
| Codeium | Free AI completion |
| Tabnine | AI code completion |

---

## Project Configuration

### 1. Node.js Setup

Settings → Languages & Frameworks → Node.js:
- Set Node interpreter from `.nvmrc`
- Enable coding assistance for Node.js

### 2. TypeScript Setup

Settings → Languages & Frameworks → TypeScript:
- TypeScript: Use project's `node_modules/typescript`
- Enable TypeScript service
- Recompile on changes: ✓

### 3. ESLint Setup

Settings → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint:
- Automatic ESLint configuration: ✓
- Run for files: `**/*.{js,jsx,ts,tsx}`
- Run eslint --fix on save: ✓

### 4. Prettier Setup

Settings → Languages & Frameworks → JavaScript → Prettier:
- Prettier package: `node_modules/prettier`
- Run for files: `**/*.{js,jsx,ts,tsx,json,css,md}`
- On save: ✓
- On reformat: ✓

---

## Editor Settings

Settings → Editor:

### Code Style

```
General:
- Hard wrap at: 100
- Visual guides: 80, 100

JavaScript/TypeScript:
- Tabs and Indents:
  - Tab size: 2
  - Indent: 2
  - Continuation indent: 2
  - Use tab character: No

- Spaces:
  - Before parentheses: function declaration ✓

- Imports:
  - Sort imports: ✓
  - Use paths relative to project: ✓
```

### Inspections

Settings → Editor → Inspections:
- JavaScript and TypeScript → Code quality tools → ESLint: ✓
- JavaScript and TypeScript → Imports and dependencies: ✓

---

## File Templates

Settings → Editor → File and Code Templates:

### React Component

```tsx
import { FC } from 'react';

interface ${NAME}Props {
  #[[// TODO: Define props]]#
}

export const ${NAME}: FC<${NAME}Props> = ({}) => {
  return (
    <div>
      ${NAME}
    </div>
  );
};
```

### Custom Hook

```typescript
import { useState, useEffect } from 'react';

export function use${NAME}() {
  #[[// TODO: Implement hook]]#

  return {};
}
```

---

## Live Templates

Settings → Editor → Live Templates → JavaScript/TypeScript:

### React Component (rfc)

```
import { FC } from 'react';

interface $NAME$Props {
  $PROPS$
}

export const $NAME$: FC<$NAME$Props> = ({ $DESTRUCTURED$ }) => {
  return (
    <div>
      $END$
    </div>
  );
};
```

### useState (us)

```
const [$STATE$, set$STATE_CAPITALIZED$] = useState<$TYPE$>($DEFAULT$);
```

### useEffect (ue)

```
useEffect(() => {
  $BODY$
  return () => {
    $CLEANUP$
  };
}, [$DEPS$]);
```

### Console Log (cl)

```
console.log('$LABEL$:', $VALUE$);
```

---

## Run Configurations

### Development Server

1. Run → Edit Configurations → Add → npm
2. Settings:
   - Name: "dev"
   - Scripts: "dev"
   - Node interpreter: Project
3. Save

### Tests

1. Run → Edit Configurations → Add → npm
2. Settings:
   - Name: "test"
   - Scripts: "test"
3. For watch mode, add arguments: `-- --watch`

### Debugging

1. Run → Edit Configurations → Add → JavaScript Debug
2. Settings:
   - Name: "Debug: Chrome"
   - URL: `http://localhost:3000`
   - Browser: Chrome

---

## Keyboard Shortcuts

### Essential Shortcuts (macOS / Windows)

| Action | macOS | Windows |
|--------|-------|---------|
| Search Everywhere | `Double Shift` | `Double Shift` |
| Find File | `Cmd+Shift+O` | `Ctrl+Shift+N` |
| Find in Files | `Cmd+Shift+F` | `Ctrl+Shift+F` |
| Go to Definition | `Cmd+B` | `Ctrl+B` |
| Find Usages | `Alt+F7` | `Alt+F7` |
| Refactor | `Ctrl+T` | `Ctrl+Alt+Shift+T` |
| Reformat Code | `Cmd+Alt+L` | `Ctrl+Alt+L` |
| Run | `Ctrl+R` | `Shift+F10` |
| Debug | `Ctrl+D` | `Shift+F9` |
| Terminal | `Alt+F12` | `Alt+F12` |

### Custom ProAgents Shortcuts

Add via Settings → Keymap → External Tools:

1. Add External Tool for ProAgents commands
2. Assign keyboard shortcuts

---

## Project View Settings

View → Tool Windows → Project:
- Show Excluded Files: Off
- Show Members: Off
- Flatten Packages: Off
- Compact Middle Packages: On

Right-click node_modules → Mark Directory as → Excluded

---

## Performance Optimization

### Exclude from Indexing

Settings → Project Structure → Excluded:
- `node_modules`
- `.next`
- `dist`
- `build`
- `coverage`

### Memory Settings

Help → Edit Custom VM Options:
```
-Xms1024m
-Xmx4096m
-XX:ReservedCodeCacheSize=512m
```

### Disable Unnecessary Inspections

Settings → Editor → Inspections:
- Disable inspections you don't use
- Set inspection severity appropriately

---

## Version Control

### Git Settings

Settings → Version Control → Git:
- Enable: ✓
- Commit: Use non-modal commit interface ✓
- Push: Update method: Rebase

### Commit Template

Settings → Version Control → Commit:
- Commit message template:
```
<type>(<scope>): <description>

<body>

<footer>
```

### Pre-commit Checks

Settings → Version Control → Commit → Before Commit:
- Reformat code: ✓
- Analyze code: ✓
- Check TODO: ✓

---

## Troubleshooting

### TypeScript Errors Not Showing
1. File → Invalidate Caches / Restart
2. Check TypeScript version in settings
3. Run `npm install`

### ESLint Not Working
1. Check ESLint is enabled in settings
2. Verify `.eslintrc` exists
3. Check ESLint plugin is installed

### Slow Performance
1. Increase memory in VM options
2. Exclude large directories
3. Disable unused plugins
4. Check "Power Save Mode" is off
