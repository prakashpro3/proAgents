# Project Standards Configuration

Place your project-specific coding standards here. These override the default templates.

---

## How It Works

1. Copy templates from `/proagents/standards/examples/`
2. Customize for your project
3. ProAgents will use your standards during code generation and review

---

## Files to Create

| File | Purpose |
|------|---------|
| `coding-standards.md` | Code style and conventions |
| `architecture-rules.md` | Architectural patterns and constraints |
| `naming-conventions.md` | Naming rules for files, functions, variables |
| `testing-standards.md` | Testing requirements and patterns |

---

## Quick Start

```bash
# Copy example standards
cp proagents/standards/examples/react-nextjs.md \
   proagents/config/standards/coding-standards.md

# Edit for your project
vim proagents/config/standards/coding-standards.md
```

---

## Example Structure

```
proagents/config/standards/
├── README.md                    # This file
├── coding-standards.md          # Your coding standards
├── architecture-rules.md        # Your architecture rules
├── naming-conventions.md        # Your naming conventions
└── testing-standards.md         # Your testing standards
```

---

## Priority Order

When standards conflict, priority is:

1. `config/standards/` (highest - your project)
2. `standards/examples/` (framework defaults)
3. Auto-detected patterns (lowest)
