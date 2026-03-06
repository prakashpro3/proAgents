# ProAgents Commands for GitHub Copilot

This project uses ProAgents workflow framework. Recognize `pa:` prefix commands.

## Commands

### Initialization
- `pa:init` - Initialize ProAgents in project
- `pa:help` - Show all commands
- `pa:status` - Show progress

### Feature Development
- `pa:feature "name"` - Start feature (read ./proagents/WORKFLOW.md)
- `pa:feature-start "name"` - Start new feature
- `pa:feature-status` - Check feature status
- `pa:feature-list` - List all features
- `pa:feature-complete` - Mark feature complete
- `pa:fix "bug"` - Bug fix mode (read ./proagents/workflow-modes/entry-modes.md)

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

### Quality & Testing
- `pa:qa` - Quality checks (read ./proagents/checklists/code-quality.md)
- `pa:test` - Test workflow (read ./proagents/prompts/06-testing.md)
- `pa:review` - Code review

### Deployment
- `pa:deploy` - Deployment (read ./proagents/prompts/08-deployment.md)
- `pa:rollback` - Rollback procedures

### AI Platform Management
- `pa:ai-list` - List installed AI platforms
- `pa:ai-add` - Add more AI platforms
- `pa:ai-remove` - Remove AI platforms from config

### Configuration
- `pa:config` - Show current configuration
- `pa:config-list` - List all configurable options
- `pa:config-show` - Show current config values
- `pa:config-set K V` - Set a config value
- `pa:config-get K` - Get a config value
- `pa:config-setup` - Interactive config wizard
- `pa:config-customize` - Copy templates to customize

### Utilities
- `pa:uninstall` - Remove ProAgents from project

## On `pa:` Command

1. Read corresponding file in `./proagents/prompts/` or `./proagents/workflow-modes/`
2. Follow the workflow instructions
3. Use config from `./proagents/proagents.config.yaml`

## Key Files

- `./proagents/WORKFLOW.md` - Full workflow
- `./proagents/PROAGENTS.md` - Command reference
- `./proagents/prompts/` - Phase prompts
