/**
 * {{hookName}} Hook Template
 *
 * Copy this file and customize for your project.
 * Variables available:
 * - {{hookName}} - camelCase name (e.g., useUserData)
 * - {{HookName}} - PascalCase without 'use' (e.g., UserData)
 * - {{description}} - Hook description
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Return type for {{hookName}}
 */
interface {{HookName}}Result {
  /** The data returned by the hook */
  data: unknown;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Refetch function */
  refetch: () => void;
}

/**
 * Options for {{hookName}}
 */
interface {{HookName}}Options {
  /** Enable/disable the hook */
  enabled?: boolean;
  /** Callback on success */
  onSuccess?: (data: unknown) => void;
  /** Callback on error */
  onError?: (error: Error) => void;
}

/**
 * {{hookName}} - {{description}}
 *
 * @param options - Hook options
 * @returns Hook result with data, loading, and error states
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = {{hookName}}();
 *
 * if (isLoading) return <Loading />;
 * if (error) return <Error error={error} />;
 * return <Display data={data} />;
 * ```
 */
export function {{hookName}}(
  options: {{HookName}}Options = {}
): {{HookName}}Result {
  const { enabled = true, onSuccess, onError } = options;

  const [data, setData] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implement data fetching logic
      const result = await Promise.resolve(null);
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [enabled, onSuccess, onError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
}
