# Web Frontend React Example

Complete walkthrough of ProAgents workflow for a React web application.

---

## Overview

This example demonstrates how to use ProAgents to build features in a React single-page application. It covers the full development lifecycle from requirements to deployment.

---

## Project Type

- **Framework:** React 18+
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Testing:** Vitest + React Testing Library

---

## Files in This Example

| File | Description |
|------|-------------|
| [workflow-example.md](./workflow-example.md) | Step-by-step workflow phases |
| [complete-conversation.md](./complete-conversation.md) | Full AI conversation example |
| [proagents.config.yaml](./proagents.config.yaml) | Project-specific configuration |

---

## What You'll Learn

### 1. Project Analysis
- How ProAgents analyzes React component structure
- Pattern recognition for hooks, context, and state
- Identifying existing UI component libraries

### 2. UI Design Integration
- Converting Figma designs to React components
- Design token extraction and application
- Component specification from wireframes

### 3. Implementation
- Following existing project conventions
- Creating reusable components
- State management patterns
- TypeScript type safety

### 4. Testing
- Unit tests for components and hooks
- Integration tests for user flows
- Accessibility testing

---

## Quick Start

```bash
# Copy configuration to your React project
cp proagents.config.yaml /path/to/your/react-project/

# Start a new feature
proagents feature start "Add user profile page"
```

---

## Example Feature: User Dashboard

The complete-conversation.md shows building a user dashboard with:
- Dashboard layout component
- Stats widgets
- Recent activity feed
- User preferences panel

---

## Key Patterns Demonstrated

### Component Structure
```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── features/     # Feature-specific components
│   └── layouts/      # Page layouts
├── hooks/            # Custom hooks
├── stores/           # Zustand stores
└── types/            # TypeScript types
```

### Testing Approach
- Component tests with React Testing Library
- Hook tests with renderHook
- Integration tests for user journeys
- 80% coverage target

---

## Configuration Highlights

```yaml
# From proagents.config.yaml
project:
  type: "web-frontend"
  framework: "react"

testing:
  framework: "vitest"
  coverage_threshold: 80

checkpoints:
  after_design: true      # Review UI before coding
  before_deployment: true # Final review
```

---

## Related Resources

- [React Scaffolding Template](../../scaffolding/react/)
- [UI Design Integration](../../ui-integration/)
- [Testing Standards](../../testing-standards/)
