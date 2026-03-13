import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Get CLI version from package.json
 */
export function getCliVersion() {
  try {
    const packagePath = join(__dirname, '..', '..', 'package.json');
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
    return packageJson.version;
  } catch (error) {
    console.error(chalk.yellow(`Warning: Could not read CLI version: ${error.message}`));
    return 'unknown';
  }
}

/**
 * Get installed version in current project
 */
function getProjectVersion(targetDir) {
  const versionPath = join(targetDir, '.proagents', '.version');

  if (!existsSync(versionPath)) {
    return null;
  }

  try {
    return readFileSync(versionPath, 'utf-8').trim();
  } catch (error) {
    console.error(chalk.yellow(`Warning: Could not read project version: ${error.message}`));
    return 'unknown';
  }
}

/**
 * Fetch latest version from npm
 */
export async function getLatestVersion() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch('https://registry.npmjs.org/proagents/latest', {
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      return data.version;
    }
    return null;
  } catch (error) {
    // Network error or timeout - not critical
    return null;
  }
}

/**
 * Compare semantic versions
 * Returns: -1 if v1 < v2, 0 if equal, 1 if v1 > v2
 */
export function compareVersions(v1, v2) {
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
 * Check for updates and display notification if available
 * Non-blocking - runs asynchronously
 */
export async function checkForUpdates() {
  try {
    const cliVersion = getCliVersion();
    const latestVersion = await getLatestVersion();

    if (latestVersion && compareVersions(cliVersion, latestVersion) < 0) {
      console.log('');
      console.log(chalk.yellow(`  ╭───────────────────────────────────────────────╮`));
      console.log(chalk.yellow(`  │  Update available: ${chalk.gray('v' + cliVersion)} → ${chalk.green('v' + latestVersion)}              │`));
      console.log(chalk.yellow(`  │  Run: ${chalk.cyan('npx proagents init')} to update         │`));
      console.log(chalk.yellow(`  ╰───────────────────────────────────────────────╯`));
    }
  } catch (error) {
    // Silently ignore update check errors
  }
}

/**
 * Version command - show detailed version information
 */
export async function versionCommand(options = {}) {
  const targetDir = process.cwd();

  console.log(chalk.bold('\nProAgents Version Info'));
  console.log(chalk.gray('======================\n'));

  // CLI Version
  const cliVersion = getCliVersion();
  console.log(`  ${chalk.cyan('CLI Version:')}      ${chalk.white('v' + cliVersion)}`);

  // Project Version
  const projectVersion = getProjectVersion(targetDir);
  if (projectVersion) {
    const versionMatch = projectVersion === cliVersion;
    const projectVersionColor = versionMatch ? chalk.green : chalk.yellow;
    console.log(`  ${chalk.cyan('Project Version:')}  ${projectVersionColor('v' + projectVersion)}`);

    if (!versionMatch) {
      console.log(chalk.yellow(`                    ↳ Run 'npx proagents init' to update`));
    }
  } else {
    console.log(`  ${chalk.cyan('Project Version:')}  ${chalk.gray('Not installed in this directory')}`);
  }

  // Latest Version (from npm)
  if (!options.offline) {
    process.stdout.write(`  ${chalk.cyan('Latest Version:')}   `);
    const latestVersion = await getLatestVersion();

    if (latestVersion) {
      const comparison = compareVersions(cliVersion, latestVersion);

      if (comparison >= 0) {
        console.log(chalk.green('v' + latestVersion + ' (up to date)'));
      } else {
        console.log(chalk.yellow('v' + latestVersion + ' (update available)'));
        console.log(chalk.yellow(`                    ↳ Run 'npx proagents init' to update`));
      }
    } else {
      console.log(chalk.gray('Could not fetch (offline or npm unavailable)'));
    }
  }

  // Additional info
  console.log('');
  console.log(`  ${chalk.cyan('Node.js:')}          ${chalk.white(process.version)}`);
  console.log(`  ${chalk.cyan('Platform:')}         ${chalk.white(process.platform + ' ' + process.arch)}`);
  console.log('');

  // Quick tips
  if (projectVersion && projectVersion !== cliVersion) {
    console.log(chalk.bold('Tip:'));
    console.log(chalk.gray('  Your project has an older ProAgents version.'));
    console.log(chalk.gray('  Run `npx proagents init` to update framework files.\n'));
  }
}
