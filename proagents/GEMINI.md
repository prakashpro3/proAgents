# ProAgents Commands for Gemini

This project uses ProAgents - an AI-agnostic development workflow framework.

## Command Recognition

When user types commands starting with `pa:`, recognize and execute them:

## Core Commands
```
pa:help              → Show all available commands
pa:feature "name"    → Start new feature workflow
pa:fix "description" → Quick bug fix mode
pa:status            → Show current progress
```

## Documentation Commands
```
pa:doc               → Show documentation options
pa:doc-full          → Generate full project documentation
pa:doc-moderate      → Generate balanced documentation
pa:doc-lite          → Generate quick reference
pa:doc-module [name] → Document specific module
pa:doc-file [path]   → Document specific file
pa:doc-api           → Generate API documentation
pa:readme            → Generate/update README
pa:changelog         → Update CHANGELOG.md
pa:release           → Generate release notes
pa:release [version] → Version-specific release notes
```

## Quality & Testing Commands
```
pa:qa                → Run quality assurance checks
pa:test              → Run test workflow
pa:review            → Code review workflow
```

## Deployment Commands
```
pa:deploy            → Deployment preparation
pa:rollback          → Rollback procedures
```

## How to Execute

When user types a `pa:` command:

1. Read the corresponding prompt file from `./proagents/prompts/`
2. Follow the workflow instructions in that file
3. Use project configuration from `./proagents/proagents.config.yaml`

## Prompt File Mapping

| Command | Prompt File |
|---------|-------------|
| `pa:feature` | `./proagents/prompts/00-init.md` + `./proagents/WORKFLOW.md` |
| `pa:fix` | `./proagents/workflow-modes/entry-modes.md` (Bug Fix section) |
| `pa:doc*` | `./proagents/prompts/07-documentation.md` |
| `pa:qa` | `./proagents/checklists/code-quality.md` |
| `pa:test` | `./proagents/prompts/06-testing.md` |
| `pa:deploy` | `./proagents/prompts/08-deployment.md` |
| `pa:release` | `./proagents/prompts/07-documentation.md` (Release Notes section) |

## Key Files

- `./proagents/WORKFLOW.md` - Full 10-phase workflow documentation
- `./proagents/PROAGENTS.md` - Quick command reference
- `./proagents/prompts/` - Phase-specific AI prompts
- `./proagents/proagents.config.yaml` - Project configuration
