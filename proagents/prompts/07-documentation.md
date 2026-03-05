# Documentation Prompts

Universal prompts for creating comprehensive documentation.

---

## Quick Start

```
/doc
```

Related commands:
- `/doc-full` - Full in-depth documentation
- `/doc-moderate` - Balanced documentation
- `/doc-lite` - Quick reference docs
- `/doc-module [name]` - Document specific module
- `/doc-file [path]` - Document specific file
- `/doc-api` - API documentation

---

## Documentation Modes

### Full Documentation Mode

```
Generate full documentation for: [FEATURE/MODULE]

Include:
1. Overview and purpose
2. Architecture explanation
3. Complete API reference
4. All component documentation
5. Usage examples (multiple)
6. Configuration options
7. Troubleshooting guide
8. Changelog
```

### Moderate Documentation Mode

```
Generate moderate documentation for: [FEATURE/MODULE]

Include:
1. Overview
2. Key concepts
3. API reference (public only)
4. Basic usage examples
5. Common configurations
```

### Lite Documentation Mode

```
Generate quick reference for: [FEATURE/MODULE]

Include:
1. Brief overview (1-2 sentences)
2. Quick start example
3. API summary table
4. Common patterns
```

---

## Code Documentation

### Document Function/Method

```
Document this function:

[FUNCTION CODE]

Generate:
```typescript
/**
 * [Brief description of what the function does]
 *
 * @description [Detailed description if needed]
 *
 * @param {Type} paramName - [Description]
 * @param {Type} [optionalParam] - [Description]
 *
 * @returns {Type} [Description of return value]
 *
 * @throws {ErrorType} [When this error is thrown]
 *
 * @example
 * // [Example usage]
 * const result = functionName(param);
 *
 * @see [Related function/concept]
 * @since [Version]
 */
```
```

### Document Component

```
Document this React component:

[COMPONENT CODE]

Generate:
```typescript
/**
 * [Component Name] - [Brief description]
 *
 * @component
 * @description [Detailed description]
 *
 * @example
 * // Basic usage
 * <ComponentName prop1="value" />
 *
 * @example
 * // With all props
 * <ComponentName
 *   prop1="value"
 *   prop2={123}
 *   onAction={handleAction}
 * />
 */

interface ComponentNameProps {
  /** [Description of prop1] */
  prop1: string;

  /** [Description of prop2] @default defaultValue */
  prop2?: number;

  /** [Description of callback] */
  onAction?: () => void;
}
```
```

### Document Hook

```
Document this custom hook:

[HOOK CODE]

Generate:
```typescript
/**
 * [Hook Name] - [Brief description]
 *
 * @description [Detailed description of hook purpose]
 *
 * @param {Type} paramName - [Description]
 *
 * @returns {Object} [Description]
 * @returns {Type} returns.property1 - [Description]
 * @returns {Type} returns.property2 - [Description]
 *
 * @example
 * const { data, loading, error } = useHookName(params);
 *
 * if (loading) return <Spinner />;
 * if (error) return <Error message={error} />;
 * return <Display data={data} />;
 */
```
```

### Document Class

```
Document this class:

[CLASS CODE]

Generate:
```typescript
/**
 * [Class Name] - [Brief description]
 *
 * @class
 * @description [Detailed description]
 *
 * @example
 * const instance = new ClassName(config);
 * instance.method();
 */
class ClassName {
  /** [Property description] */
  propertyName: Type;

  /**
   * Creates an instance of ClassName
   * @param {Type} config - [Description]
   */
  constructor(config: Type) {}

  /**
   * [Method description]
   * @param {Type} param - [Description]
   * @returns {Type} [Description]
   */
  methodName(param: Type): Type {}
}
```
```

---

## API Documentation

### Document REST API

```
Document this API endpoint:

[ENDPOINT IMPLEMENTATION]

Generate:
```markdown
## [HTTP Method] [Endpoint Path]

[Brief description of what endpoint does]

### Authentication
[Required auth method]

### Request

**Headers:**
| Header | Required | Description |
|--------|----------|-------------|
| Authorization | Yes | Bearer token |
| Content-Type | Yes | application/json |

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Resource ID |

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | number | No | 1 | Page number |

**Request Body:**
```json
{
  "field": "value"
}
```

### Response

**Success (200):**
```json
{
  "data": {},
  "meta": {}
}
```

**Errors:**
| Code | Description |
|------|-------------|
| 400 | Validation error |
| 401 | Unauthorized |
| 404 | Not found |
| 500 | Server error |

### Example

```bash
curl -X POST https://api.example.com/endpoint \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{"field": "value"}'
```
```
```

### Document API Service

```
Document this API service:

[SERVICE CODE]

Generate API reference documentation with:
- Service overview
- All methods with signatures
- Request/response types
- Error handling
- Usage examples
```

---

## Module Documentation

### Document Module

```
Document this module: [MODULE_NAME]

Generate:
```markdown
# [Module Name]

## Overview
[What this module does and why it exists]

## Architecture
[How it's structured, key patterns used]

## Installation/Setup
[Any setup required]

## API Reference

### Functions
| Function | Parameters | Returns | Description |
|----------|-----------|---------|-------------|
| funcName | (param: Type) | Type | Description |

### Components
| Component | Props | Description |
|-----------|-------|-------------|
| CompName | PropType | Description |

### Hooks
| Hook | Parameters | Returns | Description |
|------|-----------|---------|-------------|
| useHook | (param) | {data} | Description |

## Usage Examples

### Basic Usage
[Code example]

### Advanced Usage
[Code example]

## Configuration
[Configuration options]

## Related
- [Related Module 1]
- [Related Module 2]
```
```

---

## README Documentation

### Generate README

```
Generate README for: [PROJECT/MODULE]

```markdown
# [Name]

[Brief description - what it is and what it does]

## Features

- [Feature 1]
- [Feature 2]
- [Feature 3]

## Installation

```bash
npm install [package]
```

## Quick Start

```javascript
// Minimal example to get started
import { Thing } from '[package]';

const thing = new Thing();
thing.doSomething();
```

## Documentation

- [Link to full docs]
- [Link to API reference]
- [Link to examples]

## Contributing

[Brief contribution guidelines or link]

## License

[License type]
```
```

### Generate CONTRIBUTING

```
Generate CONTRIBUTING.md for: [PROJECT]

Include:
- How to report bugs
- How to suggest features
- Development setup
- Code style guide
- Pull request process
- Code of conduct reference
```

---

## Changelog Documentation

### Generate Changelog Entry

```
Generate changelog entry for: [VERSION]

Changes made:
[LIST OF CHANGES]

OUTPUT LOCATION: ./CHANGELOG.md (project root - client-facing)

Format:
```markdown
## [Version] - [Date]

### Added
- [New feature 1]
- [New feature 2]

### Changed
- [Change 1]
- [Change 2]

### Fixed
- [Bug fix 1]
- [Bug fix 2]

### Deprecated
- [Deprecated feature]

### Removed
- [Removed feature]

### Security
- [Security fix]
```
```

---

## Release Notes (Client-Facing)

### Generate Release Notes

```
Generate release notes for: [VERSION]

OUTPUT LOCATION: ./RELEASE_NOTES.md (project root - for client sharing)
ALSO SAVE TO: ./docs/releases/v[VERSION].md (version archive)

```markdown
# Release Notes - v[VERSION]

**Release Date:** [DATE]

## Overview

[2-3 sentence summary of this release for clients/stakeholders]

## What's New

### [Feature 1 Name]
[Client-friendly description of the feature and its benefits]

### [Feature 2 Name]
[Client-friendly description]

## Improvements

- [Improvement 1 - user-facing benefit]
- [Improvement 2 - user-facing benefit]

## Bug Fixes

- Fixed [issue description in user terms]
- Resolved [issue description in user terms]

## Breaking Changes

⚠️ [Any breaking changes that affect users - if none, omit section]

## Upgrade Instructions

[Steps to upgrade from previous version - if needed]

## Known Issues

[Any known issues in this release - if none, omit section]

---

For technical details, see [CHANGELOG.md](./CHANGELOG.md)
For support, contact [support email/link]
```
```

### Generate Version-Specific Release Notes

```
Generate detailed release notes for version [VERSION]

Save to: ./docs/releases/v[VERSION].md

Include:
1. Executive summary (for stakeholders)
2. New features with screenshots/examples
3. Performance improvements with metrics
4. Security updates
5. Migration guide (if breaking changes)
6. Known issues and workarounds
7. Upcoming features preview
```

### Generate Release Announcement

```
Generate release announcement for: [VERSION]

Use for: Email, Slack, Social media

Format:
```markdown
# 🚀 [Product Name] v[VERSION] Released!

[One compelling sentence about the release]

## Highlights

✨ [Feature 1] - [One line benefit]
✨ [Feature 2] - [One line benefit]
🐛 [Key fix] - [One line description]

## Quick Links

- 📖 [Full Release Notes](./RELEASE_NOTES.md)
- 📦 [Download/Install](#)
- 📚 [Documentation](#)

[Call to action]
```
```

---

## Architecture Documentation

### Document Architecture

```
Document architecture for: [FEATURE/SYSTEM]

Generate:
```markdown
# Architecture: [Name]

## Overview
[High-level description]

## Diagram
```
[ASCII diagram of architecture]
```

## Components

### [Component 1]
- **Purpose:** [Why it exists]
- **Responsibilities:** [What it does]
- **Dependencies:** [What it needs]
- **Interface:** [How to interact with it]

### [Component 2]
...

## Data Flow
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Key Decisions

### [Decision 1]
- **Context:** [Why decision was needed]
- **Decision:** [What was decided]
- **Consequences:** [Trade-offs]

## Related
- [Related docs]
```
```

---

## User Documentation

### Generate User Guide

```
Generate user guide for: [FEATURE]

```markdown
# [Feature Name] User Guide

## What is [Feature]?
[Explanation for users]

## Getting Started

### Prerequisites
- [Prerequisite 1]
- [Prerequisite 2]

### First Steps
1. [Step 1]
2. [Step 2]
3. [Step 3]

## How To

### [Task 1]
1. [Step 1]
2. [Step 2]

### [Task 2]
1. [Step 1]
2. [Step 2]

## FAQ

**Q: [Question 1]?**
A: [Answer 1]

**Q: [Question 2]?**
A: [Answer 2]

## Troubleshooting

### [Problem 1]
**Symptom:** [What user sees]
**Solution:** [How to fix]

### [Problem 2]
**Symptom:** [What user sees]
**Solution:** [How to fix]
```
```

---

## Documentation Templates

### Standard Doc Header

```markdown
---
title: [Title]
description: [Brief description]
version: [Version]
last_updated: [Date]
author: [Author]
---
```

### API Endpoint Template

```markdown
## Endpoint Name

`METHOD /path/to/endpoint`

Description of what endpoint does.

### Parameters
...

### Response
...

### Errors
...

### Example
...
```

### Component Doc Template

```markdown
## ComponentName

Description of component.

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|

### Examples
...

### Notes
...
```

---

## Documentation Checklist

```
Documentation checklist for: [FEATURE]

CODE DOCUMENTATION:
□ All public functions documented
□ All public components documented
□ Complex logic explained
□ Types have descriptions

API DOCUMENTATION:
□ All endpoints documented
□ Request/response examples
□ Error codes listed
□ Authentication explained

USER DOCUMENTATION:
□ Getting started guide
□ How-to guides for tasks
□ FAQ section
□ Troubleshooting guide

TECHNICAL DOCUMENTATION:
□ Architecture documented
□ Key decisions recorded
□ Setup instructions clear
□ Configuration documented

MAINTENANCE:
□ Changelog updated
□ Version documented
□ Migration guide (if needed)
```

---

## Output Locations Summary

| Document Type | Location | Audience |
|---------------|----------|----------|
| Release Notes | `./RELEASE_NOTES.md` | Clients/Stakeholders |
| Changelog | `./CHANGELOG.md` | Clients/Public |
| Version Archive | `./docs/releases/v*.md` | Clients |
| API Docs | `./docs/api/` | Developers/Clients |
| README | `./README.md` | Public |
| Dev Changelog | `proagents/changelog/` | Internal Team |
| Feature Docs | `proagents/active-features/` | Internal Team |

---

## Slash Commands Reference

| Command | Description | Output Location |
|---------|-------------|-----------------|
| `/doc` | Show documentation options | - |
| `/doc-full` | Full documentation | `./docs/` |
| `/doc-moderate` | Balanced documentation | `./docs/` |
| `/doc-lite` | Quick reference | `./docs/` |
| `/doc-module [name]` | Document module | `./docs/modules/` |
| `/doc-file [path]` | Document file | `./docs/` |
| `/doc-api` | API documentation | `./docs/api/` |
| `/doc-readme` | Generate README | `./README.md` |
| `/doc-changelog` | Update changelog | `./CHANGELOG.md` |
| `/doc-release` | Generate release notes | `./RELEASE_NOTES.md` |
| `/doc-release [version]` | Version-specific notes | `./docs/releases/v*.md` |
