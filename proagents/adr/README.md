# Architecture Decision Records (ADR)

Document architectural decisions in a structured, maintainable format.

---

## Overview

Architecture Decision Records (ADRs) capture important architectural decisions along with their context and consequences. They help teams understand why decisions were made and serve as a historical record.

---

## Quick Start

### Create a New ADR

```bash
# Using ProAgents command
/adr new "Use PostgreSQL for primary database"

# Creates: adr/0001-use-postgresql-for-primary-database.md
```

### List Existing ADRs

```bash
# List all ADRs
/adr list

# Filter by status
/adr list --status accepted

# Search ADRs
/adr search "database"
```

---

## ADR Structure

```
/adr/
├── README.md              # This file
├── template.md            # ADR template
├── 0001-record-title.md   # First decision
├── 0002-record-title.md   # Second decision
└── examples/              # Example ADRs
    ├── database-choice.md
    └── api-versioning.md
```

---

## ADR Lifecycle

```
┌──────────┐    ┌──────────┐    ┌──────────┐
│ Proposed │ →  │ Accepted │ →  │ Superseded │
└──────────┘    └──────────┘    └──────────┘
      │               │
      └───────────────┼──────→ ┌──────────┐
                      │        │ Deprecated │
                      │        └──────────┘
                      │
                      └──────→ ┌──────────┐
                               │ Rejected │
                               └──────────┘
```

### Status Definitions

| Status | Description |
|--------|-------------|
| **Proposed** | Under discussion, not yet decided |
| **Accepted** | Decision made and in effect |
| **Deprecated** | Still valid but discouraged for new work |
| **Superseded** | Replaced by another ADR |
| **Rejected** | Considered but not adopted |

---

## When to Write an ADR

Write an ADR when making decisions about:

- **Architecture patterns** - Microservices vs monolith, event-driven, etc.
- **Technology choices** - Languages, frameworks, databases, tools
- **Standards** - Coding conventions, API design, testing approaches
- **Infrastructure** - Cloud services, deployment strategies
- **Security** - Authentication, encryption, access control
- **Integration** - Third-party services, APIs, protocols

**Rule of thumb**: If the decision is significant enough that someone might ask "why did we do it this way?" in 6 months, write an ADR.

---

## ADR Template

```markdown
# ADR-NNNN: [Title]

## Status
[Proposed | Accepted | Deprecated | Superseded | Rejected]

## Context
[Describe the situation and the problem or opportunity]

## Decision
[State the decision clearly]

## Consequences
[List the positive and negative outcomes]

## Alternatives Considered
[What other options were evaluated]

## References
[Links to related resources, discussions, ADRs]
```

See [template.md](./template.md) for the full template.

---

## Best Practices

### Writing Good ADRs

1. **Be concise** - ADRs should be readable in a few minutes
2. **Be specific** - State exactly what was decided
3. **Include context** - Explain why the decision was needed
4. **List alternatives** - Show what else was considered
5. **Be honest** - Include tradeoffs and negative consequences

### Managing ADRs

1. **Number sequentially** - Use format `NNNN-title.md`
2. **Never delete** - Mark as superseded/deprecated instead
3. **Link related ADRs** - Reference related decisions
4. **Review periodically** - Check if decisions still apply
5. **Keep in source control** - ADRs are part of the codebase

### ADR Reviews

- ADRs should be reviewed like code
- Get input from affected stakeholders
- Consider creating a decision brief before writing ADR

---

## ADR Commands

```bash
# Create new ADR
/adr new "Decision title"

# Create from template
/adr new --template security "Implement OAuth 2.0"

# List ADRs
/adr list
/adr list --status accepted
/adr list --tag database

# Search ADRs
/adr search "authentication"

# Show ADR
/adr show 0001

# Update status
/adr status 0001 --set deprecated

# Supersede ADR
/adr supersede 0001 --with 0015

# Generate index
/adr index

# Export ADRs
/adr export --format html
```

---

## Configuration

```yaml
# proagents.config.yaml
adr:
  directory: "./adr"
  template: "./adr/template.md"

  format:
    number_width: 4
    title_case: "kebab"

  templates:
    default: "template.md"
    security: "templates/security-adr.md"
    api: "templates/api-adr.md"

  workflow:
    require_review: true
    reviewers:
      - "@tech-lead"
      - "@architect"

  metadata:
    tags: true
    date: true
    author: true
```

---

## Examples

### Example ADRs

- [Database Choice](./examples/database-choice.md) - Choosing PostgreSQL
- [API Versioning](./examples/api-versioning.md) - URL-based versioning strategy

### Quick Example

```markdown
# ADR-0001: Use React for Frontend Framework

## Status
Accepted

## Context
We need to choose a frontend framework for our new web application.
The team has experience with both React and Vue.

## Decision
We will use React as our frontend framework.

## Consequences
**Positive:**
- Large ecosystem and community
- Team already has React experience
- Good integration with our tooling

**Negative:**
- Steeper learning curve for new developers
- More boilerplate than some alternatives

## Alternatives Considered
1. **Vue.js** - Simpler but less ecosystem support
2. **Angular** - Too opinionated for our needs
3. **Svelte** - Interesting but team lacks experience

## References
- [React Documentation](https://react.dev)
- Team survey results (internal doc)
```

---

## Integration

### With Documentation

ADRs can be integrated into your documentation site:

```yaml
# mkdocs.yml
nav:
  - Architecture:
    - Decisions: adr/index.md
```

### With GitHub

ADR changes can trigger reviews:

```yaml
# .github/CODEOWNERS
/adr/ @tech-lead @architect
```

### With Slack

Notify team of new ADRs:

```yaml
adr:
  notifications:
    slack:
      channel: "#architecture"
      on_new: true
      on_status_change: true
```

---

## Resources

- [ADR GitHub Organization](https://adr.github.io/)
- [Documenting Architecture Decisions - Michael Nygard](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [ADR Tools](https://github.com/npryce/adr-tools)
