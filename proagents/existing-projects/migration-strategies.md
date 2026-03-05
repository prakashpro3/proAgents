# Migration Strategies

Strategies for migrating different aspects of existing projects to ProAgents standards.

---

## Overview

Migration involves:
- Code pattern migrations (legacy → modern)
- Dependency updates
- Test coverage improvement
- Documentation generation
- Process adoption

This guide covers each migration type with strategies, risks, and step-by-step procedures.

---

## Migration Types

```
┌─────────────────────────────────────────────────────────────┐
│                    Migration Categories                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Code Migrations           Process Migrations               │
│  ───────────────           ──────────────────               │
│  • Class → Functional      • Manual → Automated             │
│  • Redux → Zustand         • Ad-hoc → Structured            │
│  • JavaScript → TypeScript • No docs → Documented           │
│  • Legacy patterns         • No tests → Tested              │
│                                                             │
│  Dependency Migrations     Infrastructure Migrations        │
│  ────────────────────      ─────────────────────            │
│  • Outdated → Current      • No CI → CI/CD                  │
│  • Vulnerable → Secure     • Manual deploy → Automated      │
│  • Major version upgrades  • No monitoring → Monitored      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Strategy Selection

### When to Use Each Strategy

| Strategy | Best For | Risk | Effort | Timeline |
|----------|----------|------|--------|----------|
| Gradual | Large codebases, active development | Low | Medium | Ongoing |
| Opportunistic | Moderate codebases, regular changes | Low | Low | As-needed |
| Dedicated | Critical migrations, clear deadline | Medium | High | Fixed |
| Big Bang | Small codebases, major refactoring | High | High | Short |

### Decision Matrix

```yaml
migration_decision:
  questions:
    - question: "How large is the affected codebase?"
      options:
        small: "< 50 files"
        medium: "50-200 files"
        large: "> 200 files"

    - question: "How critical is the code?"
      options:
        low: "Non-critical features"
        medium: "Important but not critical"
        high: "Core business logic"

    - question: "What's your timeline?"
      options:
        flexible: "No deadline"
        moderate: "Within quarter"
        urgent: "Within weeks"

  recommendations:
    small_low_flexible: "Big Bang"
    small_high_urgent: "Dedicated"
    medium_any_any: "Gradual or Opportunistic"
    large_any_any: "Gradual"
    any_high_any: "Extra testing, staged rollout"
```

---

## Strategy 1: Gradual Migration

Best for large codebases with ongoing development.

### Approach

```yaml
gradual_migration:
  principle: "Migrate code as it's touched"

  process:
    1: "Identify file to modify"
    2: "Check migration status"
    3: "If not migrated, migrate now"
    4: "Add tests for migrated code"
    5: "Verify functionality"
    6: "Commit migration with feature"

  timeline: "Ongoing (6-12 months for full migration)"

  example:
    scenario: "Developer modifies UserProfile.tsx"
    current_state: "Class component"
    action: "Convert to functional while making changes"
```

### Implementation

```yaml
gradual_implementation:
  setup:
    - "Create migration tracking"
    - "Define migration criteria"
    - "Train team on process"

  tracking:
    file: "proagents/migrations/status.yaml"
    content: |
      migrations:
        class_to_functional:
          total_files: 45
          migrated: 0
          in_progress: 0
          remaining: 45

        redux_to_zustand:
          total_files: 30
          migrated: 0
          remaining: 30

  automation:
    on_file_open:
      - "Check if file needs migration"
      - "Suggest migration if applicable"

    on_pr:
      - "Check for migration opportunities"
      - "Track migration progress"
```

### Progress Tracking

```
┌─────────────────────────────────────────────────────────────┐
│              Gradual Migration Progress                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Class → Functional Components                              │
│  ████████████░░░░░░░░ 60% (27/45 files)                    │
│  Estimated completion: 3 months at current pace             │
│                                                             │
│  Redux → Zustand                                            │
│  ██████░░░░░░░░░░░░░░ 30% (9/30 files)                     │
│  Estimated completion: 5 months at current pace             │
│                                                             │
│  JavaScript → TypeScript                                    │
│  ████████████████░░░░ 80% (120/150 files)                  │
│  Estimated completion: 1 month at current pace              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Strategy 2: Opportunistic Migration

Best for codebases with regular changes but no dedicated migration time.

### Approach

```yaml
opportunistic_migration:
  principle: "Migrate when opportunity presents"

  triggers:
    - "Bug fix in legacy code"
    - "Feature addition touching legacy code"
    - "Refactoring for other reasons"
    - "Code review identifies candidate"

  rules:
    must_migrate:
      - "Touching file for 3rd time without migrating"
      - "Security vulnerability in legacy code"

    should_migrate:
      - "Bug fix in legacy code"
      - "Adding significant functionality"

    can_skip:
      - "Urgent hotfix"
      - "Minor text change"
      - "Would significantly delay delivery"
```

### Implementation

```yaml
opportunistic_implementation:
  detection:
    on_file_change:
      check: "Is this file a migration candidate?"
      if_yes: "Show migration suggestion"
      track: "How many times file touched without migration"

  suggestion_template: |
    📋 Migration Opportunity Detected

    File: {filename}
    Current Pattern: {current_pattern}
    Target Pattern: {target_pattern}
    Estimated Time: {estimated_time}

    This file has been touched {touch_count} times.
    Consider migrating while making this change.

    [Migrate Now] [Migrate Later] [Skip]

  escalation:
    after_3_touches: "Strongly recommend migration"
    after_5_touches: "Require justification to skip"
```

---

## Strategy 3: Dedicated Migration

Best when you can allocate specific time for migration.

### Approach

```yaml
dedicated_migration:
  principle: "Focused migration effort with dedicated resources"

  structure:
    sprint_0:
      name: "Planning"
      activities:
        - "Inventory all migration targets"
        - "Prioritize by risk/impact"
        - "Create detailed migration plan"
        - "Set up testing infrastructure"

    sprints_1_n:
      name: "Execution"
      activities:
        - "Migrate in priority order"
        - "Test thoroughly"
        - "Code review"
        - "Document changes"

    sprint_final:
      name: "Verification"
      activities:
        - "Full regression testing"
        - "Performance comparison"
        - "Documentation update"
        - "Team training if needed"
```

### Sprint Planning

```yaml
migration_sprint_plan:
  sprint_1:
    goal: "Migrate authentication module"
    files:
      - "src/auth/AuthContext.tsx"
      - "src/auth/LoginForm.tsx"
      - "src/auth/RegisterForm.tsx"
      - "src/auth/authService.ts"
    estimated_effort: "3 days"
    assigned_to: "dev-1, dev-2"
    success_criteria:
      - "All files converted to functional"
      - "Test coverage > 80%"
      - "All existing tests pass"

  sprint_2:
    goal: "Migrate user module"
    files:
      - "src/user/UserProfile.tsx"
      - "src/user/UserSettings.tsx"
      - "src/user/userService.ts"
    estimated_effort: "2 days"
    assigned_to: "dev-1"
```

### Risk Mitigation

```yaml
dedicated_migration_risks:
  risk_1:
    name: "Regression bugs"
    mitigation:
      - "Comprehensive test suite before migration"
      - "Side-by-side testing"
      - "Feature flags for rollback"

  risk_2:
    name: "Timeline overrun"
    mitigation:
      - "Buffer time in schedule"
      - "Priority-based scope cutting"
      - "Clear definition of done"

  risk_3:
    name: "Team unavailability"
    mitigation:
      - "Cross-training before sprint"
      - "Document decisions and progress"
      - "Backup resources identified"
```

---

## Strategy 4: Big Bang Migration

Best for small codebases or when complete rewrite is justified.

### Approach

```yaml
big_bang_migration:
  principle: "Migrate everything at once"

  suitable_when:
    - "Small codebase (< 50 files)"
    - "Low complexity"
    - "Good test coverage exists"
    - "Team can pause feature work"
    - "Clear deadline requiring full migration"

  NOT_suitable_when:
    - "Large codebase"
    - "Critical production system"
    - "No test coverage"
    - "Ongoing feature work"

  process:
    1: "Complete code freeze"
    2: "Full codebase migration"
    3: "Comprehensive testing"
    4: "Staged rollout"
    5: "Resume feature work"
```

### Big Bang Checklist

```markdown
## Big Bang Migration Checklist

### Pre-Migration
- [ ] Full codebase backup
- [ ] Test suite runs green
- [ ] Migration plan documented
- [ ] Rollback plan ready
- [ ] Team availability confirmed
- [ ] Stakeholder approval

### During Migration
- [ ] Code freeze in effect
- [ ] Progress tracked hourly
- [ ] Issues logged immediately
- [ ] Daily standup

### Post-Migration
- [ ] All tests passing
- [ ] Performance benchmarks met
- [ ] Security scan clean
- [ ] Documentation updated
- [ ] Team trained on changes
- [ ] Monitoring in place
```

---

## Specific Migration Guides

### Class Components → Functional Components

```yaml
class_to_functional:
  complexity: "Low-Medium"

  automated_conversion:
    tool: "react-codemod"
    command: "npx react-codemod React-Component-to-Functional"
    success_rate: "70%"
    manual_review: "Required"

  manual_steps:
    1:
      name: "Convert class to function"
      before: |
        class UserProfile extends React.Component {
          state = { user: null };

          componentDidMount() {
            this.fetchUser();
          }

          render() {
            return <div>{this.state.user?.name}</div>;
          }
        }

      after: |
        const UserProfile: FC = () => {
          const [user, setUser] = useState<User | null>(null);

          useEffect(() => {
            fetchUser();
          }, []);

          return <div>{user?.name}</div>;
        };

    2:
      name: "Convert lifecycle methods"
      mapping:
        componentDidMount: "useEffect with []"
        componentDidUpdate: "useEffect with deps"
        componentWillUnmount: "useEffect cleanup"

    3:
      name: "Convert this.setState"
      mapping:
        "this.setState({ x })": "setX(value)"
        "this.state.x": "x"

  testing:
    before_migration: "Ensure tests exist"
    after_migration: "Run same tests, should pass"
```

### Redux → Zustand

```yaml
redux_to_zustand:
  complexity: "Medium"

  migration_steps:
    1:
      name: "Create Zustand store"
      from: |
        // Redux slice
        const userSlice = createSlice({
          name: 'user',
          initialState: { user: null, loading: false },
          reducers: {
            setUser: (state, action) => {
              state.user = action.payload;
            },
            setLoading: (state, action) => {
              state.loading = action.payload;
            }
          }
        });

      to: |
        // Zustand store
        interface UserStore {
          user: User | null;
          loading: boolean;
          setUser: (user: User) => void;
          setLoading: (loading: boolean) => void;
        }

        const useUserStore = create<UserStore>((set) => ({
          user: null,
          loading: false,
          setUser: (user) => set({ user }),
          setLoading: (loading) => set({ loading }),
        }));

    2:
      name: "Update component usage"
      from: |
        const user = useSelector(state => state.user.user);
        const dispatch = useDispatch();
        dispatch(setUser(newUser));

      to: |
        const user = useUserStore(state => state.user);
        const setUser = useUserStore(state => state.setUser);
        setUser(newUser);

    3:
      name: "Migrate async actions"
      from: "createAsyncThunk"
      to: "Regular async functions in store"

  coexistence:
    during_migration: |
      // Bridge pattern for gradual migration
      const useUserBridge = () => {
        // Check which store has data
        const zustandUser = useUserStore(s => s.user);
        const reduxUser = useSelector(s => s.user.user);
        return zustandUser || reduxUser;
      };
```

### JavaScript → TypeScript

```yaml
javascript_to_typescript:
  complexity: "Medium-High"

  approach:
    1:
      name: "Configure TypeScript"
      actions:
        - "Add tsconfig.json"
        - "Enable allowJs: true"
        - "Set strict: false initially"

    2:
      name: "Rename files gradually"
      pattern: ".js → .ts, .jsx → .tsx"
      order: "Leaf files first, then dependencies"

    3:
      name: "Add types progressively"
      stages:
        - "Add explicit any where needed"
        - "Replace any with proper types"
        - "Enable stricter options"

  automated_tools:
    - name: "TypeScript's own inference"
      usage: "Let TS infer where possible"

    - name: "ts-migrate"
      usage: "npx ts-migrate-full ."

  type_extraction:
    from_jsdoc: |
      /**
       * @param {string} name
       * @param {number} age
       * @returns {User}
       */
      function createUser(name, age) { }

    to_typescript: |
      function createUser(name: string, age: number): User { }

  common_issues:
    implicit_any:
      solution: "Add types or use type inference"

    missing_types:
      solution: "Check @types packages or create custom types"

    third_party_libs:
      solution: "Install @types/[package] or declare module"
```

### Dependency Major Version Upgrades

```yaml
major_version_upgrade:
  complexity: "Variable"

  example_react_17_to_18:
    breaking_changes:
      - "Automatic batching"
      - "Strict mode behavior"
      - "Suspense changes"
      - "New root API"

    migration_steps:
      1:
        name: "Update dependencies"
        commands:
          - "npm install react@18 react-dom@18"
          - "npm install @types/react@18 @types/react-dom@18"

      2:
        name: "Update root render"
        before: |
          import ReactDOM from 'react-dom';
          ReactDOM.render(<App />, document.getElementById('root'));

        after: |
          import { createRoot } from 'react-dom/client';
          const root = createRoot(document.getElementById('root')!);
          root.render(<App />);

      3:
        name: "Address breaking changes"
        actions:
          - "Test automatic batching impact"
          - "Update Suspense usage"
          - "Fix strict mode warnings"

      4:
        name: "Test thoroughly"
        focus:
          - "State update behavior"
          - "useEffect timing"
          - "Suspense boundaries"
```

---

## Migration Testing

### Before Migration

```yaml
pre_migration_testing:
  requirements:
    - "All existing tests passing"
    - "Baseline performance metrics captured"
    - "Behavior snapshot if possible"

  baseline_capture:
    tests: "npm test -- --coverage > baseline-coverage.txt"
    performance: "lighthouse report saved"
    behavior: "E2E tests recording"
```

### During Migration

```yaml
during_migration_testing:
  continuous:
    - "Run tests after each file migration"
    - "Check for regressions immediately"

  comparison:
    - "Old vs new behavior"
    - "Performance comparison"

  isolation:
    - "Test migrated code independently"
    - "Integration test with non-migrated code"
```

### After Migration

```yaml
post_migration_testing:
  comprehensive:
    - "Full test suite run"
    - "E2E tests"
    - "Performance benchmarks"

  comparison:
    - "Coverage same or better"
    - "Performance same or better"
    - "No new bugs"

  monitoring:
    - "Error tracking after deploy"
    - "Performance monitoring"
    - "User feedback"
```

---

## Rollback Procedures

### Quick Rollback

```yaml
quick_rollback:
  use_when: "Migration causes immediate issues"

  steps:
    1: "Identify the problem"
    2: "Revert commits (git revert)"
    3: "Deploy previous version"
    4: "Verify rollback successful"

  commands: |
    # Revert migration commits
    git revert <migration-commit-hash>

    # Or reset to pre-migration state
    git reset --hard <pre-migration-tag>

    # Deploy
    npm run deploy
```

### Partial Rollback

```yaml
partial_rollback:
  use_when: "Only specific migrations have issues"

  approach:
    1: "Identify problematic files"
    2: "Revert only those files"
    3: "Keep successful migrations"

  commands: |
    # Revert specific files
    git checkout <pre-migration-commit> -- path/to/problem/file.tsx

    # Commit the revert
    git commit -m "Revert: problematic migration for file.tsx"
```

### Feature Flag Rollback

```yaml
feature_flag_rollback:
  use_when: "Using feature flags for migration"

  setup:
    flag_name: "USE_NEW_AUTH_IMPLEMENTATION"
    default: false

  code: |
    const AuthComponent = () => {
      if (featureFlags.USE_NEW_AUTH_IMPLEMENTATION) {
        return <NewAuth />;
      }
      return <LegacyAuth />;
    };

  rollback:
    action: "Set flag to false"
    effect: "Immediate switch to old implementation"
    no_deploy_needed: true
```

---

## Configuration

```yaml
# proagents.config.yaml

migrations:
  tracking:
    enabled: true
    file: "proagents/migrations/status.yaml"

  strategy:
    default: "gradual"
    suggest_on_file_touch: true

  automated:
    class_to_functional:
      enabled: true
      auto_suggest: true

    typescript:
      enabled: true
      auto_add_types: true

  testing:
    require_before_migration: true
    require_after_migration: true
    coverage_threshold: 80

  rollback:
    create_restore_point: true
    feature_flags: true
```

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `pa:migrate-status` | View migration progress |
| `pa:migrate-plan [type]` | Create migration plan |
| `pa:migrate-file [path]` | Migrate specific file |
| `pa:migrate-module [name]` | Migrate entire module |
| `pa:migrate-rollback [id]` | Rollback migration |
| `pa:migrate-report` | Generate migration report |
