# ProAgents Commands for Antigravity IDE

This project uses ProAgents - an AI-agnostic development workflow framework.

## Command Recognition

When user types commands starting with `pa:`, recognize and execute them:

## Available Commands

### Initialization
| Command | Description |
|---------|-------------|
| `pa:init` | Initialize ProAgents in project |
| `pa:help` | Show all available commands |
| `pa:status` | Show current progress |

### Feature Development
| Command | Description |
|---------|-------------|
| `pa:feature "name"` | Start new feature workflow |
| `pa:feature-start "name"` | Start new feature |
| `pa:feature-status` | Check feature status |
| `pa:feature-list` | List all features |
| `pa:feature-complete` | Mark feature complete |
| `pa:fix "description"` | Quick bug fix mode |

### Documentation Commands
| Command | Description |
|---------|-------------|
| `pa:doc` | Show documentation options |
| `pa:doc-full` | Generate full project documentation |
| `pa:doc-moderate` | Generate balanced documentation |
| `pa:doc-lite` | Generate quick reference |
| `pa:doc-module [name]` | Document specific module |
| `pa:doc-file [path]` | Document specific file |
| `pa:doc-api` | Generate API documentation |
| `pa:readme` | Generate/update README |
| `pa:changelog` | Update CHANGELOG.md |
| `pa:release` | Generate release notes |
| `pa:release [version]` | Version-specific release notes |

### Quality & Testing
| Command | Description |
|---------|-------------|
| `pa:qa` | Run quality assurance checks |
| `pa:test` | Run test workflow |
| `pa:review` | Code review workflow |

### Deployment
| Command | Description |
|---------|-------------|
| `pa:deploy` | Deployment preparation |
| `pa:rollback` | Rollback procedures |

### AI Platform Management
| Command | Description |
|---------|-------------|
| `pa:ai-list` | List installed AI platforms |
| `pa:ai-add` | Add more AI platforms |
| `pa:ai-remove` | Remove AI platforms from config |

### Configuration
| Command | Description |
|---------|-------------|
| `pa:config` | Show current configuration |
| `pa:config-list` | List all configurable options |
| `pa:config-show` | Show current config values |
| `pa:config-set K V` | Set a config value |
| `pa:config-get K` | Get a config value |
| `pa:config-setup` | Interactive config wizard |
| `pa:config-customize` | Copy templates to customize |

### Utilities
| Command | Description |
|---------|-------------|
| `pa:uninstall` | Remove ProAgents from project |

## Execution Instructions

When user types a `pa:` command:

1. **Read the corresponding prompt file** from `./proagents/prompts/`
2. **Follow the workflow** defined in that prompt
3. **Use project config** from `./proagents/proagents.config.yaml`

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

## Key Reference Files

| File | Purpose |
|------|---------|
| `./proagents/WORKFLOW.md` | Full 10-phase workflow documentation |
| `./proagents/PROAGENTS.md` | Quick command reference |
| `./proagents/prompts/` | Phase-specific AI prompts |
| `./proagents/proagents.config.yaml` | Project configuration |

## Important Notes

- Works with both Gemini and Claude models in Antigravity
- Always check `./proagents/` folder for project-specific configurations
- Preserve user's `proagents.config.yaml` settings
- Follow existing code patterns found in the project
- Use the checklists in `./proagents/checklists/` for quality gates
