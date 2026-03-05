import chalk from 'chalk';

/**
 * Show detailed help with all commands
 */
export async function helpCommand() {
  console.log('\n' + chalk.bold.blue('ProAgents Commands'));
  console.log(chalk.blue('═'.repeat(50)) + '\n');

  // Initialization
  console.log(chalk.bold.white('Initialization'));
  console.log(chalk.gray('─'.repeat(40)));
  console.log(chalk.cyan('proagents init') + '              Initialize in current project');
  console.log(chalk.cyan('proagents init --force') + '      Overwrite existing installation');
  console.log('');

  // Feature Development
  console.log(chalk.bold.white('Feature Development'));
  console.log(chalk.gray('─'.repeat(40)));
  console.log(chalk.cyan('proagents feature start "name"') + '  Start a new feature');
  console.log(chalk.cyan('proagents feature status') + '        Show current feature status');
  console.log(chalk.cyan('proagents feature list') + '          List all features');
  console.log(chalk.cyan('proagents feature complete') + '      Mark feature complete');
  console.log('');

  // Bug Fixing
  console.log(chalk.bold.white('Bug Fixing'));
  console.log(chalk.gray('─'.repeat(40)));
  console.log(chalk.cyan('proagents fix "description"') + '     Quick bug fix mode');
  console.log(chalk.cyan('proagents fix "desc" --upgrade') + '  Upgrade to full workflow');
  console.log('');

  // Status & Info
  console.log(chalk.bold.white('Status & Info'));
  console.log(chalk.gray('─'.repeat(40)));
  console.log(chalk.cyan('proagents status') + '            Show ProAgents status');
  console.log(chalk.cyan('proagents docs') + '              Open documentation');
  console.log(chalk.cyan('proagents commands') + '          Show this help');
  console.log(chalk.cyan('proagents --version') + '         Show version');
  console.log('');

  // Commands for AI Assistants
  console.log(chalk.bold.white('Commands (for AI Assistants)'));
  console.log(chalk.gray('─'.repeat(40)));
  console.log(chalk.cyan('pa:init') + '                Initialize ProAgents');
  console.log(chalk.cyan('pa:feature "name"') + '      Start a feature');
  console.log(chalk.cyan('pa:fix "description"') + '   Quick bug fix');
  console.log(chalk.cyan('pa:status') + '              Check status');
  console.log(chalk.cyan('pa:doc') + '                 Generate documentation');
  console.log(chalk.cyan('pa:qa') + '                  Quality assurance');
  console.log(chalk.cyan('pa:test') + '                Run tests');
  console.log(chalk.cyan('pa:deploy') + '              Deployment workflow');
  console.log('');

  // Examples
  console.log(chalk.bold.white('Examples'));
  console.log(chalk.gray('─'.repeat(40)));
  console.log(chalk.gray('# Initialize ProAgents in your project'));
  console.log(chalk.white('cd my-project'));
  console.log(chalk.white('npx proagents init'));
  console.log('');
  console.log(chalk.gray('# Start a new feature'));
  console.log(chalk.white('proagents feature start "Add user authentication"'));
  console.log('');
  console.log(chalk.gray('# Quick bug fix'));
  console.log(chalk.white('proagents fix "Login button not working"'));
  console.log('');

  // More info
  console.log(chalk.bold.white('More Information'));
  console.log(chalk.gray('─'.repeat(40)));
  console.log('Documentation: ' + chalk.cyan('./proagents/README.md'));
  console.log('Full Workflow: ' + chalk.cyan('./proagents/WORKFLOW.md'));
  console.log('GitHub: ' + chalk.cyan('https://github.com/prakashpro3/proAgents'));
  console.log('');
}
