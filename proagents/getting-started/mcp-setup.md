# Getting Started with MCP Integration

Step-by-step guide to setting up Model Context Protocol (MCP) for ProAgents.

---

## What is MCP?

Model Context Protocol (MCP) allows AI assistants like Claude to access external tools and data sources. With MCP, ProAgents can:

- Execute workflow commands natively
- Access project context automatically
- Integrate with your development tools
- Provide real-time project information

---

## Prerequisites

- Claude Desktop app (or compatible MCP client)
- Node.js 18+ installed
- ProAgents initialized in your project

---

## Step 1: Install MCP Server

### Option A: Global Installation

```bash
npm install -g @proagents/mcp-server
```

### Option B: Project Installation

```bash
npm install --save-dev @proagents/mcp-server
```

### Option C: Use npx (No Installation)

```bash
npx @proagents/mcp-server
```

---

## Step 2: Configure Claude Desktop

Edit your Claude Desktop configuration:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "proagents": {
      "command": "npx",
      "args": ["@proagents/mcp-server"],
      "env": {
        "PROAGENTS_PROJECT_PATH": "/path/to/your/project"
      }
    }
  }
}
```

---

## Step 3: Verify Installation

1. Restart Claude Desktop
2. Start a new conversation
3. Ask Claude: "What ProAgents tools are available?"

You should see a list of available tools like:
- `proagents_init`
- `proagents_analyze`
- `proagents_feature_start`
- etc.

---

## Step 4: Configure Project Settings

In your project's `proagents.config.yaml`:

```yaml
mcp:
  enabled: true

  # Tools to expose
  tools:
    - init
    - analyze
    - feature_start
    - fix
    - test
    - deploy

  # Context to provide
  context:
    project_info: true
    git_status: true
    active_features: true
    recent_changes: true

  # Security settings
  security:
    allow_file_write: true
    allow_git_operations: true
    require_confirmation:
      - deploy
      - rollback
```

---

## Step 5: Test MCP Integration

Try these commands in Claude:

```
"Initialize ProAgents in my project"
→ Claude uses proagents_init tool

"Analyze the codebase"
→ Claude uses proagents_analyze tool

"Start working on user authentication"
→ Claude uses proagents_feature_start tool
```

---

## Available MCP Tools

| Tool | Description |
|------|-------------|
| `proagents_init` | Initialize ProAgents in a project |
| `proagents_analyze` | Analyze codebase |
| `proagents_feature_start` | Start a new feature |
| `proagents_fix` | Start bug fix mode |
| `proagents_test` | Run tests |
| `proagents_review` | Code review |
| `proagents_deploy` | Deployment preparation |
| `proagents_status` | Get current status |

---

## Context Providers

MCP provides these context resources:

| Resource | URI | Description |
|----------|-----|-------------|
| Project Info | `proagents://project` | Project configuration |
| Analysis | `proagents://analysis` | Codebase analysis results |
| Features | `proagents://features` | Active features list |
| Status | `proagents://status` | Current workflow status |

---

## Troubleshooting

### MCP Server Not Found

```bash
# Verify installation
which proagents-mcp-server

# Or use npx
npx @proagents/mcp-server --version
```

### Connection Issues

1. Check Claude Desktop logs
2. Verify config.json syntax
3. Restart Claude Desktop

### Permission Errors

```yaml
# In proagents.config.yaml
mcp:
  security:
    allow_file_write: true
```

---

## Advanced Configuration

### Multiple Projects

```json
{
  "mcpServers": {
    "proagents-frontend": {
      "command": "npx",
      "args": ["@proagents/mcp-server"],
      "env": {
        "PROAGENTS_PROJECT_PATH": "/path/to/frontend"
      }
    },
    "proagents-backend": {
      "command": "npx",
      "args": ["@proagents/mcp-server"],
      "env": {
        "PROAGENTS_PROJECT_PATH": "/path/to/backend"
      }
    }
  }
}
```

### Custom Tool Configuration

```yaml
mcp:
  custom_tools:
    - name: "run_migrations"
      description: "Run database migrations"
      command: "npm run migrate"

    - name: "seed_database"
      description: "Seed the database"
      command: "npm run seed"
```

---

## Next Steps

- [Configure PM Integration](./pm-integration.md)
- [Set up AI Training](./ai-training-setup.md)
- [Review MCP Tools Reference](../mcp/tools-definition.md)
