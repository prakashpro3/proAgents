# Standards Examples

Complete, ready-to-use standards for different project types.

---

## Available Examples

| Example | Description | Use Case |
|---------|-------------|----------|
| `react-nextjs.md` | React/Next.js frontend standards | Web frontends, full-stack Next.js |
| `nodejs-api.md` | Node.js backend API standards | REST APIs, microservices |

---

## How to Use

### 1. Review the Example

Read through the example that matches your project type.

### 2. Copy and Customize

```bash
# Copy to your standards directory
cp proagents/standards/examples/react-nextjs.md \
   proagents/standards/coding-standards.md

# Edit to match your project
```

### 3. Enable in Config

```yaml
# proagents.config.yaml
standards:
  coding: "proagents/standards/coding-standards.md"
  enforce: true
```

---

## Creating Your Own

Start with the closest example and modify:

1. **Naming conventions** - Match your team's preferences
2. **Directory structure** - Match your project layout
3. **Patterns** - Use patterns your team already uses
4. **Tools** - Reference the tools your project uses

---

## Contributing Examples

We welcome contributions! To add a new example:

1. Create `proagents/standards/examples/your-stack.md`
2. Follow the existing format (naming, structure, patterns)
3. Include real, working code examples
4. Test that the examples compile/run
