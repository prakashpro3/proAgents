# ProAgents Commands for GitHub Copilot

This project uses ProAgents workflow framework. Recognize `pa:` prefix commands.

## Commands

### Core
- `pa:help` - Show all commands
- `pa:feature "name"` - Start feature (read ./proagents/WORKFLOW.md)
- `pa:fix "bug"` - Bug fix mode (read ./proagents/workflow-modes/entry-modes.md)
- `pa:status` - Show progress

### Documentation
- `pa:doc` - Documentation options
- `pa:doc-full` - Full docs (read ./proagents/prompts/07-documentation.md)
- `pa:doc-moderate` - Balanced docs
- `pa:doc-lite` - Quick reference
- `pa:doc-module [name]` - Document module
- `pa:doc-file [path]` - Document file
- `pa:doc-api` - API documentation
- `pa:readme` - Generate README
- `pa:changelog` - Update CHANGELOG
- `pa:release` - Release notes
- `pa:release [ver]` - Version-specific notes

### Quality
- `pa:qa` - Quality checks (read ./proagents/checklists/code-quality.md)
- `pa:test` - Test workflow (read ./proagents/prompts/06-testing.md)
- `pa:review` - Code review

### Deployment
- `pa:deploy` - Deployment (read ./proagents/prompts/08-deployment.md)
- `pa:rollback` - Rollback procedures

## On `pa:` Command

1. Read corresponding file in `./proagents/prompts/` or `./proagents/workflow-modes/`
2. Follow the workflow instructions
3. Use config from `./proagents/proagents.config.yaml`

## Key Files

- `./proagents/WORKFLOW.md` - Full workflow
- `./proagents/PROAGENTS.md` - Command reference
- `./proagents/prompts/` - Phase prompts
