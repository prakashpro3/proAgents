# Plugin API Reference

Complete API documentation for ProAgents plugins.

---

## Plugin Structure

```
my-plugin/
├── package.json          # Plugin metadata
├── index.ts              # Main entry point
├── src/
│   ├── hooks/            # Lifecycle hooks
│   ├── commands/         # Custom commands
│   ├── generators/       # Code generators
│   └── validators/       # Custom validators
└── README.md             # Plugin documentation
```

---

## Plugin Manifest (package.json)

```json
{
  "name": "@myorg/proagents-plugin-example",
  "version": "1.0.0",
  "description": "Example ProAgents plugin",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",

  "proagents": {
    "name": "example-plugin",
    "version": "1.0.0",
    "type": "integration",
    "compatibility": ">=1.0.0",

    "hooks": [
      "onInit",
      "onFeatureStart",
      "onPhaseComplete"
    ],

    "commands": [
      {
        "name": "example",
        "description": "Example command"
      }
    ],

    "config": {
      "apiKey": {
        "type": "string",
        "required": true,
        "env": "EXAMPLE_API_KEY"
      },
      "enabled": {
        "type": "boolean",
        "default": true
      }
    }
  },

  "peerDependencies": {
    "@proagents/core": ">=1.0.0"
  }
}
```

---

## Plugin Entry Point

```typescript
// index.ts
import { Plugin, PluginContext, HookPayload } from '@proagents/core';

export interface ExamplePluginConfig {
  apiKey: string;
  enabled: boolean;
}

export default class ExamplePlugin implements Plugin<ExamplePluginConfig> {
  name = 'example-plugin';
  version = '1.0.0';

  private context: PluginContext;
  private config: ExamplePluginConfig;

  // ========================================================================
  // Lifecycle
  // ========================================================================

  async initialize(context: PluginContext, config: ExamplePluginConfig) {
    this.context = context;
    this.config = config;

    // Register hooks
    context.hooks.on('onFeatureStart', this.onFeatureStart.bind(this));
    context.hooks.on('onPhaseComplete', this.onPhaseComplete.bind(this));

    // Register commands
    context.commands.register({
      name: 'example',
      description: 'Example command',
      handler: this.handleExampleCommand.bind(this),
    });

    this.context.logger.info('Example plugin initialized');
  }

  async destroy() {
    // Cleanup resources
    this.context.logger.info('Example plugin destroyed');
  }

  // ========================================================================
  // Hooks
  // ========================================================================

  async onFeatureStart(payload: HookPayload<'onFeatureStart'>) {
    const { feature, context } = payload;

    this.context.logger.info(`Feature started: ${feature.name}`);

    // Example: Create external ticket
    if (this.config.enabled) {
      await this.createExternalTicket(feature);
    }
  }

  async onPhaseComplete(payload: HookPayload<'onPhaseComplete'>) {
    const { phase, feature, result } = payload;

    this.context.logger.info(`Phase ${phase} completed for ${feature.name}`);

    // Example: Update external ticket
    if (this.config.enabled) {
      await this.updateExternalTicket(feature, phase, result);
    }
  }

  // ========================================================================
  // Commands
  // ========================================================================

  async handleExampleCommand(args: string[], options: Record<string, unknown>) {
    this.context.logger.info('Example command executed', { args, options });

    return {
      success: true,
      message: 'Example command completed',
    };
  }

  // ========================================================================
  // Private Methods
  // ========================================================================

  private async createExternalTicket(feature: Feature) {
    // Implementation
  }

  private async updateExternalTicket(
    feature: Feature,
    phase: string,
    result: PhaseResult
  ) {
    // Implementation
  }
}
```

---

## Plugin Context API

```typescript
interface PluginContext {
  // Logging
  logger: Logger;

  // Configuration
  config: ConfigManager;

  // Project information
  project: ProjectInfo;

  // Hook registration
  hooks: HookManager;

  // Command registration
  commands: CommandManager;

  // File system access
  fs: FileSystemAccess;

  // HTTP client
  http: HttpClient;

  // Cache
  cache: CacheManager;

  // Events
  events: EventEmitter;

  // UI (for CLI interactions)
  ui: UIManager;
}
```

---

## Available Hooks

### Workflow Hooks

| Hook | Payload | Description |
|------|---------|-------------|
| `onInit` | `{ project }` | Plugin initialized |
| `onFeatureStart` | `{ feature, context }` | Feature started |
| `onFeatureComplete` | `{ feature, result }` | Feature completed |
| `onPhaseStart` | `{ phase, feature }` | Phase started |
| `onPhaseComplete` | `{ phase, feature, result }` | Phase completed |
| `onError` | `{ error, context }` | Error occurred |

### Git Hooks

| Hook | Payload | Description |
|------|---------|-------------|
| `onBranchCreate` | `{ branch, feature }` | Branch created |
| `onCommit` | `{ commit, files }` | Commit made |
| `onPush` | `{ branch, commits }` | Push completed |
| `onPRCreate` | `{ pr, feature }` | PR created |

### Code Hooks

| Hook | Payload | Description |
|------|---------|-------------|
| `onFileCreate` | `{ file, content }` | File created |
| `onFileModify` | `{ file, changes }` | File modified |
| `onTestRun` | `{ tests, results }` | Tests executed |
| `onBuild` | `{ result }` | Build completed |

---

## Hook Registration

```typescript
// Register single hook
context.hooks.on('onFeatureStart', async (payload) => {
  // Handle event
});

// Register multiple hooks
context.hooks.register({
  onFeatureStart: async (payload) => { /* ... */ },
  onPhaseComplete: async (payload) => { /* ... */ },
});

// Hook with priority
context.hooks.on('onFeatureStart', handler, { priority: 10 });

// One-time hook
context.hooks.once('onInit', handler);

// Remove hook
const unsubscribe = context.hooks.on('onFeatureStart', handler);
unsubscribe(); // Remove the hook
```

---

## Command Registration

```typescript
// Simple command
context.commands.register({
  name: 'my-command',
  description: 'My custom command',
  handler: async (args, options) => {
    return { success: true };
  },
});

// Command with options
context.commands.register({
  name: 'my-command',
  description: 'My custom command',
  options: [
    {
      name: 'verbose',
      alias: 'v',
      type: 'boolean',
      description: 'Enable verbose output',
    },
    {
      name: 'output',
      alias: 'o',
      type: 'string',
      description: 'Output file path',
    },
  ],
  handler: async (args, options) => {
    if (options.verbose) {
      // Verbose output
    }
    return { success: true };
  },
});

// Command
context.commands.registerSlash({
  name: '/my-command',
  description: 'My command',
  handler: async (input) => {
    return { response: 'Command executed' };
  },
});
```

---

## File System Access

```typescript
// Read file
const content = await context.fs.read('src/index.ts');

// Write file
await context.fs.write('output.json', JSON.stringify(data));

// Check existence
const exists = await context.fs.exists('package.json');

// List files
const files = await context.fs.glob('src/**/*.ts');

// Watch files
context.fs.watch('src/**/*.ts', (event, path) => {
  // Handle file change
});
```

---

## HTTP Client

```typescript
// GET request
const response = await context.http.get('https://api.example.com/data');

// POST request
const result = await context.http.post('https://api.example.com/create', {
  body: { name: 'Test' },
  headers: { 'Authorization': `Bearer ${token}` },
});

// With retry
const data = await context.http.get('https://api.example.com/data', {
  retry: 3,
  retryDelay: 1000,
});
```

---

## Cache Manager

```typescript
// Set cache
await context.cache.set('key', value, { ttl: 3600 });

// Get cache
const value = await context.cache.get('key');

// Delete cache
await context.cache.delete('key');

// Clear all
await context.cache.clear();
```

---

## UI Manager

```typescript
// Show message
context.ui.info('Processing...');
context.ui.success('Completed!');
context.ui.warn('Warning: ...');
context.ui.error('Error: ...');

// Prompt user
const answer = await context.ui.prompt('Enter value:');

// Confirm
const confirmed = await context.ui.confirm('Continue?');

// Select
const choice = await context.ui.select('Choose option:', [
  { label: 'Option 1', value: 'opt1' },
  { label: 'Option 2', value: 'opt2' },
]);

// Progress
const progress = context.ui.progress('Processing', 100);
progress.update(50);
progress.complete();
```

---

## Error Handling

```typescript
import { PluginError } from '@proagents/core';

// Throw plugin error
throw new PluginError('Something went wrong', {
  code: 'PLUGIN_ERROR',
  recoverable: true,
  details: { /* ... */ },
});

// Handle errors in hooks
context.hooks.on('onError', async ({ error, context }) => {
  if (error instanceof PluginError) {
    // Handle plugin error
  }
});
```

---

## Testing Plugins

```typescript
import { createTestContext } from '@proagents/testing';
import MyPlugin from './index';

describe('MyPlugin', () => {
  let plugin: MyPlugin;
  let context: TestContext;

  beforeEach(async () => {
    context = createTestContext();
    plugin = new MyPlugin();
    await plugin.initialize(context, { apiKey: 'test' });
  });

  it('should handle feature start', async () => {
    const payload = {
      feature: { name: 'test-feature' },
      context: {},
    };

    await context.hooks.emit('onFeatureStart', payload);

    expect(context.logger.info).toHaveBeenCalledWith(
      expect.stringContaining('Feature started')
    );
  });
});
```
