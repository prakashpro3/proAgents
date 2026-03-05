# Creating Plugins

Step-by-step guide to building ProAgents plugins.

---

## Quick Start

### 1. Create Plugin Scaffold

```bash
proagents plugin create my-plugin
cd my-plugin
```

This creates:
```
my-plugin/
├── package.json
├── tsconfig.json
├── src/
│   └── index.ts
├── tests/
│   └── index.test.ts
└── README.md
```

### 2. Implement Plugin Logic

```typescript
// src/index.ts
import { Plugin, PluginContext } from '@proagents/core';

export interface MyPluginConfig {
  setting1: string;
  setting2: boolean;
}

export default class MyPlugin implements Plugin<MyPluginConfig> {
  name = 'my-plugin';
  version = '1.0.0';

  async initialize(context: PluginContext, config: MyPluginConfig) {
    // Setup plugin
    context.logger.info('My plugin initialized!');
  }

  async destroy() {
    // Cleanup
  }
}
```

### 3. Build and Test

```bash
npm run build
npm test
```

### 4. Install Locally

```bash
proagents plugin install ./my-plugin
```

---

## Plugin Templates

### Integration Plugin

Connects ProAgents with external services.

```typescript
import { Plugin, PluginContext, HookPayload } from '@proagents/core';

interface JiraPluginConfig {
  baseUrl: string;
  apiToken: string;
  projectKey: string;
}

export default class JiraPlugin implements Plugin<JiraPluginConfig> {
  name = 'jira-plugin';
  version = '1.0.0';

  private context: PluginContext;
  private config: JiraPluginConfig;
  private client: JiraClient;

  async initialize(context: PluginContext, config: JiraPluginConfig) {
    this.context = context;
    this.config = config;

    // Initialize Jira client
    this.client = new JiraClient({
      baseUrl: config.baseUrl,
      token: config.apiToken,
    });

    // Register hooks
    context.hooks.on('onFeatureStart', this.createTicket.bind(this));
    context.hooks.on('onFeatureComplete', this.closeTicket.bind(this));

    // Register commands
    context.commands.register({
      name: 'jira-link',
      description: 'Link current feature to Jira ticket',
      handler: this.linkTicket.bind(this),
    });
  }

  async createTicket(payload: HookPayload<'onFeatureStart'>) {
    const { feature } = payload;

    try {
      const ticket = await this.client.createIssue({
        project: this.config.projectKey,
        summary: feature.name,
        description: feature.description,
        issueType: 'Story',
      });

      // Store ticket reference
      await this.context.cache.set(
        `jira:${feature.id}`,
        ticket.key
      );

      this.context.logger.info(`Created Jira ticket: ${ticket.key}`);
    } catch (error) {
      this.context.logger.error('Failed to create Jira ticket', { error });
    }
  }

  async closeTicket(payload: HookPayload<'onFeatureComplete'>) {
    const { feature, result } = payload;

    const ticketKey = await this.context.cache.get(`jira:${feature.id}`);
    if (!ticketKey) return;

    try {
      await this.client.transitionIssue(ticketKey, 'Done');
      this.context.logger.info(`Closed Jira ticket: ${ticketKey}`);
    } catch (error) {
      this.context.logger.error('Failed to close Jira ticket', { error });
    }
  }

  async linkTicket(args: string[]) {
    const [ticketKey] = args;
    // Implementation
  }

  async destroy() {
    // Cleanup
  }
}
```

---

### Generator Plugin

Adds custom code generation capabilities.

```typescript
import { Plugin, PluginContext, Generator } from '@proagents/core';

interface GeneratorPluginConfig {
  templatesDir: string;
}

export default class CustomGeneratorPlugin implements Plugin<GeneratorPluginConfig> {
  name = 'custom-generator';
  version = '1.0.0';

  async initialize(context: PluginContext, config: GeneratorPluginConfig) {
    // Register custom generator
    context.generators.register({
      name: 'my-component',
      description: 'Generate custom component',
      generator: new MyComponentGenerator(config.templatesDir),
    });

    // Register command
    context.commands.registerSlash({
      name: '/generate-component',
      description: 'Generate a custom component',
      handler: this.handleGenerate.bind(this),
    });
  }

  async handleGenerate(input: string) {
    const generator = this.context.generators.get('my-component');
    const result = await generator.generate({ name: input });

    return {
      success: true,
      files: result.files,
      message: `Generated component: ${input}`,
    };
  }

  async destroy() {}
}

class MyComponentGenerator implements Generator {
  constructor(private templatesDir: string) {}

  async generate(options: { name: string }) {
    const files = [
      {
        path: `src/components/${options.name}/${options.name}.tsx`,
        content: this.generateComponent(options.name),
      },
      {
        path: `src/components/${options.name}/${options.name}.test.tsx`,
        content: this.generateTest(options.name),
      },
      {
        path: `src/components/${options.name}/index.ts`,
        content: `export * from './${options.name}';`,
      },
    ];

    return { files };
  }

  private generateComponent(name: string): string {
    return `
import React from 'react';

export interface ${name}Props {
  // Props
}

export function ${name}({}: ${name}Props) {
  return <div data-testid="${name.toLowerCase()}">${name}</div>;
}
    `.trim();
  }

  private generateTest(name: string): string {
    return `
import { render, screen } from '@testing-library/react';
import { ${name} } from './${name}';

describe('${name}', () => {
  it('should render', () => {
    render(<${name} />);
    expect(screen.getByTestId('${name.toLowerCase()}')).toBeInTheDocument();
  });
});
    `.trim();
  }
}
```

---

### Validator Plugin

Adds custom validation rules.

```typescript
import { Plugin, PluginContext, Validator, ValidationResult } from '@proagents/core';

interface ValidatorPluginConfig {
  rules: string[];
  severity: 'error' | 'warning';
}

export default class CustomValidatorPlugin implements Plugin<ValidatorPluginConfig> {
  name = 'custom-validator';
  version = '1.0.0';

  async initialize(context: PluginContext, config: ValidatorPluginConfig) {
    // Register validators
    context.validators.register({
      name: 'no-console-log',
      description: 'Disallow console.log statements',
      validator: new NoConsoleLogValidator(config.severity),
    });

    context.validators.register({
      name: 'require-jsdoc',
      description: 'Require JSDoc for public functions',
      validator: new RequireJSDocValidator(config.severity),
    });

    // Hook into code review phase
    context.hooks.on('onPhaseStart', async ({ phase }) => {
      if (phase === 'review') {
        const results = await context.validators.runAll();
        this.reportResults(context, results);
      }
    });
  }

  private reportResults(context: PluginContext, results: ValidationResult[]) {
    for (const result of results) {
      if (result.severity === 'error') {
        context.ui.error(`${result.file}:${result.line} - ${result.message}`);
      } else {
        context.ui.warn(`${result.file}:${result.line} - ${result.message}`);
      }
    }
  }

  async destroy() {}
}

class NoConsoleLogValidator implements Validator {
  constructor(private severity: 'error' | 'warning') {}

  async validate(files: string[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    for (const file of files) {
      const content = await fs.readFile(file, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        if (line.includes('console.log')) {
          results.push({
            file,
            line: index + 1,
            message: 'Unexpected console.log statement',
            severity: this.severity,
            rule: 'no-console-log',
          });
        }
      });
    }

    return results;
  }
}
```

---

## Configuration Schema

Define your plugin's configuration schema:

```typescript
// src/config.ts
import { z } from 'zod';

export const configSchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
  baseUrl: z.string().url('Must be a valid URL'),
  timeout: z.number().positive().default(30000),
  retries: z.number().int().min(0).max(10).default(3),
  features: z.object({
    autoSync: z.boolean().default(true),
    notifications: z.boolean().default(true),
  }).default({}),
});

export type PluginConfig = z.infer<typeof configSchema>;

// In plugin
async initialize(context: PluginContext, rawConfig: unknown) {
  const config = configSchema.parse(rawConfig);
  // Use validated config
}
```

---

## Testing

### Unit Tests

```typescript
import { createTestContext, createMockFeature } from '@proagents/testing';
import MyPlugin from '../src';

describe('MyPlugin', () => {
  let plugin: MyPlugin;
  let context: TestPluginContext;

  beforeEach(async () => {
    context = createTestContext();
    plugin = new MyPlugin();

    await plugin.initialize(context, {
      apiKey: 'test-key',
      baseUrl: 'https://api.test.com',
    });
  });

  afterEach(async () => {
    await plugin.destroy();
  });

  describe('onFeatureStart', () => {
    it('should create external ticket', async () => {
      const feature = createMockFeature({ name: 'Test Feature' });

      await context.hooks.emit('onFeatureStart', { feature });

      expect(context.http.post).toHaveBeenCalledWith(
        expect.stringContaining('/tickets'),
        expect.objectContaining({ title: 'Test Feature' })
      );
    });
  });

  describe('commands', () => {
    it('should register custom command', () => {
      expect(context.commands.has('my-command')).toBe(true);
    });

    it('should execute command', async () => {
      const result = await context.commands.execute('my-command', ['arg1']);

      expect(result.success).toBe(true);
    });
  });
});
```

### Integration Tests

```typescript
import { createIntegrationContext } from '@proagents/testing';
import MyPlugin from '../src';

describe('MyPlugin Integration', () => {
  it('should work with real API', async () => {
    const context = await createIntegrationContext({
      project: './fixtures/test-project',
    });

    const plugin = new MyPlugin();
    await plugin.initialize(context, {
      apiKey: process.env.TEST_API_KEY,
    });

    // Test real integration
  });
});
```

---

## Publishing

### 1. Prepare Package

```json
{
  "name": "@myorg/proagents-plugin-example",
  "version": "1.0.0",
  "description": "Example ProAgents plugin",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist",
    "README.md"
  ],
  "keywords": [
    "proagents",
    "proagents-plugin"
  ],
  "peerDependencies": {
    "@proagents/core": ">=1.0.0"
  }
}
```

### 2. Build

```bash
npm run build
```

### 3. Publish

```bash
npm publish --access public
```

### 4. Register (Optional)

Submit to the ProAgents plugin registry for discoverability.

---

## Best Practices

1. **Single Responsibility**: Each plugin should do one thing well
2. **Configuration Validation**: Always validate configuration
3. **Error Handling**: Handle errors gracefully, don't crash the host
4. **Logging**: Use context.logger for all output
5. **Cleanup**: Implement destroy() to clean up resources
6. **Testing**: Include comprehensive tests
7. **Documentation**: Provide clear usage documentation
8. **Versioning**: Follow semantic versioning
