import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';

/**
 * Get recent changes from _recent.md
 */
function getRecentChanges(proagentsDir) {
  const recentPath = join(proagentsDir, 'changelog', '_recent.md');
  if (existsSync(recentPath)) {
    return readFileSync(recentPath, 'utf-8');
  }
  return null;
}

/**
 * Add entry to _recent.md
 */
function addToRecent(proagentsDir, entry) {
  const changelogDir = join(proagentsDir, 'changelog');
  const recentPath = join(changelogDir, '_recent.md');

  // Ensure directory exists
  if (!existsSync(changelogDir)) {
    mkdirSync(changelogDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const formattedEntry = `- [${timestamp}] ${entry}\n`;

  if (existsSync(recentPath)) {
    const existing = readFileSync(recentPath, 'utf-8');
    const lines = existing.split('\n').filter(l => l.trim());

    // Keep only last 50 entries
    const updatedLines = [formattedEntry.trim(), ...lines].slice(0, 50);
    writeFileSync(recentPath, updatedLines.join('\n') + '\n');
  } else {
    writeFileSync(recentPath, `# Recent Changes\n\n${formattedEntry}`);
  }

  return { success: true, timestamp };
}

/**
 * Generate changelog from git commits
 */
function generateFromGit(options = {}) {
  const { since, until, limit = 50 } = options;

  try {
    let command = 'git log';

    if (since) {
      command += ` ${since}..${until || 'HEAD'}`;
    } else {
      command += ` -${limit}`;
    }

    command += ' --pretty=format:"- %s (%h, %an, %ad)" --date=short';

    const output = execSync(command, { encoding: 'utf-8' });
    return output.trim();
  } catch (error) {
    return null;
  }
}

/**
 * Export changelog to CHANGELOG.md
 */
function exportChangelog(targetDir, proagentsDir, options = {}) {
  const changelogPath = join(targetDir, 'CHANGELOG.md');

  let content = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

`;

  // Get recent changes
  const recent = getRecentChanges(proagentsDir);
  if (recent) {
    content += `## [Unreleased]\n\n`;
    // Parse recent changes
    const lines = recent.split('\n').filter(l => l.startsWith('- ['));
    if (lines.length > 0) {
      content += lines.join('\n') + '\n\n';
    }
  }

  // Add git history if requested
  if (options.includeGit) {
    const gitLog = generateFromGit({ limit: 100 });
    if (gitLog) {
      content += `## Git History\n\n${gitLog}\n`;
    }
  }

  writeFileSync(changelogPath, content);
  return changelogPath;
}

/**
 * View changelog for a specific feature
 */
function viewFeatureChangelog(proagentsDir, featureName) {
  const featurePath = join(proagentsDir, 'changelog', 'features', `${featureName}.md`);
  if (existsSync(featurePath)) {
    return readFileSync(featurePath, 'utf-8');
  }
  return null;
}

/**
 * View changelog for a specific module
 */
function viewModuleChangelog(proagentsDir, moduleName) {
  const modulePath = join(proagentsDir, 'changelog', 'modules', `${moduleName}.md`);
  if (existsSync(modulePath)) {
    return readFileSync(modulePath, 'utf-8');
  }
  return null;
}

/**
 * List available changelogs
 */
function listChangelogs(proagentsDir) {
  const result = { features: [], modules: [], years: [] };

  const changelogDir = join(proagentsDir, 'changelog');
  if (!existsSync(changelogDir)) return result;

  // Features
  const featuresDir = join(changelogDir, 'features');
  if (existsSync(featuresDir)) {
    try {
      result.features = readdirSync(featuresDir)
        .filter(f => f.endsWith('.md'))
        .map(f => f.replace('.md', ''));
    } catch {
      // Directory not readable
    }
  }

  // Modules
  const modulesDir = join(changelogDir, 'modules');
  if (existsSync(modulesDir)) {
    try {
      result.modules = readdirSync(modulesDir)
        .filter(f => f.endsWith('.md'))
        .map(f => f.replace('.md', ''));
    } catch {
      // Directory not readable
    }
  }

  // Year folders
  try {
    const entries = readdirSync(changelogDir, { withFileTypes: true });
    result.years = entries
      .filter(e => e.isDirectory() && /^20[2-9][0-9]$/.test(e.name))
      .map(e => e.name);
  } catch {
    // Directory not readable
  }

  return result;
}

/**
 * Changelog command - manage project changelogs
 */
export async function changelogCommand(action, value, options = {}) {
  const targetDir = process.cwd();
  const proagentsDir = join(targetDir, '.proagents');

  // Ensure proagents exists for some commands
  if (!existsSync(proagentsDir) && action !== 'export') {
    console.log(chalk.yellow('\nProAgents is not installed in this project.'));
    console.log(chalk.gray('Run `npx proagents init` to initialize.\n'));
    return;
  }

  // Handle different actions
  switch (action) {
    case 'add': {
      if (!value) {
        console.log(chalk.red('\nError: Please provide a changelog entry.'));
        console.log(chalk.gray('Usage: proagents changelog add "Fixed login bug"\n'));
        return;
      }

      const result = addToRecent(proagentsDir, value);

      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(chalk.green(`\n✓ Added to changelog: ${value}`));
        console.log(chalk.gray(`  Timestamp: ${result.timestamp}\n`));
      }
      break;
    }

    case 'view':
    case 'show':
    default: {
      console.log(chalk.bold('\nRecent Changes'));
      console.log(chalk.gray('==============\n'));

      const recent = getRecentChanges(proagentsDir);
      if (recent) {
        // Show last N entries
        const limit = options.limit || 10;
        const lines = recent.split('\n').filter(l => l.startsWith('- ['));
        const display = lines.slice(0, limit);

        if (display.length > 0) {
          for (const line of display) {
            // Color-code by type
            if (line.toLowerCase().includes('fix')) {
              console.log(chalk.blue(line));
            } else if (line.toLowerCase().includes('feat') || line.toLowerCase().includes('add')) {
              console.log(chalk.green(line));
            } else if (line.toLowerCase().includes('break')) {
              console.log(chalk.red(line));
            } else {
              console.log(line);
            }
          }
          if (lines.length > limit) {
            console.log(chalk.gray(`\n... and ${lines.length - limit} more entries`));
          }
        } else {
          console.log(chalk.gray('No recent changes recorded.'));
        }
      } else {
        console.log(chalk.gray('No changelog found.'));
      }
      console.log('');
      break;
    }

    case 'list': {
      console.log(chalk.bold('\nAvailable Changelogs'));
      console.log(chalk.gray('====================\n'));

      const changelogs = listChangelogs(proagentsDir);

      if (options.json) {
        console.log(JSON.stringify(changelogs, null, 2));
        return;
      }

      if (changelogs.features.length > 0) {
        console.log(chalk.cyan('Features:'));
        for (const f of changelogs.features) {
          console.log(`  • ${f}`);
        }
        console.log('');
      }

      if (changelogs.modules.length > 0) {
        console.log(chalk.cyan('Modules:'));
        for (const m of changelogs.modules) {
          console.log(`  • ${m}`);
        }
        console.log('');
      }

      if (changelogs.years.length > 0) {
        console.log(chalk.cyan('Years:'));
        for (const y of changelogs.years) {
          console.log(`  • ${y}`);
        }
        console.log('');
      }

      if (changelogs.features.length === 0 && changelogs.modules.length === 0 && changelogs.years.length === 0) {
        console.log(chalk.gray('No changelogs found.\n'));
      }
      break;
    }

    case 'feature': {
      if (!value) {
        console.log(chalk.red('\nError: Please provide a feature name.'));
        console.log(chalk.gray('Usage: proagents changelog feature <name>\n'));
        return;
      }

      const featureLog = viewFeatureChangelog(proagentsDir, value);
      if (featureLog) {
        console.log(chalk.bold(`\nFeature Changelog: ${value}`));
        console.log(chalk.gray('─'.repeat(40)));
        console.log(featureLog);
      } else {
        console.log(chalk.yellow(`\nNo changelog found for feature: ${value}\n`));
      }
      break;
    }

    case 'module': {
      if (!value) {
        console.log(chalk.red('\nError: Please provide a module name.'));
        console.log(chalk.gray('Usage: proagents changelog module <name>\n'));
        return;
      }

      const moduleLog = viewModuleChangelog(proagentsDir, value);
      if (moduleLog) {
        console.log(chalk.bold(`\nModule Changelog: ${value}`));
        console.log(chalk.gray('─'.repeat(40)));
        console.log(moduleLog);
      } else {
        console.log(chalk.yellow(`\nNo changelog found for module: ${value}\n`));
      }
      break;
    }

    case 'export': {
      console.log(chalk.bold('\nExporting Changelog'));
      console.log(chalk.gray('===================\n'));

      const outputPath = exportChangelog(targetDir, proagentsDir, {
        includeGit: options.git
      });

      if (options.json) {
        console.log(JSON.stringify({ success: true, path: outputPath }, null, 2));
      } else {
        console.log(chalk.green(`✓ Exported to: ${outputPath}\n`));
      }
      break;
    }

    case 'git': {
      console.log(chalk.bold('\nGit Commit History'));
      console.log(chalk.gray('==================\n'));

      const gitLog = generateFromGit({
        since: options.since,
        until: options.until,
        limit: options.limit || 20
      });

      if (gitLog) {
        console.log(gitLog);
      } else {
        console.log(chalk.yellow('Could not retrieve git history.'));
      }
      console.log('');
      break;
    }
  }
}

/**
 * Changelog list subcommand
 */
export async function changelogListCommand(options = {}) {
  return changelogCommand('list', null, options);
}

/**
 * Changelog add subcommand
 */
export async function changelogAddCommand(entry, options = {}) {
  return changelogCommand('add', entry, options);
}

/**
 * Changelog export subcommand
 */
export async function changelogExportCommand(options = {}) {
  return changelogCommand('export', null, options);
}

/**
 * Changelog view subcommand (default)
 */
export async function changelogViewCommand(options = {}) {
  return changelogCommand('view', null, options);
}
