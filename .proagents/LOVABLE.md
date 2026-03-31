# ProAgents Commands for Lovable

This project uses ProAgents - an AI-agnostic development workflow framework.

> **IMPORTANT:** `pa:` commands are **AI directives**, NOT shell/terminal commands.
> When user types ANY `pa:` command (e.g., `pa:feature`, `pa:fix`, `pa:status`),
> DO NOT try to run it in terminal. Instead, follow the instructions below.

## Auto-Sync Protocol

### Rule: Sync for commands that WRITE, skip for commands that READ

### Workflow Commands (Auto-Sync Required)

Commands that CREATE or MODIFY code/content need context:

**BEFORE these commands, read:**
```bash
cat .proagents/worklog/_context.md      # Current state
cat .proagents/changelog/_recent.md     # Recent changes
tail -10 .proagents/activity.log        # Recent activity
```

**Examples:** `pa:feature`, `pa:fix`, `pa:implement`, `pa:analyze`,
`pa:design`, `pa:plan`, `pa:test`, `pa:review`, `pa:doc`, `pa:deploy`,
`pa:rnd`, `pa:refactor`, `pa:debug`, `pa:qa`, `pa:changelog`, `pa:release`, `pa:resume`,
`pa:session-start`, `pa:session-end`

### Utility Commands (No Sync Required)

Commands that only READ, DISPLAY, or CONFIGURE:
- **Skip BEFORE step** - No context reading needed
- **Skip AFTER step** - No logging needed

**Examples:** `pa:help`, `pa:status`, `pa:progress`, `pa:history`,
`pa:ai-*`, `pa:config-*`, `pa:sync`, `pa:commit`, `pa:commit-config`

### AFTER Workflow Commands (Auto-Log)

**After commands that CHANGE files, update:**
1. `.proagents/changelog/_recent.md` - Prepend change summary
2. `.proagents/worklog/_context.md` - Update current state

## Essential Commands

| Command | Action |
|---------|--------|
| `pa:feature "name"` | Start new feature workflow |
| `pa:fix "bug"` | Quick bug fix mode |
| `pa:project-setup` | Interactive project setup wizard |
| `pa:rnd` | Research & Development workflow |
| `pa:doc` | Documentation options |
| `pa:qa` | Quality assurance checks |
| `pa:test` | Run test workflow |
| `pa:deploy` | Deployment preparation |
| `pa:status` | Show current progress |

## Full Command Reference

For complete command list, see: `./.proagents/AI_INSTRUCTIONS.md`

## On `pa:` Command

1. Read the corresponding file from `./.proagents/prompts/` or `./.proagents/workflow-modes/`
2. Follow the workflow instructions
3. Use project config from `./.proagents/proagents.config.yaml`

## Key Files

- `./.proagents/AI_INSTRUCTIONS.md` - Complete command reference
- `./.proagents/WORKFLOW.md` - Full 10-phase workflow
- `./.proagents/prompts/` - Phase-specific prompts
