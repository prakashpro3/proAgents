# MCP Server Configuration

Detailed configuration options for the ProAgents MCP server.

---

## Server Setup

### Installation Methods

**Global Installation:**
```bash
npm install -g @proagents/mcp-server
proagents-mcp start
```

**NPX (No Installation):**
```bash
npx @proagents/mcp-server
```

**Docker:**
```bash
docker run -v /path/to/project:/project proagents/mcp-server
```

---

## Claude Desktop Configuration

### Basic Configuration

```json
{
  "mcpServers": {
    "proagents": {
      "command": "npx",
      "args": ["-y", "@proagents/mcp-server"],
      "env": {
        "PROAGENTS_PROJECT_PATH": "/path/to/project"
      }
    }
  }
}
```

### Multi-Project Configuration

```json
{
  "mcpServers": {
    "proagents-frontend": {
      "command": "npx",
      "args": ["-y", "@proagents/mcp-server"],
      "env": {
        "PROAGENTS_PROJECT_PATH": "/projects/frontend",
        "PROAGENTS_PROJECT_NAME": "frontend"
      }
    },
    "proagents-backend": {
      "command": "npx",
      "args": ["-y", "@proagents/mcp-server"],
      "env": {
        "PROAGENTS_PROJECT_PATH": "/projects/backend",
        "PROAGENTS_PROJECT_NAME": "backend"
      }
    }
  }
}
```

### Advanced Configuration

```json
{
  "mcpServers": {
    "proagents": {
      "command": "npx",
      "args": ["-y", "@proagents/mcp-server", "--config", "/path/to/mcp-config.json"],
      "env": {
        "PROAGENTS_PROJECT_PATH": "/path/to/project",
        "PROAGENTS_LOG_LEVEL": "debug",
        "PROAGENTS_CACHE_DIR": "/tmp/proagents-cache",
        "PROAGENTS_CONFIRM_DESTRUCTIVE": "true"
      }
    }
  }
}
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PROAGENTS_PROJECT_PATH` | Root path of the project | Current directory |
| `PROAGENTS_PROJECT_NAME` | Project identifier | Directory name |
| `PROAGENTS_CONFIG_PATH` | Path to proagents.config.yaml | Auto-detected |
| `PROAGENTS_LOG_LEVEL` | Logging level (debug, info, warn, error) | `info` |
| `PROAGENTS_CACHE_DIR` | Directory for cached data | `.proagents/cache` |
| `PROAGENTS_CONFIRM_DESTRUCTIVE` | Require confirmation for destructive ops | `true` |
| `PROAGENTS_MAX_FILE_SIZE` | Max file size to analyze (bytes) | `1048576` |
| `PROAGENTS_TIMEOUT` | Operation timeout (ms) | `30000` |

---

## Server Configuration File

Create `mcp-config.json` for advanced settings:

```json
{
  "server": {
    "name": "proagents",
    "version": "1.0.0",
    "transport": "stdio"
  },

  "project": {
    "path": "/path/to/project",
    "name": "my-project",
    "type": "auto"
  },

  "tools": {
    "enabled": [
      "init",
      "analyze",
      "feature",
      "fix",
      "test",
      "doc",
      "deploy",
      "rollback"
    ],
    "disabled": [],
    "confirmRequired": [
      "deploy",
      "rollback"
    ]
  },

  "resources": {
    "enabled": [
      "config",
      "features",
      "analysis",
      "changelog",
      "todos"
    ],
    "cacheTimeout": 300
  },

  "security": {
    "allowedPaths": [
      "/path/to/project"
    ],
    "deniedPaths": [
      "**/node_modules/**",
      "**/.git/**",
      "**/secrets/**"
    ],
    "maxFileSize": 1048576,
    "rateLimit": {
      "enabled": true,
      "maxRequests": 100,
      "windowMs": 60000
    }
  },

  "logging": {
    "level": "info",
    "file": "/var/log/proagents-mcp.log",
    "format": "json"
  }
}
```

---

## YAML Configuration

Alternatively, configure in `proagents.config.yaml`:

```yaml
mcp:
  server:
    name: "proagents"
    transport: "stdio"

  tools:
    enabled:
      - init
      - analyze
      - feature
      - fix
      - test
      - doc

    confirm_required:
      - deploy
      - rollback

  resources:
    enabled:
      - config
      - features
      - analysis
    cache_timeout: 300

  security:
    allowed_paths:
      - "${PROJECT_ROOT}"
    denied_paths:
      - "**/node_modules/**"
      - "**/.git/**"
    max_file_size: 1048576
```

---

## Transport Options

### stdio (Default)

Used with Claude Desktop:
```json
{
  "command": "proagents-mcp",
  "args": ["--transport", "stdio"]
}
```

### HTTP/SSE

For remote or web-based clients:
```bash
proagents-mcp --transport http --port 3100
```

```yaml
mcp:
  server:
    transport: "http"
    port: 3100
    host: "0.0.0.0"
    cors:
      enabled: true
      origins: ["https://claude.ai"]
```

---

## Debugging

### Enable Debug Logging

```bash
PROAGENTS_LOG_LEVEL=debug npx @proagents/mcp-server
```

### Test Server Connection

```bash
# Test MCP server is responding
proagents-mcp test

# List available tools
proagents-mcp list-tools

# List available resources
proagents-mcp list-resources
```

### View Logs

```bash
# View real-time logs
tail -f ~/.proagents/logs/mcp-server.log

# View last 100 operations
proagents-mcp logs --last 100
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Server not starting | Check Node.js version (>= 18) |
| Tools not appearing | Restart Claude Desktop |
| Permission denied | Check `PROAGENTS_PROJECT_PATH` permissions |
| Timeout errors | Increase `PROAGENTS_TIMEOUT` |
| Rate limiting | Adjust `rateLimit` settings |

---

## Best Practices

1. **Use Project-Specific Configs**: Different projects may need different settings
2. **Enable Confirmation**: Always require confirmation for destructive operations
3. **Limit Paths**: Only allow access to necessary directories
4. **Monitor Logs**: Review logs for unexpected operations
5. **Version Lock**: Pin MCP server version for stability
