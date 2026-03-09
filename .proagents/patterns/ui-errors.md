# UI Error Handling

Managing and displaying errors in frontend applications.

---

## Error Boundaries

### React Error Boundary

```tsx
// components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '../logging';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to monitoring service
    logger.error('React error boundary caught error', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    // Call custom handler
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

// Default fallback component
function DefaultErrorFallback({ error }: { error?: Error }) {
  return (
    <div className="error-fallback">
      <h2>Something went wrong</h2>
      <p>We're sorry, an unexpected error occurred.</p>
      <button onClick={() => window.location.reload()}>
        Reload Page
      </button>
      {process.env.NODE_ENV === 'development' && (
        <pre>{error?.stack}</pre>
      )}
    </div>
  );
}

// Usage
<ErrorBoundary fallback={<CustomErrorPage />}>
  <App />
</ErrorBoundary>
```

### Feature-Level Boundaries

```tsx
// components/FeatureErrorBoundary.tsx
export function FeatureErrorBoundary({
  children,
  feature,
}: {
  children: ReactNode;
  feature: string;
}) {
  return (
    <ErrorBoundary
      fallback={<FeatureErrorFallback feature={feature} />}
      onError={(error) => {
        analytics.track('feature_error', { feature, error: error.message });
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

// Usage
<FeatureErrorBoundary feature="checkout">
  <CheckoutFlow />
</FeatureErrorBoundary>
```

---

## Form Validation Errors

### Form Error State

```tsx
// hooks/useFormErrors.ts
interface FieldError {
  field: string;
  message: string;
  code?: string;
}

interface FormErrors {
  fields: Record<string, FieldError>;
  general?: string;
}

export function useFormErrors() {
  const [errors, setErrors] = useState<FormErrors>({ fields: {} });

  const setFieldError = (field: string, message: string, code?: string) => {
    setErrors(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [field]: { field, message, code },
      },
    }));
  };

  const clearFieldError = (field: string) => {
    setErrors(prev => {
      const { [field]: _, ...rest } = prev.fields;
      return { ...prev, fields: rest };
    });
  };

  const setGeneralError = (message: string) => {
    setErrors(prev => ({ ...prev, general: message }));
  };

  const clearAllErrors = () => {
    setErrors({ fields: {} });
  };

  const hasErrors = Object.keys(errors.fields).length > 0 || !!errors.general;

  return {
    errors,
    setFieldError,
    clearFieldError,
    setGeneralError,
    clearAllErrors,
    hasErrors,
  };
}
```

### Error Display Components

```tsx
// components/FormError.tsx
export function FieldError({ name, error }: { name: string; error?: FieldError }) {
  if (!error) return null;

  return (
    <div className="field-error" role="alert" aria-live="polite">
      <span className="error-icon">⚠️</span>
      <span className="error-message">{error.message}</span>
    </div>
  );
}

export function FormGeneralError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <div className="form-error" role="alert">
      <span className="error-message">{message}</span>
    </div>
  );
}

// Form usage
function LoginForm() {
  const { errors, setFieldError, setGeneralError } = useFormErrors();

  const handleSubmit = async (data: LoginData) => {
    try {
      await login(data);
    } catch (error) {
      if (error instanceof ValidationError) {
        error.details.forEach(d => setFieldError(d.field, d.message));
      } else if (error instanceof AuthenticationError) {
        setGeneralError('Invalid email or password');
      } else {
        setGeneralError('An unexpected error occurred');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormGeneralError message={errors.general} />

      <div className="field">
        <input name="email" type="email" />
        <FieldError name="email" error={errors.fields.email} />
      </div>

      <div className="field">
        <input name="password" type="password" />
        <FieldError name="password" error={errors.fields.password} />
      </div>

      <button type="submit">Login</button>
    </form>
  );
}
```

---

## API Error Handling

### API Error Hook

```tsx
// hooks/useApiError.ts
interface UseApiErrorResult<T> {
  data: T | null;
  error: APIError | null;
  isLoading: boolean;
  isError: boolean;
  retry: () => void;
}

export function useApiError<T>(
  fetcher: () => Promise<T>,
  options?: { onError?: (error: APIError) => void }
): UseApiErrorResult<T> {
  const [state, setState] = useState<{
    data: T | null;
    error: APIError | null;
    isLoading: boolean;
  }>({
    data: null,
    error: null,
    isLoading: true,
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const data = await fetcher();
      setState({ data, error: null, isLoading: false });
    } catch (error) {
      const apiError = error instanceof APIError
        ? error
        : new APIError({ error: { code: 'UNKNOWN', message: error.message } }, 500);

      setState({ data: null, error: apiError, isLoading: false });
      options?.onError?.(apiError);
    }
  }, [fetcher, options?.onError]);

  useEffect(() => {
    execute();
  }, [execute]);

  return {
    ...state,
    isError: !!state.error,
    retry: execute,
  };
}

// Usage
function UserProfile({ userId }: { userId: string }) {
  const { data: user, error, isLoading, retry } = useApiError(
    () => fetchUser(userId),
    {
      onError: (error) => {
        if (error.statusCode === 401) {
          router.push('/login');
        }
      },
    }
  );

  if (isLoading) return <Loading />;
  if (error) return <ErrorDisplay error={error} onRetry={retry} />;

  return <Profile user={user} />;
}
```

### Error Display Component

```tsx
// components/ErrorDisplay.tsx
interface ErrorDisplayProps {
  error: APIError;
  onRetry?: () => void;
  compact?: boolean;
}

export function ErrorDisplay({ error, onRetry, compact }: ErrorDisplayProps) {
  const message = getErrorMessage(error);
  const canRetry = isRetryableError(error);

  if (compact) {
    return (
      <div className="error-inline">
        <span>{message}</span>
        {canRetry && onRetry && (
          <button onClick={onRetry}>Retry</button>
        )}
      </div>
    );
  }

  return (
    <div className="error-display">
      <div className="error-icon">
        {getErrorIcon(error)}
      </div>
      <h3>{getErrorTitle(error)}</h3>
      <p>{message}</p>
      {canRetry && onRetry && (
        <button onClick={onRetry}>Try Again</button>
      )}
      {error.code === 'NETWORK_ERROR' && (
        <p className="error-hint">Check your internet connection</p>
      )}
    </div>
  );
}

function getErrorMessage(error: APIError): string {
  switch (error.code) {
    case 'NETWORK_ERROR':
      return 'Unable to connect. Please check your internet connection.';
    case 'TIMEOUT':
      return 'The request took too long. Please try again.';
    case 'NOT_FOUND':
      return 'The requested resource was not found.';
    default:
      return error.message || 'An unexpected error occurred.';
  }
}
```

---

## Toast Notifications

### Toast Error System

```tsx
// contexts/ToastContext.tsx
interface Toast {
  id: string;
  type: 'error' | 'warning' | 'success' | 'info';
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const ToastContext = createContext<{
  showToast: (toast: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
} | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36);
    setToasts(prev => [...prev, { ...toast, id }]);

    if (toast.duration !== 0) {
      setTimeout(() => dismissToast(id), toast.duration || 5000);
    }
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

// Hook for showing error toasts
export function useErrorToast() {
  const { showToast } = useContext(ToastContext)!;

  return (error: Error | APIError, options?: { action?: Toast['action'] }) => {
    showToast({
      type: 'error',
      message: getErrorMessage(error),
      action: options?.action,
    });
  };
}

// Usage
function SaveButton() {
  const showError = useErrorToast();

  const handleSave = async () => {
    try {
      await saveData();
    } catch (error) {
      showError(error, {
        action: {
          label: 'Retry',
          onClick: handleSave,
        },
      });
    }
  };

  return <button onClick={handleSave}>Save</button>;
}
```

---

## Global Error Handler

### Configuration

```yaml
# proagents.config.yaml
patterns:
  ui_errors:
    global_handler:
      enabled: true

      # Catch unhandled errors
      catch_unhandled: true
      catch_rejections: true

      # Reporting
      reporting:
        enabled: true
        service: "sentry"
        sample_rate: 1.0

      # User notification
      notify_user:
        enabled: true
        threshold: "error"  # Only show errors, not warnings
```

### Implementation

```typescript
// errorHandler/global.ts
export function setupGlobalErrorHandler() {
  // Catch unhandled errors
  window.onerror = (message, source, lineno, colno, error) => {
    handleGlobalError(error || new Error(String(message)), {
      source,
      lineno,
      colno,
    });
    return false; // Let default handler run too
  };

  // Catch unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    handleGlobalError(event.reason, { type: 'unhandledRejection' });
  });
}

function handleGlobalError(error: Error, context?: Record<string, unknown>) {
  // Log to monitoring
  logger.error('Unhandled error', { error, context });

  // Report to Sentry/similar
  errorReporting.captureException(error, { extra: context });

  // Show user notification (if appropriate)
  if (shouldNotifyUser(error)) {
    showErrorNotification(error);
  }
}

function shouldNotifyUser(error: Error): boolean {
  // Don't show for cancelled requests, etc.
  if (error.name === 'AbortError') return false;
  if (error.message.includes('chunk load')) return false;

  return true;
}
```

---

## Accessibility

### Error Announcements

```tsx
// components/AccessibleError.tsx
export function AccessibleError({
  error,
  id,
}: {
  error: string;
  id: string;
}) {
  return (
    <div
      id={id}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className="error-message"
    >
      <span className="sr-only">Error: </span>
      {error}
    </div>
  );
}

// Form field with accessible error
export function FormField({
  name,
  label,
  error,
  ...props
}: FormFieldProps) {
  const errorId = `${name}-error`;

  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && <AccessibleError error={error} id={errorId} />}
    </div>
  );
}
```

---

## Commands

```bash
# Generate error components
proagents ui generate error-boundary

# Test error handling
proagents ui test --errors

# View error analytics
proagents ui errors --last 7d
```

---

## Best Practices

1. **Error Boundaries**: Wrap features in error boundaries
2. **User-Friendly Messages**: Don't show technical errors to users
3. **Retry Options**: Offer retry for transient errors
4. **Accessibility**: Use proper ARIA attributes for errors
5. **Log Everything**: Report all errors to monitoring
6. **Graceful Degradation**: Show partial content when possible
7. **Offline Support**: Handle network errors gracefully
