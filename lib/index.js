/**
 * ProAgents - AI-agnostic development workflow framework
 *
 * This module exports the main functionality for programmatic use.
 */

import { existsSync } from 'fs';
import { join } from 'path';

export { initCommand } from './commands/init.js';
export { featureCommand } from './commands/feature.js';
export { fixCommand } from './commands/fix.js';
export { statusCommand } from './commands/status.js';
export { helpCommand } from './commands/help.js';

/**
 * ProAgents version
 */
export const VERSION = '1.0.0';

/**
 * Check if ProAgents is initialized in a directory
 * @param {string} dir - Directory to check
 * @returns {boolean}
 */
export function isInitialized(dir = process.cwd()) {
  return existsSync(join(dir, 'proagents'));
}
