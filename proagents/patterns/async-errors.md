# Async Error Handling

Managing errors in asynchronous operations, background jobs, and event-driven systems.

---

## Promise Error Handling

### Basic Patterns

```typescript
// Pattern 1: try-catch with async/await
async function processOrder(orderId: string) {
  try {
    const order = await getOrder(orderId);
    await validateOrder(order);
    await processPayment(order);
    await fulfillOrder(order);
  } catch (error) {
    if (error instanceof ValidationError) {
      // Handle validation errors
      logger.warn('Order validation failed', { orderId, error });
      throw error;
    }
    if (error instanceof PaymentError) {
      // Handle payment errors
      await handlePaymentFailure(orderId, error);
      throw error;
    }
    // Unexpected error
    logger.error('Order processing failed', { orderId, error });
    throw new ProcessingError('Order processing failed', { cause: error });
  }
}

// Pattern 2: Promise chain with .catch()
fetchData()
  .then(processData)
  .then(saveData)
  .catch(handleError);

// Pattern 3: Promise.allSettled for parallel operations
const results = await Promise.allSettled([
  fetchUser(userId),
  fetchOrders(userId),
  fetchPreferences(userId),
]);

const errors = results.filter(r => r.status === 'rejected');
if (errors.length > 0) {
  logger.warn('Some operations failed', { errors });
}
```

### Error Aggregation

```typescript
// errors/async.ts
export class AggregateAsyncError extends BaseError {
  readonly code = 'AGGREGATE_ERROR';
  readonly statusCode = 500;
  readonly isOperational = true;

  readonly errors: Error[];
  readonly successCount: number;
  readonly failureCount: number;

  constructor(errors: Error[], successCount: number) {
    super(`${errors.length} operations failed`);
    this.errors = errors;
    this.successCount = successCount;
    this.failureCount = errors.length;
  }
}

// Usage
async function batchProcess(items: Item[]) {
  const results = await Promise.allSettled(
    items.map(item => processItem(item))
  );

  const failures = results
    .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
    .map(r => r.reason);

  const successes = results.filter(r => r.status === 'fulfilled');

  if (failures.length > 0) {
    throw new AggregateAsyncError(failures, successes.length);
  }

  return successes.map(s => s.value);
}
```

---

## Background Job Errors

### Job Error Configuration

```yaml
# proagents.config.yaml
patterns:
  async_errors:
    jobs:
      # Retry configuration
      retry:
        enabled: true
        max_attempts: 3
        backoff:
          type: "exponential"
          initial_delay: "1s"
          max_delay: "5m"
          multiplier: 2

      # Dead letter queue
      dlq:
        enabled: true
        queue_name: "failed-jobs"
        retention: "7d"

      # Error handling
      on_error:
        log: true
        notify:
          after_attempts: 3
          channels: ["slack"]
```

### Job Error Handler

```typescript
// jobs/errorHandler.ts
import { Job } from 'bull';
import { BaseError } from '../errors';

interface JobErrorContext {
  jobId: string;
  jobName: string;
  attempt: number;
  data: unknown;
}

export async function handleJobError(
  error: Error,
  job: Job,
  done: (err?: Error) => void
) {
  const context: JobErrorContext = {
    jobId: job.id,
    jobName: job.name,
    attempt: job.attemptsMade,
    data: job.data,
  };

  // Log the error
  logger.error('Job failed', { error, ...context });

  // Determine if retryable
  const isRetryable = isRetryableError(error);
  const maxAttempts = job.opts.attempts || 3;

  if (isRetryable && job.attemptsMade < maxAttempts) {
    // Let it retry
    logger.info('Job will retry', {
      ...context,
      remainingAttempts: maxAttempts - job.attemptsMade,
    });
    done(error);
  } else {
    // Move to dead letter queue
    await moveToDeadLetterQueue(job, error);
    logger.error('Job moved to DLQ', context);

    // Notify if max attempts reached
    if (job.attemptsMade >= maxAttempts) {
      await notifyJobFailure(job, error);
    }

    done(); // Mark as processed (to DLQ)
  }
}

function isRetryableError(error: Error): boolean {
  // Network errors, timeouts are retryable
  if (error instanceof NetworkError) return true;
  if (error instanceof TimeoutError) return true;

  // Validation errors are not retryable
  if (error instanceof ValidationError) return false;
  if (error instanceof BusinessLogicError) return false;

  // Default: retry unknown errors
  return true;
}
```

### Bull Queue Error Handling

```typescript
// jobs/queue.ts
import Queue from 'bull';

const orderQueue = new Queue('orders', {
  redis: process.env.REDIS_URL,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: 100,
    removeOnFail: false, // Keep for debugging
  },
});

// Global error handler
orderQueue.on('failed', async (job, error) => {
  logger.error('Job failed', {
    jobId: job.id,
    attempts: job.attemptsMade,
    error: error.message,
  });

  // Check if final failure
  if (job.attemptsMade >= job.opts.attempts) {
    await handleFinalFailure(job, error);
  }
});

orderQueue.on('error', (error) => {
  logger.error('Queue error', { error });
});

// Stalled job handler
orderQueue.on('stalled', (job) => {
  logger.warn('Job stalled', { jobId: job.id });
});
```

---

## Event-Driven Error Handling

### Event Emitter Errors

```typescript
// events/errorHandler.ts
import { EventEmitter } from 'events';

class SafeEventEmitter extends EventEmitter {
  emit(event: string, ...args: unknown[]): boolean {
    try {
      return super.emit(event, ...args);
    } catch (error) {
      this.handleEmitError(event, error, args);
      return false;
    }
  }

  private handleEmitError(event: string, error: Error, args: unknown[]) {
    logger.error('Event handler error', {
      event,
      error: error.message,
      args,
    });

    // Emit to error handlers
    if (event !== 'error') {
      this.emit('error', error, { event, args });
    }
  }
}

// Usage
const events = new SafeEventEmitter();

events.on('error', (error, context) => {
  logger.error('Unhandled event error', { error, context });
  // Optionally notify monitoring
});

events.on('order.created', async (order) => {
  await processOrder(order); // If this throws, it's caught
});
```

### Message Queue Errors

```typescript
// messaging/consumer.ts
import { Message, Consumer } from 'kafka-js';

async function processMessage(message: Message): Promise<void> {
  const context = {
    topic: message.topic,
    partition: message.partition,
    offset: message.offset,
  };

  try {
    const payload = JSON.parse(message.value.toString());
    await handlePayload(payload);

  } catch (error) {
    if (isParseError(error)) {
      // Invalid message format - send to DLQ
      await sendToDeadLetterQueue(message, error);
      logger.error('Invalid message format', { ...context, error });
      return; // Don't retry
    }

    if (isRetryableError(error)) {
      // Throw to trigger retry
      logger.warn('Message processing failed, will retry', { ...context, error });
      throw error;
    }

    // Non-retryable error
    await sendToDeadLetterQueue(message, error);
    logger.error('Message processing failed permanently', { ...context, error });
  }
}

// Consumer configuration
const consumer: Consumer = kafka.consumer({
  retry: {
    initialRetryTime: 100,
    retries: 5,
    maxRetryTime: 30000,
    factor: 2,
  },
});
```

---

## Circuit Breaker Pattern

### Configuration

```yaml
patterns:
  async_errors:
    circuit_breaker:
      enabled: true

      # Thresholds
      failure_threshold: 5
      success_threshold: 3
      timeout: "30s"

      # States
      states:
        closed: "Normal operation"
        open: "Failing fast"
        half_open: "Testing recovery"

      # Monitoring
      metrics:
        enabled: true
        export: "prometheus"
```

### Implementation

```typescript
// patterns/circuitBreaker.ts
enum CircuitState {
  CLOSED = 'closed',
  OPEN = 'open',
  HALF_OPEN = 'half_open',
}

class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failures = 0;
  private successes = 0;
  private lastFailureTime?: Date;

  constructor(
    private readonly failureThreshold: number,
    private readonly successThreshold: number,
    private readonly timeout: number
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (this.shouldAttemptReset()) {
        this.state = CircuitState.HALF_OPEN;
      } else {
        throw new CircuitOpenError('Circuit is open');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    if (this.state === CircuitState.HALF_OPEN) {
      this.successes++;
      if (this.successes >= this.successThreshold) {
        this.state = CircuitState.CLOSED;
        this.successes = 0;
      }
    }
  }

  private onFailure() {
    this.failures++;
    this.lastFailureTime = new Date();
    if (this.failures >= this.failureThreshold) {
      this.state = CircuitState.OPEN;
    }
  }

  private shouldAttemptReset(): boolean {
    if (!this.lastFailureTime) return true;
    const elapsed = Date.now() - this.lastFailureTime.getTime();
    return elapsed >= this.timeout;
  }
}

// Usage
const paymentCircuit = new CircuitBreaker(5, 3, 30000);

async function processPayment(payment: Payment) {
  return paymentCircuit.execute(() => paymentGateway.charge(payment));
}
```

---

## Timeout Handling

### Timeout Wrapper

```typescript
// utils/timeout.ts
export class TimeoutError extends BaseError {
  readonly code = 'TIMEOUT_ERROR';
  readonly statusCode = 504;
  readonly isOperational = true;

  constructor(operation: string, timeout: number) {
    super(`Operation "${operation}" timed out after ${timeout}ms`);
  }
}

export async function withTimeout<T>(
  promise: Promise<T>,
  timeout: number,
  operation: string
): Promise<T> {
  let timeoutId: NodeJS.Timeout;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new TimeoutError(operation, timeout));
    }, timeout);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId!);
    return result;
  } catch (error) {
    clearTimeout(timeoutId!);
    throw error;
  }
}

// Usage
const user = await withTimeout(
  fetchUser(userId),
  5000,
  'fetchUser'
);
```

---

## Commands

```bash
# View failed jobs
proagents jobs failed --queue orders

# Retry failed job
proagents jobs retry --id job-123

# View dead letter queue
proagents jobs dlq --queue orders

# Process DLQ
proagents jobs process-dlq --queue orders --limit 10

# Circuit breaker status
proagents circuit-breaker status
```

---

## Best Practices

1. **Always Handle Rejections**: Never leave promises unhandled
2. **Use Circuit Breakers**: Prevent cascade failures
3. **Implement Retries**: With exponential backoff
4. **Dead Letter Queues**: Capture permanently failed messages
5. **Timeout Everything**: Don't wait forever
6. **Log Context**: Include job/message IDs for debugging
7. **Monitor Failures**: Track failure rates and patterns
