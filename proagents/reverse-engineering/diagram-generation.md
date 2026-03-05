# Diagram Generation

Generate visual diagrams from existing code automatically.

---

## Overview

Transform code into visual representations for:
- Architecture understanding
- Documentation
- Team communication
- Onboarding

---

## Diagram Types

### 1. Component Hierarchy Diagram

Visualize React/Vue/Angular component relationships.

```mermaid
graph TB
    subgraph Pages
        Dashboard[Dashboard Page]
        Profile[Profile Page]
        Settings[Settings Page]
    end

    subgraph Layout
        AppLayout[App Layout]
        Sidebar[Sidebar]
        Header[Header]
    end

    subgraph Shared
        Button[Button]
        Modal[Modal]
        Card[Card]
    end

    Dashboard --> AppLayout
    Dashboard --> Card
    Dashboard --> Button

    Profile --> AppLayout
    Profile --> Card
    Profile --> Modal

    AppLayout --> Sidebar
    AppLayout --> Header
```

**Generated From:**
```yaml
component_scan:
  entry: "src/pages/Dashboard.tsx"

  detected_hierarchy:
    Dashboard:
      imports:
        - AppLayout
        - Card
        - Button
      children:
        - StatsWidget
        - ActivityFeed
        - QuickActions
```

---

### 2. Module Dependency Diagram

Show how modules depend on each other.

```mermaid
graph LR
    subgraph Core
        Auth[Auth Module]
        User[User Module]
        API[API Module]
    end

    subgraph Features
        Dashboard[Dashboard]
        Settings[Settings]
        Notifications[Notifications]
    end

    subgraph Shared
        Utils[Utils]
        Types[Types]
        UI[UI Components]
    end

    Dashboard --> Auth
    Dashboard --> User
    Dashboard --> API
    Dashboard --> UI

    Settings --> User
    Settings --> UI

    Auth --> API
    Auth --> Utils

    User --> API
    User --> Types

    Notifications --> User
    Notifications --> API
```

---

### 3. Data Flow Diagram

Visualize how data moves through the application.

```mermaid
flowchart LR
    subgraph UI
        Component[React Component]
        Form[Form Input]
    end

    subgraph State
        Hook[Custom Hook]
        Store[Zustand Store]
        Query[React Query]
    end

    subgraph API
        Service[API Service]
        Endpoint[REST Endpoint]
    end

    subgraph Backend
        Handler[Route Handler]
        DB[(Database)]
    end

    Form -->|user input| Component
    Component -->|calls| Hook
    Hook -->|uses| Query
    Query -->|fetches via| Service
    Service -->|HTTP| Endpoint
    Endpoint -->|Next.js| Handler
    Handler -->|Prisma| DB

    DB -->|data| Handler
    Handler -->|JSON| Endpoint
    Endpoint -->|response| Service
    Service -->|cache| Query
    Query -->|data| Hook
    Hook -->|render| Component
```

---

### 4. Database Schema Diagram

Generate ER diagrams from Prisma/TypeORM/Sequelize schemas.

```mermaid
erDiagram
    User ||--o{ Post : writes
    User ||--|| Profile : has
    User ||--o{ Comment : writes
    Post ||--o{ Comment : has
    Post }o--o{ Category : belongs_to

    User {
        string id PK
        string email UK
        string password
        string name
        datetime createdAt
    }

    Post {
        string id PK
        string title
        text content
        boolean published
        string authorId FK
        datetime createdAt
    }

    Profile {
        string id PK
        string bio
        string avatar
        string userId FK
    }

    Comment {
        string id PK
        text content
        string authorId FK
        string postId FK
        datetime createdAt
    }

    Category {
        string id PK
        string name UK
        string slug UK
    }
```

**Generated From:**
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  posts     Post[]
  profile   Profile?
  comments  Comment[]
  createdAt DateTime @default(now())
}

model Post {
  id         String     @id @default(cuid())
  title      String
  content    String?
  published  Boolean    @default(false)
  author     User       @relation(fields: [authorId], references: [id])
  authorId   String
  comments   Comment[]
  categories Category[]
  createdAt  DateTime   @default(now())
}
```

---

### 5. API Route Diagram

Visualize all API endpoints.

```mermaid
graph TB
    subgraph API["/api"]
        subgraph Auth["/auth"]
            Login[POST /login]
            Register[POST /register]
            Logout[POST /logout]
            Refresh[POST /refresh]
        end

        subgraph Users["/users"]
            ListUsers[GET /]
            GetUser[GET /:id]
            CreateUser[POST /]
            UpdateUser[PUT /:id]
            DeleteUser[DELETE /:id]
            UserPosts[GET /:id/posts]
        end

        subgraph Posts["/posts"]
            ListPosts[GET /]
            GetPost[GET /:id]
            CreatePost[POST /]
            UpdatePost[PUT /:id]
            DeletePost[DELETE /:id]
            PostComments[GET /:id/comments]
        end
    end

    style Login fill:#90EE90
    style Register fill:#90EE90
    style Logout fill:#FFB6C1
    style CreateUser fill:#90EE90
    style UpdateUser fill:#87CEEB
    style DeleteUser fill:#FFB6C1
```

---

### 6. State Management Diagram

Visualize application state structure.

```mermaid
stateDiagram-v2
    [*] --> Unauthenticated

    Unauthenticated --> Authenticating: login()
    Authenticating --> Authenticated: success
    Authenticating --> Unauthenticated: failure
    Authenticated --> Unauthenticated: logout()

    state Authenticated {
        [*] --> Idle
        Idle --> Loading: fetchData()
        Loading --> Success: data received
        Loading --> Error: request failed
        Error --> Loading: retry()
        Success --> Idle: reset()
    }
```

**Store Visualization:**
```mermaid
graph TB
    subgraph GlobalState[Global State - Zustand]
        AuthStore[Auth Store]
        UIStore[UI Store]
        UserStore[User Store]
    end

    subgraph ServerState[Server State - React Query]
        UsersQuery[Users Query]
        PostsQuery[Posts Query]
        CommentsQuery[Comments Query]
    end

    subgraph LocalState[Local State - useState]
        FormState[Form State]
        ModalState[Modal State]
        FilterState[Filter State]
    end

    AuthStore --> UsersQuery
    UserStore --> PostsQuery
    PostsQuery --> CommentsQuery
```

---

### 7. Sequence Diagram

Show interaction flow for specific features.

```mermaid
sequenceDiagram
    participant U as User
    participant C as Component
    participant H as useAuth Hook
    participant S as AuthService
    participant A as API
    participant D as Database

    U->>C: Click Login
    C->>H: login(email, password)
    H->>S: authService.login()
    S->>A: POST /api/auth/login
    A->>D: Query user
    D-->>A: User data
    A->>A: Verify password
    A->>A: Generate tokens
    A-->>S: { user, accessToken, refreshToken }
    S->>S: Store tokens
    S-->>H: User object
    H->>H: Update auth state
    H-->>C: { user, isAuthenticated: true }
    C-->>U: Redirect to dashboard
```

---

### 8. Deployment Architecture Diagram

Visualize infrastructure and deployment.

```mermaid
graph TB
    subgraph Client
        Browser[Browser]
        Mobile[Mobile App]
    end

    subgraph CDN
        CloudFront[CloudFront]
        Assets[Static Assets]
    end

    subgraph Vercel
        NextApp[Next.js App]
        ServerlessAPI[Serverless Functions]
    end

    subgraph AWS
        RDS[(PostgreSQL RDS)]
        S3[S3 Bucket]
        Redis[ElastiCache Redis]
    end

    subgraph External
        Auth0[Auth0]
        Stripe[Stripe]
        SendGrid[SendGrid]
    end

    Browser --> CloudFront
    Mobile --> CloudFront
    CloudFront --> Assets
    CloudFront --> NextApp

    NextApp --> ServerlessAPI
    ServerlessAPI --> RDS
    ServerlessAPI --> Redis
    ServerlessAPI --> S3

    ServerlessAPI --> Auth0
    ServerlessAPI --> Stripe
    ServerlessAPI --> SendGrid
```

---

## Generation Process

### Step 1: Code Analysis

```yaml
analysis:
  scan:
    - component_imports
    - module_dependencies
    - database_schema
    - api_routes
    - state_management
    - type_definitions
```

### Step 2: Relationship Extraction

```yaml
relationships:
  components:
    - parent_child
    - imports
    - props_passing

  modules:
    - dependencies
    - exports
    - shared_types

  data:
    - api_calls
    - state_updates
    - event_handlers
```

### Step 3: Diagram Generation

```yaml
generation:
  format: "mermaid"  # mermaid | plantuml | ascii | svg

  options:
    group_by_module: true
    show_external_deps: false
    highlight_critical_paths: true
    max_depth: 3
```

---

## Output Formats

### Mermaid (Default)

```markdown
```mermaid
graph TB
    A --> B
    B --> C
```
```

**Best for:** GitHub, GitLab, Notion, Obsidian

### PlantUML

```
@startuml
A --> B
B --> C
@enduml
```

**Best for:** Confluence, enterprise documentation

### ASCII Art

```
┌─────┐     ┌─────┐     ┌─────┐
│  A  │────▶│  B  │────▶│  C  │
└─────┘     └─────┘     └─────┘
```

**Best for:** Terminal, plain text docs

### SVG/PNG Export

For embedding in presentations, wikis, or external tools.

---

## Configuration

```yaml
# proagents.config.yaml

reverse_engineering:
  diagrams:
    enabled: true

    default_format: "mermaid"

    types:
      - component_hierarchy
      - module_dependency
      - data_flow
      - database_schema
      - api_routes
      - state_management
      - sequence_diagrams

    options:
      theme: "default"  # default | dark | forest | neutral
      direction: "TB"   # TB | BT | LR | RL
      max_nodes: 50     # Limit for readability
      group_threshold: 5  # Group if more than N items

    output:
      directory: "docs/diagrams/"
      formats: ["mermaid", "svg"]

    auto_generate:
      on_analysis: true
      on_feature_complete: false
```

---

## Interactive Diagram Features

### Zoom & Filter

```yaml
interactive:
  zoom:
    enabled: true
    min: 0.5
    max: 3.0

  filter:
    by_module: true
    by_type: true
    hide_external: true

  highlight:
    on_hover: true
    show_details: true
```

### Click-Through Navigation

Clicking a node in the diagram navigates to:
- Source file for that component/module
- Related documentation
- API reference

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `pa:re-diagrams` | Generate all diagrams |
| `pa:re-diagrams --type components` | Component hierarchy only |
| `pa:re-diagrams --type dependencies` | Module dependencies only |
| `pa:re-diagrams --type database` | Database schema only |
| `pa:re-diagrams --type api` | API routes only |
| `pa:re-diagrams --type flow` | Data flow diagrams |
| `pa:re-diagrams --format svg` | Export as SVG |
| `pa:re-diagrams --module auth` | Diagrams for specific module |
