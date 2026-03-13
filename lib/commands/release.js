import { existsSync, readFileSync, writeFileSync, appendFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { createInterface } from 'readline';
import chalk from 'chalk';

// JSON output flag (set by --json option)
let jsonOutput = false;
let jsonResult = {};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Release type configurations
const RELEASE_TYPES = {
  detailed: {
    name: 'Detailed Release',
    description: 'Full comprehensive notes with all sections (technical + business)',
    emoji: '📚'
  },
  short: {
    name: 'Short Release',
    description: 'Quick summary of key changes',
    emoji: '📝'
  },
  client: {
    name: 'Client Release',
    description: 'Business-focused, non-technical for stakeholders',
    emoji: '💼'
  },
  developer: {
    name: 'Developer Release',
    description: 'Technical details, code changes, breaking changes',
    emoji: '🔧'
  },
  hotfix: {
    name: 'Hotfix Release',
    description: 'Quick patch notes for urgent fixes',
    emoji: '🚑'
  },
  prerelease: {
    name: 'Pre-release (Beta/RC)',
    description: 'Beta or release candidate notes',
    emoji: '🧪'
  }
};

// Change categories
const CHANGE_CATEGORIES = {
  features: { name: 'Features', emoji: '✨', keywords: ['feat:', 'feature', 'add ', 'new ', 'implement'] },
  fixes: { name: 'Bug Fixes', emoji: '🐛', keywords: ['fix:', 'fix ', 'bug', 'resolve', 'patch'] },
  improvements: { name: 'Improvements', emoji: '⚡', keywords: ['improve', 'enhance', 'update', 'refactor', 'optimize'] },
  breaking: { name: 'Breaking Changes', emoji: '💥', keywords: ['breaking', 'break:'] },
  security: { name: 'Security', emoji: '🔒', keywords: ['security', 'vulnerability', 'cve', 'auth'] },
  docs: { name: 'Documentation', emoji: '📖', keywords: ['doc:', 'docs:', 'readme', 'documentation'] },
  deps: { name: 'Dependencies', emoji: '📦', keywords: ['deps:', 'dependency', 'upgrade ', 'downgrade'] },
  perf: { name: 'Performance', emoji: '🚀', keywords: ['perf:', 'performance', 'speed', 'faster'] },
  other: { name: 'Other', emoji: '📋', keywords: [] }
};

/**
 * Get git commits with various filters
 */
function getGitCommits(options = {}) {
  const { since, until, path, limit = 100 } = options;

  try {
    let command = 'git log';

    // Date or tag range
    if (since && until) {
      command += ` ${since}..${until}`;
    } else if (since) {
      command += ` ${since}..HEAD`;
    } else if (until) {
      command += ` HEAD..${until}`;
    } else {
      // Try to get since last tag
      try {
        const lastTag = execSync('git describe --tags --abbrev=0 2>/dev/null', { encoding: 'utf-8' }).trim();
        command += ` ${lastTag}..HEAD`;
        options.detectedSince = lastTag;
      } catch {
        command += ` -${limit}`;
        options.detectedSince = null;
      }
    }

    command += ' --oneline --no-merges';

    // Filter by path/module
    if (path) {
      command += ` -- ${path}`;
    }

    const commits = execSync(command, { encoding: 'utf-8' });
    return commits.trim();
  } catch {
    return '';
  }
}

/**
 * Get current version from package.json
 */
function getCurrentVersion(targetDir) {
  const packagePath = join(targetDir, 'package.json');
  if (existsSync(packagePath)) {
    try {
      const pkg = JSON.parse(readFileSync(packagePath, 'utf-8'));
      return pkg.version || 'unknown';
    } catch {
      // Package.json unreadable
    }
  }
  return 'unknown';
}

/**
 * Suggest version bump based on changes
 */
function suggestVersionBump(currentVersion, categories) {
  const [major, minor, patch] = currentVersion.split('.').map(Number);

  if (categories.breaking.length > 0) {
    return {
      type: 'major',
      reason: `${categories.breaking.length} breaking change(s)`,
      suggested: `${major + 1}.0.0`
    };
  }

  if (categories.features.length > 0) {
    return {
      type: 'minor',
      reason: `${categories.features.length} new feature(s)`,
      suggested: `${major}.${minor + 1}.0`
    };
  }

  return {
    type: 'patch',
    reason: `${categories.fixes.length} fix(es), ${categories.improvements.length} improvement(s)`,
    suggested: `${major}.${minor}.${patch + 1}`
  };
}

/**
 * Parse commits into categories
 */
function categorizeCommits(commitsText, options = {}) {
  const { include, exclude, module } = options;
  const lines = commitsText.split('\n').filter(line => line.trim());

  const categories = {
    features: [],
    fixes: [],
    improvements: [],
    breaking: [],
    security: [],
    docs: [],
    deps: [],
    perf: [],
    other: []
  };

  for (const line of lines) {
    const lower = line.toLowerCase();
    const message = line.replace(/^[a-f0-9]+ /, ''); // Remove hash

    // Module filter - check if commit message contains module name
    if (module && !lower.includes(module.toLowerCase())) {
      // Also check for common patterns like (module): or [module]
      const modulePatterns = [
        `(${module.toLowerCase()})`,
        `[${module.toLowerCase()}]`,
        `${module.toLowerCase()}:`
      ];
      if (!modulePatterns.some(p => lower.includes(p))) {
        continue; // Skip if module not mentioned
      }
    }

    // Categorize
    let categorized = false;
    for (const [category, config] of Object.entries(CHANGE_CATEGORIES)) {
      if (category === 'other') continue;

      if (config.keywords.some(kw => lower.includes(kw))) {
        categories[category].push(message);
        categorized = true;
        break;
      }
    }

    if (!categorized) {
      categories.other.push(message);
    }
  }

  // Apply include/exclude filters
  if (include && include.length > 0) {
    const validCategories = include.map(i => i.toLowerCase());
    for (const category of Object.keys(categories)) {
      if (!validCategories.includes(category)) {
        categories[category] = [];
      }
    }
  }

  if (exclude && exclude.length > 0) {
    const excludeCategories = exclude.map(e => e.toLowerCase());
    for (const category of excludeCategories) {
      if (categories[category]) {
        categories[category] = [];
      }
    }
  }

  return categories;
}

/**
 * Generate DETAILED release notes
 */
function generateDetailedNotes(version, categories, since, options = {}) {
  const date = new Date().toISOString().split('T')[0];
  const totalChanges = Object.values(categories).flat().length;

  let notes = `# Release Notes v${version}

**Release Date:** ${date}
**Previous Version:** ${since || 'Initial Release'}
${options.prerelease ? `**Status:** ${options.prerelease.toUpperCase()}\n` : ''}
---

## Overview

This release includes ${totalChanges} changes: ${categories.features.length} new features, ${categories.fixes.length} bug fixes, and ${categories.improvements.length} improvements.

---

## What's New

`;

  // Add each non-empty category
  const categoryOrder = ['breaking', 'security', 'features', 'fixes', 'improvements', 'perf', 'deps', 'docs', 'other'];

  for (const category of categoryOrder) {
    if (categories[category] && categories[category].length > 0) {
      const config = CHANGE_CATEGORIES[category];
      notes += `### ${config.emoji} ${config.name}\n\n`;
      notes += categories[category].map(c => `- ${c}`).join('\n');
      notes += '\n\n';
    }
  }

  notes += `---

## Upgrade Instructions

\`\`\`bash
npm update proagents
# or
npx proagents init
\`\`\`

## Full Changelog

See all changes: [GitHub Commits](../../commits/main)

---

*Generated by ProAgents v${getCurrentVersion(process.cwd())}*
`;

  return notes;
}

/**
 * Generate SHORT release notes
 */
function generateShortNotes(version, categories, since, options = {}) {
  const date = new Date().toISOString().split('T')[0];
  const totalChanges = Object.values(categories).flat().length;

  let notes = `# v${version} Release Notes${options.prerelease ? ` (${options.prerelease})` : ''}

**Date:** ${date} | **Changes:** ${totalChanges}

`;

  if (categories.breaking.length > 0) {
    notes += `**⚠️ Breaking:** ${categories.breaking.length} changes\n`;
  }

  const summary = [];
  if (categories.features.length > 0) summary.push(`Features: ${categories.features.length}`);
  if (categories.fixes.length > 0) summary.push(`Fixes: ${categories.fixes.length}`);
  if (categories.improvements.length > 0) summary.push(`Improvements: ${categories.improvements.length}`);
  if (categories.security.length > 0) summary.push(`Security: ${categories.security.length}`);

  notes += `**${summary.join(' | ')}**\n\n`;

  // Show top highlights
  const highlights = [
    ...categories.breaking.slice(0, 2),
    ...categories.security.slice(0, 1),
    ...categories.features.slice(0, 2),
    ...categories.fixes.slice(0, 1)
  ].slice(0, 5);

  if (highlights.length > 0) {
    notes += `## Highlights\n\n`;
    notes += highlights.map(c => `- ${c}`).join('\n');
    notes += '\n\n';
  }

  notes += `---\n*Run \`proagents release --type detailed\` for full notes*\n`;

  return notes;
}

/**
 * Generate CLIENT release notes (non-technical)
 */
function generateClientNotes(version, categories, since, options = {}) {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  let notes = `# Product Update - Version ${version}${options.prerelease ? ` (${options.prerelease})` : ''}

**Release Date:** ${date}

---

## What's New for You

`;

  if (categories.features.length > 0) {
    notes += `### ✨ New Capabilities\n\n`;
    notes += `We've added ${categories.features.length} new features to improve your experience:\n\n`;
    categories.features.forEach(f => {
      const friendly = f
        .replace(/^feat(\(.*?\))?:?\s*/i, '')
        .replace(/^add\s+/i, 'Added ')
        .replace(/^implement\s+/i, 'New ');
      notes += `- ${friendly}\n`;
    });
    notes += '\n';
  }

  if (categories.fixes.length > 0) {
    notes += `### 🔧 Resolved Issues\n\n`;
    notes += `We've fixed ${categories.fixes.length} issues to make things work better:\n\n`;
    categories.fixes.slice(0, 5).forEach(f => {
      const friendly = f
        .replace(/^fix(\(.*?\))?:?\s*/i, '')
        .replace(/^bug:?\s*/i, '');
      notes += `- ${friendly}\n`;
    });
    if (categories.fixes.length > 5) {
      notes += `- And ${categories.fixes.length - 5} more fixes\n`;
    }
    notes += '\n';
  }

  if (categories.improvements.length > 0) {
    notes += `### ⚡ Better Experience\n\n`;
    categories.improvements.slice(0, 3).forEach(i => {
      const friendly = i
        .replace(/^(improve|enhance|update|refactor)(\(.*?\))?:?\s*/i, 'Improved ');
      notes += `- ${friendly}\n`;
    });
    notes += '\n';
  }

  if (categories.security.length > 0) {
    notes += `### 🔒 Security Updates\n\n`;
    notes += `We've strengthened security with ${categories.security.length} update(s).\n\n`;
  }

  if (categories.breaking.length > 0) {
    notes += `### ⚠️ Important Notice\n\n`;
    notes += `This update includes some changes that may require your attention. Please review the upgrade guide or contact support if you have questions.\n\n`;
  }

  notes += `---

## How to Update

Your system will be automatically updated, or you can manually update by following the standard upgrade process.

## Questions?

Contact our support team if you have any questions about this release.

---

*Thank you for being a valued user!*
`;

  return notes;
}

/**
 * Generate DEVELOPER release notes
 */
function generateDeveloperNotes(version, categories, since, options = {}) {
  const date = new Date().toISOString().split('T')[0];

  let notes = `# Developer Release Notes - v${version}${options.prerelease ? `-${options.prerelease}` : ''}

**Released:** ${date}
**Diff:** ${since ? `${since}...v${version}` : 'See commits'}
${options.module ? `**Module:** ${options.module}\n` : ''}
---

## TL;DR

`;

  const summary = [];
  if (categories.breaking.length > 0) summary.push(`${categories.breaking.length} BREAKING`);
  if (categories.security.length > 0) summary.push(`${categories.security.length} security`);
  if (categories.features.length > 0) summary.push(`${categories.features.length} features`);
  if (categories.fixes.length > 0) summary.push(`${categories.fixes.length} fixes`);
  if (categories.improvements.length > 0) summary.push(`${categories.improvements.length} improvements`);
  if (categories.perf.length > 0) summary.push(`${categories.perf.length} perf`);

  notes += `\`${summary.join(' | ') || 'No changes'}\`\n\n`;

  // Add each non-empty category
  const categoryOrder = ['breaking', 'security', 'features', 'fixes', 'improvements', 'perf', 'deps', 'docs', 'other'];

  for (const category of categoryOrder) {
    if (categories[category] && categories[category].length > 0) {
      const config = CHANGE_CATEGORIES[category];
      notes += `## ${config.emoji} ${config.name}\n\n`;
      notes += categories[category].map(c => `- ${c}`).join('\n');
      notes += '\n\n';
    }
  }

  if (categories.breaking.length > 0) {
    notes += `### Migration Guide\n\n`;
    notes += `Review breaking changes above and update your code accordingly.\n\n`;
  }

  notes += `---

## Technical Details

\`\`\`bash
# Update
npm update proagents

# Verify
npx proagents version
npx proagents doctor
\`\`\`

## API Changes

${categories.breaking.length > 0 ? 'See breaking changes above.' : 'No API changes in this release.'}

## Dependencies

Run \`npm audit\` to check for security updates.

---

*Generated by ProAgents CLI*
`;

  return notes;
}

/**
 * Generate HOTFIX release notes
 */
function generateHotfixNotes(version, categories, since, options = {}) {
  const date = new Date().toISOString();
  const timestamp = date.replace('T', ' ').slice(0, 19);

  let notes = `# 🚑 HOTFIX v${version}

**Released:** ${timestamp} UTC
**Urgency:** ${options.urgency || 'High'}

---

## Critical Fixes

`;

  // Prioritize security and fixes
  if (categories.security.length > 0) {
    notes += `### 🔒 Security Patches\n\n`;
    notes += categories.security.map(c => `- **SECURITY:** ${c}`).join('\n');
    notes += '\n\n';
  }

  if (categories.fixes.length > 0) {
    notes += `### 🐛 Bug Fixes\n\n`;
    notes += categories.fixes.map(c => `- ${c}`).join('\n');
    notes += '\n\n';
  }

  if (categories.breaking.length > 0) {
    notes += `### ⚠️ Breaking Changes\n\n`;
    notes += categories.breaking.map(c => `- **BREAKING:** ${c}`).join('\n');
    notes += '\n\n';
  }

  notes += `---

## Immediate Action Required

\`\`\`bash
# Update immediately
npm update proagents

# Verify fix applied
npx proagents version
\`\`\`

## Rollback (if needed)

\`\`\`bash
npm install proagents@${since || 'previous-version'}
\`\`\`

---

*This is a hotfix release. For full release notes, see the next scheduled release.*
`;

  return notes;
}

/**
 * Generate PRE-RELEASE notes (Beta/RC)
 */
function generatePrereleaseNotes(version, categories, since, options = {}) {
  const date = new Date().toISOString().split('T')[0];
  const stage = options.prerelease || 'beta';

  let notes = `# 🧪 Pre-release v${version}-${stage}

**Date:** ${date}
**Stage:** ${stage.toUpperCase()}
**Status:** Testing / Not for production

---

## ⚠️ Pre-release Notice

This is a **${stage}** release. It may contain bugs and is not recommended for production use.

**Please report issues:** [GitHub Issues](../../issues)

---

## Changes in this ${stage}

`;

  const categoryOrder = ['breaking', 'features', 'fixes', 'improvements', 'other'];

  for (const category of categoryOrder) {
    if (categories[category] && categories[category].length > 0) {
      const config = CHANGE_CATEGORIES[category];
      notes += `### ${config.emoji} ${config.name}\n\n`;
      notes += categories[category].map(c => `- ${c}`).join('\n');
      notes += '\n\n';
    }
  }

  notes += `---

## Testing Instructions

\`\`\`bash
# Install pre-release
npm install proagents@${version}-${stage}

# Test features
npx proagents doctor
\`\`\`

## Known Issues

- [ ] List any known issues here

## Feedback

Please test and provide feedback before the stable release.

---

*This is a pre-release version. Use at your own risk.*
`;

  return notes;
}

/**
 * Interactive release type selection
 */
async function selectReleaseType() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

  console.log(chalk.bold('\nSelect Release Note Type:\n'));

  const types = Object.entries(RELEASE_TYPES);
  types.forEach(([key, value], index) => {
    console.log(chalk.cyan(`  ${index + 1}. ${value.emoji} ${value.name}`));
    console.log(chalk.gray(`     ${value.description}`));
  });
  console.log('');

  const answer = await question(chalk.yellow('Enter choice (1-6): '));
  rl.close();

  const index = parseInt(answer) - 1;
  if (index >= 0 && index < types.length) {
    return types[index][0];
  }

  console.log(chalk.yellow('\nInvalid choice, defaulting to detailed release notes.'));
  return 'detailed';
}

/**
 * Interactive filter selection
 */
async function selectFilters() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

  console.log(chalk.bold('\nFilter Changes (optional):\n'));

  const categories = ['features', 'fixes', 'improvements', 'security', 'breaking', 'docs', 'deps', 'perf'];
  categories.forEach((cat, i) => {
    const config = CHANGE_CATEGORIES[cat];
    console.log(chalk.cyan(`  ${i + 1}. ${config.emoji} ${config.name}`));
  });
  console.log(chalk.gray('  0. All changes (no filter)'));
  console.log('');

  const answer = await question(chalk.yellow('Include only (comma-separated, e.g., 1,2): '));
  rl.close();

  if (!answer || answer === '0') {
    return null;
  }

  const indices = answer.split(',').map(s => parseInt(s.trim()) - 1);
  const selected = indices
    .filter(i => i >= 0 && i < categories.length)
    .map(i => categories[i]);

  return selected.length > 0 ? selected : null;
}

/**
 * Append to existing release notes file
 */
function appendToExistingNotes(existingPath, newNotes, version) {
  if (!existsSync(existingPath)) {
    writeFileSync(existingPath, newNotes);
    return { created: true };
  }

  const existingContent = readFileSync(existingPath, 'utf-8');

  // Add separator and append
  const separator = `\n\n---\n\n## Additional Changes (v${version})\n\n`;
  const appendContent = newNotes
    .replace(/^#.*?\n/, '') // Remove first heading
    .replace(/\*Generated by.*?\*\n?$/, ''); // Remove footer

  const updatedContent = existingContent.trimEnd() + separator + appendContent + `\n\n*Updated: ${new Date().toISOString()}*\n`;

  writeFileSync(existingPath, updatedContent);
  return { appended: true };
}

/**
 * Update CHANGELOG.md with release notes
 */
function updateChangelog(targetDir, version, categories, since) {
  const changelogPath = join(targetDir, 'CHANGELOG.md');
  const date = new Date().toISOString().split('T')[0];

  // Generate changelog entry
  let entry = `## [${version}] - ${date}\n\n`;

  const categoryOrder = ['breaking', 'security', 'features', 'fixes', 'improvements', 'perf', 'deps', 'docs'];
  const categoryLabels = {
    breaking: 'BREAKING CHANGES',
    security: 'Security',
    features: 'Added',
    fixes: 'Fixed',
    improvements: 'Changed',
    perf: 'Performance',
    deps: 'Dependencies',
    docs: 'Documentation'
  };

  for (const category of categoryOrder) {
    if (categories[category] && categories[category].length > 0) {
      entry += `### ${categoryLabels[category]}\n\n`;
      entry += categories[category].map(c => `- ${c}`).join('\n');
      entry += '\n\n';
    }
  }

  // Create or update CHANGELOG.md
  if (existsSync(changelogPath)) {
    const existing = readFileSync(changelogPath, 'utf-8');

    // Find insertion point (after header, before first version)
    const headerMatch = existing.match(/^# Changelog.*?\n\n/s);
    if (headerMatch) {
      const header = headerMatch[0];
      const rest = existing.slice(header.length);
      const updated = header + entry + rest;
      writeFileSync(changelogPath, updated);
    } else {
      // No header found, prepend
      writeFileSync(changelogPath, `# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n${entry}${existing}`);
    }
  } else {
    // Create new CHANGELOG.md
    const content = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

${entry}`;
    writeFileSync(changelogPath, content);
  }

  return { path: changelogPath, version };
}

/**
 * Create git tag for release
 */
function createGitTag(version, message) {
  const tagName = version.startsWith('v') ? version : `v${version}`;

  try {
    // Check if tag already exists
    try {
      execSync(`git rev-parse ${tagName}`, { encoding: 'utf-8', stdio: 'pipe' });
      return { error: `Tag ${tagName} already exists` };
    } catch {
      // Tag doesn't exist, good to create
    }

    // Create annotated tag
    const tagMessage = message || `Release ${tagName}`;
    execSync(`git tag -a ${tagName} -m "${tagMessage}"`, { encoding: 'utf-8' });

    return { success: true, tag: tagName };
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Generate compact changelog entry for --changelog option
 */
function generateChangelogEntry(version, categories) {
  const date = new Date().toISOString().split('T')[0];
  let entry = `\n## [${version}] - ${date}\n`;

  if (categories.breaking.length > 0) {
    entry += `\n### BREAKING CHANGES\n${categories.breaking.map(c => `- ${c}`).join('\n')}\n`;
  }
  if (categories.features.length > 0) {
    entry += `\n### Added\n${categories.features.map(c => `- ${c}`).join('\n')}\n`;
  }
  if (categories.fixes.length > 0) {
    entry += `\n### Fixed\n${categories.fixes.map(c => `- ${c}`).join('\n')}\n`;
  }
  if (categories.improvements.length > 0) {
    entry += `\n### Changed\n${categories.improvements.map(c => `- ${c}`).join('\n')}\n`;
  }
  if (categories.security.length > 0) {
    entry += `\n### Security\n${categories.security.map(c => `- ${c}`).join('\n')}\n`;
  }

  return entry;
}

/**
 * Release command - generate release notes
 */
export async function releaseCommand(options = {}) {
  const targetDir = process.cwd();

  console.log(chalk.bold('\nProAgents Release Notes Generator'));
  console.log(chalk.gray('==================================\n'));

  // Get version
  const currentVersion = getCurrentVersion(targetDir);
  let version = options.version || currentVersion;
  console.log(`Current Version: ${chalk.cyan('v' + currentVersion)}`);

  // Get commits with filters
  const commitOptions = {
    since: options.since,
    until: options.until,
    path: options.path,
    limit: options.limit || 100
  };

  const commits = getGitCommits(commitOptions);
  const detectedSince = commitOptions.detectedSince;

  if (!commits) {
    console.log(chalk.yellow('\nNo commits found. Make sure you are in a git repository.'));
    return;
  }

  const commitCount = commits.split('\n').filter(l => l.trim()).length;
  console.log(`Commits: ${chalk.cyan(commitCount)} ${detectedSince ? `since ${detectedSince}` : ''}`);

  if (options.path) {
    console.log(`Path filter: ${chalk.cyan(options.path)}`);
  }
  if (options.module) {
    console.log(`Module filter: ${chalk.cyan(options.module)}`);
  }

  // Select release type
  let releaseType = options.type;
  if (!releaseType) {
    releaseType = await selectReleaseType();
  }

  // Select filters if interactive
  let includeFilter = options.include ? options.include.split(',') : null;
  let excludeFilter = options.exclude ? options.exclude.split(',') : null;

  if (!includeFilter && !excludeFilter && options.interactive) {
    includeFilter = await selectFilters();
  }

  console.log(chalk.cyan(`\nGenerating ${RELEASE_TYPES[releaseType].emoji} ${RELEASE_TYPES[releaseType].name}...`));

  // Categorize commits
  const categories = categorizeCommits(commits, {
    include: includeFilter,
    exclude: excludeFilter,
    module: options.module
  });

  // Show version bump suggestion
  if (options.bump) {
    const suggestion = suggestVersionBump(currentVersion, categories);
    console.log(chalk.bold('\nVersion Bump Suggestion:'));
    console.log(`  Type: ${chalk.yellow(suggestion.type.toUpperCase())}`);
    console.log(`  Reason: ${chalk.gray(suggestion.reason)}`);
    console.log(`  Suggested: ${chalk.green('v' + suggestion.suggested)}`);

    if (!options.version) {
      version = suggestion.suggested;
      console.log(chalk.cyan(`\nUsing suggested version: v${version}`));
    }
  }

  // Generate notes based on type
  const genOptions = {
    prerelease: options.prerelease,
    module: options.module,
    urgency: options.urgency
  };

  let notes;
  switch (releaseType) {
    case 'detailed':
      notes = generateDetailedNotes(version, categories, detectedSince, genOptions);
      break;
    case 'short':
      notes = generateShortNotes(version, categories, detectedSince, genOptions);
      break;
    case 'client':
      notes = generateClientNotes(version, categories, detectedSince, genOptions);
      break;
    case 'developer':
      notes = generateDeveloperNotes(version, categories, detectedSince, genOptions);
      break;
    case 'hotfix':
      notes = generateHotfixNotes(version, categories, detectedSince, genOptions);
      break;
    case 'prerelease':
      notes = generatePrereleaseNotes(version, categories, detectedSince, genOptions);
      break;
    default:
      notes = generateDetailedNotes(version, categories, detectedSince, genOptions);
  }

  // Output options
  if (options.output) {
    const outputPath = typeof options.output === 'string'
      ? options.output
      : join(targetDir, `RELEASE_NOTES_v${version}.md`);

    if (options.append && existsSync(outputPath)) {
      const result = appendToExistingNotes(outputPath, notes, version);
      console.log(chalk.green(`\n${RELEASE_TYPES[releaseType].emoji} Release notes appended to: ${outputPath}`));
    } else {
      writeFileSync(outputPath, notes);
      console.log(chalk.green(`\n${RELEASE_TYPES[releaseType].emoji} Release notes saved to: ${outputPath}`));
    }
  } else {
    console.log(chalk.gray('\n' + '─'.repeat(50) + '\n'));
    console.log(notes);
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.gray('\nTip: Use --output to save to file'));
  }

  // Update CHANGELOG.md if requested
  if (options.changelog) {
    const changelogResult = updateChangelog(targetDir, version, categories, detectedSince);
    if (!options.json) {
      console.log(chalk.green(`\n📋 CHANGELOG.md updated with v${version}`));
    }
    if (options.json) {
      jsonResult.changelog = changelogResult;
    }
  }

  // Create git tag if requested
  if (options.tag) {
    const tagMessage = options.tagMessage || `Release v${version}`;
    const tagResult = createGitTag(version, tagMessage);

    if (!options.json) {
      if (tagResult.success) {
        console.log(chalk.green(`\n🏷️  Created git tag: ${tagResult.tag}`));
      } else {
        console.log(chalk.yellow(`\n⚠️  Tag creation failed: ${tagResult.error}`));
      }
    }
    if (options.json) {
      jsonResult.tag = tagResult;
    }
  }

  // Summary
  const summaryItems = [
    { label: 'Features', count: categories.features.length, color: chalk.green },
    { label: 'Fixes', count: categories.fixes.length, color: chalk.blue },
    { label: 'Improvements', count: categories.improvements.length, color: chalk.cyan },
    { label: 'Security', count: categories.security.length, color: chalk.yellow },
    { label: 'Breaking', count: categories.breaking.length, color: chalk.red },
    { label: 'Performance', count: categories.perf.length, color: chalk.magenta },
    { label: 'Docs', count: categories.docs.length, color: chalk.gray },
    { label: 'Dependencies', count: categories.deps.length, color: chalk.white }
  ];

  // JSON output mode
  if (options.json) {
    jsonResult.version = version;
    jsonResult.releaseType = releaseType;
    jsonResult.categories = {};
    for (const item of summaryItems) {
      if (item.count > 0) {
        jsonResult.categories[item.label.toLowerCase()] = item.count;
      }
    }
    jsonResult.notes = notes;
    console.log(JSON.stringify(jsonResult, null, 2));
    return;
  }

  console.log(chalk.bold('\nSummary:'));
  for (const item of summaryItems) {
    if (item.count > 0) {
      console.log(`  ${item.color(item.label + ':')} ${item.count}`);
    }
  }
  console.log('');
}
