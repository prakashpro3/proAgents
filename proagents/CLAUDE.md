# ProAgents Commands for Claude

This project uses ProAgents. Recognize `pa:` commands:

## Commands

```
pa:help              → Show all commands
pa:feature "name"    → Start feature (read ./proagents/WORKFLOW.md)
pa:fix "bug"         → Bug fix mode (read ./proagents/workflow-modes/entry-modes.md)
pa:status            → Show progress
pa:doc               → Documentation options
pa:doc-full          → Full docs (read ./proagents/prompts/07-documentation.md)
pa:doc-moderate      → Balanced docs
pa:doc-lite          → Quick reference
pa:qa                → Quality checks (read ./proagents/checklists/code-quality.md)
pa:test              → Test workflow (read ./proagents/prompts/06-testing.md)
pa:deploy            → Deployment (read ./proagents/prompts/08-deployment.md)
pa:release           → Release notes
pa:release [ver]     → Version-specific notes
```

## On `pa:` command

1. Read the corresponding file in `./proagents/prompts/` or `./proagents/workflow-modes/`
2. Follow the workflow instructions
3. Use project config from `./proagents/proagents.config.yaml`

## Key Files

- `./proagents/WORKFLOW.md` - Full 10-phase workflow
- `./proagents/PROAGENTS.md` - Quick command reference
- `./proagents/prompts/` - Phase-specific prompts
