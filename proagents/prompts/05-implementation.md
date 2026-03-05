# Implementation Prompts

Universal prompts for code implementation phase.

---

## Quick Start

```
/implement
```

---

## Implementation Guidelines

### Start Implementation

```
Begin implementing: [FEATURE_NAME]

Based on:
- Implementation plan: [reference]
- Design spec: [reference]
- Codebase analysis: [reference]

Guidelines:
1. Follow existing project conventions
2. Implement in planned order
3. Write code comments as per project style
4. Create unit tests alongside code
5. Commit logically grouped changes
```

---

## Code Generation

### Generate Component

```
Generate a React component for: [COMPONENT_NAME]

Requirements:
- [List requirements]

Props:
- [List props with types]

Behavior:
- [Describe behavior]

Follow project conventions:
- [Naming conventions]
- [File structure]
- [Styling approach]
- [State management pattern]
```

### Generate Hook

```
Generate a custom hook for: [HOOK_PURPOSE]

Hook Name: use[HookName]

Inputs:
- [Parameter 1]: [type] - [description]

Returns:
- [Return value 1]: [type] - [description]

Behavior:
- [Describe behavior]
- [Side effects]
- [Cleanup needed]

Usage Example:
```javascript
const { data, loading, error } = useHookName(params);
```
```

### Generate Service/API Layer

```
Generate API service for: [RESOURCE_NAME]

Endpoints:
- GET /api/[resource] - List all
- GET /api/[resource]/:id - Get one
- POST /api/[resource] - Create
- PUT /api/[resource]/:id - Update
- DELETE /api/[resource]/:id - Delete

Include:
- TypeScript types for request/response
- Error handling
- Request/response transformation
- Authentication header handling
```

### Generate Utility Function

```
Generate utility function for: [PURPOSE]

Function: [functionName]

Inputs:
- [param]: [type]

Output:
- [type]

Requirements:
- [List requirements]
- [Edge cases to handle]

Include:
- TypeScript types
- JSDoc documentation
- Error handling
- Unit test cases
```

---

## Pattern Following

### Match Existing Pattern

```
I need to implement: [FEATURE]

Here's an existing similar implementation:
[EXISTING CODE EXAMPLE]

Please implement [NEW FEATURE] following the same pattern:
- Same file structure
- Same naming conventions
- Same error handling
- Same state management approach
```

### Extend Existing Component

```
Extend this existing component: [COMPONENT_NAME]

Current implementation:
[CURRENT CODE]

Add these features:
1. [Feature 1]
2. [Feature 2]

Maintain:
- Existing API (backward compatible)
- Current styling approach
- Existing test patterns
```

### Refactor Following Pattern

```
Refactor this code to follow project patterns:

Current code:
[CODE TO REFACTOR]

Project patterns to follow:
- [Pattern 1 example]
- [Pattern 2 example]

Maintain:
- Same functionality
- Same public API
- Backward compatibility
```

---

## Code Quality

### Review Code for Quality

```
Review this code for quality:

[CODE TO REVIEW]

Check for:
1. Code correctness
2. Error handling
3. Edge cases
4. Performance issues
5. Security vulnerabilities
6. Code style consistency
7. Documentation completeness
8. Test coverage
```

### Optimize Code

```
Optimize this code for: [PERFORMANCE/READABILITY/MAINTAINABILITY]

Current code:
[CODE TO OPTIMIZE]

Constraints:
- Maintain same functionality
- Keep same public API
- [Other constraints]

Focus areas:
- [Specific optimization areas]
```

### Add Error Handling

```
Add comprehensive error handling to:

[CODE WITHOUT ERROR HANDLING]

Handle these scenarios:
1. Invalid input
2. Network failures
3. Timeout
4. Authentication errors
5. Permission errors
6. Unexpected errors

Error handling pattern:
[PROJECT'S ERROR HANDLING PATTERN]
```

---

## Type Safety

### Add TypeScript Types

```
Add TypeScript types to this code:

[UNTYPED CODE]

Include:
- Interface/type definitions
- Function signatures
- Generic types where appropriate
- Strict null checks
- Union types for variants
```

### Fix Type Errors

```
Fix TypeScript errors in this code:

[CODE WITH TYPE ERRORS]

Errors:
[LIST OF ERRORS]

Fix while:
- Maintaining functionality
- Using proper types (avoid any)
- Following project type conventions
```

---

## State Management

### Implement State Logic

```
Implement state management for: [FEATURE]

State shape:
[DESIRED STATE STRUCTURE]

Actions needed:
- [Action 1]
- [Action 2]

Follow project state pattern:
[PROJECT'S STATE MANAGEMENT APPROACH]
```

### Add Async Logic

```
Implement async logic for: [OPERATION]

Steps:
1. Initiate request (loading state)
2. Handle success (update state)
3. Handle error (error state)
4. Cleanup if needed

Include:
- Loading indicators
- Error messages
- Retry logic (if needed)
- Cancellation (if needed)
```

---

## API Integration

### Implement API Call

```
Implement API integration for: [ENDPOINT]

Endpoint: [METHOD] [URL]

Request:
[REQUEST STRUCTURE]

Response:
[RESPONSE STRUCTURE]

Include:
- Request building
- Response transformation
- Error handling
- Loading state
- Caching (if needed)
```

### Handle API Errors

```
Implement error handling for API call:

[CURRENT API CALL CODE]

Handle:
- 400: Validation errors (show field errors)
- 401: Unauthorized (redirect to login)
- 403: Forbidden (show permission error)
- 404: Not found (show not found message)
- 500: Server error (show generic error, allow retry)
- Network error: (show offline message)
```

---

## UI Implementation

### Implement UI Component

```
Implement UI for: [COMPONENT_NAME]

Design reference: [DESIGN SPEC]

Structure:
[COMPONENT STRUCTURE]

Styling:
- Use [CSS approach from project]
- Follow design tokens

Behavior:
- [Interactive behaviors]
- [State changes]
- [Animations]
```

### Implement Form

```
Implement form for: [FORM_PURPOSE]

Fields:
- [Field 1]: [type] - [validation rules]
- [Field 2]: [type] - [validation rules]

Validation:
- [Validation approach]
- [Error display]

Submission:
- [Submit handler]
- [Success handling]
- [Error handling]

Use project's form pattern:
[PROJECT'S FORM APPROACH]
```

### Implement Responsive Layout

```
Implement responsive layout for: [COMPONENT/PAGE]

Breakpoints:
- Mobile: [layout description]
- Tablet: [layout description]
- Desktop: [layout description]

Follow project's responsive approach:
[PROJECT'S RESPONSIVE PATTERN]
```

---

## Testing During Implementation

### Write Unit Test

```
Write unit tests for: [FUNCTION/COMPONENT]

Implementation:
[CODE TO TEST]

Test cases:
1. Normal input → Expected output
2. Edge case → Expected behavior
3. Error case → Expected error handling
4. [Additional cases]

Follow project test pattern:
[PROJECT'S TESTING APPROACH]
```

### Write Integration Test

```
Write integration test for: [FEATURE/FLOW]

Flow:
1. [Step 1]
2. [Step 2]
3. [Expected outcome]

Mock:
- [API calls to mock]
- [Services to mock]

Assert:
- [Assertions to make]
```

---

## Commit Guidelines

### Prepare Commit

```
Prepare commit for: [CHANGES DESCRIPTION]

Files changed:
[LIST OF FILES]

Commit message format:
[PROJECT'S COMMIT CONVENTION]

Example:
feat(auth): add login form validation

- Add email format validation
- Add password strength check
- Add error message display
```

---

## Implementation Checklist

```
Implementation checklist for: [TASK]

Before coding:
□ Understand requirements fully
□ Review related existing code
□ Identify patterns to follow

During coding:
□ Follow naming conventions
□ Add proper types
□ Handle errors
□ Add documentation/comments
□ Write tests alongside

After coding:
□ Self-review code
□ Run linter
□ Run tests
□ Check for console.logs
□ Verify no hardcoded values
□ Check accessibility (UI)
```

---

## Commands Reference

| Command | Description |
|---------|-------------|
| `pa:implement` | Start implementation |
| `pa:generate-component` | Generate component code |
| `pa:generate-hook` | Generate custom hook |
| `pa:generate-api` | Generate API service |
| `pa:review-code` | Review code quality |
| `pa:add-types` | Add TypeScript types |
| `pa:add-tests` | Add unit tests |
| `pa:commit-prep` | Prepare commit message |
