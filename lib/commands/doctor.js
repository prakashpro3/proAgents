import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
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
  const proagentsDir = join(targetDir, 'proagents');
  const configPath = join(targetDir, 'proagents.config.yaml');

  const checks = [];

  // Check proagents folder
  if (existsSync(proagentsDir)) {
    checks.push({ name: 'ProAgents folder', status: 'ok', message: './proagents/ exists' });
  } else {
    checks.push({ name: 'ProAgents folder', status: 'error', message: './proagents/ not found. Run: npx proagents init' });
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
    } catch { }
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
  const lockPath = join(targetDir, 'proagents', '.lock');
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
 * Check version
 */
async function checkVersion() {
  const checks = [];

  try {
    // Get current version from package.json
    const packagePath = new URL('../../package.json', import.meta.url);
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
    const currentVersion = packageJson.version;

    checks.push({ name: 'Installed version', status: 'info', message: `v${currentVersion}` });

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

        if (currentVersion === latestVersion) {
          checks.push({ name: 'Latest version', status: 'ok', message: 'Up to date' });
        } else {
          checks.push({ name: 'Latest version', status: 'warning', message: `v${latestVersion} available. Run: npm update -g proagents` });
        }
      }
    } catch {
      checks.push({ name: 'Version check', status: 'skip', message: 'Could not check npm registry' });
    }
  } catch {
    checks.push({ name: 'Version', status: 'error', message: 'Could not read version' });
  }

  return checks;
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
export async function doctorCommand() {
  const targetDir = process.cwd();

  console.log(chalk.bold('\nProAgents Doctor'));
  console.log(chalk.gray('================'));
  console.log(chalk.gray(`Checking: ${targetDir}\n`));

  let hasErrors = false;
  let hasWarnings = false;

  // Run all checks
  const installChecks = checkInstallation(targetDir);
  printChecks('Installation', installChecks);

  const configChecks = checkConfig(targetDir);
  printChecks('Configuration', configChecks);

  const platformChecks = checkPlatformSync(targetDir);
  printChecks('AI Platforms', platformChecks);

  const lockChecks = checkLockFile(targetDir);
  printChecks('Lock Status', lockChecks);

  const versionChecks = await checkVersion();
  printChecks('Version', versionChecks);

  // Count issues
  const allChecks = [...installChecks, ...configChecks, ...platformChecks, ...lockChecks, ...versionChecks];
  const errors = allChecks.filter(c => c.status === 'error').length;
  const warnings = allChecks.filter(c => c.status === 'warning').length;

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
      console.log(chalk.gray('Run `pa:ai-sync` to fix platform sync issues.'));
    }
    console.log('');
  }
}
