import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';
import yaml from 'js-yaml';

// Platform file mapping
const PLATFORM_FILES = {
  claude: 'CLAUDE.md',
  cursor: '.cursorrules',
  windsurf: '.windsurfrules',
  copilot: '.github/copilot-instructions.md',
  chatgpt: 'CHATGPT.md',
  gemini: 'GEMINI.md',
  bolt: 'BOLT.md',
  lovable: 'LOVABLE.md',
  replit: 'REPLIT.md',
  kiro: 'KIRO.md',
  groq: 'GROQ.md',
  antigravity: 'ANTIGRAVITY.md'
};

/**
 * Check if ProAgents is installed
 */
function checkInstallation(targetDir) {
  const proagentsDir = join(targetDir, '.proagents');
  const configPath = join(targetDir, 'proagents.config.yaml');

  const checks = [];

  // Check proagents folder
  if (existsSync(proagentsDir)) {
    checks.push({ name: 'ProAgents folder', status: 'ok', message: './.proagents/ exists' });
  } else {
    checks.push({ name: 'ProAgents folder', status: 'error', message: './.proagents/ not found. Run: npx proagents init' });
  }

  // Check config file
  if (existsSync(configPath)) {
    checks.push({ name: 'Config file', status: 'ok', message: 'proagents.config.yaml exists' });
  } else {
    checks.push({ name: 'Config file', status: 'warning', message: 'proagents.config.yaml not found' });
  }

  return checks;
}

/**
 * Check config validity
 */
function checkConfig(targetDir) {
  const configPath = join(targetDir, 'proagents.config.yaml');
  const checks = [];

  if (!existsSync(configPath)) {
    return [{ name: 'Config validation', status: 'skip', message: 'No config file to validate' }];
  }

  try {
    const content = readFileSync(configPath, 'utf-8');
    const config = yaml.load(content);

    if (config && typeof config === 'object') {
      checks.push({ name: 'Config syntax', status: 'ok', message: 'YAML is valid' });

      // Check required sections
      if (config.project?.name) {
        checks.push({ name: 'Project name', status: 'ok', message: `"${config.project.name}"` });
      } else {
        checks.push({ name: 'Project name', status: 'warning', message: 'Not set' });
      }

      if (config.project?.type) {
        checks.push({ name: 'Project type', status: 'ok', message: `"${config.project.type}"` });
      } else {
        checks.push({ name: 'Project type', status: 'warning', message: 'Not set' });
      }
    }
  } catch (error) {
    checks.push({ name: 'Config syntax', status: 'error', message: `Invalid YAML: ${error.message}` });
  }

  return checks;
}

/**
 * Check AI platform files sync
 */
function checkPlatformSync(targetDir) {
  const configPath = join(targetDir, 'proagents.config.yaml');
  const checks = [];

  let configPlatforms = [];

  // Read platforms from config
  if (existsSync(configPath)) {
    try {
      const content = readFileSync(configPath, 'utf-8');
      const config = yaml.load(content);
      configPlatforms = config?.platforms || config?.ai_platforms || [];
    } catch {
      // Config file unreadable - will be caught by other checks
    }
  }

  // Check each platform file
  const existingFiles = [];
  const missingFiles = [];

  for (const [platformId, fileName] of Object.entries(PLATFORM_FILES)) {
    const filePath = join(targetDir, fileName);
    const inConfig = configPlatforms.includes(platformId);
    const fileExists = existsSync(filePath);

    if (fileExists) {
      existingFiles.push(platformId);
      if (!inConfig) {
        checks.push({ name: `${platformId}`, status: 'warning', message: `${fileName} exists but not in config` });
      }
    } else if (inConfig) {
      missingFiles.push(platformId);
      checks.push({ name: `${platformId}`, status: 'warning', message: `In config but ${fileName} missing` });
    }
  }

  if (checks.length === 0 && existingFiles.length > 0) {
    checks.push({ name: 'Platform sync', status: 'ok', message: `${existingFiles.length} platforms synced` });
  } else if (existingFiles.length === 0) {
    checks.push({ name: 'Platform files', status: 'warning', message: 'No AI platform files found' });
  }

  return checks;
}

/**
 * Check for lock file
 */
function checkLockFile(targetDir) {
  const lockPath = join(targetDir, '.proagents', '.lock');
  const checks = [];

  if (existsSync(lockPath)) {
    try {
      const content = readFileSync(lockPath, 'utf-8');
      const lock = yaml.load(content);

      const expiresAt = new Date(lock.expires);
      const now = new Date();

      if (expiresAt < now) {
        const lockedBy = lock.model ? `${lock.locked_by}:${lock.model}` : lock.locked_by;
        checks.push({ name: 'Lock file', status: 'warning', message: `Expired lock by ${lockedBy}. Consider removing.` });
      } else {
        const lockedBy = lock.model ? `${lock.locked_by}:${lock.model}` : lock.locked_by;
        checks.push({ name: 'Lock file', status: 'info', message: `Locked by ${lockedBy} for "${lock.task}"` });
      }
    } catch {
      checks.push({ name: 'Lock file', status: 'warning', message: 'Lock file exists but is invalid' });
    }
  } else {
    checks.push({ name: 'Lock file', status: 'ok', message: 'No active lock' });
  }

  return checks;
}

/**
 * Extended checks for --full mode
 */
function checkExtended(targetDir) {
  const checks = [];

  // Check changelog size
  const recentPath = join(targetDir, '.proagents', 'changelog', '_recent.md');
  if (existsSync(recentPath)) {
    try {
      const content = readFileSync(recentPath, 'utf-8');
      const entries = (content.match(/^### /gm) || []).length;
      if (entries > 50) {
        checks.push({ name: 'Changelog size', status: 'warning', message: `${entries} entries (consider archiving)` });
      } else {
        checks.push({ name: 'Changelog size', status: 'ok', message: `${entries} entries` });
      }
    } catch {
      checks.push({ name: 'Changelog size', status: 'skip', message: 'Could not read' });
    }
  } else {
    checks.push({ name: 'Changelog', status: 'info', message: 'No recent changelog' });
  }

  // Check activity log freshness
  const activityPath = join(targetDir, '.proagents', 'activity.log');
  if (existsSync(activityPath)) {
    try {
      const content = readFileSync(activityPath, 'utf-8');
      const lines = content.trim().split('\n').filter(l => l && !l.startsWith('#') && !l.includes('Activity Log'));
      if (lines.length > 0) {
        const lastLine = lines[lines.length - 1];
        const dateMatch = lastLine.match(/^\[?(\d{4}-\d{2}-\d{2})/);
        if (dateMatch) {
          const lastDate = new Date(dateMatch[1]);
          const daysAgo = Math.floor((Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
          if (daysAgo > 7) {
            checks.push({ name: 'Activity log', status: 'warning', message: `Last entry ${daysAgo} days ago` });
          } else if (daysAgo > 0) {
            checks.push({ name: 'Activity log', status: 'ok', message: `Last entry ${daysAgo} day(s) ago` });
          } else {
            checks.push({ name: 'Activity log', status: 'ok', message: 'Activity today' });
          }
        } else {
          checks.push({ name: 'Activity log', status: 'ok', message: `${lines.length} entries` });
        }
      } else {
        checks.push({ name: 'Activity log', status: 'info', message: 'No entries yet' });
      }
    } catch {
      checks.push({ name: 'Activity log', status: 'skip', message: 'Could not read' });
    }
  } else {
    checks.push({ name: 'Activity log', status: 'info', message: 'No activity log' });
  }

  // Check for stale feature branches
  try {
    const branches = execSync('git branch --list "feature/*" 2>/dev/null', { encoding: 'utf-8' }).trim();
    if (branches) {
      const branchCount = branches.split('\n').filter(b => b.trim()).length;
      if (branchCount > 5) {
        checks.push({ name: 'Feature branches', status: 'warning', message: `${branchCount} branches (consider cleanup)` });
      } else if (branchCount > 0) {
        checks.push({ name: 'Feature branches', status: 'ok', message: `${branchCount} active` });
      }
    } else {
      checks.push({ name: 'Feature branches', status: 'ok', message: 'None' });
    }
  } catch {
    checks.push({ name: 'Feature branches', status: 'skip', message: 'Not a git repo or no feature branches' });
  }

  // Check active features
  const featuresPath = join(targetDir, '.proagents', 'active-features', '_index.json');
  if (existsSync(featuresPath)) {
    try {
      const content = readFileSync(featuresPath, 'utf-8');
      const index = JSON.parse(content);
      const activeCount = index.active_features?.length || 0;
      const completedCount = index.completed_features?.length || 0;

      if (activeCount > 0) {
        checks.push({ name: 'Active features', status: 'ok', message: `${activeCount} active, ${completedCount} completed` });
      } else {
        checks.push({ name: 'Active features', status: 'info', message: `None active, ${completedCount} completed` });
      }
    } catch {
      checks.push({ name: 'Active features', status: 'skip', message: 'Could not read index' });
    }
  } else {
    checks.push({ name: 'Active features', status: 'info', message: 'No features tracked' });
  }

  // Check worklog context
  const contextPath = join(targetDir, '.proagents', 'worklog', '_context.md');
  if (existsSync(contextPath)) {
    checks.push({ name: 'Worklog context', status: 'ok', message: 'Present' });
  } else {
    checks.push({ name: 'Worklog context', status: 'warning', message: 'Missing (cross-AI sync may be affected)' });
  }

  // Check for required folders
  const requiredFolders = [
    { path: '.proagents/prompts', name: 'Prompts folder' },
    { path: '.proagents/templates', name: 'Templates folder' },
    { path: '.proagents/changelog', name: 'Changelog folder' },
    { path: '.proagents/worklog', name: 'Worklog folder' }
  ];

  for (const folder of requiredFolders) {
    if (existsSync(join(targetDir, folder.path))) {
      checks.push({ name: folder.name, status: 'ok', message: 'Present' });
    } else {
      checks.push({ name: folder.name, status: 'warning', message: 'Missing' });
    }
  }

  return checks;
}

/**
 * Compare semantic versions
 * Returns: -1 if v1 < v2, 0 if equal, 1 if v1 > v2
 */
function compareVersions(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    if (p1 < p2) return -1;
    if (p1 > p2) return 1;
  }
  return 0;
}

/**
 * Check version (CLI, project, and npm)
 */
async function checkVersion(targetDir) {
  const checks = [];
  const recommendations = [];

  try {
    // Get CLI version from package.json
    const packagePath = new URL('../../package.json', import.meta.url);
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
    const cliVersion = packageJson.version;

    checks.push({ name: 'CLI version', status: 'info', message: `v${cliVersion}` });

    // Get project version from .proagents/.version
    const projectVersionPath = join(targetDir, '.proagents', '.version');
    let projectVersion = null;

    if (existsSync(projectVersionPath)) {
      try {
        projectVersion = readFileSync(projectVersionPath, 'utf-8').trim();

        if (projectVersion === cliVersion) {
          checks.push({ name: 'Project version', status: 'ok', message: `v${projectVersion} (synced with CLI)` });
        } else if (compareVersions(projectVersion, cliVersion) < 0) {
          checks.push({ name: 'Project version', status: 'warning', message: `v${projectVersion} (outdated)` });
          recommendations.push({
            issue: 'Project framework is outdated',
            action: 'Run `npx proagents init` to update framework files'
          });
        } else {
          checks.push({ name: 'Project version', status: 'info', message: `v${projectVersion}` });
        }
      } catch {
        checks.push({ name: 'Project version', status: 'warning', message: 'Could not read version file' });
      }
    } else {
      checks.push({ name: 'Project version', status: 'warning', message: 'No version marker (older installation)' });
      recommendations.push({
        issue: 'No version tracking',
        action: 'Run `npx proagents init` to update and add version tracking'
      });
    }

    // Try to fetch latest version from npm (with timeout)
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);

      const response = await fetch('https://registry.npmjs.org/proagents/latest', {
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (response.ok) {
        const data = await response.json();
        const latestVersion = data.version;

        if (compareVersions(cliVersion, latestVersion) >= 0) {
          checks.push({ name: 'npm registry', status: 'ok', message: `v${latestVersion} (up to date)` });
        } else {
          checks.push({ name: 'npm registry', status: 'warning', message: `v${latestVersion} available` });
          recommendations.push({
            issue: 'CLI update available',
            action: 'Run `npm update -g proagents` to update CLI'
          });
        }
      }
    } catch {
      checks.push({ name: 'npm registry', status: 'skip', message: 'Could not check (offline?)' });
    }
  } catch (error) {
    checks.push({ name: 'Version', status: 'error', message: `Could not read version: ${error.message}` });
  }

  return { checks, recommendations };
}

/**
 * Print check results
 */
function printChecks(title, checks) {
  console.log(chalk.bold(`\n${title}`));
  console.log(chalk.gray('─'.repeat(40)));

  for (const check of checks) {
    let icon, color;
    switch (check.status) {
      case 'ok':
        icon = '✓';
        color = chalk.green;
        break;
      case 'error':
        icon = '✗';
        color = chalk.red;
        break;
      case 'warning':
        icon = '⚠';
        color = chalk.yellow;
        break;
      case 'info':
        icon = 'ℹ';
        color = chalk.blue;
        break;
      case 'skip':
        icon = '○';
        color = chalk.gray;
        break;
      default:
        icon = '•';
        color = chalk.white;
    }

    console.log(`  ${color(icon)} ${check.name}: ${color(check.message)}`);
  }
}

/**
 * Doctor command - check health of ProAgents installation
 */
export async function doctorCommand(options = {}) {
  const targetDir = process.cwd();
  const isFullMode = options.full || false;

  console.log(chalk.bold('\nProAgents Doctor' + (isFullMode ? ' (Full)' : '')));
  console.log(chalk.gray('═'.repeat(40)));
  console.log(chalk.gray(`Checking: ${targetDir}\n`));

  // Run all checks
  const installChecks = checkInstallation(targetDir);
  printChecks('Installation', installChecks);

  const configChecks = checkConfig(targetDir);
  printChecks('Configuration', configChecks);

  const platformChecks = checkPlatformSync(targetDir);
  printChecks('AI Platforms', platformChecks);

  const lockChecks = checkLockFile(targetDir);
  printChecks('Lock Status', lockChecks);

  const versionResult = await checkVersion(targetDir);
  printChecks('Version', versionResult.checks);

  // Extended checks for --full mode
  let extendedChecks = [];
  if (isFullMode) {
    extendedChecks = checkExtended(targetDir);
    printChecks('Extended Health Checks', extendedChecks);
  }

  // Count issues
  const allChecks = [...installChecks, ...configChecks, ...platformChecks, ...lockChecks, ...versionResult.checks, ...extendedChecks];
  const errors = allChecks.filter(c => c.status === 'error').length;
  const warnings = allChecks.filter(c => c.status === 'warning').length;

  // Recommendations section (if any)
  if (versionResult.recommendations && versionResult.recommendations.length > 0) {
    console.log(chalk.bold('\nRecommendations'));
    console.log(chalk.gray('─'.repeat(40)));

    for (const rec of versionResult.recommendations) {
      console.log(chalk.yellow(`  ⚡ ${rec.issue}`));
      console.log(chalk.cyan(`     → ${rec.action}`));
    }
  }

  // Summary
  console.log(chalk.bold('\nSummary'));
  console.log(chalk.gray('─'.repeat(40)));

  if (errors === 0 && warnings === 0) {
    console.log(chalk.green('  ✓ All checks passed!\n'));
  } else {
    if (errors > 0) {
      console.log(chalk.red(`  ✗ ${errors} error(s) found`));
    }
    if (warnings > 0) {
      console.log(chalk.yellow(`  ⚠ ${warnings} warning(s) found`));
    }
    console.log('');

    if (errors > 0) {
      console.log(chalk.gray('Run `npx proagents init` to fix installation issues.'));
    }
    if (platformChecks.some(c => c.status === 'warning')) {
      console.log(chalk.gray('Run `npx proagents ai add` to fix platform sync issues.'));
    }
    console.log('');
  }

  // Hint for full mode
  if (!isFullMode) {
    console.log(chalk.gray('Run `proagents doctor --full` for extended health checks.\n'));
  }
}
