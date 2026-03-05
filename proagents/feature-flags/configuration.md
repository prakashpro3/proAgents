# Feature Flag Configuration

Setting up and managing feature flags in your application.

---

## Configuration Structure

### Basic Flag Definition

```yaml
# proagents.config.yaml
feature_flags:
  enabled: true

  # Flag definitions
  flags:
    new_checkout_flow:
      description: "New streamlined checkout experience"
      type: "boolean"
      default: false
      environments:
        development: true
        staging: true
        production: false

    max_upload_size:
      description: "Maximum file upload size in MB"
      type: "number"
      default: 10
      environments:
        development: 100
        staging: 50
        production: 25

    pricing_tier:
      description: "Active pricing model"
      type: "string"
      default: "standard"
      allowed_values: ["standard", "premium", "enterprise"]
```

### Flag Types

```yaml
feature_flags:
  flags:
    # Boolean flag
    dark_mode:
      type: "boolean"
      default: false

    # Number flag
    rate_limit:
      type: "number"
      default: 100
      min: 10
      max: 1000

    # String flag
    api_version:
      type: "string"
      default: "v1"
      allowed_values: ["v1", "v2", "v3"]

    # JSON flag
    feature_config:
      type: "json"
      default:
        enabled: true
        max_items: 50
        show_banner: false
```

---

## Flag Targeting

### User-Based Targeting

```yaml
feature_flags:
  flags:
    beta_features:
      type: "boolean"
      default: false

      targeting:
        # Enable for specific users
        users:
          - "user-123"
          - "user-456"

        # Enable for user attributes
        rules:
          - attribute: "plan"
            operator: "equals"
            value: "enterprise"
            percentage: 100

          - attribute: "signup_date"
            operator: "before"
            value: "2024-01-01"
            percentage: 50
```

### Percentage Rollouts

```yaml
feature_flags:
  flags:
    new_ui:
      type: "boolean"
      default: false

      targeting:
        # Gradual rollout
        percentage:
          enabled: 25  # 25% of users
          sticky: true  # Same users always get same value

        # Exclude specific segments
        exclude:
          - attribute: "account_type"
            value: "free"
```

### Geographic Targeting

```yaml
feature_flags:
  flags:
    gdpr_consent:
      type: "boolean"
      default: false

      targeting:
        # By country
        geo:
          countries:
            - code: "EU"
              value: true
            - code: "US"
              value: false

        # By region
        regions:
          - name: "Europe"
            value: true
          - name: "California"
            value: true
```

### Time-Based Targeting

```yaml
feature_flags:
  flags:
    holiday_theme:
      type: "boolean"
      default: false

      targeting:
        schedule:
          - start: "2024-12-20T00:00:00Z"
            end: "2024-12-26T23:59:59Z"
            value: true

          - start: "2024-12-31T18:00:00Z"
            end: "2025-01-01T12:00:00Z"
            value: true
```

---

## Provider Integration

### LaunchDarkly

```yaml
feature_flags:
  provider: "launchdarkly"

  launchdarkly:
    sdk_key_env: "LAUNCHDARKLY_SDK_KEY"
    stream_url: "https://stream.launchdarkly.com"

    # Sync local flags
    sync:
      enabled: true
      interval: "5m"

    # Offline fallback
    offline:
      enabled: true
      fallback_file: "./flags-cache.json"
```

### Split.io

```yaml
feature_flags:
  provider: "split"

  split:
    api_key_env: "SPLIT_API_KEY"

    # Traffic type
    traffic_type: "user"

    # Impressions
    impressions:
      mode: "optimized"
```

### Unleash

```yaml
feature_flags:
  provider: "unleash"

  unleash:
    url: "https://unleash.company.com/api"
    api_token_env: "UNLEASH_API_TOKEN"
    app_name: "myapp"
    instance_id: "${HOSTNAME}"

    # Refresh interval
    refresh_interval: 15
```

### Local Provider

```yaml
feature_flags:
  provider: "local"

  local:
    # Load from file
    config_file: "./feature-flags.yaml"

    # Hot reload
    watch: true
    reload_interval: "30s"
```

---

## Code Integration

### JavaScript/TypeScript

```typescript
// Initialize
import { FeatureFlags } from '@proagents/feature-flags';

const flags = new FeatureFlags({
  provider: 'launchdarkly',
  sdkKey: process.env.LAUNCHDARKLY_SDK_KEY,
});

// Check flag
if (await flags.isEnabled('new_checkout_flow', { userId: user.id })) {
  // New checkout flow
} else {
  // Old checkout flow
}

// Get variation
const maxSize = await flags.getValue('max_upload_size', { userId: user.id });

// With default fallback
const tier = await flags.getValue('pricing_tier', { userId: user.id }, 'standard');
```

### React

```tsx
import { useFeatureFlag, FeatureFlagProvider } from '@proagents/feature-flags/react';

// Provider setup
function App() {
  return (
    <FeatureFlagProvider config={{ provider: 'launchdarkly' }}>
      <MyComponent />
    </FeatureFlagProvider>
  );
}

// Hook usage
function MyComponent() {
  const { isEnabled, isLoading } = useFeatureFlag('new_ui');

  if (isLoading) return <Loading />;

  return isEnabled ? <NewUI /> : <OldUI />;
}

// Conditional rendering
function FeatureGate({ flag, children, fallback }) {
  const { isEnabled } = useFeatureFlag(flag);
  return isEnabled ? children : fallback;
}

<FeatureGate flag="beta_features" fallback={<StandardView />}>
  <BetaView />
</FeatureGate>
```

### Backend (Node.js)

```typescript
// Middleware
import { featureFlagMiddleware } from '@proagents/feature-flags/express';

app.use(featureFlagMiddleware({
  provider: 'launchdarkly',
  userIdExtractor: (req) => req.user?.id,
}));

// Route usage
app.get('/api/checkout', async (req, res) => {
  if (req.featureFlags.isEnabled('new_checkout_flow')) {
    return handleNewCheckout(req, res);
  }
  return handleOldCheckout(req, res);
});
```

---

## Flag Lifecycle

### Flag States

```yaml
feature_flags:
  lifecycle:
    states:
      - "development"    # Being developed
      - "testing"        # In QA/staging
      - "rollout"        # Gradually releasing
      - "released"       # Fully released
      - "deprecated"     # Marked for removal
      - "archived"       # Removed from code

    # Automatic transitions
    transitions:
      testing_to_rollout:
        condition: "staging_tests_pass"
        approval_required: true

      rollout_to_released:
        condition: "rollout_percentage == 100 AND no_issues"
        approval_required: false
```

### Flag Cleanup

```yaml
feature_flags:
  cleanup:
    # Alert on stale flags
    stale_alert:
      enabled: true
      threshold: "90d"
      notify: ["engineering@company.com"]

    # Auto-archive
    auto_archive:
      enabled: true
      threshold: "180d"
      condition: "released_and_no_changes"

    # Cleanup reports
    reports:
      schedule: "monthly"
      recipients: ["tech-leads@company.com"]
```

---

## Commands

```bash
# List all flags
proagents flags list

# Get flag value
proagents flags get new_checkout_flow

# Set flag value
proagents flags set new_checkout_flow true --env production

# Enable for percentage
proagents flags rollout new_ui --percentage 25

# Enable for users
proagents flags enable new_ui --users user-123,user-456

# Disable flag
proagents flags disable new_checkout_flow

# View flag history
proagents flags history new_ui

# Cleanup stale flags
proagents flags cleanup --dry-run
```

---

## Best Practices

1. **Naming Convention**: Use snake_case, be descriptive
2. **Short-Lived Flags**: Remove flags after full rollout
3. **Default Safe**: Defaults should be the safe/old behavior
4. **Document Purpose**: Always add descriptions
5. **Test Both States**: Ensure both flag states work
6. **Monitor Usage**: Track flag evaluations and outcomes
