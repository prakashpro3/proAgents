# Phase 1: Codebase Analysis Prompts

Use these prompts to analyze an existing codebase before implementing new features.

---

## Quick Analysis (`/analyze-lite`)

```
Perform a quick overview of this codebase:

1. What is the main technology stack?
2. What is the project structure (main directories)?
3. What are the key entry points?
4. What patterns are immediately visible?

Output a brief summary (1 page max).
```

---

## Moderate Analysis (`/analyze-moderate`)

```
Perform a moderate analysis of this codebase:

1. **Structure Analysis**
   - Map the main directories and their purposes
   - Identify the architectural pattern (MVC, feature-based, etc.)

2. **Code Conventions**
   - What naming conventions are used?
   - What code style is followed?

3. **Dependencies**
   - List main dependencies
   - Identify any outdated or risky dependencies

4. **Key Patterns**
   - How is state managed?
   - How are API calls handled?
   - How is error handling done?

Output a structured report.
```

---

## Full Analysis (`/analyze-full`)

```
Perform a comprehensive deep analysis of this codebase:

## 1. Structure Analysis

### 1.1 Directory Mapping
Generate complete directory tree with purposes:
- src/ folders and their responsibilities
- test/ structure
- config/ files

### 1.2 Framework Detection
- What frameworks are used?
- What version?
- Any deprecated APIs?

### 1.3 Architecture Pattern
- What pattern is followed? (MVC, Clean Architecture, etc.)
- How are modules organized?
- Are there any violations of the pattern?

## 2. Code Conventions

### 2.1 Naming Conventions
- File naming (kebab-case, PascalCase, etc.)
- Component naming
- Function/method naming
- Variable naming
- Type/Interface naming

### 2.2 Code Style
- Indentation (tabs/spaces, size)
- Quotes (single/double)
- Semicolons
- Line length
- Import ordering

### 2.3 Documentation Style
- JSDoc usage?
- README patterns
- Inline comments style

## 3. Dependencies

### 3.1 External Dependencies
Categorize by:
- Core framework
- State management
- Styling
- HTTP/API
- Testing
- Build tools
- Dev tools

### 3.2 Internal Dependencies
- Create dependency graph
- Identify circular dependencies
- Find tightly coupled modules

### 3.3 Third-Party Integrations
- Authentication providers
- Payment gateways
- Analytics
- Cloud services

## 4. Existing Features

### 4.1 Feature Inventory
For each feature:
- Feature name
- Location (files/folders)
- Entry points
- Components used
- Test coverage

### 4.2 UI Component Inventory
- List all components
- Document props/interfaces
- Identify variants
- Map relationships

### 4.3 API Endpoints
Map all endpoints:
- Method
- Path
- Purpose
- Request/Response format

## 5. Pattern Recognition

### 5.1 State Management
- What approach? (Redux, Context, Zustand, etc.)
- Where is state defined?
- How is state accessed?

### 5.2 Error Handling
- Try-catch patterns
- Error boundaries
- API error handling
- User-facing errors

### 5.3 Authentication
- Token storage
- Auth context/hooks
- Protected routes
- Refresh token handling

### 5.4 Data Flow
- Props vs Context
- Event handling
- Form handling
- Real-time updates

## Output

Generate a comprehensive Codebase Analysis Report with:
- Executive summary
- Detailed findings per section
- Recommendations for new development
- Potential areas of concern
```

---

## Module-Specific Analysis (`/analyze-module [name]`)

```
Analyze the [MODULE_NAME] module in detail:

1. **Module Overview**
   - Purpose and responsibility
   - Location in codebase
   - Entry points

2. **Components/Files**
   - List all files in this module
   - Purpose of each file
   - Key exports

3. **Dependencies**
   - What does this module depend on?
   - What depends on this module?

4. **Patterns Used**
   - State management approach
   - API patterns
   - Error handling

5. **Test Coverage**
   - What tests exist?
   - What's missing?

6. **Potential Improvements**
   - Technical debt
   - Refactoring opportunities
```

---

## Dependency Analysis (`/analyze-deps`)

```
Analyze project dependencies:

1. **Direct Dependencies**
   - List all dependencies with versions
   - Categorize by purpose

2. **Outdated Packages**
   - Which packages have updates?
   - Are any security updates needed?

3. **Unused Dependencies**
   - Are any packages not being used?

4. **Risky Dependencies**
   - Any packages with known vulnerabilities?
   - Any deprecated packages?

5. **Recommendations**
   - Suggest updates
   - Suggest alternatives for problematic packages
```

---

## Using Analysis Results

After analysis, the AI should:

1. Cache results for reuse
2. Use patterns for consistent new code
3. Avoid contradicting existing conventions
4. Integrate with existing features properly
