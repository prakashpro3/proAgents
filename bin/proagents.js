#!/usr/bin/env node

import { program } from 'commander';
import { initCommand } from '../lib/commands/init.js';
import { featureCommand } from '../lib/commands/feature.js';
import { fixCommand } from '../lib/commands/fix.js';
import { statusCommand } from '../lib/commands/status.js';
import { helpCommand } from '../lib/commands/help.js';
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
    console.log('Local: ./proagents/README.md');
    console.log('Workflow: ./proagents/WORKFLOW.md');
    console.log('GitHub: https://github.com/prakashpro3/proAgents\n');
  });

// Help command (custom)
program
  .command('commands')
  .description('Show all available commands with examples')
  .action(helpCommand);

program.parse();
