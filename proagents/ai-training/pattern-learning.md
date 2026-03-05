# Pattern Learning

Learn code patterns, conventions, and architectural preferences from your codebase.

---

## Pattern Types

### Code Style Patterns

```yaml
learned_patterns:
  code_style:
    # Indentation
    indentation:
      type: "spaces"
      size: 2
      confidence: 0.98

    # Quotes
    quotes:
      style: "single"
      jsx_style: "double"
      confidence: 0.95

    # Semicolons
    semicolons:
      required: true
      confidence: 0.99

    # Trailing commas
    trailing_commas:
      arrays: true
      objects: true
      functions: false
      confidence: 0.92
```

### Naming Conventions

```yaml
learned_patterns:
  naming:
    # Components
    components:
      pattern: "PascalCase"
      suffix: ""  # No suffix required
      examples:
        - "UserProfile"
        - "NavigationMenu"
        - "PaymentForm"
      confidence: 0.97

    # Hooks
    hooks:
      pattern: "camelCase"
      prefix: "use"
      examples:
        - "useAuth"
        - "useUserData"
        - "usePagination"
      confidence: 0.99

    # Utilities
    utilities:
      pattern: "camelCase"
      examples:
        - "formatDate"
        - "calculateTotal"
        - "parseResponse"
      confidence: 0.94

    # Constants
    constants:
      pattern: "UPPER_SNAKE_CASE"
      examples:
        - "MAX_RETRY_COUNT"
        - "API_BASE_URL"
        - "DEFAULT_TIMEOUT"
      confidence: 0.96

    # Files
    files:
      components: "PascalCase"       # UserProfile.tsx
      utilities: "camelCase"         # formatDate.ts
      tests: "*.test.ts"             # UserProfile.test.tsx
      styles: "*.module.css"         # UserProfile.module.css
      confidence: 0.93
```

### Component Patterns

```yaml
learned_patterns:
  components:
    # Component structure
    structure:
      type: "functional"
      export_style: "named"  # or "default"
      props_location: "inline"  # or "separate_interface"
      confidence: 0.95

    # Props pattern
    props:
      interface_naming: "{ComponentName}Props"
      destructure_in_signature: true
      default_props: "inline"
      examples:
        - |
          interface UserCardProps {
            user: User;
            onSelect?: (user: User) => void;
          }

          export const UserCard = ({ user, onSelect }: UserCardProps) => {
            // ...
          };
      confidence: 0.94

    # State management
    state:
      local_state: "useState"
      complex_state: "useReducer"
      global_state: "zustand"
      server_state: "react-query"
      confidence: 0.91

    # Common patterns
    common_patterns:
      - pattern: "early_return"
        description: "Return early for loading/error states"
        example: |
          if (isLoading) return <Spinner />;
          if (error) return <ErrorMessage error={error} />;
          return <Component data={data} />;

      - pattern: "compound_components"
        description: "Use compound components for complex UIs"
        example: |
          <Card>
            <Card.Header />
            <Card.Body />
            <Card.Footer />
          </Card>
```

### API Patterns

```yaml
learned_patterns:
  api:
    # Request pattern
    requests:
      library: "axios"
      style: "service_functions"
      error_handling: "try_catch"
      example: |
        export const getUser = async (id: string): Promise<User> => {
          try {
            const response = await api.get(`/users/${id}`);
            return response.data;
          } catch (error) {
            throw handleApiError(error);
          }
        };
      confidence: 0.93

    # Response handling
    responses:
      unwrap_data: true
      type_responses: true
      handle_pagination: "cursor_based"
      confidence: 0.89

    # Error handling
    errors:
      error_class: "ApiError"
      include_status_code: true
      include_message: true
      confidence: 0.91
```

### Testing Patterns

```yaml
learned_patterns:
  testing:
    # Framework
    framework: "vitest"  # or jest
    confidence: 0.99

    # Test structure
    structure:
      describe_pattern: "Component/Function name"
      it_pattern: "should {expected behavior}"
      example: |
        describe('UserCard', () => {
          it('should render user name', () => {
            // ...
          });

          it('should call onSelect when clicked', () => {
            // ...
          });
        });
      confidence: 0.94

    # Mocking
    mocking:
      api_mocks: "msw"
      module_mocks: "vi.mock"
      confidence: 0.88

    # Assertions
    assertions:
      prefer: "expect().toBe()"
      matchers:
        - "toBe"
        - "toEqual"
        - "toHaveBeenCalled"
        - "toContain"
      confidence: 0.92
```

---

## Learning Process

### Automatic Learning

```
┌─────────────────────────────────────────────────────────────┐
│                    Pattern Detection                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Scan Codebase                                           │
│     └── Analyze all source files                            │
│                                                             │
│  2. Extract Patterns                                        │
│     ├── Naming conventions                                  │
│     ├── Code structures                                     │
│     ├── Import patterns                                     │
│     └── Common functions                                    │
│                                                             │
│  3. Calculate Confidence                                    │
│     └── Pattern frequency / Total occurrences               │
│                                                             │
│  4. Store Patterns                                          │
│     └── .proagents/learning/patterns.json                   │
│                                                             │
│  5. Apply to Suggestions                                    │
│     └── Use patterns in code generation                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Manual Training

```bash
# Train on specific files
proagents learning train --path src/components/

# Train on recent changes
proagents learning train --recent 30d

# Train on specific patterns
proagents learning train --type naming

# Full retraining
proagents learning train --full
```

---

## Pattern Application

### In Code Suggestions

```
Before Learning:
AI: "Here's a component..."
  function user_card(props) {
    return <div>...</div>
  }

After Learning:
AI: "Following your project patterns..."
  interface UserCardProps {
    user: User;
  }

  export const UserCard = ({ user }: UserCardProps) => {
    return <div>...</div>;
  };
```

### In Code Review

```
Before Learning:
AI: "This looks fine."

After Learning:
AI: "This component doesn't follow the project's naming convention.
     Suggestion: Rename 'user_profile' to 'UserProfile' to match
     the PascalCase pattern used in other components."
```

---

## Pattern Storage

### Storage Structure

```
.proagents/learning/
├── patterns/
│   ├── code-style.json
│   ├── naming.json
│   ├── components.json
│   ├── api.json
│   └── testing.json
├── confidence/
│   └── scores.json
└── metadata.json
```

### Pattern File Format

```json
{
  "pattern_type": "naming",
  "category": "components",
  "pattern": {
    "format": "PascalCase",
    "examples": ["UserProfile", "NavigationMenu"],
    "counter_examples": [],
    "regex": "^[A-Z][a-zA-Z]*$"
  },
  "confidence": 0.97,
  "occurrences": 145,
  "last_updated": "2024-01-15T10:30:00Z",
  "sources": [
    "src/components/UserProfile.tsx",
    "src/components/NavigationMenu.tsx"
  ]
}
```

---

## Confidence Scoring

### Calculation

```
Confidence = (Pattern Matches) / (Total Occurrences)

Example:
- 145 components use PascalCase
- 5 components use other naming
- Confidence = 145/150 = 0.97
```

### Thresholds

```yaml
learning:
  confidence_thresholds:
    high: 0.90      # Auto-apply pattern
    medium: 0.70    # Suggest pattern
    low: 0.50       # Note but don't suggest
    ignore: 0.30    # Too inconsistent
```

---

## Pattern Override

### User Corrections

When user corrects a suggestion:

```yaml
corrections:
  - timestamp: "2024-01-15T10:30:00Z"
    type: "naming"
    suggested: "user_profile"
    corrected: "UserProfile"
    context: "Component naming"
    weight: 1.5  # Corrections have higher weight
```

### Manual Pattern Definition

```yaml
# Override learned patterns
learning:
  overrides:
    naming:
      components:
        pattern: "PascalCase"
        enforce: true  # Always use this

    code_style:
      semicolons:
        required: true
        enforce: true
```

---

## Pattern Reports

### View Learned Patterns

```bash
proagents learning patterns

# Output:
┌─────────────────────────────────────────────────────────────┐
│ Learned Patterns                                            │
├─────────────────────────────────────────────────────────────┤
│ Category          │ Pattern           │ Confidence          │
├───────────────────┼───────────────────┼─────────────────────┤
│ Components        │ PascalCase        │ 97%                 │
│ Hooks             │ use* prefix       │ 99%                 │
│ Constants         │ UPPER_SNAKE       │ 96%                 │
│ Files             │ PascalCase.tsx    │ 93%                 │
│ Indentation       │ 2 spaces          │ 98%                 │
│ Quotes            │ Single quotes     │ 95%                 │
│ State Mgmt        │ Zustand           │ 91%                 │
│ Testing           │ Vitest            │ 99%                 │
└─────────────────────────────────────────────────────────────┘
```

### Export Patterns

```bash
# Export to JSON
proagents learning export --format json > patterns.json

# Export to YAML
proagents learning export --format yaml > patterns.yaml
```

---

## Best Practices

1. **Let It Learn First**: Allow 1-2 weeks of usage before relying heavily
2. **Review Patterns**: Periodically review what's been learned
3. **Correct Mistakes**: Corrections improve future suggestions
4. **Override When Needed**: Use overrides for strict standards
5. **Reset When Necessary**: Reset if patterns become outdated
