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

  // AI Platforms
  console.log(chalk.bold.white('AI Platforms'));
  console.log(chalk.gray('─'.repeat(40)));
  console.log(chalk.cyan('proagents ai list') + '           List installed AI platforms');
  console.log(chalk.cyan('proagents ai add') + '            Add more AI platforms');
  console.log(chalk.cyan('proagents ai remove') + '         Remove AI platforms');
  console.log('');

  // Configuration
  console.log(chalk.bold.white('Configuration'));
  console.log(chalk.gray('─'.repeat(40)));
  console.log(chalk.cyan('proagents config list') + '       Show all configurable options');
  console.log(chalk.cyan('proagents config show') + '       Show current config values');
  console.log(chalk.cyan('proagents config set K V') + '    Set a config value');
  console.log(chalk.cyan('proagents config get K') + '      Get a config value');
  console.log(chalk.cyan('proagents config setup') + '      Interactive setup wizard');
  console.log(chalk.cyan('proagents config customize') + '  Copy templates to customize');
  console.log('');

  // Status & Info
  console.log(chalk.bold.white('Status & Info'));
  console.log(chalk.gray('─'.repeat(40)));
  console.log(chalk.cyan('proagents status') + '            Show ProAgents status');
  console.log(chalk.cyan('proagents docs') + '              Open documentation');
  console.log(chalk.cyan('proagents commands') + '          Show this help');
  console.log(chalk.cyan('proagents uninstall') + '         Remove ProAgents from project');
  console.log(chalk.cyan('proagents --version') + '         Show version');
  console.log('');

  // Commands for AI Assistants
  console.log(chalk.bold.white('Commands (for AI Assistants)'));
  console.log(chalk.gray('─'.repeat(40)));
  console.log(chalk.gray('Initialization:'));
  console.log(chalk.cyan('  pa:init') + '              Initialize ProAgents');
  console.log(chalk.cyan('  pa:help') + '              Show all commands');
  console.log(chalk.cyan('  pa:status') + '            Check status');
  console.log(chalk.gray('Feature Development:'));
  console.log(chalk.cyan('  pa:feature "name"') + '    Start a feature');
  console.log(chalk.cyan('  pa:feature-start') + '     Start new feature');
  console.log(chalk.cyan('  pa:feature-status') + '    Feature status');
  console.log(chalk.cyan('  pa:feature-list') + '      List features');
  console.log(chalk.cyan('  pa:feature-complete') + '  Complete feature');
  console.log(chalk.cyan('  pa:fix "bug"') + '         Quick bug fix');
  console.log(chalk.gray('Documentation:'));
  console.log(chalk.cyan('  pa:doc') + '               Documentation options');
  console.log(chalk.cyan('  pa:doc-full') + '          Full documentation');
  console.log(chalk.cyan('  pa:doc-moderate') + '      Balanced docs');
  console.log(chalk.cyan('  pa:doc-lite') + '          Quick reference');
  console.log(chalk.gray('Quality & Testing:'));
  console.log(chalk.cyan('  pa:qa') + '                Quality assurance');
  console.log(chalk.cyan('  pa:test') + '              Run tests');
  console.log(chalk.cyan('  pa:review') + '            Code review');
  console.log(chalk.gray('Deployment:'));
  console.log(chalk.cyan('  pa:deploy') + '            Deployment workflow');
  console.log(chalk.cyan('  pa:rollback') + '          Rollback procedures');
  console.log(chalk.gray('AI Platforms:'));
  console.log(chalk.cyan('  pa:ai-list') + '           List AI platforms');
  console.log(chalk.cyan('  pa:ai-add') + '            Add AI platforms');
  console.log(chalk.cyan('  pa:ai-remove') + '         Remove AI platforms');
  console.log(chalk.gray('Configuration:'));
  console.log(chalk.cyan('  pa:config') + '            Show configuration');
  console.log(chalk.cyan('  pa:config-list') + '       List all options');
  console.log(chalk.cyan('  pa:config-set K V') + '    Set config value');
  console.log(chalk.cyan('  pa:config-get K') + '      Get config value');
  console.log(chalk.cyan('  pa:config-setup') + '      Config wizard');
  console.log(chalk.cyan('  pa:config-customize') + '  Copy templates');
  console.log(chalk.gray('Utilities:'));
  console.log(chalk.cyan('  pa:uninstall') + '         Remove ProAgents');
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
