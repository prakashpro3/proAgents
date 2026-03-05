# React (Web Frontend) Scaffold

Project structure and configuration for React applications.

---

## Directory Structure

```
project-root/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Basic UI elements (Button, Input, etc.)
│   │   ├── forms/           # Form components
│   │   ├── layout/          # Layout components (Header, Footer, etc.)
│   │   └── index.ts         # Component exports
│   │
│   ├── pages/               # Page components (route endpoints)
│   │   ├── Home/
│   │   │   ├── Home.tsx
│   │   │   ├── Home.test.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   └── index.ts
│   │
│   ├── services/            # API and external service calls
│   │   ├── api.ts           # API client configuration
│   │   ├── authService.ts
│   │   └── index.ts
│   │
│   ├── stores/              # State management (Zustand/Redux)
│   │   ├── authStore.ts
│   │   └── index.ts
│   │
│   ├── utils/               # Utility functions
│   │   ├── helpers.ts
│   │   ├── constants.ts
│   │   └── index.ts
│   │
│   ├── types/               # TypeScript type definitions
│   │   ├── api.types.ts
│   │   ├── user.types.ts
│   │   └── index.ts
│   │
│   ├── styles/              # Global styles
│   │   ├── globals.css
│   │   └── variables.css
│   │
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Entry point
│   └── vite-env.d.ts        # Vite type definitions
│
├── public/                  # Static assets
│   ├── favicon.ico
│   └── robots.txt
│
├── tests/                   # Test utilities and setup
│   ├── setup.ts
│   └── utils.tsx
│
├── .husky/                  # Git hooks
│   ├── pre-commit
│   └── commit-msg
│
├── proagents/               # ProAgents configuration
│   └── ...
│
├── index.html               # HTML entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── eslint.config.js
├── prettier.config.js
├── tailwind.config.js       # If using Tailwind
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
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "format": "prettier --write src/",
    "type-check": "tsc --noEmit",
    "prepare": "husky install"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "zustand": "^4.4.0",
    "@tanstack/react-query": "^5.0.0",
    "axios": "^1.6.0",
    "clsx": "^2.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "eslint": "^8.55.0",
    "eslint-plugin-react": "^7.33.0",
    "eslint-plugin-react-hooks": "^4.6.0",
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
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@hooks/*": ["src/hooks/*"],
      "@services/*": ["src/services/*"],
      "@stores/*": ["src/stores/*"],
      "@utils/*": ["src/utils/*"],
      "@types/*": ["src/types/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### vite.config.ts
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    sourcemap: true,
  },
});
```

### vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: ['node_modules/', 'tests/'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

---

## Starter Files

### src/App.tsx
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Home } from '@/pages/Home';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
```

### src/main.tsx
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### src/pages/Home/Home.tsx
```tsx
export function Home() {
  return (
    <div>
      <h1>Welcome to Your App</h1>
      <p>Start building something amazing!</p>
    </div>
  );
}
```

### tests/setup.ts
```typescript
import '@testing-library/jest-dom';
```

---

## ProAgents Configuration

### proagents.config.yaml (React-specific)
```yaml
project:
  name: "{{project-name}}"
  type: "web-frontend"
  framework: "react-vite"
  language: "typescript"

phases:
  analysis:
    enabled: true
    focus:
      - "component-structure"
      - "state-management"
      - "routing"
  ui_design:
    enabled: true
    guidelines: ["react-patterns", "accessibility"]
  api_design:
    enabled: false
  testing:
    coverage_target: 80
    types: ["unit", "integration"]

patterns:
  components:
    style: "functional"
    naming: "PascalCase"
    structure: "folder-per-component"
  state:
    global: "zustand"
    server: "react-query"
    local: "useState"
  styling:
    approach: "tailwind"  # or css-modules, styled-components
  testing:
    framework: "vitest"
    library: "testing-library"

deployment:
  target: "vercel"  # or netlify, cloudflare-pages
  build_command: "npm run build"
  output_directory: "dist"
```

---

## Component Template

When creating new components, use this structure:

```
src/components/MyComponent/
├── MyComponent.tsx       # Main component
├── MyComponent.test.tsx  # Component tests
├── MyComponent.module.css # Styles (if using CSS modules)
└── index.ts              # Export
```

### Component File Template
```tsx
import { memo } from 'react';
import type { FC } from 'react';

interface MyComponentProps {
  title: string;
  onClick?: () => void;
}

export const MyComponent: FC<MyComponentProps> = memo(({ title, onClick }) => {
  return (
    <div data-testid="my-component">
      <h2>{title}</h2>
      {onClick && <button onClick={onClick}>Click me</button>}
    </div>
  );
});

MyComponent.displayName = 'MyComponent';
```

### Test File Template
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders title correctly', () => {
    render(<MyComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('calls onClick when button is clicked', () => {
    const handleClick = vi.fn();
    render(<MyComponent title="Test" onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## Slash Commands (React-specific)

| Command | Description |
|---------|-------------|
| `pa:component [name]` | Generate new component |
| `pa:hook [name]` | Generate custom hook |
| `pa:page [name]` | Generate page component |
| `pa:service [name]` | Generate service |
| `pa:store [name]` | Generate Zustand store |
