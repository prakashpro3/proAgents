# Coding Standards Template

Copy this file to `coding-standards.md` and customize for your project.

---

## Language: [JavaScript/TypeScript/Python/Go/etc.]

### Code Style

```yaml
indentation: [2 spaces | 4 spaces | tabs]
max_line_length: [80 | 100 | 120]
quotes: [single | double]
semicolons: [required | omit]
trailing_commas: [always | never | es5]
```

### Formatting

- Use [Prettier | Black | gofmt | etc.] for auto-formatting
- Configuration file: [.prettierrc | pyproject.toml | etc.]

---

## TypeScript Specific

```yaml
strict_mode: true
no_any: true
explicit_return_types: [always | public_only | never]
prefer_const: true
no_unused_variables: true
```

---

## Import Organization

Order imports as follows:
1. [Built-in modules]
2. [External dependencies]
3. [Internal absolute imports]
4. [Relative imports]
5. [Style imports]

Example:
```typescript
// 1. Built-in
import { useState } from 'react';

// 2. External
import axios from 'axios';

// 3. Internal absolute
import { Button } from '@/components';

// 4. Relative
import { helper } from './utils';

// 5. Styles
import styles from './Component.module.css';
```

---

## Comments

- Use JSDoc/docstrings for public APIs
- Inline comments only for non-obvious logic
- TODO format: `// TODO(author): description`
- No commented-out code in production

---

## Error Handling

- Always handle errors explicitly
- Use typed error classes
- Log errors with context
- User-facing errors should be friendly

---

## File Organization

```
src/
├── components/     # UI components
├── hooks/          # Custom hooks
├── services/       # API/business logic
├── utils/          # Pure utility functions
├── types/          # TypeScript types
└── constants/      # Constants and config
```

---

## Naming Conventions

See `naming-conventions.md` for detailed rules.

---

## Testing Requirements

See `testing-standards.md` for detailed rules.
