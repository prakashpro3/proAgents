import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { createInterface } from 'readline';
import chalk from 'chalk';

/**
 * Restore ProAgents data from backup file
 */
export async function restoreCommand(backupFile, options = {}) {
  const targetDir = process.cwd();
  const proagentsDir = join(targetDir, '.proagents');

  console.log(chalk.bold('\nProAgents Restore'));
  console.log(chalk.gray('=================\n'));

  // Check if backup file exists
  if (!backupFile) {
    console.log(chalk.red('Error: Please provide a backup file path.'));
    console.log(chalk.gray('\nUsage: proagents restore <backup-file.json>'));
    console.log(chalk.gray('Example: proagents restore proagents-backup-2024-01-15.json\n'));
    return;
  }

  const backupPath = backupFile.startsWith('/') ? backupFile : join(targetDir, backupFile);

  if (!existsSync(backupPath)) {
    console.log(chalk.red(`Error: Backup file not found: ${backupPath}`));
    return;
  }

  // Read backup file
  let backup;
  try {
    const content = readFileSync(backupPath, 'utf-8');
    backup = JSON.parse(content);
  } catch (error) {
    console.log(chalk.red(`Error: Could not parse backup file: ${error.message}`));
    return;
  }

  // Validate backup structure
  if (!backup.exportedAt || !backup.version) {
    console.log(chalk.red('Error: Invalid backup file format.'));
    return;
  }

  console.log(chalk.cyan('Backup Information:'));
  console.log(`  Exported: ${chalk.white(backup.exportedAt)}`);
  console.log(`  Version: ${chalk.white(backup.version)}`);

  const fileCount = Object.keys(backup.files || {}).length;
  const folderCount = Object.keys(backup.folders || {}).length;
  console.log(`  Files: ${chalk.white(fileCount)}`);
  console.log(`  Folder items: ${chalk.white(folderCount)}`);
  console.log('');

  // Confirm restore unless --force
  if (!options.force) {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const answer = await new Promise(resolve => {
      rl.question(chalk.yellow('Restore this backup? This will overwrite existing files. (y/N) '), resolve);
    });
    rl.close();

    if (answer.toLowerCase() !== 'y') {
      console.log(chalk.gray('\nRestore cancelled.\n'));
      return;
    }
  }

  console.log('');

  // Ensure .proagents directory exists
  if (!existsSync(proagentsDir)) {
    mkdirSync(proagentsDir, { recursive: true });
    console.log(chalk.cyan('Created .proagents/ directory'));
  }

  let restoredCount = 0;
  let errorCount = 0;

  // Restore individual files
  if (backup.files) {
    for (const [file, content] of Object.entries(backup.files)) {
      const filePath = join(proagentsDir, file);
      try {
        // Ensure directory exists
        const fileDir = dirname(filePath);
        if (!existsSync(fileDir)) {
          mkdirSync(fileDir, { recursive: true });
        }
        writeFileSync(filePath, content);
        restoredCount++;
        if (!options.quiet) {
          console.log(chalk.green(`  ✓ ${file}`));
        }
      } catch (error) {
        errorCount++;
        console.log(chalk.red(`  ✗ ${file}: ${error.message}`));
      }
    }
  }

  // Restore folder items
  if (backup.folders) {
    for (const [file, content] of Object.entries(backup.folders)) {
      const filePath = join(proagentsDir, file);
      try {
        // Ensure directory exists
        const fileDir = dirname(filePath);
        if (!existsSync(fileDir)) {
          mkdirSync(fileDir, { recursive: true });
        }
        writeFileSync(filePath, content);
        restoredCount++;
        if (!options.quiet) {
          console.log(chalk.green(`  ✓ ${file}`));
        }
      } catch (error) {
        errorCount++;
        console.log(chalk.red(`  ✗ ${file}: ${error.message}`));
      }
    }
  }

  // Summary
  console.log(chalk.bold('\nRestore Complete'));
  console.log(chalk.gray('─'.repeat(40)));
  console.log(chalk.green(`  ✓ Restored: ${restoredCount} files`));
  if (errorCount > 0) {
    console.log(chalk.red(`  ✗ Errors: ${errorCount} files`));
  }
  console.log('');

  // JSON output
  if (options.json) {
    console.log(JSON.stringify({
      success: true,
      restored: restoredCount,
      errors: errorCount,
      backupDate: backup.exportedAt
    }, null, 2));
  }

  console.log(chalk.gray('Run `npx proagents doctor` to verify installation.\n'));
}
