import { existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';

// File shortcuts mapping
const FILE_SHORTCUTS = {
  // Main config
  'config': 'proagents.config.yaml',
  'cfg': 'proagents.config.yaml',

  // Changelog files
  'changelog': '.proagents/changelog/_recent.md',
  'changes': '.proagents/changelog/_recent.md',
  'recent': '.proagents/changelog/_recent.md',

  // Activity and logs
  'activity': '.proagents/activity.log',
  'log': '.proagents/activity.log',
  'logs': '.proagents/activity.log',

  // Context and worklog
  'context': '.proagents/worklog/_context.md',
  'ctx': '.proagents/worklog/_context.md',
  'worklog': '.proagents/worklog/',

  // AI instructions
  'instructions': '.proagents/AI_INSTRUCTIONS.md',
  'ai': '.proagents/AI_INSTRUCTIONS.md',

  // Learning and feedback
  'feedback': '.proagents/feedback.md',
  'errors': '.proagents/errors.md',
  'decisions': '.proagents/decisions.md',

  // Watchlist
  'watchlist': '.proagents/watchlist.yaml',
  'watch': '.proagents/watchlist.yaml',

  // Handoff
  'handoff': '.proagents/handoff.md',

  // Features
  'features': '.proagents/active-features/',

  // Standards and rules
  'standards': '.proagents/config/standards/',
  'rules': '.proagents/config/rules/',
  'integrations': '.proagents/config/integrations/',

  // Quick reference
  'commands': '.proagents/PROAGENTS.md',
  'help': '.proagents/PROAGENTS.md',
  'workflow': '.proagents/WORKFLOW.md',
};

/**
 * Get the editor command based on environment
 */
function getEditorCommand() {
  // Check for common environment variables
  const editor = process.env.EDITOR || process.env.VISUAL;
  if (editor) return editor;

  // Platform-specific defaults
  const platform = process.platform;
  if (platform === 'darwin') {
    // macOS - try code, then open
    try {
      execSync('which code', { stdio: 'ignore' });
      return 'code';
    } catch {
      return 'open';
    }
  } else if (platform === 'win32') {
    return 'notepad';
  } else {
    // Linux - try code, vim, nano
    try {
      execSync('which code', { stdio: 'ignore' });
      return 'code';
    } catch {
      try {
        execSync('which vim', { stdio: 'ignore' });
        return 'vim';
      } catch {
        return 'nano';
      }
    }
  }
}

/**
 * Open a file or directory in the default editor
 */
function openInEditor(path) {
  const editor = getEditorCommand();

  try {
    if (editor === 'open') {
      // macOS open command
      execSync(`open "${path}"`, { stdio: 'inherit' });
    } else if (editor === 'code') {
      // VS Code
      execSync(`code "${path}"`, { stdio: 'inherit' });
    } else {
      // Other editors
      execSync(`${editor} "${path}"`, { stdio: 'inherit' });
    }
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Command: proagents open <shortcut|path>
 * Open ProAgents files quickly
 */
export function openCommand(target, options = {}) {
  const targetDir = process.cwd();

  // If no target, show available shortcuts
  if (!target) {
    console.log(chalk.bold('\nProAgents Open - Quick File Access'));
    console.log(chalk.gray('══════════════════════════════════════════════════════════\n'));

    console.log(chalk.cyan('Usage:'));
    console.log(chalk.white('  proagents open <shortcut>'));
    console.log(chalk.white('  proagents open <file-path>\n'));

    console.log(chalk.cyan('Shortcuts:'));
    console.log(chalk.gray('─────────────────────────────────────────────────'));

    const categories = {
      'Configuration': ['config', 'watchlist', 'standards', 'rules'],
      'Changelog & Logs': ['changelog', 'activity', 'context'],
      'AI & Workflow': ['instructions', 'commands', 'workflow'],
      'Learning': ['feedback', 'errors', 'decisions'],
      'Collaboration': ['handoff', 'features', 'worklog'],
    };

    for (const [category, shortcuts] of Object.entries(categories)) {
      console.log(chalk.yellow(`\n  ${category}:`));
      for (const shortcut of shortcuts) {
        const path = FILE_SHORTCUTS[shortcut];
        if (path) {
          const exists = existsSync(join(targetDir, path));
          const status = exists ? chalk.green('✓') : chalk.gray('○');
          console.log(`    ${status} ${chalk.white(shortcut.padEnd(15))} → ${chalk.gray(path)}`);
        }
      }
    }

    console.log(chalk.gray('\n─────────────────────────────────────────────────'));
    console.log(chalk.gray('Legend: ') + chalk.green('✓ exists  ') + chalk.gray('○ not created yet\n'));
    return;
  }

  // Check if target is a shortcut
  let filePath = FILE_SHORTCUTS[target.toLowerCase()];

  if (filePath) {
    filePath = join(targetDir, filePath);
  } else {
    // Treat as direct path
    filePath = target.startsWith('/') ? target : join(targetDir, target);
  }

  // Check if file/directory exists
  if (!existsSync(filePath)) {
    console.log(chalk.red(`\nFile not found: ${filePath}`));
    console.log(chalk.gray('Run "proagents open" to see available shortcuts.\n'));
    return;
  }

  // Open the file
  console.log(chalk.cyan(`\nOpening: ${filePath}`));

  const success = openInEditor(filePath);

  if (success) {
    console.log(chalk.green('✓ Opened in editor\n'));
  } else {
    console.log(chalk.yellow(`\nCould not open automatically.`));
    console.log(chalk.gray(`Path: ${filePath}\n`));
  }
}
