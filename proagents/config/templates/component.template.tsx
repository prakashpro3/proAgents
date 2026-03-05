/**
 * {{ComponentName}} Component Template
 *
 * Copy this file and customize for your project.
 * Variables available:
 * - {{ComponentName}} - PascalCase name
 * - {{componentName}} - camelCase name
 * - {{description}} - Component description
 */

import React from 'react';
import type { FC } from 'react';

// {{#if hasStyles}}
import styles from './{{ComponentName}}.module.css';
// {{/if}}

/**
 * Props for {{ComponentName}}
 */
interface {{ComponentName}}Props {
  /** Add your props here */
  children?: React.ReactNode;
  className?: string;
}

/**
 * {{ComponentName}} - {{description}}
 *
 * @example
 * ```tsx
 * <{{ComponentName}}>
 *   Content here
 * </{{ComponentName}}>
 * ```
 */
export const {{ComponentName}}: FC<{{ComponentName}}Props> = ({
  children,
  className,
}) => {
  return (
    <div
      className={className}
      data-testid="{{component-name}}"
    >
      {children}
    </div>
  );
};

// Optional: Add displayName for debugging
{{ComponentName}}.displayName = '{{ComponentName}}';

// Optional: Default export if your project uses it
// export default {{ComponentName}};
