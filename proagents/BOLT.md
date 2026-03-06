# ProAgents Commands for Bolt.new

This project uses ProAgents - an AI-agnostic development workflow framework.

## Essential Commands

| Command | Action |
|---------|--------|
| `pa:feature "name"` | Start new feature workflow |
| `pa:fix "bug"` | Quick bug fix mode |
| `pa:doc` | Documentation options |
| `pa:qa` | Quality assurance checks |
| `pa:test` | Run test workflow |
| `pa:deploy` | Deployment preparation |
| `pa:status` | Show current progress |

## Full Command Reference

For complete command list, see: `./proagents/AI_INSTRUCTIONS.md`

## On `pa:` Command

1. Read the corresponding file from `./proagents/prompts/` or `./proagents/workflow-modes/`
2. Follow the workflow instructions
3. Use project config from `./proagents/proagents.config.yaml`

## Key Files

- `./proagents/AI_INSTRUCTIONS.md` - Complete command reference
- `./proagents/WORKFLOW.md` - Full 10-phase workflow
- `./proagents/prompts/` - Phase-specific prompts
