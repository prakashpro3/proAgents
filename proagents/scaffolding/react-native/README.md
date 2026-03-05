# React Native (Mobile) Scaffold

Project structure and configuration for React Native mobile applications.

---

## Directory Structure

```
project-root/
├── src/
│   ├── screens/             # Screen components (pages)
│   │   ├── Home/
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── HomeScreen.test.tsx
│   │   │   └── index.ts
│   │   ├── Auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   └── index.ts
│   │
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Basic UI elements
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Card.tsx
│   │   ├── forms/          # Form components
│   │   └── index.ts
│   │
│   ├── navigation/          # Navigation configuration
│   │   ├── RootNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   ├── MainNavigator.tsx
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   └── index.ts
│   │
│   ├── services/            # API and external services
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── storageService.ts
│   │   └── index.ts
│   │
│   ├── stores/              # State management (Zustand)
│   │   ├── authStore.ts
│   │   ├── userStore.ts
│   │   └── index.ts
│   │
│   ├── utils/               # Utility functions
│   │   ├── helpers.ts
│   │   ├── constants.ts
│   │   ├── dimensions.ts
│   │   └── index.ts
│   │
│   ├── types/               # TypeScript types
│   │   ├── navigation.types.ts
│   │   ├── api.types.ts
│   │   └── index.ts
│   │
│   ├── theme/               # Theme configuration
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── index.ts
│   │
│   └── assets/              # Local assets
│       ├── images/
│       ├── fonts/
│       └── icons/
│
├── __tests__/               # Test files
│   ├── setup.ts
│   └── utils.tsx
│
├── ios/                     # iOS native code
│   └── ...
│
├── android/                 # Android native code
│   └── ...
│
├── .husky/                  # Git hooks
│
├── proagents/               # ProAgents configuration
│
├── App.tsx                  # Root component
├── index.js                 # Entry point
├── app.json                 # App configuration
├── package.json
├── tsconfig.json
├── babel.config.js
├── metro.config.js
├── jest.config.js
└── proagents.config.yaml
```

---

## Configuration Files

### package.json
```json
{
  "name": "{{project-name}}",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start",
    "test": "jest",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "type-check": "tsc --noEmit",
    "clean": "watchman watch-del-all && rm -rf node_modules && npm install",
    "clean:android": "cd android && ./gradlew clean && cd ..",
    "clean:ios": "cd ios && pod deintegrate && pod install && cd ..",
    "prepare": "husky install"
  },
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.73.0",
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/native-stack": "^6.9.0",
    "react-native-screens": "^3.29.0",
    "react-native-safe-area-context": "^4.8.0",
    "zustand": "^4.4.0",
    "@tanstack/react-query": "^5.0.0",
    "axios": "^1.6.0",
    "@react-native-async-storage/async-storage": "^1.21.0"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@babel/preset-env": "^7.20.0",
    "@babel/runtime": "^7.20.0",
    "@react-native/babel-preset": "^0.73.0",
    "@react-native/eslint-config": "^0.73.0",
    "@react-native/metro-config": "^0.73.0",
    "@react-native/typescript-config": "^0.73.0",
    "@types/react": "^18.2.0",
    "@types/react-test-renderer": "^18.0.0",
    "typescript": "^5.0.0",
    "jest": "^29.6.0",
    "@testing-library/react-native": "^12.4.0",
    "eslint": "^8.19.0",
    "prettier": "^3.1.0",
    "husky": "^8.0.0",
    "@commitlint/cli": "^18.4.0",
    "@commitlint/config-conventional": "^18.4.0"
  }
}
```

### tsconfig.json
```json
{
  "extends": "@react-native/typescript-config/tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@screens/*": ["src/screens/*"],
      "@components/*": ["src/components/*"],
      "@navigation/*": ["src/navigation/*"],
      "@hooks/*": ["src/hooks/*"],
      "@services/*": ["src/services/*"],
      "@stores/*": ["src/stores/*"],
      "@utils/*": ["src/utils/*"],
      "@types/*": ["src/types/*"],
      "@theme/*": ["src/theme/*"],
      "@assets/*": ["src/assets/*"]
    }
  }
}
```

### babel.config.js
```javascript
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@screens': './src/screens',
          '@components': './src/components',
          '@navigation': './src/navigation',
          '@hooks': './src/hooks',
          '@services': './src/services',
          '@stores': './src/stores',
          '@utils': './src/utils',
          '@types': './src/types',
          '@theme': './src/theme',
          '@assets': './src/assets',
        },
      },
    ],
  ],
};
```

---

## Starter Files

### App.tsx
```tsx
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RootNavigator } from '@/navigation';

const queryClient = new QueryClient();

function App(): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

export default App;
```

### src/navigation/RootNavigator.tsx
```tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '@/screens/Home';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### src/navigation/types.ts
```tsx
export type RootStackParamList = {
  Home: undefined;
  Details: { id: string };
  Profile: { userId: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
```

### src/screens/Home/HomeScreen.tsx
```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>Start building your app</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
```

### src/theme/colors.ts
```typescript
export const colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',

  background: '#FFFFFF',
  surface: '#F2F2F7',
  text: '#000000',
  textSecondary: '#8E8E93',

  border: '#C6C6C8',
  divider: '#E5E5EA',
};
```

---

## ProAgents Configuration

### proagents.config.yaml (React Native-specific)
```yaml
project:
  name: "{{project-name}}"
  type: "mobile"
  framework: "react-native"
  language: "typescript"
  platforms: ["ios", "android"]

phases:
  analysis:
    enabled: true
    focus:
      - "screen-structure"
      - "navigation-patterns"
      - "platform-specific"
  ui_design:
    enabled: true
    guidelines:
      - "ios-hig"
      - "material-design"
      - "accessibility"
  api_design:
    enabled: false
  testing:
    coverage_target: 75
    types: ["unit", "integration"]
    device_testing: true

patterns:
  screens:
    naming: "PascalCase"
    suffix: "Screen"
    structure: "folder-per-screen"
  components:
    style: "functional"
    platform_specific: true
  navigation:
    library: "react-navigation"
    type: "native-stack"
  state:
    global: "zustand"
    server: "react-query"
  styling:
    approach: "stylesheet"  # or nativewind, styled-components

testing:
  framework: "jest"
  library: "testing-library-react-native"
  device_testing:
    ios_simulator: true
    android_emulator: true

deployment:
  ios:
    method: "app-store"  # or testflight, adhoc
    signing: "automatic"
  android:
    method: "play-store"  # or internal, beta
    signing: "release-keystore"
```

---

## Screen Template

When creating new screens:

```
src/screens/MyScreen/
├── MyScreen.tsx          # Main screen component
├── MyScreen.test.tsx     # Screen tests
├── components/           # Screen-specific components
├── hooks/               # Screen-specific hooks
└── index.ts             # Export
```

### Screen File Template
```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'MyScreen'>;

export function MyScreen({ navigation, route }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>My Screen</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
```

---

## Platform-Specific Files

For platform-specific code:

```
src/components/Button/
├── Button.tsx            # Shared logic
├── Button.ios.tsx        # iOS-specific
├── Button.android.tsx    # Android-specific
└── index.ts
```

---

## Slash Commands (React Native-specific)

| Command | Description |
|---------|-------------|
| `pa:screen [name]` | Generate new screen |
| `pa:component [name]` | Generate component |
| `pa:hook [name]` | Generate custom hook |
| `pa:navigator [name]` | Generate navigator |
| `pa:service [name]` | Generate service |
| `pa:run ios` | Run on iOS simulator |
| `pa:run android` | Run on Android emulator |
| `pa:build ios` | Build iOS release |
| `pa:build android` | Build Android release |
