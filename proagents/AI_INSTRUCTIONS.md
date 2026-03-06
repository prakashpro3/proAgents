# AI Instructions for ProAgents

This project uses ProAgents - an AI-agnostic development workflow framework.

## Command Recognition

When the user types commands starting with `pa:`, recognize and execute them:

### Initialization
| Command | Action |
|---------|--------|
| `pa:init` | Initialize ProAgents in project |
| `pa:help` | Show all available commands |
| `pa:status` | Show current progress |

### Feature Development
| Command | Action |
|---------|--------|
| `pa:feature "name"` | Start new feature workflow |
| `pa:feature-start "name"` | Start new feature |
| `pa:feature-status` | Check feature status |
| `pa:feature-list` | List all features |
| `pa:feature-complete` | Mark feature complete |
| `pa:fix "description"` | Quick bug fix mode |

### Documentation Commands
| Command | Action |
|---------|--------|
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
| Command | Action |
|---------|--------|
| `pa:qa` | Run quality assurance checks |
| `pa:test` | Run test workflow |
| `pa:review` | Code review workflow |

### Deployment
| Command | Action |
|---------|--------|
| `pa:deploy` | Deployment preparation |
| `pa:rollback` | Rollback procedures |

### AI Platform Management
| Command | Action |
|---------|--------|
| `pa:ai-list` | List installed AI platforms |
| `pa:ai-add` | Add more AI platforms |
| `pa:ai-remove` | Remove AI platforms from config |

**How to execute AI Platform commands:**

For `pa:ai-list`:
- Read `./proagents/proagents.config.yaml` and show the `platforms` array
- Show which AI instruction files exist in project root

For `pa:ai-add`:
1. Show available platforms to user:
   | Platform | File Created |
   |----------|--------------|
   | Claude Code | CLAUDE.md |
   | Cursor | .cursorrules |
   | Windsurf | .windsurfrules |
   | GitHub Copilot | .github/copilot-instructions.md |
   | ChatGPT | CHATGPT.md |
   | Gemini | GEMINI.md |
   | Bolt | BOLT.md |
   | Lovable | LOVABLE.md |
   | Replit | REPLIT.md |
   | Kiro | KIRO.md |
   | Groq | GROQ.md |
   | AntiGravity | ANTIGRAVITY.md |

2. Ask user which platforms to add
3. For each selected platform:
   - Copy content from `./proagents/{PLATFORM}.md` (e.g., `./proagents/CLAUDE.md`)
   - If target file exists, wrap new content with markers and append:
     ```
     <!-- PROAGENTS:START -->
     {content from proagents folder}
     <!-- PROAGENTS:END -->
     ```
   - If target file doesn't exist, create it with the content wrapped in markers
4. Update `./proagents/proagents.config.yaml` to add platform to `platforms` array

For `pa:ai-remove`:
1. Read `./proagents/proagents.config.yaml` to get current platforms
2. Show list and ask which to remove
3. For each selected:
   - Remove the PROAGENTS section (between markers) from the file, OR delete the file if it only contains ProAgents content
   - Update config to remove from `platforms` array

### Configuration
| Command | Action |
|---------|--------|
| `pa:config` | Show current configuration |
| `pa:config-list` | List all configurable options |
| `pa:config-show` | Show current config values |
| `pa:config-set K V` | Set a config value |
| `pa:config-get K` | Get a config value |
| `pa:config-setup` | Interactive config wizard |
| `pa:config-customize` | Copy templates to customize |

### Utilities
| Command | Action |
|---------|--------|
| `pa:uninstall` | Remove ProAgents from project |

## How to Execute Commands

When user types a `pa:` command:

1. **Read the corresponding prompt file** from `./proagents/prompts/`
2. **Follow the workflow** defined in that prompt
3. **Use project context** from `./proagents/` folder

### Prompt File Mapping
- `pa:feature` → `./proagents/prompts/00-init.md` + workflow
- `pa:fix` → `./proagents/workflow-modes/entry-modes.md` (Bug Fix section)
- `pa:doc*` → `./proagents/prompts/07-documentation.md`
- `pa:qa` → `./proagents/checklists/code-quality.md`
- `pa:test` → `./proagents/prompts/06-testing.md`
- `pa:deploy` → `./proagents/prompts/08-deployment.md`
- `pa:release` → `./proagents/prompts/07-documentation.md` (Release Notes section)

## Workflow Reference

Full workflow documentation: `./proagents/WORKFLOW.md`
Quick command reference: `./proagents/PROAGENTS.md`

## Important

- Always check `./proagents/` folder for project-specific configurations
- Preserve user's `proagents.config.yaml` settings
- Follow existing code patterns found in the project
