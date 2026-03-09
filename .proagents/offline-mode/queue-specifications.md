# Offline Queue Specifications

Technical specifications for the offline operation queue system.

---

## Overview

The offline queue stores operations that require AI services for later processing when connectivity is restored.

```
┌─────────────────────────────────────────────────────────────┐
│                    Offline Queue System                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   User      │    │   Queue     │    │   AI        │     │
│  │   Request   │───►│   Storage   │───►│  Services   │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│         │                  │                  │             │
│         │                  │                  │             │
│  [OFFLINE]           [PERSISTED]        [ONLINE]           │
│                                                             │
│  Operation Flow:                                            │
│  1. Request received while offline                         │
│  2. Added to persistent queue                              │
│  3. Acknowledgment returned to user                        │
│  4. Connectivity restored                                  │
│  5. Queue processed automatically                          │
│  6. Results delivered to user                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Queue Architecture

### Storage Structure

```
.proagents/
└── offline-queue/
    ├── queue.json              # Queue metadata
    ├── items/                  # Individual queue items
    │   ├── item-001.json
    │   ├── item-002.json
    │   └── item-003.json
    ├── processing/             # Items being processed
    ├── completed/              # Completed items (for audit)
    └── failed/                 # Failed items (for retry)
```

### Queue Item Schema

```json
{
  "id": "queue-item-uuid-v4",
  "version": "1.0",
  "created_at": "2024-01-15T10:30:00Z",
  "queued_at": "2024-01-15T10:30:05Z",
  "status": "pending",

  "operation": {
    "type": "code_generation",
    "action": "generate_component",
    "priority": "normal",
    "timeout": 300000
  },

  "context": {
    "project_path": "/path/to/project",
    "feature": "feature/user-dashboard",
    "phase": "implementation",
    "files": ["src/components/Dashboard.tsx"]
  },

  "request": {
    "prompt": "Generate a Dashboard component with...",
    "parameters": {
      "component_name": "Dashboard",
      "framework": "react",
      "styling": "tailwind"
    }
  },

  "metadata": {
    "user": "developer@company.com",
    "session_id": "session-123",
    "client_version": "1.2.0",
    "offline_duration": null
  },

  "processing": {
    "attempts": 0,
    "max_attempts": 3,
    "last_attempt": null,
    "next_retry": null
  },

  "result": null,
  "error": null
}
```

---

## Queue Operations

### 1. Adding to Queue

**When an operation is queued:**

```typescript
interface QueueOperation {
  // Validate operation can be queued
  validate(): ValidationResult;

  // Serialize operation for storage
  serialize(): QueueItem;

  // Generate acknowledgment for user
  acknowledge(): QueueAcknowledgment;
}

// Example implementation
async function queueOperation(operation: Operation): Promise<QueueAcknowledgment> {
  // 1. Validate operation
  const validation = operation.validate();
  if (!validation.valid) {
    throw new QueueValidationError(validation.errors);
  }

  // 2. Create queue item
  const item: QueueItem = {
    id: generateUUID(),
    created_at: new Date().toISOString(),
    status: 'pending',
    operation: operation.serialize(),
    // ... other fields
  };

  // 3. Persist to disk
  await persistQueueItem(item);

  // 4. Return acknowledgment
  return {
    queued: true,
    item_id: item.id,
    position: await getQueuePosition(item.id),
    estimated_processing: null // Unknown until online
  };
}
```

### 2. Queue Processing

**When connectivity is restored:**

```typescript
async function processQueue(): Promise<ProcessingResult[]> {
  const results: ProcessingResult[] = [];

  // 1. Get pending items sorted by priority
  const items = await getPendingItems({ sort: 'priority' });

  for (const item of items) {
    try {
      // 2. Move to processing
      await moveToProcessing(item.id);

      // 3. Execute operation
      const result = await executeOperation(item);

      // 4. Store result
      await storeResult(item.id, result);

      // 5. Move to completed
      await moveToCompleted(item.id);

      // 6. Notify user
      await notifyUser(item, result);

      results.push({ item_id: item.id, status: 'success', result });

    } catch (error) {
      // Handle failure
      await handleFailure(item, error);
      results.push({ item_id: item.id, status: 'failed', error });
    }
  }

  return results;
}
```

### 3. Failure Handling

```typescript
async function handleFailure(item: QueueItem, error: Error): Promise<void> {
  // 1. Increment attempt counter
  item.processing.attempts++;
  item.processing.last_attempt = new Date().toISOString();

  // 2. Check if should retry
  if (item.processing.attempts < item.processing.max_attempts) {
    // Calculate next retry time (exponential backoff)
    const delay = Math.pow(2, item.processing.attempts) * 1000; // 2s, 4s, 8s
    item.processing.next_retry = new Date(Date.now() + delay).toISOString();
    item.status = 'retry_pending';

    await updateQueueItem(item);

  } else {
    // Max retries exceeded
    item.status = 'failed';
    item.error = {
      message: error.message,
      code: error.code,
      occurred_at: new Date().toISOString()
    };

    await moveToFailed(item);
    await notifyFailure(item);
  }
}
```

---

## Queueable Operations

### Operations That Can Be Queued

| Operation | Priority | Timeout | Notes |
|-----------|----------|---------|-------|
| Code generation | Normal | 5 min | Full component/function generation |
| Refactoring suggestion | Normal | 5 min | Complex refactoring requests |
| Code review | Low | 10 min | AI-powered code review |
| Documentation generation | Low | 10 min | Auto-generate docs |
| Test generation | Normal | 5 min | Generate test cases |
| Security analysis | High | 15 min | Security vulnerability scan |
| Dependency analysis | Low | 10 min | Analyze dependencies |

### Operations That Cannot Be Queued

| Operation | Reason | Alternative |
|-----------|--------|-------------|
| Interactive code completion | Real-time required | Use cached suggestions |
| Live debugging assistance | Context changes | Log for later review |
| Real-time collaboration | Synchronous required | Queue summary for review |

---

## Priority System

### Priority Levels

```typescript
enum QueuePriority {
  CRITICAL = 1,   // Security issues, blocking bugs
  HIGH = 2,       // Important features, urgent requests
  NORMAL = 3,     // Standard operations
  LOW = 4,        // Documentation, non-urgent
  BACKGROUND = 5  // Analytics, learning updates
}
```

### Priority Rules

```yaml
# proagents.config.yaml

offline:
  queue:
    priority_rules:
      # Security-related always high priority
      - match:
          operation_type: "security_analysis"
        priority: "high"

      # User-initiated higher than system
      - match:
          source: "user_request"
        priority_boost: 1

      # Older items get priority boost
      - match:
          age_hours: ">24"
        priority_boost: 1

      # Feature branch items lower during release
      - match:
          branch_type: "feature"
          release_freeze: true
        priority: "low"
```

### Processing Order

```
Queue Processing Order:
1. CRITICAL items (sorted by age)
2. HIGH items (sorted by age)
3. NORMAL items (sorted by age)
4. LOW items (sorted by age)
5. BACKGROUND items (sorted by age)

Within same priority, FIFO (First In, First Out)
```

---

## Queue Configuration

### Full Configuration Options

```yaml
# proagents.config.yaml

offline:
  queue:
    enabled: true

    # Storage
    storage:
      path: ".proagents/offline-queue"
      max_items: 100
      max_size_mb: 50

    # Item limits
    limits:
      max_payload_size_kb: 500
      max_context_size_kb: 200

    # Processing
    processing:
      batch_size: 10
      parallel_items: 3
      timeout_default_ms: 300000

    # Retry configuration
    retry:
      max_attempts: 3
      backoff_type: "exponential"  # exponential | linear | fixed
      base_delay_ms: 2000
      max_delay_ms: 60000

    # Cleanup
    cleanup:
      completed_retention_days: 7
      failed_retention_days: 30
      auto_cleanup: true

    # Notifications
    notifications:
      on_queue: true
      on_process_start: true
      on_success: true
      on_failure: true
      channels: ["terminal", "notification_center"]

    # Priority
    priority:
      default: "normal"
      allow_user_override: true

    # Expiration
    expiration:
      enabled: true
      default_hours: 168  # 7 days
      warn_before_hours: 24
```

---

## Queue Status & Monitoring

### Status Commands

```bash
# View queue status
proagents offline queue status

# Output:
# Offline Queue Status
# ────────────────────────────────────────
# Status: Active (collecting while offline)
#
# Items:
# ├── Pending: 5
# ├── Processing: 0
# ├── Completed (today): 12
# └── Failed: 1
#
# Storage: 2.3 MB / 50 MB (4.6%)
#
# Oldest Item: 2 hours ago
# Priority Distribution:
# ├── High: 1
# ├── Normal: 3
# └── Low: 1
```

```bash
# List queue items
proagents offline queue list

# Output:
# Queue Items (5 pending)
# ────────────────────────────────────────
# ID          | Type              | Priority | Age    | Size
# ------------|-------------------|----------|--------|------
# q-abc123    | code_generation   | high     | 2h     | 12KB
# q-def456    | test_generation   | normal   | 1h     | 8KB
# q-ghi789    | documentation     | normal   | 45m    | 15KB
# q-jkl012    | code_review       | normal   | 30m    | 22KB
# q-mno345    | refactoring       | low      | 15m    | 5KB
```

```bash
# View specific item
proagents offline queue show q-abc123

# Output:
# Queue Item: q-abc123
# ────────────────────────────────────────
# Type: code_generation
# Status: pending
# Priority: high
#
# Created: 2024-01-15 08:30:00 UTC
# Age: 2 hours
#
# Operation:
# - Action: generate_component
# - Component: UserDashboard
# - Framework: react
#
# Context:
# - Project: my-app
# - Feature: feature/user-dashboard
# - Phase: implementation
#
# Attempts: 0 / 3
# Estimated Processing: ~2 minutes
```

### Monitoring Events

```typescript
// Queue events for monitoring
interface QueueEvents {
  'queue:item_added': { item: QueueItem };
  'queue:processing_started': { item_id: string };
  'queue:item_completed': { item_id: string; result: any };
  'queue:item_failed': { item_id: string; error: Error };
  'queue:retry_scheduled': { item_id: string; next_retry: Date };
  'queue:capacity_warning': { current: number; max: number };
  'queue:online_sync_started': { item_count: number };
  'queue:online_sync_completed': { success: number; failed: number };
}
```

---

## User Experience

### When Operation is Queued

```
┌─────────────────────────────────────────────────────────────┐
│ ⏳ Operation Queued                                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Your request has been queued for processing when           │
│ connectivity is restored.                                   │
│                                                             │
│ Queue ID: q-abc123                                          │
│ Operation: Generate Dashboard Component                     │
│ Priority: Normal                                            │
│ Position: #3 in queue                                       │
│                                                             │
│ You will be notified when processing completes.            │
│                                                             │
│ Continue working offline? [Y/n]                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### When Connectivity Returns

```
┌─────────────────────────────────────────────────────────────┐
│ 🔄 Processing Offline Queue                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Connectivity restored. Processing 5 queued operations...   │
│                                                             │
│ [████████████████░░░░░░░░] 3/5 completed                   │
│                                                             │
│ ✅ q-abc123: Dashboard component generated                 │
│ ✅ q-def456: Tests generated (15 test cases)               │
│ ✅ q-ghi789: Documentation updated                         │
│ ⏳ q-jkl012: Code review in progress...                    │
│ ⏸  q-mno345: Waiting...                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Result Delivery

```bash
# When results are ready
proagents offline queue results

# Output:
# Completed Queue Items
# ────────────────────────────────────────
#
# ✅ q-abc123 - Dashboard Component
#    Generated: src/components/Dashboard.tsx
#    View: proagents queue show q-abc123 --result
#
# ✅ q-def456 - Test Generation
#    Generated: 15 test cases
#    View: proagents queue show q-def456 --result
#
# ❌ q-xyz789 - Refactoring (FAILED)
#    Error: Context too large
#    Retry: proagents queue retry q-xyz789
```

---

## API Reference

### Queue Client Interface

```typescript
interface QueueClient {
  // Add operation to queue
  enqueue(operation: Operation): Promise<QueueAcknowledgment>;

  // Get queue status
  status(): Promise<QueueStatus>;

  // List items
  list(filter?: QueueFilter): Promise<QueueItem[]>;

  // Get specific item
  get(id: string): Promise<QueueItem | null>;

  // Remove item
  remove(id: string): Promise<boolean>;

  // Update priority
  updatePriority(id: string, priority: QueuePriority): Promise<void>;

  // Manual retry
  retry(id: string): Promise<void>;

  // Process queue (when online)
  process(): Promise<ProcessingResult[]>;

  // Clear queue
  clear(filter?: QueueFilter): Promise<number>;

  // Event subscription
  on<E extends keyof QueueEvents>(
    event: E,
    handler: (data: QueueEvents[E]) => void
  ): void;
}
```

### Queue Status Interface

```typescript
interface QueueStatus {
  active: boolean;
  offline: boolean;

  counts: {
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  };

  storage: {
    used_bytes: number;
    max_bytes: number;
    item_count: number;
    max_items: number;
  };

  processing: {
    in_progress: number;
    rate_per_minute: number;
    estimated_completion: Date | null;
  };

  oldest_item: Date | null;
  newest_item: Date | null;

  health: 'healthy' | 'warning' | 'critical';
  health_issues: string[];
}
```

---

## Error Handling

### Error Types

```typescript
enum QueueErrorCode {
  // Validation errors
  INVALID_OPERATION = 'QUEUE_001',
  PAYLOAD_TOO_LARGE = 'QUEUE_002',
  UNSUPPORTED_OPERATION = 'QUEUE_003',

  // Capacity errors
  QUEUE_FULL = 'QUEUE_010',
  STORAGE_LIMIT = 'QUEUE_011',

  // Processing errors
  PROCESSING_TIMEOUT = 'QUEUE_020',
  AI_SERVICE_ERROR = 'QUEUE_021',
  CONTEXT_INVALID = 'QUEUE_022',

  // System errors
  STORAGE_ERROR = 'QUEUE_030',
  CORRUPTION_DETECTED = 'QUEUE_031',
}
```

### Error Recovery

```yaml
# Error recovery configuration
offline:
  queue:
    error_recovery:
      on_corruption:
        action: "rebuild_from_items"
        notify: true

      on_storage_error:
        action: "retry_with_backoff"
        max_retries: 3

      on_capacity_exceeded:
        action: "remove_lowest_priority"
        notify: true
        require_confirmation: true
```

---

## Best Practices

1. **Keep payloads small** - Include only essential context
2. **Set appropriate priorities** - Don't mark everything as high
3. **Monitor queue regularly** - Check for stuck items
4. **Clean up completed items** - Don't let storage grow unbounded
5. **Handle failures gracefully** - Notify users of permanent failures
6. **Test offline workflows** - Ensure queue works before needed
7. **Document queueable operations** - Users should know what can be queued

---

## Next Steps

- [Caching Guide](./caching.md)
- [Offline Operations](./offline-operations.md)
- [Sync Procedures](./sync.md)
