# MCP Tools Definition

Complete reference for ProAgents MCP tools available to AI assistants.

---

## Tool Schema

Each tool follows the MCP tool specification:

```typescript
interface Tool {
  name: string;
  description: string;
  inputSchema: JSONSchema;
}
```

---

## Workflow Tools

### proagents_init

Initialize ProAgents in a project.

```json
{
  "name": "proagents_init",
  "description": "Initialize ProAgents workflow in a project directory",
  "inputSchema": {
    "type": "object",
    "properties": {
      "project_path": {
        "type": "string",
        "description": "Path to the project root"
      },
      "project_type": {
        "type": "string",
        "enum": ["web-frontend", "fullstack", "backend", "mobile", "auto"],
        "description": "Type of project",
        "default": "auto"
      },
      "git_enabled": {
        "type": "boolean",
        "description": "Enable git integration",
        "default": true
      }
    },
    "required": ["project_path"]
  }
}
```

**Example Usage:**
```
Use proagents_init to set up the workflow in /projects/my-app
```

---

### proagents_analyze

Analyze codebase structure and patterns.

```json
{
  "name": "proagents_analyze",
  "description": "Analyze codebase to understand structure, patterns, and conventions",
  "inputSchema": {
    "type": "object",
    "properties": {
      "depth": {
        "type": "string",
        "enum": ["lite", "moderate", "full"],
        "description": "Analysis depth level",
        "default": "moderate"
      },
      "path": {
        "type": "string",
        "description": "Specific path to analyze (optional)"
      },
      "focus": {
        "type": "array",
        "items": {
          "type": "string",
          "enum": ["structure", "patterns", "dependencies", "conventions", "security"]
        },
        "description": "Specific aspects to focus on"
      },
      "use_cache": {
        "type": "boolean",
        "description": "Use cached analysis if available",
        "default": true
      }
    }
  }
}
```

**Example Usage:**
```
Use proagents_analyze with depth "full" to understand the authentication module
```

---

### proagents_feature_start

Start a new feature development workflow.

```json
{
  "name": "proagents_feature_start",
  "description": "Start a new feature development workflow with full tracking",
  "inputSchema": {
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "description": "Feature name/description"
      },
      "mode": {
        "type": "string",
        "enum": ["full", "fast", "minimal"],
        "description": "Workflow mode",
        "default": "full"
      },
      "branch": {
        "type": "string",
        "description": "Git branch name (auto-generated if not provided)"
      },
      "checkpoints": {
        "type": "object",
        "description": "Override default checkpoints"
      }
    },
    "required": ["name"]
  }
}
```

---

### proagents_feature_status

Check current feature status.

```json
{
  "name": "proagents_feature_status",
  "description": "Get status of current or specified feature",
  "inputSchema": {
    "type": "object",
    "properties": {
      "feature_id": {
        "type": "string",
        "description": "Feature ID (current feature if not specified)"
      },
      "include_history": {
        "type": "boolean",
        "description": "Include phase history",
        "default": false
      }
    }
  }
}
```

---

### proagents_fix

Start bug fix workflow.

```json
{
  "name": "proagents_fix",
  "description": "Start a bug fix workflow with streamlined process",
  "inputSchema": {
    "type": "object",
    "properties": {
      "description": {
        "type": "string",
        "description": "Bug description"
      },
      "severity": {
        "type": "string",
        "enum": ["critical", "high", "medium", "low"],
        "description": "Bug severity"
      },
      "mode": {
        "type": "string",
        "enum": ["quick", "standard", "thorough"],
        "description": "Fix mode",
        "default": "standard"
      },
      "related_files": {
        "type": "array",
        "items": { "type": "string" },
        "description": "Known affected files"
      }
    },
    "required": ["description"]
  }
}
```

---

## Testing Tools

### proagents_test

Run tests with various options.

```json
{
  "name": "proagents_test",
  "description": "Run project tests with configurable options",
  "inputSchema": {
    "type": "object",
    "properties": {
      "type": {
        "type": "string",
        "enum": ["all", "unit", "integration", "e2e"],
        "description": "Type of tests to run",
        "default": "all"
      },
      "path": {
        "type": "string",
        "description": "Specific test file or directory"
      },
      "coverage": {
        "type": "boolean",
        "description": "Generate coverage report",
        "default": true
      },
      "watch": {
        "type": "boolean",
        "description": "Run in watch mode",
        "default": false
      },
      "filter": {
        "type": "string",
        "description": "Filter tests by name pattern"
      }
    }
  }
}
```

---

## Documentation Tools

### proagents_doc

Generate documentation.

```json
{
  "name": "proagents_doc",
  "description": "Generate documentation for code, modules, or entire project",
  "inputSchema": {
    "type": "object",
    "properties": {
      "scope": {
        "type": "string",
        "enum": ["project", "module", "file", "function"],
        "description": "Documentation scope",
        "default": "project"
      },
      "target": {
        "type": "string",
        "description": "Target path for documentation"
      },
      "mode": {
        "type": "string",
        "enum": ["full", "moderate", "lite"],
        "description": "Documentation detail level",
        "default": "moderate"
      },
      "format": {
        "type": "string",
        "enum": ["markdown", "html", "json"],
        "description": "Output format",
        "default": "markdown"
      },
      "include_examples": {
        "type": "boolean",
        "description": "Include usage examples",
        "default": true
      }
    }
  }
}
```

---

## Deployment Tools

### proagents_deploy

Start deployment workflow.

```json
{
  "name": "proagents_deploy",
  "description": "Start deployment workflow with pre-flight checks",
  "inputSchema": {
    "type": "object",
    "properties": {
      "environment": {
        "type": "string",
        "enum": ["development", "staging", "production"],
        "description": "Target environment"
      },
      "skip_tests": {
        "type": "boolean",
        "description": "Skip test execution (not recommended)",
        "default": false
      },
      "dry_run": {
        "type": "boolean",
        "description": "Simulate deployment without executing",
        "default": false
      }
    },
    "required": ["environment"]
  }
}
```

**Requires Confirmation:** Yes

---

### proagents_rollback

Execute rollback procedures.

```json
{
  "name": "proagents_rollback",
  "description": "Rollback to previous version with safety checks",
  "inputSchema": {
    "type": "object",
    "properties": {
      "target": {
        "type": "string",
        "description": "Target version/commit/tag to rollback to"
      },
      "environment": {
        "type": "string",
        "enum": ["staging", "production"],
        "description": "Environment to rollback"
      },
      "include_database": {
        "type": "boolean",
        "description": "Include database rollback",
        "default": false
      },
      "dry_run": {
        "type": "boolean",
        "description": "Simulate rollback",
        "default": true
      }
    },
    "required": ["environment"]
  }
}
```

**Requires Confirmation:** Yes

---

## Quality Tools

### proagents_qa

Run quality assurance checks.

```json
{
  "name": "proagents_qa",
  "description": "Run comprehensive quality assurance checks",
  "inputSchema": {
    "type": "object",
    "properties": {
      "checks": {
        "type": "array",
        "items": {
          "type": "string",
          "enum": ["lint", "types", "security", "performance", "accessibility", "all"]
        },
        "description": "QA checks to run",
        "default": ["all"]
      },
      "fix": {
        "type": "boolean",
        "description": "Auto-fix issues where possible",
        "default": false
      },
      "path": {
        "type": "string",
        "description": "Specific path to check"
      }
    }
  }
}
```

---

## Utility Tools

### proagents_status

Get overall workflow status.

```json
{
  "name": "proagents_status",
  "description": "Get current workflow and project status",
  "inputSchema": {
    "type": "object",
    "properties": {
      "include_features": {
        "type": "boolean",
        "description": "Include active features",
        "default": true
      },
      "include_todos": {
        "type": "boolean",
        "description": "Include todo list",
        "default": true
      },
      "include_metrics": {
        "type": "boolean",
        "description": "Include recent metrics",
        "default": false
      }
    }
  }
}
```

---

## Tool Response Format

All tools return responses in this format:

```typescript
interface ToolResponse {
  success: boolean;
  data?: any;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    duration_ms: number;
    cached: boolean;
    warnings?: string[];
  };
}
```

**Example Success Response:**
```json
{
  "success": true,
  "data": {
    "feature_id": "feature-user-auth",
    "status": "in_progress",
    "current_phase": "implementation",
    "progress": 65
  },
  "metadata": {
    "duration_ms": 45,
    "cached": false
  }
}
```

**Example Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "FEATURE_NOT_FOUND",
    "message": "No active feature found",
    "details": {
      "suggestion": "Start a new feature with proagents_feature_start"
    }
  }
}
```

---

## Best Practices

1. **Check Status First**: Use `proagents_status` before starting operations
2. **Use Appropriate Depth**: Start with `lite` analysis, go deeper if needed
3. **Leverage Caching**: Use cached data for repeated queries
4. **Confirm Destructive Operations**: Always use `dry_run` first for deploy/rollback
5. **Provide Context**: Include related files and descriptions for better results
