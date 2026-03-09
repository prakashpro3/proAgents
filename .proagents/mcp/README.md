# MCP (Model Context Protocol) Integration

Integrate ProAgents with AI tools that support the Model Context Protocol.

---

## Overview

MCP (Model Context Protocol) enables AI assistants like Claude to interact with external tools and data sources. ProAgents provides MCP servers that expose workflow capabilities directly to AI assistants.

---

## Quick Start

### 1. Install the MCP Server

```bash
npm install -g @proagents/mcp-server
```

### 2. Configure Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "proagents": {
      "command": "npx",
      "args": ["-y", "@proagents/mcp-server"],
      "env": {
        "PROAGENTS_PROJECT_PATH": "/path/to/your/project"
      }
    }
  }
}
```

### 3. Restart Claude Desktop

The ProAgents tools will now be available in Claude.

---

## Available MCP Tools

| Tool | Description |
|------|-------------|
| `proagents_init` | Initialize ProAgents in a project |
| `proagents_analyze` | Analyze codebase structure and patterns |
| `proagents_feature_start` | Start a new feature workflow |
| `proagents_feature_status` | Check current feature status |
| `proagents_fix` | Start bug fix workflow |
| `proagents_test` | Run tests |
| `proagents_doc` | Generate documentation |
| `proagents_deploy` | Start deployment workflow |
| `proagents_rollback` | Execute rollback procedures |

---

## MCP Resources

ProAgents exposes these resources via MCP:

| Resource | URI | Description |
|----------|-----|-------------|
| Project Config | `proagents://config` | Current configuration |
| Feature Status | `proagents://features` | Active features |
| Codebase Analysis | `proagents://analysis` | Cached analysis |
| Changelog | `proagents://changelog` | Recent changes |
| Todo List | `proagents://todos` | Current tasks |

---

## Configuration

```yaml
# proagents.config.yaml
mcp:
  enabled: true

  # Server settings
  server:
    port: 3100
    host: "localhost"

  # Exposed tools
  tools:
    - init
    - analyze
    - feature
    - fix
    - test
    - doc
    - deploy
    - rollback

  # Exposed resources
  resources:
    - config
    - features
    - analysis
    - changelog
    - todos

  # Security
  security:
    require_confirmation: true
    allowed_operations:
      - read
      - analyze
      - generate
    restricted_operations:
      - deploy
      - delete
```

---

## Documentation

- [Server Configuration](./server-config.md)
- [Tools Definition](./tools-definition.md)
- [Context Providers](./context-providers.md)

---

## Security Considerations

1. **Project Scope**: MCP server only accesses configured project paths
2. **Confirmation**: Destructive operations require confirmation
3. **Audit Logging**: All MCP operations are logged
4. **Rate Limiting**: Configurable rate limits for operations
