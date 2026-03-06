import { existsSync, readFileSync, writeFileSync, cpSync, mkdirSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { createInterface } from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Files to preserve during upgrade (user customizations)
const PRESERVE_FILES = [
  'proagents.config.yaml',
  'activity.log',
  'handoff.md',
  '.lock',
  'active-features/_index.json',
  'active-features/.gitkeep'
];

// Folders to preserve (user data)
const PRESERVE_FOLDERS = [
  'active-features'
];

/**
 * Backup user files before upgrade
 */
function backupUserFiles(targetDir) {
  const backups = {};

  for (const file of PRESERVE_FILES) {
    const filePath = join(targetDir, 'proagents', file);
    if (existsSync(filePath)) {
      try {
        backups[file] = readFileSync(filePath, 'utf-8');
      } catch { }
    }
  }

  return backups;
}

/**
 * Restore user files after upgrade
 */
function restoreUserFiles(targetDir, backups) {
  for (const [file, content] of Object.entries(backups)) {
    const filePath = join(targetDir, 'proagents', file);
    try {
      // Ensure directory exists
      mkdirSync(dirname(filePath), { recursive: true });
      writeFileSync(filePath, content);
    } catch (error) {
      console.log(chalk.yellow(`  ⚠ Could not restore ${file}: ${error.message}`));
    }
  }
}

/**
 * Get current installed version
 */
function getCurrentVersion(targetDir) {
  // Try to read version from a marker file or package
  const markerPath = join(targetDir, 'proagents', '.version');
  if (existsSync(markerPath)) {
    try {
      return readFileSync(markerPath, 'utf-8').trim();
    } catch { }
  }
  return 'unknown';
}

/**
 * Get package version
 */
function getPackageVersion() {
  try {
    const packagePath = join(__dirname, '..', '..', 'package.json');
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
    return packageJson.version;
  } catch {
    return 'unknown';
  }
}

/**
 * Upgrade command - upgrade proagents folder to latest version
 */
export async function upgradeCommand(options = {}) {
  const targetDir = process.cwd();
  const proagentsDir = join(targetDir, 'proagents');
  const sourceDir = join(__dirname, '..', '..', 'proagents');

  console.log(chalk.bold('\nProAgents Upgrade'));
  console.log(chalk.gray('=================\n'));

  // Check if proagents folder exists
  if (!existsSync(proagentsDir)) {
    console.log(chalk.red('Error: ProAgents not found in this project.'));
    console.log(chalk.gray('Run `npx proagents init` to initialize.\n'));
    return;
  }

  const currentVersion = getCurrentVersion(targetDir);
  const packageVersion = getPackageVersion();

  console.log(`Current version: ${chalk.yellow(currentVersion)}`);
  console.log(`Package version: ${chalk.green(packageVersion)}`);
  console.log('');

  // Confirm upgrade unless --force
  if (!options.force) {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const answer = await new Promise(resolve => {
      rl.question(chalk.yellow('Upgrade proagents folder? (y/N) '), resolve);
    });
    rl.close();

    if (answer.toLowerCase() !== 'y') {
      console.log(chalk.gray('\nUpgrade cancelled.\n'));
      return;
    }
  }

  console.log('');

  // Step 1: Backup user files
  console.log(chalk.cyan('Backing up user files...'));
  const backups = backupUserFiles(targetDir);
  const backedUpCount = Object.keys(backups).length;
  console.log(chalk.gray(`  Backed up ${backedUpCount} file(s)`));

  // Step 2: Remove old proagents folder (except active-features)
  console.log(chalk.cyan('Removing old files...'));
  try {
    // We'll do a selective removal to preserve active-features folder structure
    rmSync(proagentsDir, { recursive: true, force: true });
    console.log(chalk.gray('  Old proagents folder removed'));
  } catch (error) {
    console.log(chalk.yellow(`  ⚠ Could not remove old folder: ${error.message}`));
  }

  // Step 3: Copy new proagents folder
  console.log(chalk.cyan('Installing new version...'));
  try {
    cpSync(sourceDir, proagentsDir, { recursive: true });
    console.log(chalk.gray('  New proagents folder installed'));
  } catch (error) {
    console.log(chalk.red(`  ✗ Error: ${error.message}`));
    return;
  }

  // Step 4: Restore user files
  console.log(chalk.cyan('Restoring user files...'));
  restoreUserFiles(targetDir, backups);
  console.log(chalk.gray(`  Restored ${backedUpCount} file(s)`));

  // Step 5: Write version marker
  try {
    writeFileSync(join(proagentsDir, '.version'), packageVersion);
  } catch { }

  // Summary
  console.log(chalk.bold('\nUpgrade Complete'));
  console.log(chalk.gray('─'.repeat(40)));
  console.log(chalk.green(`  ✓ Upgraded to v${packageVersion}`));
  console.log('');

  console.log(chalk.bold('Preserved files:'));
  for (const file of Object.keys(backups)) {
    console.log(chalk.gray(`  • ${file}`));
  }
  console.log('');

  console.log(chalk.gray('Run `npx proagents doctor` to verify installation.\n'));
}
