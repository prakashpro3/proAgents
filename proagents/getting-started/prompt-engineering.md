# Prompt Engineering Best Practices

Guide to writing effective prompts for AI-assisted development with ProAgents.

---

## Overview

Effective prompts lead to better AI assistance. This guide covers best practices for communicating with AI during development workflows.

---

## Core Principles

### 1. Be Specific

**Bad:**
```
Make this better
```

**Good:**
```
Refactor this function to:
- Extract the validation logic into a separate function
- Add error handling for null inputs
- Use early returns instead of nested if statements
```

### 2. Provide Context

**Bad:**
```
Fix the bug
```

**Good:**
```
Fix the login bug:
- Error: "Cannot read property 'email' of undefined"
- Occurs when: User submits empty form
- Expected: Show validation error
- File: src/components/LoginForm.tsx:45
```

### 3. Specify Constraints

**Bad:**
```
Add authentication
```

**Good:**
```
Add authentication:
- Use NextAuth.js (already installed)
- Support Google and GitHub providers
- Store sessions in database (Prisma)
- Follow existing auth patterns in src/lib/auth.ts
```

### 4. Request Incrementally

**Bad:**
```
Build a complete e-commerce system with cart, checkout, inventory, orders, shipping, and returns
```

**Good:**
```
Let's build the e-commerce system incrementally:
1. First: Add product catalog display
2. Then: Add to cart functionality
3. Next: Checkout flow
(Continue step by step)
```

---

## Prompt Templates

### Feature Request

```markdown
## Feature: [Name]

### Description
[What should this feature do?]

### User Story
As a [user type], I want [action] so that [benefit]

### Acceptance Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]

### Constraints
- Must use: [existing patterns/libraries]
- Must not: [restrictions]
- Performance: [requirements]

### Examples
[Provide examples of expected behavior]
```

### Bug Fix Request

```markdown
## Bug: [Title]

### Current Behavior
[What's happening now?]

### Expected Behavior
[What should happen?]

### Steps to Reproduce
1. [Step 1]
2. [Step 2]

### Error Details
- Error message: [message]
- Stack trace: [if available]
- Location: [file:line]

### Environment
- Browser/Node: [version]
- OS: [os]
```

### Code Review Request

```markdown
## Review Request

### Changes
[Brief description of changes]

### Files Modified
- [file1]: [what changed]
- [file2]: [what changed]

### Areas to Focus
- [ ] Logic correctness
- [ ] Error handling
- [ ] Performance
- [ ] Security

### Questions
[Specific questions for reviewer]
```

### Refactoring Request

```markdown
## Refactor: [Component/Function]

### Current Issues
- [Issue 1]
- [Issue 2]

### Goals
- [Goal 1]
- [Goal 2]

### Constraints
- Must maintain: [backward compatibility]
- Must not: [break existing tests]

### Suggested Approach
[Your ideas, if any]
```

---

## Context Techniques

### Include Relevant Code

```markdown
Here's the current implementation:

```typescript
function processOrder(order: Order) {
  // 50 lines of code
}
```

Issues:
1. Function is too long
2. Mixing concerns

Please refactor following our service layer pattern.
```

### Reference Existing Patterns

```markdown
Add a new API endpoint following the pattern in:
- src/app/api/users/route.ts
- src/app/api/products/route.ts

The endpoint should handle:
- GET /api/orders
- POST /api/orders
```

### Provide Examples

```markdown
Create a hook like useUserData:

Example usage:
```typescript
const { data, loading, error, refetch } = useOrders({
  userId: currentUser.id,
  status: 'pending'
});
```

Return shape:
```typescript
{
  data: Order[] | null,
  loading: boolean,
  error: Error | null,
  refetch: () => Promise<void>
}
```
```

---

## Iterative Refinement

### Start Broad, Then Narrow

```
Round 1: "Add form validation to the signup page"
↓
Round 2: "The email validation works, but also add:
         - Password strength indicator
         - Real-time username availability check"
↓
Round 3: "The password indicator should show:
         - Minimum 8 characters
         - At least one uppercase
         - At least one number"
```

### Ask for Options

```markdown
I need to implement caching for API responses.

Please suggest 3 approaches:
1. In-memory caching
2. Redis caching
3. Browser caching

For each, explain:
- Pros and cons
- Implementation complexity
- When to use
```

### Request Explanations

```markdown
You suggested using useMemo here. Please explain:
1. Why is it needed in this case?
2. What would happen without it?
3. Are there alternatives?
```

---

## Domain-Specific Prompts

### Frontend (React/Next.js)

```markdown
Create a React component:
- Name: ProductCard
- Props: product (Product type), onAddToCart
- Features:
  - Image with lazy loading
  - Price with currency formatting
  - Add to cart button with loading state
- Styling: Use Tailwind CSS
- Tests: Include unit tests with Testing Library
```

### Backend (Node.js/Express)

```markdown
Create an API endpoint:
- Route: POST /api/orders
- Authentication: Required (JWT)
- Validation: Use Zod schema
- Actions:
  1. Validate input
  2. Check inventory
  3. Create order
  4. Send confirmation email
- Error handling: Standard error format
- Response: Created order with 201 status
```

### Database

```markdown
Design a Prisma schema for:
- Users (with profile)
- Organizations (users belong to orgs)
- Projects (orgs have projects)
- Tasks (projects have tasks)

Include:
- Proper relations
- Timestamps
- Soft delete for users
- Indexes for common queries
```

---

## Anti-Patterns to Avoid

### 1. Vague Instructions

❌ "Make it work"
✅ "Fix the null pointer error when user.profile is undefined"

### 2. Too Much at Once

❌ "Build the entire authentication system"
✅ "Start with the login form component"

### 3. No Context

❌ "Add a button"
✅ "Add a 'Save Draft' button below the form, using our Button component with variant='secondary'"

### 4. Assuming Knowledge

❌ "Use our standard pattern"
✅ "Use the repository pattern as shown in src/repositories/UserRepository.ts"

### 5. Ignoring Constraints

❌ "Add a date picker"
✅ "Add a date picker using react-datepicker (already in package.json), styled to match our form inputs"

---

## Prompt Modifiers

### For Code Generation

| Modifier | Effect |
|----------|--------|
| "with TypeScript types" | Includes type definitions |
| "with error handling" | Adds try/catch and error states |
| "with tests" | Includes unit tests |
| "with comments" | Adds code comments |
| "following [pattern]" | Uses specified pattern |

### For Explanations

| Modifier | Effect |
|----------|--------|
| "step by step" | Detailed walkthrough |
| "briefly" | Concise explanation |
| "with examples" | Include code examples |
| "for a beginner" | Simpler language |
| "for production" | Production considerations |

### For Reviews

| Modifier | Effect |
|----------|--------|
| "focus on security" | Security-focused review |
| "focus on performance" | Performance-focused review |
| "be thorough" | Comprehensive review |
| "quick check" | High-level review |

---

## Conversation Management

### Starting a Session

```markdown
I'm working on [project type] using [tech stack].

Today I need to:
1. [Task 1]
2. [Task 2]

Let's start with [Task 1].
```

### Switching Context

```markdown
Good progress on the login form.

Let's switch to the API endpoint now.
Here's the current state: [context]
```

### Ending a Session

```markdown
Let's wrap up. Please:
1. Summarize what we implemented
2. List any TODOs or follow-ups
3. Note any potential issues to watch
```

---

## ProAgents-Specific Tips

### Use Slash Commands

```bash
/feature-start "Add user authentication"
# More effective than: "I want to add auth"

/fix "Login button not responding"
# More effective than: "There's a bug"

/analyze
# Let ProAgents understand your codebase first
```

### Reference Phase Context

```markdown
Based on the analysis from Phase 1, implement the
user service following the patterns identified in
src/services/.
```

### Build on Previous Work

```markdown
Continue from where we left off with the checkout flow.
The cart component is done, now let's add the payment form.
```

---

## Measuring Prompt Effectiveness

### Good Prompt Indicators

- AI asks few clarifying questions
- Generated code needs minimal modifications
- Solution matches project patterns
- Tests pass on first try

### Signs to Improve

- AI asks many questions
- Multiple revision rounds
- Code doesn't match patterns
- Missing error handling

---

## Next Steps

- Practice with [example prompts](../examples/)
- Review [command reference](../cli/commands-reference.md)
- Set up [project standards](../standards/)
