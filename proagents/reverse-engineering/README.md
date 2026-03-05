# Reverse Engineering System

Analyze existing codebases to extract architecture, patterns, and documentation.

---

## Overview

Reverse engineering enables ProAgents to:

- **Understand** existing codebases without documentation
- **Extract** architecture, patterns, and conventions
- **Generate** documentation from code
- **Create** visual diagrams of system structure
- **Map** dependencies and relationships
- **Identify** tech debt and improvement opportunities

---

## Use Cases

### 1. Onboarding to Existing Project
```
pa:reverse-engineer --full

Output:
- Complete architecture documentation
- Component relationship diagrams
- API endpoint mapping
- Database schema visualization
- Pattern guide for new developers
```

### 2. Documentation Generation
```
pa:reverse-engineer --docs

Output:
- README for each module
- API documentation
- Component documentation
- Architecture decision records
```

### 3. Architecture Understanding
```
pa:reverse-engineer --architecture

Output:
- High-level architecture diagram
- Module dependency graph
- Data flow documentation
- Integration points
```

### 4. Code Quality Assessment
```
pa:reverse-engineer --quality

Output:
- Tech debt identification
- Code smell detection
- Refactoring opportunities
- Complexity analysis
```

---

## Reverse Engineering Phases

### Phase 1: Discovery
- Scan all files and directories
- Identify frameworks and languages
- Detect configuration files
- Map project structure

### Phase 2: Analysis
- Parse source code
- Extract classes, functions, components
- Map imports and dependencies
- Identify patterns and conventions

### Phase 3: Relationship Mapping
- Build dependency graph
- Map component relationships
- Trace data flow
- Identify integration points

### Phase 4: Documentation Generation
- Generate architecture docs
- Create API documentation
- Produce component guides
- Build visual diagrams

### Phase 5: Insight Extraction
- Identify patterns used
- Extract conventions
- Detect anti-patterns
- Suggest improvements

---

## Quick Start

```bash
# Full reverse engineering
/reverse-engineer

# Specific scope
pa:reverse-engineer --scope architecture
pa:reverse-engineer --scope api
pa:reverse-engineer --scope components
pa:reverse-engineer --scope database

# Output format
pa:reverse-engineer --format markdown
pa:reverse-engineer --format html
pa:reverse-engineer --format json

# Specific path
pa:reverse-engineer --path ./src/modules/auth
```

---

## Files in This Section

| File | Description |
|------|-------------|
| `README.md` | This overview |
| `architecture-extraction.md` | How to extract architecture |
| `code-analysis.md` | Deep code analysis guide |
| `documentation-generation.md` | Auto-generate docs from code |
| `diagram-generation.md` | Generate visual diagrams |
| `pattern-detection.md` | Detect patterns and conventions |
| `dependency-mapping.md` | Map dependencies |
| `quality-assessment.md` | Code quality analysis |

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `pa:reverse-engineer` | Full reverse engineering |
| `pa:re-architecture` | Extract architecture only |
| `pa:re-docs` | Generate documentation |
| `pa:re-diagrams` | Generate diagrams |
| `pa:re-patterns` | Detect patterns |
| `pa:re-deps` | Map dependencies |
| `pa:re-quality` | Quality assessment |
