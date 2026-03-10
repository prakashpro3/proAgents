# ProAgents Testing Configuration

## Test Commands

| Command | Action |
|---------|--------|
| `pa:test` | Run all tests |
| `pa:test-unit` | Unit tests only |
| `pa:test-integration` | Integration tests |
| `pa:test-e2e` | End-to-end tests |
| `pa:test-coverage` | Run with coverage report |
| `pa:test-watch` | Watch mode |
| `pa:test-file "path"` | Test specific file |
| `pa:test-failed` | Re-run failed tests |

## Configuration

Tests are configured in `proagents.config.yaml`:

```yaml
testing:
  coverage_targets:
    unit: 80
    integration: 60
    e2e: critical_flows
  parallel: true
  max_workers: 4

  tools:
    unit:
      command: "npm test"
      framework: "jest"
    integration:
      command: "npm run test:integration"
      framework: "jest"
    e2e:
      command: "npx playwright test"
      framework: "playwright"
    visual:
      command: "npx percy exec -- npm test"
      framework: "percy"
    load:
      command: "k6 run loadtest.js"
      framework: "k6"
    security:
      command: "npm audit && snyk test"
      framework: "snyk"
```

## Mobile Testing

```yaml
testing:
  mobile:
    react_native:
      unit:
        command: "npm test"
        framework: "jest"
      component:
        command: "npm test -- --testPathPattern=components"
        framework: "@testing-library/react-native"
      e2e:
        command: "maestro test .maestro/"
        framework: "maestro"

    android:
      unit:
        command: "./gradlew test"
        framework: "junit"
      integration:
        command: "./gradlew connectedAndroidTest"
        framework: "espresso"
      e2e:
        command: "maestro test .maestro/"
        framework: "maestro"

    ios:
      unit:
        command: "xcodebuild test -scheme MyApp -destination 'platform=iOS Simulator,name=iPhone 15'"
        framework: "xctest"
      e2e:
        command: "maestro test .maestro/"
        framework: "maestro"

    flutter:
      unit:
        command: "flutter test"
        framework: "flutter_test"
      integration:
        command: "flutter test integration_test/"
        framework: "integration_test"
      e2e:
        command: "maestro test .maestro/"
        framework: "maestro"
```

## pa:test-mobile - Full Mobile Testing

**CRITICAL: AI must SET UP testing if not configured, not tell user to test manually!**

### When E2E Not Configured - AI Must Install:

```bash
# 1. Check if Maestro installed
maestro --version 2>/dev/null || {
  echo "Installing Maestro..."
  curl -Ls "https://get.maestro.mobile.dev" | bash
}

# 2. Create .maestro folder if missing
mkdir -p .maestro

# 3. Create sample test flow
cat > .maestro/login-flow.yaml << 'EOF'
appId: com.yourapp
---
- launchApp
- tapOn: "Login"
- inputText:
    id: "email"
    text: "test@example.com"
- inputText:
    id: "password"
    text: "password123"
- tapOn: "Submit"
- assertVisible: "Welcome"
EOF

# 4. Run tests
maestro test .maestro/
```

### AI Workflow for pa:test-mobile:

1. **Check what's configured:**
   ```bash
   ls .maestro/ 2>/dev/null || echo "No Maestro tests"
   ls e2e/ 2>/dev/null || echo "No Detox tests"
   ```

2. **If nothing configured - SET IT UP:**
   - Install Maestro (easier) or Detox
   - Create test flows for the feature being tested
   - Run the tests

3. **If configured - RUN tests:**
   ```bash
   maestro test .maestro/
   # OR
   npx detox test
   ```

4. **Report results:**
   ```
   Mobile Test Results
   ═══════════════════
   ✓ login-flow.yaml - PASSED (3.2s)
   ✓ signup-flow.yaml - PASSED (4.1s)
   ✗ checkout-flow.yaml - FAILED
     Error: Element "Submit" not found
   ```

### WRONG Behavior:
```
"E2E not configured. Please test manually:
- Open app
- Click login
- ..."
```

### CORRECT Behavior:
```
E2E not configured. Setting up Maestro...

Installing Maestro... ✓
Creating test flows for login feature...
Created: .maestro/login-flow.yaml

Running tests...
✓ login-flow.yaml - PASSED

All tests passed!
```

---

## How pa:test Works

1. **Read config** from `proagents.config.yaml`
2. **Detect test type** from command (unit, e2e, etc.)
3. **If not configured - SET IT UP** (install tools, create tests)
4. **Run appropriate command** from config
5. **Parse results** based on framework
6. **Report summary**:
   ```
   Test Results
   ════════════
   ✓ 45 passed
   ✗ 2 failed
   ○ 3 skipped

   Coverage: 82%

   Failed:
   • src/auth/login.test.ts - Expected true, got false
   • src/api/user.test.ts - Timeout
   ```

## Custom Test Commands

Add custom commands in config:

```yaml
testing:
  custom_commands:
    test:quick: "npm test -- --onlyChanged"
    test:ci: "npm test -- --coverage --ci"
    test:debug: "npm test -- --runInBand --detectOpenHandles"
```

Use with: `pa:test-quick`, `pa:test-ci`, `pa:test-debug`

## Framework Detection

If no config exists, detect from:

1. `package.json` - scripts.test, devDependencies
2. Config files - `jest.config.js`, `vitest.config.ts`, `playwright.config.ts`
3. Common patterns in codebase

## Coverage Requirements

```yaml
testing:
  coverage_targets:
    unit: 80        # Minimum 80% for unit tests
    integration: 60 # Minimum 60% for integration
    e2e: critical_flows  # Cover critical user flows
```

If coverage drops below target, warn user.
