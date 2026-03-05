# Project Type Selection

Interactive project type selection during `pa:init` command.

---

## Available Project Types

### 1. Web Frontend
**For:** Single-page applications, static sites, PWAs

**Frameworks:**
- React (Vite, CRA)
- Vue (Vite)
- Angular
- Svelte
- Solid.js

**Workflow Adjustments:**
- UI Design phase emphasized
- Component testing focus
- Bundle optimization included
- No backend/API phases
- Browser compatibility testing

**Generated Config:**
```yaml
project:
  type: "web-frontend"
  framework: "react"  # User selected

phases:
  ui_design: required
  api_design: skipped
  database: skipped
  deployment:
    target: "static-hosting"  # Vercel, Netlify, S3
```

---

### 2. Full-stack
**For:** Complete web applications with frontend + backend

**Frameworks:**
- Next.js
- Nuxt.js
- SvelteKit
- Remix
- Astro (with SSR)

**Workflow Adjustments:**
- Full workflow enabled
- API design included
- Database migration support
- SSR/SSG considerations
- Full deployment pipeline

**Generated Config:**
```yaml
project:
  type: "fullstack"
  framework: "nextjs"

phases:
  ui_design: required
  api_design: required
  database: optional
  deployment:
    target: "serverless"  # Vercel, Netlify Functions
```

---

### 3. Mobile
**For:** iOS, Android, cross-platform mobile apps

**Frameworks:**
- React Native
- Flutter
- Native iOS (Swift)
- Native Android (Kotlin)
- Ionic/Capacitor

**Workflow Adjustments:**
- Mobile UI guidelines (iOS HIG, Material Design)
- App store deployment
- Device testing matrix
- Performance profiling (memory, battery)
- Push notification setup

**Generated Config:**
```yaml
project:
  type: "mobile"
  framework: "react-native"
  platforms: ["ios", "android"]

phases:
  ui_design:
    guidelines: ["ios-hig", "material-design"]
  testing:
    devices: ["ios-simulator", "android-emulator"]
  deployment:
    target: ["app-store", "play-store"]
```

---

### 4. Desktop
**For:** Desktop applications (Windows, macOS, Linux)

**Frameworks:**
- Electron
- Tauri
- Qt (C++/Python)
- .NET MAUI
- Flutter Desktop

**Workflow Adjustments:**
- Multi-platform builds
- Native OS integration
- Auto-updater setup
- Code signing
- Installer creation

**Generated Config:**
```yaml
project:
  type: "desktop"
  framework: "electron"
  platforms: ["windows", "macos", "linux"]

phases:
  ui_design:
    guidelines: ["windows-fluent", "macos-hig", "gtk"]
  deployment:
    signing: required
    auto_update: true
    installers: ["msi", "dmg", "deb"]
```

---

### 5. Backend/API
**For:** REST APIs, GraphQL servers, microservices

**Frameworks:**
- Node.js (Express, Fastify, NestJS)
- Python (FastAPI, Django, Flask)
- Go (Gin, Echo, Fiber)
- Rust (Actix, Axum)
- Java (Spring Boot)

**Workflow Adjustments:**
- No UI design phase
- API design emphasized
- Database design included
- API documentation (OpenAPI/Swagger)
- Load testing included

**Generated Config:**
```yaml
project:
  type: "backend"
  framework: "nodejs-express"
  api_style: "rest"  # rest, graphql, grpc

phases:
  ui_design: skipped
  api_design: required
  database: required
  testing:
    load_testing: true
  documentation:
    api_docs: "openapi"
```

---

### 6. CLI Tool
**For:** Command-line applications and tools

**Languages:**
- Node.js (Commander, Yargs, Oclif)
- Python (Click, Typer, argparse)
- Rust (Clap)
- Go (Cobra)

**Workflow Adjustments:**
- No UI design (text-based interface)
- Argument parsing patterns
- Help text generation
- Cross-platform binaries
- Package registry publishing

**Generated Config:**
```yaml
project:
  type: "cli"
  language: "nodejs"

phases:
  ui_design: skipped
  deployment:
    target: ["npm", "homebrew", "binary"]
```

---

### 7. Library/Package
**For:** Reusable code packages (npm, PyPI, crates.io)

**Languages:**
- JavaScript/TypeScript (npm)
- Python (PyPI)
- Rust (crates.io)
- Go (pkg.go.dev)

**Workflow Adjustments:**
- API design focused
- Comprehensive documentation
- Backward compatibility checks
- Semantic versioning
- Multi-format builds (CJS, ESM, UMD)

**Generated Config:**
```yaml
project:
  type: "library"
  language: "typescript"

phases:
  ui_design: skipped
  api_design: required
  testing:
    coverage_minimum: 90
  deployment:
    target: "npm"
    formats: ["esm", "cjs", "types"]
```

---

### 8. Microservices
**For:** Distributed systems with multiple services

**Technologies:**
- Docker
- Kubernetes
- Service Mesh (Istio)
- Message Queues (RabbitMQ, Kafka)

**Workflow Adjustments:**
- Service boundary definition
- API contract design
- Inter-service communication
- Container orchestration
- Distributed tracing

**Generated Config:**
```yaml
project:
  type: "microservices"
  orchestration: "kubernetes"

phases:
  api_design:
    style: "contract-first"
  deployment:
    container: "docker"
    orchestration: "kubernetes"
  observability:
    tracing: true
    metrics: true
```

---

### 9. Monorepo
**For:** Multiple related projects in one repository

**Tools:**
- Turborepo
- Nx
- Lerna
- pnpm Workspaces
- Yarn Workspaces

**Workflow Adjustments:**
- Multi-project coordination
- Shared dependencies
- Affected project detection
- Parallel builds
- Cross-project testing

**Generated Config:**
```yaml
project:
  type: "monorepo"
  tool: "turborepo"

workspaces:
  - name: "web"
    type: "web-frontend"
    path: "./apps/web"
  - name: "api"
    type: "backend"
    path: "./apps/api"
  - name: "shared"
    type: "library"
    path: "./packages/shared"
```

---

## Selection Flow

### Step 1: Project Type
```
? What type of project are you developing?
  ○ Web Frontend
  ○ Full-stack
  ○ Mobile
  ○ Desktop
  ○ Backend/API
  ○ CLI Tool
  ○ Library/Package
  ○ Microservices
  ○ Monorepo
```

### Step 2: Framework/Language (Based on Type)
```
? Select your framework: (Web Frontend selected)
  ○ React (Vite)
  ○ React (Create React App)
  ○ Vue 3 (Vite)
  ○ Angular
  ○ Svelte
  ○ Other (specify)
```

### Step 3: Additional Options
```
? Select additional features:
  ☑ TypeScript
  ☐ Testing (Jest/Vitest)
  ☑ Linting (ESLint)
  ☑ Formatting (Prettier)
  ☐ CI/CD (GitHub Actions)
  ☐ Docker
```

### Step 4: Standards Selection
```
? Use coding standards:
  ○ ProAgents Default
  ○ Airbnb Style Guide
  ○ Google Style Guide
  ○ Custom (I'll configure)
```

---

## Type-Specific Checklists

Each project type gets customized checklists:

| Project Type | Pre-Implementation | Testing | Deployment |
|-------------|-------------------|---------|------------|
| Web Frontend | Component design, Routing | Unit, E2E, Visual | Static hosting |
| Full-stack | API design, DB schema | Unit, Integration, E2E | Serverless/Container |
| Mobile | Screen design, Navigation | Unit, Device tests | App stores |
| Desktop | Window design, OS integration | Unit, Platform tests | Installers |
| Backend/API | API design, DB schema | Unit, Integration, Load | Container/Serverless |
| CLI | Command design | Unit, Integration | Package registries |
| Library | API design | Unit, Integration | Package registries |

---

## Type-Specific Templates

Each type includes:
1. **Scaffolding template** - Initial project structure
2. **Config template** - Pre-configured settings
3. **Workflow template** - Customized phase order
4. **Checklist template** - Type-specific checklists
5. **Example workflow** - Complete feature example

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `pa:init` | Start with project type selection |
| `pa:init --type web` | Skip selection, use web frontend |
| `pa:init --type mobile --framework react-native` | Full preset |
| `pa:init --wizard` | Full interactive wizard |
| `pa:init --quick` | Minimal setup |
