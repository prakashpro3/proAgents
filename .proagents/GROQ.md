# ProAgents Commands for Groq

This project uses ProAgents - an AI-agnostic development workflow framework.

## ⚠️ MANDATORY: Every pa: Command Flow

### BEFORE Any pa: Command (Auto-Sync)

**Read these files FIRST before doing anything:**

```bash
cat .proagents/worklog/_context.md      # Current state
cat .proagents/changelog/_recent.md     # Recent changes
tail -10 .proagents/activity.log        # Recent activity
```

**This applies to EVERY command:** `pa:fix`, `pa:feature`, `pa:test`, `pa:doc`, etc.

### AFTER Any pa: Command (Auto-Log)

**After EVERY file edit, IMMEDIATELY update these files:**

1. `.proagents/changelog/_recent.md` - Prepend change summary
2. `.proagents/changelog/modules/[module].md` - Based on file path
3. `.proagents/worklog/_context.md` - Update current state

Module detection: `src/api/*`→api, `src/auth/*`→auth, `src/components/*`→ui

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

For complete command list, see: `./.proagents/AI_INSTRUCTIONS.md`

## On `pa:` Command

1. Read the corresponding file from `./.proagents/prompts/` or `./.proagents/workflow-modes/`
2. Follow the workflow instructions
3. Use project config from `./.proagents/proagents.config.yaml`

## Key Files

- `./.proagents/AI_INSTRUCTIONS.md` - Complete command reference
- `./.proagents/WORKFLOW.md` - Full 10-phase workflow
- `./.proagents/prompts/` - Phase-specific prompts
