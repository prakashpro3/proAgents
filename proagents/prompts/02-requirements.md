# Requirements Gathering Prompts

Universal prompts for gathering and documenting feature requirements.

---

## Quick Start

```
pa:feature "Feature Name"
```

---

## Requirements Gathering Flow

### Initial Feature Description

**Prompt:**
```
I want to implement: [FEATURE_DESCRIPTION]

Please help me gather complete requirements by:
1. Understanding the feature purpose
2. Identifying user stories
3. Defining acceptance criteria
4. Listing edge cases
5. Identifying technical constraints
```

### Detailed Requirements Template

**Prompt:**
```
Based on the feature "[FEATURE_NAME]", let's define requirements:

1. PURPOSE
   - What problem does this solve?
   - Who benefits from this feature?

2. USER STORIES
   - As a [user type], I want to [action] so that [benefit]
   - List all relevant user stories

3. FUNCTIONAL REQUIREMENTS
   - What must the feature do?
   - What inputs does it accept?
   - What outputs does it produce?

4. NON-FUNCTIONAL REQUIREMENTS
   - Performance expectations
   - Security requirements
   - Accessibility requirements
   - Scalability needs

5. ACCEPTANCE CRITERIA
   - How do we know the feature is complete?
   - What tests must pass?

6. EDGE CASES
   - What unusual scenarios should we handle?
   - What error conditions exist?

7. CONSTRAINTS
   - Technical limitations
   - Time constraints
   - Dependency constraints
```

---

## User Story Prompts

### Generate User Stories

```
For the feature "[FEATURE_NAME]", generate user stories for:

1. Primary user (main beneficiary)
2. Secondary users (others affected)
3. Admin/system users
4. Edge case users

Format each as:
"As a [user type], I want to [action] so that [benefit]"

Include acceptance criteria for each story.
```

### User Story Refinement

```
For this user story:
"[USER_STORY]"

Please:
1. Break down into smaller stories if needed
2. Define clear acceptance criteria
3. Identify dependencies
4. Estimate complexity (S/M/L/XL)
5. List any assumptions
```

---

## Acceptance Criteria Prompts

### Define Acceptance Criteria

```
For the requirement: [REQUIREMENT]

Define acceptance criteria using Given-When-Then format:

Given: [initial context/state]
When: [action/event occurs]
Then: [expected outcome]

Include:
- Happy path scenarios
- Error scenarios
- Edge cases
- Performance expectations
```

### Acceptance Criteria Checklist

```
Verify these acceptance criteria for "[FEATURE_NAME]":

Functionality:
□ Core functionality works as specified
□ All user inputs are validated
□ Error messages are clear and helpful
□ Success feedback is provided

UI/UX:
□ UI matches design specifications
□ Responsive on all target devices
□ Accessible (keyboard, screen reader)
□ Loading states handled

Performance:
□ Loads within [X] seconds
□ No UI blocking during operations
□ Handles expected load

Security:
□ Input is sanitized
□ Authentication required (if applicable)
□ Authorization enforced
□ Data is encrypted (if applicable)
```

---

## Edge Case Discovery

### Identify Edge Cases

```
For "[FEATURE_NAME]", identify edge cases:

1. INPUT EDGE CASES
   - Empty input
   - Very long input
   - Special characters
   - Unicode/emoji
   - Malformed data
   - Maximum limits

2. STATE EDGE CASES
   - First time user
   - Returning user
   - Concurrent users
   - Session expired
   - Network offline

3. DATA EDGE CASES
   - No data available
   - Large dataset
   - Duplicate data
   - Corrupted data
   - Missing fields

4. TIMING EDGE CASES
   - Slow network
   - Timeout scenarios
   - Race conditions
   - Rapid repeated actions

5. PERMISSION EDGE CASES
   - Unauthorized access
   - Partial permissions
   - Permission changes mid-session
```

### Edge Case Documentation

```
Document this edge case:

Edge Case: [DESCRIPTION]
Trigger: [How does this occur?]
Expected Behavior: [What should happen?]
User Impact: [How does this affect user?]
Priority: [Critical/High/Medium/Low]
Test Scenario: [How to test this?]
```

---

## Technical Requirements

### Identify Technical Constraints

```
For "[FEATURE_NAME]", identify technical requirements:

1. TECHNOLOGY CONSTRAINTS
   - Required frameworks/libraries
   - Version requirements
   - Browser/device support
   - API dependencies

2. PERFORMANCE REQUIREMENTS
   - Response time targets
   - Throughput requirements
   - Resource limits (memory, CPU)
   - Concurrent user limits

3. INTEGRATION REQUIREMENTS
   - APIs to integrate with
   - Data formats required
   - Authentication methods
   - Rate limits to respect

4. DATA REQUIREMENTS
   - Data models needed
   - Storage requirements
   - Data retention policies
   - Privacy considerations

5. SECURITY REQUIREMENTS
   - Authentication needs
   - Authorization rules
   - Data protection needs
   - Compliance requirements
```

### API Requirements

```
Define API requirements for "[FEATURE_NAME]":

ENDPOINTS NEEDED:
- Method: [GET/POST/PUT/DELETE]
- Path: /api/...
- Request body: {...}
- Response: {...}
- Error responses: {...}

AUTHENTICATION:
- Method: [JWT/Session/API Key]
- Required scopes: [...]

RATE LIMITS:
- Requests per minute: [X]
- Burst limit: [X]

VALIDATION:
- Input validation rules
- Response validation
```

---

## Requirements Validation

### Validate Requirements

```
Review these requirements for "[FEATURE_NAME]":

[REQUIREMENTS LIST]

Check for:
1. COMPLETENESS
   □ All user scenarios covered?
   □ Edge cases identified?
   □ Error handling specified?

2. CLARITY
   □ Requirements unambiguous?
   □ Acceptance criteria testable?
   □ Technical specs clear?

3. CONSISTENCY
   □ No conflicting requirements?
   □ Aligns with existing features?
   □ Follows project standards?

4. FEASIBILITY
   □ Technically achievable?
   □ Within time constraints?
   □ Resources available?

5. TESTABILITY
   □ Can requirements be tested?
   □ Test criteria defined?
   □ Test data available?
```

### Requirements Sign-off

```
Requirements Sign-off Checklist for "[FEATURE_NAME]":

□ All user stories documented
□ Acceptance criteria defined
□ Edge cases identified
□ Technical constraints listed
□ Dependencies documented
□ Security requirements reviewed
□ Performance targets set
□ Stakeholder approval obtained

Approved by: ________________
Date: ________________
```

---

## Output Templates

### Requirements Document

```markdown
# Feature Requirements: [Feature Name]

## Overview
[Brief description of the feature]

## User Stories

### Story 1: [Title]
As a [user type], I want to [action] so that [benefit].

**Acceptance Criteria:**
- Given [context], when [action], then [result]
- ...

### Story 2: [Title]
...

## Functional Requirements
1. [Requirement 1]
2. [Requirement 2]
...

## Non-Functional Requirements
- Performance: [requirements]
- Security: [requirements]
- Accessibility: [requirements]

## Edge Cases
| Edge Case | Expected Behavior | Priority |
|-----------|------------------|----------|
| [case] | [behavior] | [priority] |

## Technical Constraints
- [Constraint 1]
- [Constraint 2]

## Dependencies
- [Dependency 1]
- [Dependency 2]

## Out of Scope
- [Item 1]
- [Item 2]

## Open Questions
- [Question 1]
- [Question 2]
```

---

## Slash Commands Reference

| Command | Description |
|---------|-------------|
| `pa:feature "name"` | Start new feature requirements |
| `pa:requirements` | Show requirements template |
| `pa:user-story` | Generate user stories |
| `pa:acceptance-criteria` | Define acceptance criteria |
| `pa:edge-cases` | Identify edge cases |
| `pa:technical-reqs` | Document technical requirements |
