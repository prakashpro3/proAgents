# Learning System Implementation Guide

Technical guide for implementing and customizing the ProAgents learning system.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Learning System Architecture                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│  │   Events    │───▶│  Collector  │───▶│   Storage   │        │
│  └─────────────┘    └─────────────┘    └─────────────┘        │
│        │                                      │                 │
│        │                                      │                 │
│        ▼                                      ▼                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│  │  Analysis   │◀───│   Adapter   │◀───│   Loader    │        │
│  └─────────────┘    └─────────────┘    └─────────────┘        │
│        │                                                        │
│        │                                                        │
│        ▼                                                        │
│  ┌─────────────────────────────────────────────────────┐       │
│  │              Applied to AI Interactions              │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. Event Collector

Captures learning events from user interactions.

```typescript
// learning/collector.ts

interface LearningEvent {
  type: EventType;
  timestamp: string;
  sessionId: string;
  data: Record<string, unknown>;
}

type EventType =
  | 'checkpoint_skipped'
  | 'checkpoint_reviewed'
  | 'output_modified'
  | 'correction_made'
  | 'feature_completed'
  | 'phase_duration'
  | 'explicit_feedback';

class LearningCollector {
  private events: LearningEvent[] = [];
  private sessionId: string;
  private flushInterval: NodeJS.Timer;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
    // Flush events every 30 seconds
    this.flushInterval = setInterval(() => this.flush(), 30000);
  }

  track(type: EventType, data: Record<string, unknown>): void {
    this.events.push({
      type,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      data,
    });

    // Flush if buffer is large
    if (this.events.length >= 50) {
      this.flush();
    }
  }

  async flush(): Promise<void> {
    if (this.events.length === 0) return;

    const eventsToFlush = [...this.events];
    this.events = [];

    await learningStorage.appendEvents(eventsToFlush);
  }

  destroy(): void {
    clearInterval(this.flushInterval);
    this.flush();
  }
}

// Singleton instance
export const collector = new LearningCollector(generateSessionId());
```

### 2. Learning Storage

Persists learned data to the file system.

```typescript
// learning/storage.ts

import * as fs from 'fs/promises';
import * as path from 'path';

interface StorageConfig {
  basePath: string;
  projectHash: string;
}

class LearningStorage {
  private basePath: string;
  private projectHash: string;

  constructor(config: StorageConfig) {
    this.basePath = config.basePath;
    this.projectHash = config.projectHash;
  }

  private get globalPath(): string {
    return path.join(this.basePath, '.learning', 'global');
  }

  private get projectPath(): string {
    return path.join(
      this.basePath,
      '.learning',
      'projects',
      this.projectHash
    );
  }

  async initialize(): Promise<void> {
    await fs.mkdir(this.globalPath, { recursive: true });
    await fs.mkdir(this.projectPath, { recursive: true });
  }

  // Preferences (global)
  async loadPreferences(): Promise<UserPreferences> {
    const filePath = path.join(this.globalPath, 'preferences.json');
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return getDefaultPreferences();
    }
  }

  async savePreferences(prefs: UserPreferences): Promise<void> {
    const filePath = path.join(this.globalPath, 'preferences.json');
    await fs.writeFile(filePath, JSON.stringify(prefs, null, 2));
  }

  // Patterns (project-specific)
  async loadPatterns(): Promise<ProjectPatterns> {
    const filePath = path.join(this.projectPath, 'patterns.json');
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return getDefaultPatterns();
    }
  }

  async savePatterns(patterns: ProjectPatterns): Promise<void> {
    const filePath = path.join(this.projectPath, 'patterns.json');
    await fs.writeFile(filePath, JSON.stringify(patterns, null, 2));
  }

  // Corrections (project-specific)
  async loadCorrections(): Promise<Correction[]> {
    const filePath = path.join(this.projectPath, 'corrections.json');
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return [];
    }
  }

  async appendCorrection(correction: Correction): Promise<void> {
    const corrections = await this.loadCorrections();
    corrections.push(correction);
    const filePath = path.join(this.projectPath, 'corrections.json');
    await fs.writeFile(filePath, JSON.stringify(corrections, null, 2));
  }

  // Events (raw data for analysis)
  async appendEvents(events: LearningEvent[]): Promise<void> {
    const filePath = path.join(this.projectPath, 'events.jsonl');
    const lines = events.map((e) => JSON.stringify(e)).join('\n') + '\n';
    await fs.appendFile(filePath, lines);
  }
}

export const learningStorage = new LearningStorage({
  basePath: process.env.PROAGENTS_PATH || process.cwd(),
  projectHash: getProjectHash(),
});
```

### 3. Pattern Analyzer

Extracts patterns from collected events.

```typescript
// learning/analyzer.ts

interface PatternAnalysis {
  codePatterns: CodePattern[];
  checkpointPreferences: CheckpointPreference[];
  corrections: CorrectionPattern[];
  metrics: PhaseMetrics;
}

class PatternAnalyzer {
  async analyze(events: LearningEvent[]): Promise<PatternAnalysis> {
    return {
      codePatterns: this.extractCodePatterns(events),
      checkpointPreferences: this.extractCheckpointPreferences(events),
      corrections: this.extractCorrectionPatterns(events),
      metrics: this.calculateMetrics(events),
    };
  }

  private extractCodePatterns(events: LearningEvent[]): CodePattern[] {
    const patterns: CodePattern[] = [];

    // Group modifications by category
    const modifications = events
      .filter((e) => e.type === 'output_modified')
      .map((e) => e.data as OutputModification);

    // Naming convention patterns
    const namingChanges = modifications.filter((m) =>
      m.category === 'naming'
    );
    if (namingChanges.length >= 3) {
      const commonPattern = findCommonPattern(namingChanges);
      if (commonPattern) {
        patterns.push({
          type: 'naming',
          pattern: commonPattern,
          confidence: namingChanges.length / modifications.length,
          examples: namingChanges.slice(0, 3),
        });
      }
    }

    // Import ordering patterns
    const importChanges = modifications.filter((m) =>
      m.category === 'imports'
    );
    if (importChanges.length >= 3) {
      patterns.push({
        type: 'imports',
        pattern: extractImportOrder(importChanges),
        confidence: 0.8,
        examples: importChanges.slice(0, 3),
      });
    }

    return patterns;
  }

  private extractCheckpointPreferences(
    events: LearningEvent[]
  ): CheckpointPreference[] {
    const preferences: CheckpointPreference[] = [];

    const checkpointEvents = events.filter(
      (e) =>
        e.type === 'checkpoint_skipped' ||
        e.type === 'checkpoint_reviewed'
    );

    // Group by checkpoint name
    const grouped = groupBy(checkpointEvents, (e) =>
      e.data.checkpoint as string
    );

    for (const [checkpoint, events] of Object.entries(grouped)) {
      const skipped = events.filter(
        (e) => e.type === 'checkpoint_skipped'
      ).length;
      const reviewed = events.filter(
        (e) => e.type === 'checkpoint_reviewed'
      ).length;
      const total = skipped + reviewed;

      if (total >= 3) {
        preferences.push({
          checkpoint,
          skipRate: skipped / total,
          sampleSize: total,
          recommendation:
            skipped / total > 0.8
              ? 'auto_skip'
              : skipped / total < 0.2
              ? 'always_review'
              : 'ask',
        });
      }
    }

    return preferences;
  }

  private extractCorrectionPatterns(
    events: LearningEvent[]
  ): CorrectionPattern[] {
    const corrections = events
      .filter((e) => e.type === 'correction_made')
      .map((e) => e.data as Correction);

    // Group similar corrections
    const grouped = groupSimilarCorrections(corrections);

    return grouped
      .filter((g) => g.count >= 3) // Only patterns seen 3+ times
      .map((g) => ({
        originalPattern: g.pattern,
        correctedPattern: g.correction,
        count: g.count,
        autoApply: g.count >= 5, // Auto-apply after 5 occurrences
      }));
  }

  private calculateMetrics(events: LearningEvent[]): PhaseMetrics {
    const durations = events
      .filter((e) => e.type === 'phase_duration')
      .map((e) => e.data as PhaseDuration);

    const byPhase = groupBy(durations, (d) => d.phase);
    const metrics: PhaseMetrics = {};

    for (const [phase, phaseDurations] of Object.entries(byPhase)) {
      const times = phaseDurations.map((d) => d.durationMs);
      metrics[phase] = {
        average: average(times),
        median: median(times),
        min: Math.min(...times),
        max: Math.max(...times),
        sampleSize: times.length,
      };
    }

    return metrics;
  }
}

export const analyzer = new PatternAnalyzer();
```

### 4. Learning Adapter

Applies learned patterns to AI interactions.

```typescript
// learning/adapter.ts

interface AdaptedContext {
  skipCheckpoints: string[];
  autoCorrections: CorrectionPattern[];
  suggestedPatterns: CodePattern[];
  projectInsights: string[];
}

class LearningAdapter {
  private storage: LearningStorage;
  private cachedContext: AdaptedContext | null = null;

  constructor(storage: LearningStorage) {
    this.storage = storage;
  }

  async getAdaptedContext(): Promise<AdaptedContext> {
    if (this.cachedContext) {
      return this.cachedContext;
    }

    const [preferences, patterns, corrections] = await Promise.all([
      this.storage.loadPreferences(),
      this.storage.loadPatterns(),
      this.storage.loadCorrections(),
    ]);

    this.cachedContext = {
      skipCheckpoints: this.determineSkipCheckpoints(preferences),
      autoCorrections: this.getAutoCorrections(corrections),
      suggestedPatterns: this.getSuggestedPatterns(patterns),
      projectInsights: this.generateInsights(patterns),
    };

    return this.cachedContext;
  }

  private determineSkipCheckpoints(prefs: UserPreferences): string[] {
    return Object.entries(prefs.checkpoints)
      .filter(([_, pref]) => pref.skipRate > 0.8 && pref.sampleSize >= 5)
      .map(([checkpoint]) => checkpoint);
  }

  private getAutoCorrections(corrections: Correction[]): CorrectionPattern[] {
    // Group similar corrections and return those with 5+ occurrences
    const grouped = groupSimilarCorrections(corrections);
    return grouped
      .filter((g) => g.count >= 5)
      .map((g) => ({
        originalPattern: g.pattern,
        correctedPattern: g.correction,
        count: g.count,
        autoApply: true,
      }));
  }

  private getSuggestedPatterns(patterns: ProjectPatterns): CodePattern[] {
    return patterns.codePatterns.filter((p) => p.confidence >= 0.8);
  }

  private generateInsights(patterns: ProjectPatterns): string[] {
    const insights: string[] = [];

    // Naming convention insight
    const namingPattern = patterns.codePatterns.find(
      (p) => p.type === 'naming'
    );
    if (namingPattern) {
      insights.push(
        `Use ${namingPattern.pattern} for ${namingPattern.appliesTo}`
      );
    }

    // State management insight
    if (patterns.stateManagement) {
      insights.push(
        `Use ${patterns.stateManagement} for state management`
      );
    }

    // API patterns
    if (patterns.apiPatterns) {
      insights.push(`Follow ${patterns.apiPatterns} for API calls`);
    }

    return insights;
  }

  invalidateCache(): void {
    this.cachedContext = null;
  }
}

export const adapter = new LearningAdapter(learningStorage);
```

---

## Integration Points

### 1. Checkpoint System Integration

```typescript
// workflow/checkpoint.ts

import { adapter } from '../learning/adapter';

async function shouldShowCheckpoint(
  checkpointName: string
): Promise<boolean> {
  const context = await adapter.getAdaptedContext();

  // Skip if in auto-skip list
  if (context.skipCheckpoints.includes(checkpointName)) {
    console.log(`[Learning] Auto-skipping checkpoint: ${checkpointName}`);
    return false;
  }

  return true;
}

async function recordCheckpointDecision(
  checkpointName: string,
  skipped: boolean
): Promise<void> {
  collector.track(
    skipped ? 'checkpoint_skipped' : 'checkpoint_reviewed',
    { checkpoint: checkpointName }
  );
}
```

### 2. Code Generation Integration

```typescript
// workflow/codegen.ts

import { adapter } from '../learning/adapter';

async function generateCode(request: CodeRequest): Promise<string> {
  const context = await adapter.getAdaptedContext();

  // Build enhanced prompt with learned patterns
  const enhancedPrompt = buildPrompt(request, {
    patterns: context.suggestedPatterns,
    insights: context.projectInsights,
  });

  let code = await aiGenerate(enhancedPrompt);

  // Apply auto-corrections
  for (const correction of context.autoCorrections) {
    code = applyCorrection(code, correction);
  }

  return code;
}

function buildPrompt(
  request: CodeRequest,
  context: { patterns: CodePattern[]; insights: string[] }
): string {
  let prompt = request.basePrompt;

  if (context.patterns.length > 0) {
    prompt += '\n\nFollow these project patterns:\n';
    for (const pattern of context.patterns) {
      prompt += `- ${pattern.type}: ${pattern.pattern}\n`;
    }
  }

  if (context.insights.length > 0) {
    prompt += '\n\nProject conventions:\n';
    for (const insight of context.insights) {
      prompt += `- ${insight}\n`;
    }
  }

  return prompt;
}
```

### 3. Output Modification Tracking

```typescript
// workflow/review.ts

import { collector } from '../learning/collector';

function trackModification(
  original: string,
  modified: string,
  category: string
): void {
  if (original === modified) return;

  collector.track('output_modified', {
    category,
    original: original.slice(0, 200), // Truncate for privacy
    modified: modified.slice(0, 200),
    diff: generateDiff(original, modified),
  });
}

// Called when user edits AI-generated code
function onCodeEdited(
  originalCode: string,
  editedCode: string,
  filePath: string
): void {
  const changes = detectChanges(originalCode, editedCode);

  for (const change of changes) {
    if (change.type === 'naming') {
      trackModification(change.original, change.modified, 'naming');
    } else if (change.type === 'formatting') {
      trackModification(change.original, change.modified, 'formatting');
    } else if (change.type === 'structure') {
      trackModification(change.original, change.modified, 'structure');
    }
  }
}
```

---

## Data Schemas

### User Preferences Schema

```typescript
interface UserPreferences {
  version: string;
  checkpoints: Record<
    string,
    {
      skipRate: number;
      sampleSize: number;
      lastUpdated: string;
    }
  >;
  detailLevel: 'minimal' | 'moderate' | 'detailed';
  commonCorrections: Array<{
    pattern: string;
    correction: string;
    count: number;
  }>;
}
```

### Project Patterns Schema

```typescript
interface ProjectPatterns {
  version: string;
  projectHash: string;
  analyzedAt: string;

  codePatterns: CodePattern[];
  stateManagement?: string;
  apiPatterns?: string;
  testingPatterns?: string;

  conventions: {
    naming: Record<string, string>;
    imports: string[];
    formatting: Record<string, unknown>;
  };
}

interface CodePattern {
  type: 'naming' | 'imports' | 'structure' | 'style';
  pattern: string;
  appliesTo?: string;
  confidence: number;
  examples: unknown[];
  learnedFrom: number; // Number of observations
}
```

### Correction Schema

```typescript
interface Correction {
  id: string;
  timestamp: string;
  type: 'naming' | 'code' | 'structure' | 'other';
  original: string;
  corrected: string;
  context?: string;
  autoApply: boolean;
}
```

---

## CLI Commands

### Learning Management Commands

```typescript
// cli/commands/learning.ts

import { Command } from 'commander';
import { learningStorage, analyzer, adapter } from '../learning';

export const learningCommand = new Command('learning')
  .description('Manage learning system');

learningCommand
  .command('report')
  .description('Show learning report')
  .action(async () => {
    const [prefs, patterns, corrections] = await Promise.all([
      learningStorage.loadPreferences(),
      learningStorage.loadPatterns(),
      learningStorage.loadCorrections(),
    ]);

    console.log('ProAgents Learning Report');
    console.log('='.repeat(40));
    console.log(`Patterns Learned: ${patterns.codePatterns.length}`);
    console.log(`Auto-corrections: ${corrections.filter(c => c.autoApply).length}`);
    console.log(`Checkpoint preferences: ${Object.keys(prefs.checkpoints).length}`);
    console.log();

    if (patterns.codePatterns.length > 0) {
      console.log('Top Patterns:');
      for (const p of patterns.codePatterns.slice(0, 5)) {
        console.log(`  - ${p.type}: ${p.pattern}`);
      }
    }
  });

learningCommand
  .command('reset')
  .description('Reset learning data')
  .option('--preferences', 'Reset only preferences')
  .option('--patterns', 'Reset only patterns')
  .option('--all', 'Reset everything')
  .action(async (options) => {
    if (options.all) {
      await learningStorage.reset();
      console.log('All learning data reset.');
    } else if (options.preferences) {
      await learningStorage.resetPreferences();
      console.log('Preferences reset.');
    } else if (options.patterns) {
      await learningStorage.resetPatterns();
      console.log('Patterns reset.');
    }
    adapter.invalidateCache();
  });

learningCommand
  .command('export')
  .description('Export learning data')
  .argument('<path>', 'Export path')
  .action(async (exportPath) => {
    const data = await learningStorage.exportAll();
    await fs.writeFile(exportPath, JSON.stringify(data, null, 2));
    console.log(`Exported to ${exportPath}`);
  });
```

---

## Configuration Options

```yaml
# proagents.config.yaml

learning:
  # Enable/disable learning
  enabled: true

  # What to track
  tracking:
    preferences: true
    patterns: true
    corrections: true
    metrics: true

  # Auto-apply settings
  auto_apply:
    corrections: true
    corrections_threshold: 5    # Apply after this many occurrences
    checkpoint_skip: true
    checkpoint_skip_threshold: 0.8  # Skip if >80% skip rate

  # Privacy settings
  privacy:
    truncate_code_samples: true
    max_sample_length: 200
    exclude_paths:
      - "**/.env*"
      - "**/secrets/**"

  # Storage settings
  storage:
    max_events_file_size_mb: 10
    archive_after_days: 30
    retention_days: 90
```

---

## Testing the Learning System

```typescript
// learning/__tests__/analyzer.test.ts

describe('PatternAnalyzer', () => {
  it('extracts naming patterns from modifications', async () => {
    const events: LearningEvent[] = [
      { type: 'output_modified', data: { category: 'naming', original: 'getData', modified: 'fetchUserData' } },
      { type: 'output_modified', data: { category: 'naming', original: 'handleClick', modified: 'handleUserClick' } },
      { type: 'output_modified', data: { category: 'naming', original: 'process', modified: 'processUserInput' } },
    ];

    const analysis = await analyzer.analyze(events);

    expect(analysis.codePatterns).toContainEqual(
      expect.objectContaining({
        type: 'naming',
        pattern: expect.stringContaining('descriptive'),
      })
    );
  });

  it('identifies checkpoint preferences', async () => {
    const events: LearningEvent[] = [
      { type: 'checkpoint_skipped', data: { checkpoint: 'after_requirements' } },
      { type: 'checkpoint_skipped', data: { checkpoint: 'after_requirements' } },
      { type: 'checkpoint_skipped', data: { checkpoint: 'after_requirements' } },
      { type: 'checkpoint_reviewed', data: { checkpoint: 'after_design' } },
      { type: 'checkpoint_reviewed', data: { checkpoint: 'after_design' } },
      { type: 'checkpoint_reviewed', data: { checkpoint: 'after_design' } },
    ];

    const analysis = await analyzer.analyze(events);

    expect(analysis.checkpointPreferences).toContainEqual(
      expect.objectContaining({
        checkpoint: 'after_requirements',
        recommendation: 'auto_skip',
      })
    );
  });
});
```

---

## Extending the Learning System

### Adding Custom Learners

```typescript
// learning/custom/myLearner.ts

import { BaseLearner } from '../base';

export class CustomApiPatternLearner extends BaseLearner {
  name = 'api-patterns';

  async learn(events: LearningEvent[]): Promise<Pattern[]> {
    // Filter relevant events
    const apiEvents = events.filter((e) =>
      e.data.filePath?.includes('/api/') ||
      e.data.filePath?.includes('/services/')
    );

    // Extract patterns
    return this.extractPatterns(apiEvents);
  }

  async apply(code: string, patterns: Pattern[]): Promise<string> {
    // Apply learned API patterns
    return this.applyPatterns(code, patterns);
  }
}

// Register learner
learningSystem.registerLearner(new CustomApiPatternLearner());
```

---

## Best Practices

1. **Privacy First**: Never store sensitive data (credentials, personal info)
2. **Confidence Thresholds**: Only apply patterns with high confidence (>0.8)
3. **Sample Size Requirements**: Require minimum observations (3-5) before learning
4. **User Override**: Always allow users to override learned behavior
5. **Transparency**: Show users what has been learned via reports
6. **Graceful Degradation**: System works without learning data
