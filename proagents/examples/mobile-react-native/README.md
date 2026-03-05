# Mobile React Native Example

Complete walkthrough of ProAgents workflow for a React Native mobile application.

---

## Overview

This example demonstrates how to use ProAgents to build features in a React Native application for iOS and Android. It covers mobile-specific patterns, navigation, and platform considerations.

---

## Project Type

- **Framework:** React Native 0.72+ / Expo
- **Language:** TypeScript
- **Navigation:** React Navigation
- **State Management:** Zustand
- **Testing:** Jest + React Native Testing Library

---

## Files in This Example

| File | Description |
|------|-------------|
| [workflow-example.md](./workflow-example.md) | Step-by-step workflow phases |
| [proagents.config.yaml](./proagents.config.yaml) | Project-specific configuration |

---

## What You'll Learn

### 1. Mobile Project Analysis
- Understanding React Native project structure
- Identifying platform-specific code (iOS/Android)
- Navigation flow mapping
- Native module detection

### 2. Mobile UI Design
- Converting mobile designs to components
- Platform-specific styling (iOS vs Android)
- Responsive layouts for different devices
- Gesture handling patterns

### 3. Implementation
- Screen components and navigation
- Platform-specific code when needed
- Async storage and data persistence
- API integration with offline support

### 4. Testing
- Component tests with Testing Library
- Navigation flow tests
- Snapshot testing for UI consistency
- Device-specific testing considerations

---

## Quick Start

```bash
# Copy configuration to your React Native project
cp proagents.config.yaml /path/to/your/react-native-project/

# Start a new feature
proagents feature start "Add push notification settings screen"
```

---

## Example Feature: Notification Settings

The workflow-example.md demonstrates building:
- Settings screen with toggle switches
- Platform-specific notification permissions
- Local storage for preferences
- Deep linking to system settings

---

## Key Patterns Demonstrated

### Project Structure
```
src/
├── screens/          # Screen components
│   ├── HomeScreen.tsx
│   └── SettingsScreen.tsx
├── components/       # Reusable components
│   ├── ui/
│   └── forms/
├── navigation/       # Navigation configuration
│   └── RootNavigator.tsx
├── hooks/            # Custom hooks
├── services/         # API and native services
├── stores/           # State management
└── utils/            # Utilities
    └── platform.ts   # Platform helpers
```

### Platform-Specific Patterns
```typescript
// Platform-specific code
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 44 : 0,
  },
});

// Platform-specific files
// Button.ios.tsx
// Button.android.tsx
```

---

## Configuration Highlights

```yaml
# From proagents.config.yaml
project:
  type: "mobile"
  framework: "react-native"

platforms:
  ios: true
  android: true

testing:
  framework: "jest"
  coverage_threshold: 75
  snapshot_testing: true

checkpoints:
  after_design: true      # Review UI for both platforms
  before_deployment: true # Final review before app store
```

---

## Mobile-Specific Considerations

### Performance
- List virtualization (FlatList)
- Image optimization
- Bundle size monitoring
- Memory management

### Platform Differences
- Navigation patterns (tabs vs drawer)
- System UI (status bar, safe areas)
- Permissions handling
- Push notifications

### Testing on Devices
- iOS Simulator testing
- Android Emulator testing
- Physical device testing
- Different screen sizes

---

## Related Resources

- [React Native Scaffolding Template](../../scaffolding/react-native/)
- [UI Design Integration](../../ui-integration/)
- [Testing Standards](../../testing-standards/)
- [Performance Monitoring](../../performance/)
