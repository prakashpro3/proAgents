import { existsSync, renameSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';
import { createInterface } from 'readline';

/**
 * Migrate from proagents/ to .proagents/
 */
export async function migrateCommand(options = {}) {
  const targetDir = process.cwd();
  const oldDir = join(targetDir, 'proagents');
  const newDir = join(targetDir, '.proagents');

  console.log(chalk.bold('\nProAgents Migration'));
  console.log(chalk.gray('==================\n'));

  // Check if migration is needed
  const hasOldDir = existsSync(oldDir);
  const hasNewDir = existsSync(newDir);

  if (!hasOldDir && hasNewDir) {
    console.log(chalk.green('✓ Already using .proagents/ folder. No migration needed.\n'));
    return;
  }

  if (!hasOldDir && !hasNewDir) {
    console.log(chalk.yellow('⚠ No proagents folder found. Run `npx proagents init` to get started.\n'));
    return;
  }

  if (hasOldDir && hasNewDir) {
    console.log(chalk.red('✗ Both proagents/ and .proagents/ folders exist.'));
    console.log(chalk.gray('  Please manually remove one before migrating.\n'));
    return;
  }

  // Migration needed
  console.log(chalk.cyan('Migration detected: proagents/ → .proagents/\n'));
  console.log(chalk.gray('This will:'));
  console.log(chalk.gray('  1. Rename proagents/ to .proagents/'));
  console.log(chalk.gray('  2. Update references in README.md'));
  console.log(chalk.gray('  3. Keep all your customizations intact\n'));

  // Confirm unless --force
  if (!options.force) {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const answer = await new Promise(resolve => {
      rl.question(chalk.yellow('Proceed with migration? (y/n): '), resolve);
    });
    rl.close();

    if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
      console.log(chalk.gray('\nMigration cancelled.\n'));
      return;
    }
  }

  try {
    // 1. Rename the folder
    console.log(chalk.gray('\nRenaming proagents/ to .proagents/...'));
    renameSync(oldDir, newDir);
    console.log(chalk.green('✓ Folder renamed'));

    // 2. Update README.md references
    const readmePath = join(targetDir, 'README.md');
    if (existsSync(readmePath)) {
      console.log(chalk.gray('Updating README.md references...'));
      let content = readFileSync(readmePath, 'utf-8');
      content = content.replace(/\.\/proagents\//g, './.proagents/');
      content = content.replace(/`proagents\//g, '`.proagents/');
      writeFileSync(readmePath, content);
      console.log(chalk.green('✓ README.md updated'));
    }

    // 3. Update any AI instruction files
    const aiFiles = ['CLAUDE.md', '.cursorrules', 'CHATGPT.md', 'GEMINI.md'];
    for (const file of aiFiles) {
      const filePath = join(targetDir, file);
      if (existsSync(filePath)) {
        let content = readFileSync(filePath, 'utf-8');
        if (content.includes('./proagents/') || content.includes('`proagents/')) {
          content = content.replace(/\.\/proagents\//g, './.proagents/');
          content = content.replace(/`proagents\//g, '`.proagents/');
          writeFileSync(filePath, content);
          console.log(chalk.green(`✓ ${file} updated`));
        }
      }
    }

    console.log(chalk.green('\n✓ Migration complete!\n'));
    console.log(chalk.gray('Your project now uses the new .proagents/ folder structure.'));
    console.log(chalk.gray('This follows the convention of .github/, .vscode/, .claude/, etc.\n'));

  } catch (error) {
    console.error(chalk.red('\n✗ Migration failed:'));
    console.error(chalk.red(error.message));
    console.log(chalk.gray('\nYou can manually rename the folder:'));
    console.log(chalk.cyan('  mv proagents .proagents\n'));
  }
}
