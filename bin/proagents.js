#!/usr/bin/env node

import { program } from 'commander';
import { initCommand } from '../lib/commands/init.js';
import { featureCommand } from '../lib/commands/feature.js';
import { fixCommand } from '../lib/commands/fix.js';
import { statusCommand } from '../lib/commands/status.js';
import { helpCommand } from '../lib/commands/help.js';
import { aiAddCommand, aiListCommand, aiRemoveCommand } from '../lib/commands/ai.js';
import { uninstallCommand } from '../lib/commands/uninstall.js';
import { configListCommand, configShowCommand, configEditCommand, configSetCommand, configGetCommand, configSetupCommand, configCustomizeCommand, configExportCommand, configImportCommand } from '../lib/commands/config.js';
import { doctorCommand } from '../lib/commands/doctor.js';
import { upgradeCommand } from '../lib/commands/upgrade.js';
import { migrateCommand } from '../lib/commands/migrate.js';
import { versionCommand, checkForUpdates } from '../lib/commands/version.js';
import { releaseCommand } from '../lib/commands/release.js';
import { statsCommand } from '../lib/commands/stats.js';
import { restoreCommand } from '../lib/commands/restore.js';
import { changelogCommand, changelogAddCommand, changelogListCommand, changelogExportCommand, changelogViewCommand } from '../lib/commands/changelog.js';
import { completionCommand } from '../lib/commands/completion.js';
import { openCommand } from '../lib/commands/open.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json for version
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '..', 'package.json'), 'utf-8')
);

program
  .name('proagents')
  .description('AI-agnostic development workflow framework')
  .version(packageJson.version);

// Init command
program
  .command('init')
  .description('Initialize ProAgents in the current project')
  .option('-f, --force', 'Overwrite existing proagents folder')
  .option('--skip-config', 'Skip creating config file')
  .option('-t, --template <name>', 'Use a project template (e.g., nextjs-saas, react-spa)')
  .option('--list-templates', 'List available project templates')
  .action(initCommand);

// Feature commands
const feature = program
  .command('feature')
  .description('Feature development commands');

feature
  .command('start <name>')
  .description('Start a new feature')
  .action((name) => featureCommand('start', name));

feature
  .command('status')
  .description('Check current feature status')
  .action(() => featureCommand('status'));

feature
  .command('list')
  .description('List all features')
  .action(() => featureCommand('list'));

feature
  .command('complete')
  .description('Mark current feature as complete')
  .action(() => featureCommand('complete'));

// Fix command
program
  .command('fix <description>')
  .description('Quick bug fix mode')
  .option('--upgrade', 'Upgrade to full workflow')
  .action(fixCommand);

// Status command
program
  .command('status')
  .description('Show ProAgents status in current project')
  .action(statusCommand);

// Docs command
program
  .command('docs')
  .description('Open ProAgents documentation')
  .action(() => {
    console.log('\nProAgents Documentation');
    console.log('=======================\n');
    console.log('Local: ./.proagents/README.md');
    console.log('Workflow: ./.proagents/WORKFLOW.md');
    console.log('GitHub: https://github.com/prakashpro3/proAgents\n');
  });

// AI platform commands
const ai = program
  .command('ai')
  .description('Manage AI platform instruction files');

ai
  .command('add')
  .description('Add more AI platforms')
  .action(aiAddCommand);

ai
  .command('list')
  .description('List installed AI platforms')
  .action(aiListCommand);

ai
  .command('remove')
  .description('Remove AI platforms from config')
  .action(aiRemoveCommand);

// Config commands
const config = program
  .command('config')
  .description('Manage ProAgents configuration');

config
  .command('list')
  .description('Show all configurable options')
  .action(configListCommand);

config
  .command('show')
  .description('Show current config values')
  .action(configShowCommand);

config
  .command('edit')
  .description('Info on how to edit config')
  .action(configEditCommand);

config
  .command('set <key> <value>')
  .description('Set a config value (e.g., checkpoints.after_analysis true)')
  .action(configSetCommand);

config
  .command('get <key>')
  .description('Get a config value (e.g., checkpoints.after_analysis)')
  .action(configGetCommand);

config
  .command('setup')
  .description('Interactive configuration wizard')
  .action(configSetupCommand);

config
  .command('customize')
  .description('Copy templates to create custom configurations')
  .action(configCustomizeCommand);

config
  .command('export')
  .description('Export configuration for sharing or backup')
  .option('-o, --output [path]', 'Output to file instead of stdout')
  .action(configExportCommand);

config
  .command('import <file>')
  .description('Import configuration from export file')
  .option('-f, --force', 'Skip confirmation prompt')
  .option('-q, --quiet', 'Minimal output')
  .option('--json', 'Output in JSON format')
  .action(configImportCommand);

// Uninstall command
program
  .command('uninstall')
  .description('Remove ProAgents from current project')
  .option('-f, --force', 'Skip confirmation prompt')
  .action(uninstallCommand);

// Help command (custom)
program
  .command('commands')
  .description('Show all available commands with examples')
  .action(helpCommand);

// Doctor command
program
  .command('doctor')
  .description('Check health of ProAgents installation')
  .option('--full', 'Run extended health checks')
  .action(doctorCommand);

// Upgrade command
program
  .command('upgrade')
  .description('Upgrade .proagents folder to latest version')
  .option('-f, --force', 'Skip confirmation prompt')
  .action(upgradeCommand);

// Migrate command
program
  .command('migrate')
  .description('Migrate from proagents/ to .proagents/ folder structure')
  .option('-f, --force', 'Skip confirmation prompt')
  .action(migrateCommand);

// Version command (detailed)
program
  .command('version')
  .description('Show detailed version information')
  .option('--offline', 'Skip checking npm for latest version')
  .action(versionCommand);

// Stats command
program
  .command('stats')
  .description('Show project and AI usage statistics')
  .option('--json', 'Output in JSON format')
  .action(statsCommand);

// Restore command
program
  .command('restore <backup-file>')
  .description('Restore ProAgents data from backup')
  .option('-f, --force', 'Skip confirmation prompt')
  .option('-q, --quiet', 'Minimal output')
  .option('--json', 'Output in JSON format')
  .action(restoreCommand);

// Changelog commands
const changelog = program
  .command('changelog')
  .description('Manage project changelogs');

changelog
  .command('view')
  .description('View recent changelog entries (default)')
  .option('-l, --limit <number>', 'Number of entries to show', '10')
  .option('--json', 'Output in JSON format')
  .action(changelogViewCommand);

changelog
  .command('add <entry>')
  .description('Add a new changelog entry')
  .option('--json', 'Output in JSON format')
  .action(changelogAddCommand);

changelog
  .command('list')
  .description('List available changelogs (features, modules, years)')
  .option('--json', 'Output in JSON format')
  .action(changelogListCommand);

changelog
  .command('export')
  .description('Export changelog to CHANGELOG.md')
  .option('--git', 'Include git commit history')
  .option('--json', 'Output in JSON format')
  .action(changelogExportCommand);

changelog
  .command('feature <name>')
  .description('View changelog for a specific feature')
  .action((name) => changelogCommand('feature', name));

changelog
  .command('module <name>')
  .description('View changelog for a specific module')
  .action((name) => changelogCommand('module', name));

changelog
  .command('git')
  .description('View git commit history as changelog')
  .option('--since <ref>', 'Start from tag/commit/date')
  .option('--until <ref>', 'End at tag/commit/date')
  .option('-l, --limit <number>', 'Number of commits', '20')
  .action((options) => changelogCommand('git', null, options));

// Release command
program
  .command('release')
  .description('Generate release notes with type selection')
  .option('-t, --type <type>', 'Release type: detailed, short, client, developer, hotfix, prerelease')
  .option('-v, --version <version>', 'Version number (defaults to package.json)')
  .option('-o, --output [path]', 'Output to file (optional path)')
  .option('-a, --append', 'Append to existing release notes file')
  .option('-i, --include <categories>', 'Include only: features,fixes,improvements,security,breaking,docs,deps,perf')
  .option('-e, --exclude <categories>', 'Exclude categories (comma-separated)')
  .option('-m, --module <name>', 'Filter by module/component name in commits')
  .option('-p, --path <path>', 'Filter commits by file path')
  .option('--since <ref>', 'Start from tag/commit/date')
  .option('--until <ref>', 'End at tag/commit/date')
  .option('--bump', 'Suggest version bump based on changes')
  .option('--prerelease <stage>', 'Mark as pre-release (beta, rc, alpha)')
  .option('--urgency <level>', 'Hotfix urgency level (low, medium, high, critical)')
  .option('--interactive', 'Interactive mode with filter selection')
  .option('--changelog', 'Update CHANGELOG.md with release notes')
  .option('--tag', 'Create git tag for this release')
  .option('--tag-message <message>', 'Custom message for git tag')
  .option('--json', 'Output in JSON format (for scripting)')
  .action(releaseCommand);

// Completion command
program
  .command('completion [shell]')
  .description('Generate shell completion scripts (bash, zsh, fish)')
  .option('-q, --quiet', 'Skip install instructions')
  .action(completionCommand);

// Open command
program
  .command('open [target]')
  .description('Open ProAgents files quickly (config, changelog, activity, etc.)')
  .action(openCommand);

program.parse();

// Check for updates after command completes (non-blocking)
// Skip for version command (it already shows version info)
const commandName = program.args[0];
if (commandName !== 'version' && commandName !== '--version' && commandName !== '-V') {
  // Run update check in background without blocking
  checkForUpdates().catch(() => {});
}
