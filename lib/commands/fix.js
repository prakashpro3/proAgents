import { existsSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';

/**
 * Quick bug fix command
 */
export async function fixCommand(description, options = {}) {
  const targetDir = process.cwd();
  const proagentsDir = join(targetDir, 'proagents');

  // Check if initialized
  if (!existsSync(proagentsDir)) {
    console.log(chalk.red('\n✗ ProAgents is not initialized in this project.'));
    console.log(chalk.gray('  Run: proagents init\n'));
    return;
  }

  console.log('\n' + chalk.bold.blue('Bug Fix Mode'));
  console.log(chalk.blue('─'.repeat(40)) + '\n');

  if (options.upgrade) {
    console.log(chalk.yellow('Upgrading to full workflow mode...\n'));
    console.log(chalk.white('Use this prompt with your AI:'));
    console.log(chalk.cyan('─'.repeat(50)));
    console.log(chalk.white(`
pa:feature "Fix: ${description}"

This bug fix has been upgraded to full workflow mode.
Please follow all phases in ./proagents/WORKFLOW.md
`));
    console.log(chalk.cyan('─'.repeat(50)) + '\n');
    return;
  }

  console.log(chalk.green('✓ Bug fix mode activated'));
  console.log(chalk.gray(`  Issue: ${description}\n`));

  console.log(chalk.bold('Use this prompt with your AI assistant:'));
  console.log(chalk.cyan('─'.repeat(50)));
  console.log(chalk.white(`
pa:fix "${description}"

Or paste this to your AI:

I need to fix a bug: "${description}"

Please follow the Bug Fix Fast Track in ./proagents/workflow-modes/entry-modes.md:
1. Context Scan - Identify affected files
2. Root Cause Analysis - Find the bug source
3. Fix Implementation - Apply minimal fix
4. Verification - Test the fix
5. Commit & Document - Commit with description

Keep the fix focused and minimal. Don't scope creep.
`));
  console.log(chalk.cyan('─'.repeat(50)) + '\n');

  console.log(chalk.gray('Tip: Use --upgrade flag to switch to full workflow if the fix is complex.\n'));
}
