import { existsSync, rmSync, readFileSync, writeFileSync, readdirSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { createInterface } from 'readline';
import chalk from 'chalk';

// AI instruction files that may have been copied to project root
const AI_FILES = [
  'CLAUDE.md',
  '.cursorrules',
  '.windsurfrules',
  'GEMINI.md',
  'CHATGPT.md',
  'KIRO.md',
  'REPLIT.md',
  'BOLT.md',
  'LOVABLE.md',
  'GROQ.md',
  'ANTIGRAVITY.md',
  'AI_INSTRUCTIONS.md',
];

// ProAgents markers used in merged files
const PROAGENTS_START = '<!-- PROAGENTS:START -->';
const PROAGENTS_END = '<!-- PROAGENTS:END -->';

// User data folders to export
const USER_DATA_FOLDERS = ['changelog', 'worklog', 'active-features'];
const USER_DATA_FILES = ['proagents.config.yaml', 'activity.log', 'handoff.md'];

/**
 * Recursively read all files in a directory
 */
function readDirRecursive(dir, baseDir = dir) {
  const files = {};

  if (!existsSync(dir)) return files;

  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      const relativePath = fullPath.replace(baseDir + '/', '');

      if (entry.isDirectory()) {
        Object.assign(files, readDirRecursive(fullPath, baseDir));
      } else {
        try {
          files[relativePath] = readFileSync(fullPath, 'utf-8');
        } catch {
          // Skip unreadable files (binary, permissions, etc.)
        }
      }
    }
  } catch {
    // Directory read failed - return what we have
  }

  return files;
}

/**
 * Export user data to a backup file
 */
function exportUserData(proagentsDir, targetDir) {
  const backup = {
    exportedAt: new Date().toISOString(),
    version: '1.0',
    files: {},
    folders: {}
  };

  // Export individual files
  for (const file of USER_DATA_FILES) {
    const filePath = join(proagentsDir, file);
    if (existsSync(filePath)) {
      try {
        backup.files[file] = readFileSync(filePath, 'utf-8');
      } catch {
        // Skip unreadable files
      }
    }
  }

  // Export folders recursively
  for (const folder of USER_DATA_FOLDERS) {
    const folderPath = join(proagentsDir, folder);
    if (existsSync(folderPath)) {
      const folderFiles = readDirRecursive(folderPath, proagentsDir);
      Object.assign(backup.folders, folderFiles);
    }
  }

  // Generate backup filename with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupFileName = `proagents-backup-${timestamp}.json`;
  const backupPath = join(targetDir, backupFileName);

  // Write backup file
  writeFileSync(backupPath, JSON.stringify(backup, null, 2));

  return { backupPath, backupFileName, fileCount: Object.keys(backup.files).length + Object.keys(backup.folders).length };
}

/**
 * Remove only ProAgents section from a file, keep user's original content
 * Returns: 'deleted' (file removed), 'cleaned' (section removed), 'skipped' (no ProAgents section)
 */
function removeProagentsSectionFromFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');

    const startIndex = content.indexOf(PROAGENTS_START);
    const endIndex = content.indexOf(PROAGENTS_END);

    if (startIndex !== -1 && endIndex !== -1) {
      // Has ProAgents section - remove it, keep the rest
      const before = content.substring(0, startIndex).trim();
      const after = content.substring(endIndex + PROAGENTS_END.length).trim();
      const remaining = (before + '\n\n' + after).trim();

      if (remaining.length === 0) {
        // File only had ProAgents content - delete it
        rmSync(filePath, { force: true });
        return 'deleted';
      } else {
        // File has other content - keep it, remove only ProAgents section
        writeFileSync(filePath, remaining + '\n');
        return 'cleaned';
      }
    } else {
      // No ProAgents markers - file was created by ProAgents (not merged)
      // Check if it's a ProAgents-generated file by looking for ProAgents reference
      if (content.includes('proagents') || content.includes('ProAgents') || content.includes('.proagents/')) {
        rmSync(filePath, { force: true });
        return 'deleted';
      }
      return 'skipped';
    }
  } catch (error) {
    return 'skipped';
  }
}

/**
 * Command: proagents uninstall
 */
export async function uninstallCommand(options = {}) {
  const targetDir = process.cwd();
  const proagentsDir = join(targetDir, '.proagents');

  console.log('\n' + chalk.bold.red('ProAgents Uninstall'));
  console.log(chalk.red('===================\n'));

  // Check if ProAgents is installed
  if (!existsSync(proagentsDir)) {
    console.log(chalk.yellow('ProAgents is not installed in this project.\n'));
    return;
  }

  // Confirm unless --force is used
  if (!options.force) {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

    console.log(chalk.yellow('This will remove:'));
    console.log(chalk.gray('  • ./.proagents/ folder (including changelog, worklog, config)'));
    console.log(chalk.gray('  • ProAgents sections from AI files (keeps your original config)'));
    console.log(chalk.gray('  • ProAgents section from README.md\n'));

    // Offer to export user data first
    console.log(chalk.cyan('💾 Would you like to export your data before uninstalling?'));
    console.log(chalk.gray('   This saves changelog, worklog, config to a backup file.\n'));

    const exportAnswer = await question(chalk.yellow('Export data first? (y/N): '));

    if (exportAnswer.toLowerCase() === 'y' || exportAnswer.toLowerCase() === 'yes') {
      try {
        const result = exportUserData(proagentsDir, targetDir);
        console.log(chalk.green(`\n✓ Exported ${result.fileCount} files to ${result.backupFileName}`));
        console.log(chalk.gray(`  Location: ${result.backupPath}\n`));
      } catch (error) {
        console.log(chalk.yellow(`\n⚠️  Could not export data: ${error.message}\n`));
      }
    }

    const answer = await question(chalk.yellow('Proceed with uninstall? (yes/no): '));
    rl.close();

    if (answer.toLowerCase() !== 'yes' && answer.toLowerCase() !== 'y') {
      console.log(chalk.gray('\nUninstall cancelled.\n'));
      return;
    }
  }

  console.log('');

  // 1. Remove proagents folder
  if (existsSync(proagentsDir)) {
    rmSync(proagentsDir, { recursive: true, force: true });
    console.log(chalk.green('✓ Removed ./.proagents/ folder'));
  }

  // 2. Remove AI instruction files from project root (smart removal)
  let aiFilesRemoved = 0;
  let aiFilesCleaned = 0;

  for (const file of AI_FILES) {
    const filePath = join(targetDir, file);
    if (existsSync(filePath)) {
      const result = removeProagentsSectionFromFile(filePath);
      if (result === 'deleted') {
        aiFilesRemoved++;
      } else if (result === 'cleaned') {
        aiFilesCleaned++;
      }
    }
  }

  // Remove .github/copilot-instructions.md
  const copilotPath = join(targetDir, '.github', 'copilot-instructions.md');
  if (existsSync(copilotPath)) {
    const result = removeProagentsSectionFromFile(copilotPath);
    if (result === 'deleted') {
      aiFilesRemoved++;
    } else if (result === 'cleaned') {
      aiFilesCleaned++;
    }
  }

  if (aiFilesRemoved > 0) {
    console.log(chalk.green(`✓ Removed ${aiFilesRemoved} AI instruction file(s)`));
  }
  if (aiFilesCleaned > 0) {
    console.log(chalk.green(`✓ Cleaned ProAgents section from ${aiFilesCleaned} AI file(s) (kept original config)`));
  }

  // 3. Remove ProAgents section from README.md
  const readmePath = join(targetDir, 'README.md');
  if (existsSync(readmePath)) {
    try {
      let content = readFileSync(readmePath, 'utf-8');

      // Remove ProAgents section between markers
      const startMarker = '<!-- PROAGENTS:START';
      const endMarker = '<!-- PROAGENTS:END -->';

      const startIndex = content.indexOf(startMarker);
      const endIndex = content.indexOf(endMarker);

      if (startIndex !== -1 && endIndex !== -1) {
        const before = content.substring(0, startIndex).trimEnd();
        const after = content.substring(endIndex + endMarker.length).trimStart();
        content = before + (after ? '\n\n' + after : '');

        writeFileSync(readmePath, content);
        console.log(chalk.green('✓ Removed ProAgents section from README.md'));
      }
    } catch (error) {
      console.log(chalk.yellow('⚠️  Could not update README.md: ' + error.message));
    }
  }

  // 4. Remove docs files created by ProAgents (optional - only if empty)
  const docsDir = join(targetDir, 'docs');
  const releasesDir = join(docsDir, 'releases');
  const releasesReadme = join(releasesDir, 'README.md');

  // Only remove if it's the default ProAgents-generated file
  if (existsSync(releasesReadme)) {
    try {
      const content = readFileSync(releasesReadme, 'utf-8');
      if (content.includes('Generated by [ProAgents]')) {
        rmSync(releasesReadme, { force: true });
        // Try to remove empty directories
        try {
          rmSync(releasesDir, { recursive: false });
          rmSync(join(docsDir, 'api'), { recursive: false });
          rmSync(docsDir, { recursive: false });
          console.log(chalk.green('✓ Removed empty docs/ folder'));
        } catch {
          // Directory not empty, leave it
        }
      }
    } catch {
      // Ignore errors
    }
  }

  // 5. Check for CHANGELOG.md and RELEASE_NOTES.md
  const changelogPath = join(targetDir, 'CHANGELOG.md');
  const releaseNotesPath = join(targetDir, 'RELEASE_NOTES.md');

  if (existsSync(changelogPath)) {
    try {
      const content = readFileSync(changelogPath, 'utf-8');
      if (content.includes('Generated by [ProAgents]')) {
        rmSync(changelogPath, { force: true });
        console.log(chalk.green('✓ Removed CHANGELOG.md (ProAgents-generated)'));
      } else {
        console.log(chalk.gray('ℹ️  Kept CHANGELOG.md (has custom content)'));
      }
    } catch {
      // Ignore
    }
  }

  if (existsSync(releaseNotesPath)) {
    try {
      const content = readFileSync(releaseNotesPath, 'utf-8');
      if (content.includes('Generated by [ProAgents]')) {
        rmSync(releaseNotesPath, { force: true });
        console.log(chalk.green('✓ Removed RELEASE_NOTES.md (ProAgents-generated)'));
      } else {
        console.log(chalk.gray('ℹ️  Kept RELEASE_NOTES.md (has custom content)'));
      }
    } catch {
      // Ignore
    }
  }

  console.log(chalk.green('\n✓ ProAgents uninstalled from this project.\n'));

  console.log(chalk.gray('To uninstall the global CLI:'));
  console.log(chalk.cyan('  npm uninstall -g proagents\n'));
}
