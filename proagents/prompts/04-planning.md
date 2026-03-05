# Implementation Planning Prompts

Universal prompts for planning feature implementation.

---

## Quick Start

```
/plan
```

---

## Planning Flow

### Create Implementation Plan

```
Create an implementation plan for: [FEATURE_NAME]

Based on:
- Requirements: [reference to requirements doc]
- Design: [reference to design spec]
- Existing codebase: [analysis reference]

Plan should include:
1. Architecture design
2. Component/module breakdown
3. File changes needed
4. Implementation order
5. Risk assessment
6. Testing strategy
```

---

## Architecture Planning

### Design Architecture

```
Design the architecture for: [FEATURE_NAME]

Consider:
1. How does this fit into existing architecture?
2. What new components/modules are needed?
3. What existing components need modification?
4. How will data flow through the system?
5. What state management is needed?
6. What API changes are required?

Output:
- Architecture diagram (text-based)
- Component hierarchy
- Data flow description
- Integration points
```

### Component Architecture

```
Design component architecture for: [FEATURE_NAME]

COMPONENT HIERARCHY:
```
[FeatureName]/
├── index.ts                 # Public exports
├── [FeatureName].tsx        # Main component
├── [FeatureName].test.tsx   # Tests
├── [FeatureName].styles.ts  # Styles
├── components/              # Sub-components
│   ├── [SubComponent1]/
│   └── [SubComponent2]/
├── hooks/                   # Feature-specific hooks
│   └── use[Feature].ts
├── utils/                   # Feature utilities
└── types.ts                 # Type definitions
```

For each component, define:
- Purpose and responsibility
- Props interface
- Internal state
- External dependencies
- Child components
```

### Data Architecture

```
Design data architecture for: [FEATURE_NAME]

DATA MODELS:
- Entity definitions
- Relationships
- Validation rules

STATE MANAGEMENT:
- Local state (component)
- Global state (store)
- Server state (cache)

DATA FLOW:
- How data enters the system
- How data is transformed
- How data is persisted
- How data is displayed
```

---

## File Planning

### Map File Changes

```
Map all file changes for: [FEATURE_NAME]

NEW FILES TO CREATE:
| File Path | Purpose | Priority |
|-----------|---------|----------|
| [path] | [purpose] | [1-5] |

EXISTING FILES TO MODIFY:
| File Path | Changes | Risk |
|-----------|---------|------|
| [path] | [changes] | [low/med/high] |

FILES TO POTENTIALLY REFACTOR:
| File Path | Reason | Scope |
|-----------|--------|-------|
| [path] | [reason] | [small/medium/large] |
```

### File Structure Plan

```
Plan file structure for: [FEATURE_NAME]

Current structure:
[Show relevant current structure]

Proposed changes:
[Show proposed structure with new files marked]

Rationale:
- Why this organization
- How it follows existing patterns
- How it enables future extension
```

---

## Implementation Order

### Define Implementation Order

```
Define implementation order for: [FEATURE_NAME]

PHASE 1 - Foundation:
1. [Task] - [description] - [dependencies: none]
2. [Task] - [description] - [dependencies: 1]

PHASE 2 - Core Features:
3. [Task] - [description] - [dependencies: 1, 2]
4. [Task] - [description] - [dependencies: 3]

PHASE 3 - Integration:
5. [Task] - [description] - [dependencies: 4]
6. [Task] - [description] - [dependencies: 4, 5]

PHASE 4 - Polish:
7. [Task] - [description] - [dependencies: 6]
8. [Task] - [description] - [dependencies: 7]

Parallel opportunities:
- [Tasks that can run in parallel]
```

### Task Breakdown

```
Break down this feature into implementable tasks:

FEATURE: [FEATURE_NAME]

For each task provide:
1. Task ID and name
2. Clear description
3. Acceptance criteria
4. Dependencies (task IDs)
5. Estimated complexity (S/M/L/XL)
6. Files affected
7. Testing requirements
```

### Critical Path

```
Identify critical path for: [FEATURE_NAME]

CRITICAL PATH TASKS:
1. [Task] - blocks: [tasks]
2. [Task] - blocks: [tasks]
3. [Task] - blocks: [tasks]

PARALLEL TRACKS:
Track A: [task] → [task] → [task]
Track B: [task] → [task]

BOTTLENECKS:
- [Potential bottleneck and mitigation]
```

---

## Risk Assessment

### Identify Risks

```
Assess risks for: [FEATURE_NAME]

TECHNICAL RISKS:
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| [risk] | [H/M/L] | [H/M/L] | [strategy] |

INTEGRATION RISKS:
- Existing code conflicts
- API compatibility
- Data migration issues

PERFORMANCE RISKS:
- Bundle size impact
- Runtime performance
- Database load

SCHEDULE RISKS:
- Unknown complexity
- Dependencies on others
- External blockers
```

### Risk Mitigation Plan

```
Create risk mitigation plan:

RISK: [DESCRIPTION]
Probability: [High/Medium/Low]
Impact: [High/Medium/Low]

Prevention Strategy:
- [How to prevent this risk]

Detection Strategy:
- [How to detect if risk materializes]

Response Plan:
- [What to do if risk occurs]

Contingency:
- [Backup plan]
```

---

## API Planning

### Design API Changes

```
Design API changes for: [FEATURE_NAME]

NEW ENDPOINTS:
```
POST /api/[resource]
  Request: { ... }
  Response: { ... }
  Errors: 400, 401, 404, 500

GET /api/[resource]/:id
  Response: { ... }
  Errors: 401, 404, 500
```

MODIFIED ENDPOINTS:
- [endpoint] - [changes]

DEPRECATED ENDPOINTS:
- [endpoint] - [replacement] - [sunset date]

API VERSIONING:
- Current version: [v1]
- Changes require new version: [yes/no]
```

### API Contract

```
Define API contract for: [ENDPOINT]

Request:
  Method: [GET/POST/PUT/DELETE]
  Path: /api/...
  Headers:
    Authorization: Bearer {token}
    Content-Type: application/json
  Query Parameters:
    [param]: [type] - [required] - [description]
  Body:
    {
      "field": "type - description"
    }

Response:
  Success (200/201):
    {
      "data": { ... },
      "meta": { ... }
    }

  Errors:
    400: { "error": "Validation error", "details": [...] }
    401: { "error": "Unauthorized" }
    404: { "error": "Not found" }
    500: { "error": "Internal server error" }

Rate Limits:
  [X] requests per [minute/hour]
```

---

## State Management Planning

### Plan State Management

```
Plan state management for: [FEATURE_NAME]

LOCAL STATE (Component):
- [state item] - [component] - [reason for local]

GLOBAL STATE (Store):
- [state item] - [reason for global]
- Actions needed:
  - [action name] - [purpose]

SERVER STATE (Cache):
- [data type] - [cache strategy]
- Invalidation rules:
  - [when to invalidate]

STATE FLOW:
User Action → [dispatch] → [store update] → [component re-render]
API Call → [cache update] → [component re-render]
```

### Store Design

```
Design store for: [FEATURE_NAME]

STATE SHAPE:
```typescript
interface FeatureState {
  // Data
  items: Item[];
  selectedId: string | null;

  // UI State
  isLoading: boolean;
  error: Error | null;

  // Filters/Pagination
  filters: FilterState;
  pagination: PaginationState;
}
```

ACTIONS:
- fetchItems(): Async - Load items from API
- selectItem(id): Sync - Set selected item
- updateItem(item): Async - Update item
- deleteItem(id): Async - Delete item

SELECTORS:
- selectAllItems: Get all items
- selectSelectedItem: Get currently selected
- selectFilteredItems: Get filtered items
```

---

## Testing Strategy

### Plan Testing Approach

```
Plan testing strategy for: [FEATURE_NAME]

UNIT TESTS:
| Component/Function | Test Cases | Priority |
|-------------------|------------|----------|
| [name] | [cases] | [P1/P2/P3] |

INTEGRATION TESTS:
| Flow | Components Involved | Priority |
|------|---------------------|----------|
| [flow] | [components] | [P1/P2/P3] |

E2E TESTS:
| User Journey | Steps | Priority |
|--------------|-------|----------|
| [journey] | [steps] | [P1/P2/P3] |

TEST DATA:
- Fixtures needed
- Mock data required
- Test user scenarios
```

---

## Implementation Plan Document

### Generate Plan Document

```markdown
# Implementation Plan: [Feature Name]

## Overview
[Brief description of what will be implemented]

## Architecture

### Component Hierarchy
[Diagram or list]

### Data Flow
[Description of data flow]

## File Changes

### New Files
| File | Purpose |
|------|---------|
| ... | ... |

### Modified Files
| File | Changes |
|------|---------|
| ... | ... |

## Implementation Phases

### Phase 1: [Name]
- [ ] Task 1.1: [description]
- [ ] Task 1.2: [description]

### Phase 2: [Name]
- [ ] Task 2.1: [description]
- [ ] Task 2.2: [description]

## API Changes
[API specifications]

## State Management
[State design]

## Testing Plan
[Testing approach]

## Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| ... | ... |

## Dependencies
- [External dependencies]
- [Internal dependencies]

## Open Questions
- [Question 1]
- [Question 2]
```

---

## Slash Commands Reference

| Command | Description |
|---------|-------------|
| `/plan` | Create implementation plan |
| `/architecture` | Design architecture |
| `/file-plan` | Map file changes |
| `/task-breakdown` | Break into tasks |
| `/risk-assess` | Assess risks |
| `/api-design` | Design API changes |
| `/state-plan` | Plan state management |
| `/test-strategy` | Plan testing approach |
