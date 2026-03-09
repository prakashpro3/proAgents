# Codebase Analysis Report

**Project:** [Project Name]
**Analysis Date:** [YYYY-MM-DD]
**Analysis Depth:** [Full / Moderate / Lite]

---

## Executive Summary

[Brief overview of the codebase - 2-3 sentences describing the project, its purpose, and overall health]

---

## Project Overview

### Basic Information

| Property | Value |
|----------|-------|
| Project Type | [Web Frontend / Full-stack / Mobile / Backend] |
| Primary Language | [TypeScript / JavaScript / etc.] |
| Framework | [React / Next.js / Express / etc.] |
| Package Manager | [npm / yarn / pnpm] |
| Node Version | [X.X.X] |
| Total Files | [X] |
| Lines of Code | [X] |

### Tech Stack

**Frontend:**
- [Framework/Library] - [version]
- [UI Library] - [version]
- [State Management] - [version]

**Backend (if applicable):**
- [Framework] - [version]
- [Database] - [version]
- [ORM] - [version]

**Build Tools:**
- [Bundler] - [version]
- [Compiler] - [version]

**Testing:**
- [Test Framework] - [version]
- [Testing Library] - [version]

---

## Directory Structure

```
[project-root]/
├── src/
│   ├── components/     # [Description]
│   ├── pages/          # [Description]
│   ├── services/       # [Description]
│   ├── hooks/          # [Description]
│   ├── utils/          # [Description]
│   ├── types/          # [Description]
│   └── styles/         # [Description]
├── tests/              # [Description]
├── public/             # [Description]
└── config/             # [Description]
```

---

## Code Conventions

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Files (Components) | [PascalCase / kebab-case] | [Example.tsx] |
| Files (Utils) | [camelCase / kebab-case] | [example.ts] |
| Components | [PascalCase] | [UserProfile] |
| Functions | [camelCase] | [getUserData] |
| Constants | [UPPER_SNAKE_CASE] | [MAX_RETRIES] |
| Types/Interfaces | [PascalCase with I/T prefix] | [IUser / UserType] |
| CSS Classes | [BEM / CSS Modules / Tailwind] | [.user-card__title] |

### Code Style

| Aspect | Convention |
|--------|------------|
| Indentation | [2 spaces / 4 spaces / tabs] |
| Quotes | [single / double] |
| Semicolons | [yes / no] |
| Trailing Commas | [always / never / ES5] |
| Max Line Length | [80 / 100 / 120] |
| Import Order | [description of order] |

### Documentation Style

- JSDoc: [Used / Not Used]
- Inline Comments: [Style description]
- README: [Present / Missing]

---

## Architecture Patterns

### Overall Architecture

[Description of architecture pattern: MVC, Clean Architecture, Feature-based, etc.]

```
[ASCII diagram showing high-level architecture]
```

### Component Patterns

- **Component Type:** [Functional / Class / Mixed]
- **Props Pattern:** [Destructured / Props object]
- **State Pattern:** [useState / useReducer / External store]

### State Management

| Type | Approach | Location |
|------|----------|----------|
| Local State | [useState / useReducer] | Component level |
| Global State | [Context / Redux / Zustand / etc.] | [Store location] |
| Server State | [React Query / SWR / Custom] | [Cache location] |
| Form State | [React Hook Form / Formik / Native] | Component level |

### Data Flow

```
[Diagram or description of data flow]

User Action → Component → [State Update / API Call] → Re-render
```

### API Patterns

- **HTTP Client:** [axios / fetch / custom]
- **API Structure:** [REST / GraphQL / Mixed]
- **Error Handling:** [Description]
- **Authentication:** [JWT / Session / OAuth]

---

## Feature Inventory

### Existing Features

| Feature | Location | Status | Test Coverage |
|---------|----------|--------|---------------|
| [Feature 1] | [/src/features/feature1] | [Complete/Partial] | [X%] |
| [Feature 2] | [/src/features/feature2] | [Complete/Partial] | [X%] |

### Component Inventory

| Component | Location | Props Count | Used In |
|-----------|----------|-------------|---------|
| [Component1] | [path] | [X] | [locations] |
| [Component2] | [path] | [X] | [locations] |

### API Endpoint Inventory

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| /api/users | GET | List users | Yes |
| /api/users/:id | GET | Get user | Yes |

---

## Dependencies

### Production Dependencies

| Package | Version | Purpose | Risk |
|---------|---------|---------|------|
| [package] | [version] | [purpose] | [Low/Med/High] |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| [package] | [version] | [purpose] |

### Dependency Concerns

- **Outdated:** [List any significantly outdated packages]
- **Vulnerabilities:** [List any known vulnerabilities]
- **Large Bundles:** [List any unusually large packages]

---

## Code Quality Metrics

### Test Coverage

| Metric | Value | Target |
|--------|-------|--------|
| Statements | [X]% | 80% |
| Branches | [X]% | 75% |
| Functions | [X]% | 80% |
| Lines | [X]% | 80% |

### Code Complexity

| Metric | Value | Status |
|--------|-------|--------|
| Average Cyclomatic Complexity | [X] | [Good/Warning/High] |
| High Complexity Files | [X] | [List files if > 0] |

### Linting Status

- Errors: [X]
- Warnings: [X]
- Files with issues: [X]

---

## Identified Patterns

### Positive Patterns

1. **[Pattern Name]**
   - Description: [What it is]
   - Example: [Where it's used]
   - Recommendation: Continue using

2. **[Pattern Name]**
   - Description: [What it is]
   - Example: [Where it's used]

### Anti-Patterns / Concerns

1. **[Issue Name]**
   - Description: [What's wrong]
   - Location: [Where it occurs]
   - Impact: [Why it matters]
   - Recommendation: [How to fix]

2. **[Issue Name]**
   - Description: [What's wrong]
   - Location: [Where it occurs]
   - Impact: [Why it matters]
   - Recommendation: [How to fix]

---

## Recommendations

### High Priority

1. **[Recommendation]**
   - Impact: [High]
   - Effort: [Low/Medium/High]
   - Details: [Explanation]

### Medium Priority

1. **[Recommendation]**
   - Impact: [Medium]
   - Effort: [Low/Medium/High]
   - Details: [Explanation]

### Nice to Have

1. **[Recommendation]**
   - Impact: [Low]
   - Effort: [Low/Medium/High]
   - Details: [Explanation]

---

## Development Guidelines

Based on this analysis, new development should:

1. **Follow these conventions:**
   - [Convention 1]
   - [Convention 2]

2. **Use these patterns:**
   - [Pattern 1]
   - [Pattern 2]

3. **Avoid:**
   - [Anti-pattern 1]
   - [Anti-pattern 2]

4. **Place new code:**
   - Components: [location]
   - Services: [location]
   - Utils: [location]
   - Types: [location]

---

## Appendix

### File Statistics

| Extension | Count | Lines |
|-----------|-------|-------|
| .tsx | [X] | [X] |
| .ts | [X] | [X] |
| .css | [X] | [X] |

### Configuration Files

| File | Purpose | Notable Settings |
|------|---------|-----------------|
| tsconfig.json | TypeScript config | [notable settings] |
| .eslintrc | Linting rules | [notable settings] |

---

*Report generated by ProAgents Analysis*
