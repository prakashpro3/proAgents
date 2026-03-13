import chalk from 'chalk';

/**
 * Generate bash completion script
 */
function generateBashCompletion() {
  return `# ProAgents bash completion
# Add this to ~/.bashrc or ~/.bash_completion

_proagents_completions() {
    local cur prev opts commands subcommands
    COMPREPLY=()
    cur="\${COMP_WORDS[COMP_CWORD]}"
    prev="\${COMP_WORDS[COMP_CWORD-1]}"

    # Main commands
    commands="init feature fix status docs ai config uninstall commands doctor upgrade migrate version release stats restore changelog completion"

    # Subcommands for specific commands
    case "\${COMP_WORDS[1]}" in
        feature)
            subcommands="start status list complete"
            COMPREPLY=( \$(compgen -W "\${subcommands}" -- \${cur}) )
            return 0
            ;;
        ai)
            subcommands="add list remove"
            COMPREPLY=( \$(compgen -W "\${subcommands}" -- \${cur}) )
            return 0
            ;;
        config)
            subcommands="list show edit set get setup customize export import"
            COMPREPLY=( \$(compgen -W "\${subcommands}" -- \${cur}) )
            return 0
            ;;
        changelog)
            subcommands="view add list export feature module git"
            COMPREPLY=( \$(compgen -W "\${subcommands}" -- \${cur}) )
            return 0
            ;;
        release)
            if [[ \${cur} == -* ]]; then
                opts="-t --type -v --version -o --output -a --append -i --include -e --exclude -m --module -p --path --since --until --bump --prerelease --urgency --interactive --changelog --tag --tag-message --json"
                COMPREPLY=( \$(compgen -W "\${opts}" -- \${cur}) )
                return 0
            fi
            ;;
        completion)
            subcommands="bash zsh fish"
            COMPREPLY=( \$(compgen -W "\${subcommands}" -- \${cur}) )
            return 0
            ;;
    esac

    # Options for specific commands
    case "\${prev}" in
        -t|--type)
            COMPREPLY=( \$(compgen -W "detailed short client developer hotfix prerelease" -- \${cur}) )
            return 0
            ;;
        --prerelease)
            COMPREPLY=( \$(compgen -W "alpha beta rc" -- \${cur}) )
            return 0
            ;;
        --urgency)
            COMPREPLY=( \$(compgen -W "low medium high critical" -- \${cur}) )
            return 0
            ;;
        -i|--include|-e|--exclude)
            COMPREPLY=( \$(compgen -W "features fixes improvements security breaking docs deps perf" -- \${cur}) )
            return 0
            ;;
    esac

    # Complete file paths for specific arguments
    case "\${prev}" in
        restore|import)
            COMPREPLY=( \$(compgen -f -- \${cur}) )
            return 0
            ;;
        -o|--output)
            COMPREPLY=( \$(compgen -f -- \${cur}) )
            return 0
            ;;
    esac

    # Default to main commands
    if [[ \${COMP_CWORD} -eq 1 ]]; then
        COMPREPLY=( \$(compgen -W "\${commands}" -- \${cur}) )
    fi
}

complete -F _proagents_completions proagents
complete -F _proagents_completions pa
`;
}

/**
 * Generate zsh completion script
 */
function generateZshCompletion() {
  return `#compdef proagents pa

# ProAgents zsh completion
# Add this to ~/.zshrc or save to ~/.zsh/completions/_proagents

_proagents() {
    local -a commands subcommands options

    commands=(
        'init:Initialize ProAgents in the current project'
        'feature:Feature development commands'
        'fix:Quick bug fix mode'
        'status:Show ProAgents status in current project'
        'docs:Open ProAgents documentation'
        'ai:Manage AI platform instruction files'
        'config:Manage ProAgents configuration'
        'uninstall:Remove ProAgents from current project'
        'commands:Show all available commands with examples'
        'doctor:Check health of ProAgents installation'
        'upgrade:Upgrade .proagents folder to latest version'
        'migrate:Migrate from proagents/ to .proagents/ folder structure'
        'version:Show detailed version information'
        'release:Generate release notes with type selection'
        'stats:Show project and AI usage statistics'
        'restore:Restore ProAgents data from backup'
        'changelog:Manage project changelogs'
        'completion:Generate shell completion scripts'
    )

    _arguments -C \\
        '1: :->command' \\
        '*: :->args'

    case \$state in
        command)
            _describe 'command' commands
            ;;
        args)
            case \$words[2] in
                feature)
                    subcommands=(
                        'start:Start a new feature'
                        'status:Check current feature status'
                        'list:List all features'
                        'complete:Mark current feature as complete'
                    )
                    _describe 'subcommand' subcommands
                    ;;
                ai)
                    subcommands=(
                        'add:Add more AI platforms'
                        'list:List installed AI platforms'
                        'remove:Remove AI platforms from config'
                    )
                    _describe 'subcommand' subcommands
                    ;;
                config)
                    subcommands=(
                        'list:Show all configurable options'
                        'show:Show current config values'
                        'edit:Info on how to edit config'
                        'set:Set a config value'
                        'get:Get a config value'
                        'setup:Interactive configuration wizard'
                        'customize:Copy templates to create custom configurations'
                        'export:Export configuration for sharing or backup'
                        'import:Import configuration from export file'
                    )
                    _describe 'subcommand' subcommands
                    ;;
                changelog)
                    subcommands=(
                        'view:View recent changelog entries'
                        'add:Add a new changelog entry'
                        'list:List available changelogs'
                        'export:Export changelog to CHANGELOG.md'
                        'feature:View changelog for a specific feature'
                        'module:View changelog for a specific module'
                        'git:View git commit history as changelog'
                    )
                    _describe 'subcommand' subcommands
                    ;;
                completion)
                    subcommands=(
                        'bash:Generate bash completion script'
                        'zsh:Generate zsh completion script'
                        'fish:Generate fish completion script'
                    )
                    _describe 'subcommand' subcommands
                    ;;
                release)
                    options=(
                        '-t[Release type]:type:(detailed short client developer hotfix prerelease)'
                        '--type[Release type]:type:(detailed short client developer hotfix prerelease)'
                        '-v[Version number]:version:'
                        '--version[Version number]:version:'
                        '-o[Output to file]:file:_files'
                        '--output[Output to file]:file:_files'
                        '-a[Append to existing release notes]'
                        '--append[Append to existing release notes]'
                        '-i[Include only categories]:categories:'
                        '--include[Include only categories]:categories:'
                        '-e[Exclude categories]:categories:'
                        '--exclude[Exclude categories]:categories:'
                        '-m[Filter by module name]:module:'
                        '--module[Filter by module name]:module:'
                        '-p[Filter by file path]:path:_files'
                        '--path[Filter by file path]:path:_files'
                        '--since[Start from tag/commit/date]:ref:'
                        '--until[End at tag/commit/date]:ref:'
                        '--bump[Suggest version bump based on changes]'
                        '--prerelease[Mark as pre-release]:stage:(alpha beta rc)'
                        '--urgency[Hotfix urgency level]:level:(low medium high critical)'
                        '--interactive[Interactive mode with filter selection]'
                        '--changelog[Update CHANGELOG.md with release notes]'
                        '--tag[Create git tag for this release]'
                        '--tag-message[Custom message for git tag]:message:'
                        '--json[Output in JSON format]'
                    )
                    _arguments \$options
                    ;;
                restore)
                    _arguments \\
                        '-f[Skip confirmation prompt]' \\
                        '--force[Skip confirmation prompt]' \\
                        '-q[Minimal output]' \\
                        '--quiet[Minimal output]' \\
                        '--json[Output in JSON format]' \\
                        '1:backup file:_files -g "*.json"'
                    ;;
            esac
            ;;
    esac
}

_proagents "\$@"
`;
}

/**
 * Generate fish completion script
 */
function generateFishCompletion() {
  return `# ProAgents fish completion
# Save to ~/.config/fish/completions/proagents.fish

# Disable file completion by default
complete -c proagents -f

# Main commands
complete -c proagents -n "__fish_use_subcommand" -a init -d "Initialize ProAgents in the current project"
complete -c proagents -n "__fish_use_subcommand" -a feature -d "Feature development commands"
complete -c proagents -n "__fish_use_subcommand" -a fix -d "Quick bug fix mode"
complete -c proagents -n "__fish_use_subcommand" -a status -d "Show ProAgents status in current project"
complete -c proagents -n "__fish_use_subcommand" -a docs -d "Open ProAgents documentation"
complete -c proagents -n "__fish_use_subcommand" -a ai -d "Manage AI platform instruction files"
complete -c proagents -n "__fish_use_subcommand" -a config -d "Manage ProAgents configuration"
complete -c proagents -n "__fish_use_subcommand" -a uninstall -d "Remove ProAgents from current project"
complete -c proagents -n "__fish_use_subcommand" -a commands -d "Show all available commands with examples"
complete -c proagents -n "__fish_use_subcommand" -a doctor -d "Check health of ProAgents installation"
complete -c proagents -n "__fish_use_subcommand" -a upgrade -d "Upgrade .proagents folder to latest version"
complete -c proagents -n "__fish_use_subcommand" -a migrate -d "Migrate from proagents/ to .proagents/"
complete -c proagents -n "__fish_use_subcommand" -a version -d "Show detailed version information"
complete -c proagents -n "__fish_use_subcommand" -a release -d "Generate release notes with type selection"
complete -c proagents -n "__fish_use_subcommand" -a stats -d "Show project and AI usage statistics"
complete -c proagents -n "__fish_use_subcommand" -a restore -d "Restore ProAgents data from backup"
complete -c proagents -n "__fish_use_subcommand" -a changelog -d "Manage project changelogs"
complete -c proagents -n "__fish_use_subcommand" -a completion -d "Generate shell completion scripts"

# Feature subcommands
complete -c proagents -n "__fish_seen_subcommand_from feature" -a start -d "Start a new feature"
complete -c proagents -n "__fish_seen_subcommand_from feature" -a status -d "Check current feature status"
complete -c proagents -n "__fish_seen_subcommand_from feature" -a list -d "List all features"
complete -c proagents -n "__fish_seen_subcommand_from feature" -a complete -d "Mark current feature as complete"

# AI subcommands
complete -c proagents -n "__fish_seen_subcommand_from ai" -a add -d "Add more AI platforms"
complete -c proagents -n "__fish_seen_subcommand_from ai" -a list -d "List installed AI platforms"
complete -c proagents -n "__fish_seen_subcommand_from ai" -a remove -d "Remove AI platforms from config"

# Config subcommands
complete -c proagents -n "__fish_seen_subcommand_from config" -a list -d "Show all configurable options"
complete -c proagents -n "__fish_seen_subcommand_from config" -a show -d "Show current config values"
complete -c proagents -n "__fish_seen_subcommand_from config" -a edit -d "Info on how to edit config"
complete -c proagents -n "__fish_seen_subcommand_from config" -a set -d "Set a config value"
complete -c proagents -n "__fish_seen_subcommand_from config" -a get -d "Get a config value"
complete -c proagents -n "__fish_seen_subcommand_from config" -a setup -d "Interactive configuration wizard"
complete -c proagents -n "__fish_seen_subcommand_from config" -a customize -d "Copy templates to create custom configurations"
complete -c proagents -n "__fish_seen_subcommand_from config" -a export -d "Export configuration for sharing or backup"
complete -c proagents -n "__fish_seen_subcommand_from config" -a import -d "Import configuration from export file"

# Changelog subcommands
complete -c proagents -n "__fish_seen_subcommand_from changelog" -a view -d "View recent changelog entries"
complete -c proagents -n "__fish_seen_subcommand_from changelog" -a add -d "Add a new changelog entry"
complete -c proagents -n "__fish_seen_subcommand_from changelog" -a list -d "List available changelogs"
complete -c proagents -n "__fish_seen_subcommand_from changelog" -a export -d "Export changelog to CHANGELOG.md"
complete -c proagents -n "__fish_seen_subcommand_from changelog" -a feature -d "View changelog for a specific feature"
complete -c proagents -n "__fish_seen_subcommand_from changelog" -a module -d "View changelog for a specific module"
complete -c proagents -n "__fish_seen_subcommand_from changelog" -a git -d "View git commit history as changelog"

# Completion subcommands
complete -c proagents -n "__fish_seen_subcommand_from completion" -a bash -d "Generate bash completion script"
complete -c proagents -n "__fish_seen_subcommand_from completion" -a zsh -d "Generate zsh completion script"
complete -c proagents -n "__fish_seen_subcommand_from completion" -a fish -d "Generate fish completion script"

# Release options
complete -c proagents -n "__fish_seen_subcommand_from release" -s t -l type -d "Release type" -xa "detailed short client developer hotfix prerelease"
complete -c proagents -n "__fish_seen_subcommand_from release" -s v -l version -d "Version number"
complete -c proagents -n "__fish_seen_subcommand_from release" -s o -l output -d "Output to file" -r
complete -c proagents -n "__fish_seen_subcommand_from release" -s a -l append -d "Append to existing release notes"
complete -c proagents -n "__fish_seen_subcommand_from release" -s i -l include -d "Include only categories"
complete -c proagents -n "__fish_seen_subcommand_from release" -s e -l exclude -d "Exclude categories"
complete -c proagents -n "__fish_seen_subcommand_from release" -s m -l module -d "Filter by module name"
complete -c proagents -n "__fish_seen_subcommand_from release" -s p -l path -d "Filter by file path" -r
complete -c proagents -n "__fish_seen_subcommand_from release" -l since -d "Start from tag/commit/date"
complete -c proagents -n "__fish_seen_subcommand_from release" -l until -d "End at tag/commit/date"
complete -c proagents -n "__fish_seen_subcommand_from release" -l bump -d "Suggest version bump based on changes"
complete -c proagents -n "__fish_seen_subcommand_from release" -l prerelease -d "Mark as pre-release" -xa "alpha beta rc"
complete -c proagents -n "__fish_seen_subcommand_from release" -l urgency -d "Hotfix urgency level" -xa "low medium high critical"
complete -c proagents -n "__fish_seen_subcommand_from release" -l interactive -d "Interactive mode with filter selection"
complete -c proagents -n "__fish_seen_subcommand_from release" -l changelog -d "Update CHANGELOG.md with release notes"
complete -c proagents -n "__fish_seen_subcommand_from release" -l tag -d "Create git tag for this release"
complete -c proagents -n "__fish_seen_subcommand_from release" -l tag-message -d "Custom message for git tag"
complete -c proagents -n "__fish_seen_subcommand_from release" -l json -d "Output in JSON format"

# Stats options
complete -c proagents -n "__fish_seen_subcommand_from stats" -l json -d "Output in JSON format"

# Restore options
complete -c proagents -n "__fish_seen_subcommand_from restore" -s f -l force -d "Skip confirmation prompt"
complete -c proagents -n "__fish_seen_subcommand_from restore" -s q -l quiet -d "Minimal output"
complete -c proagents -n "__fish_seen_subcommand_from restore" -l json -d "Output in JSON format"

# Alias for pa
complete -c pa -w proagents
`;
}

/**
 * Completion command - generate shell completions
 */
export async function completionCommand(shell, options = {}) {
  // If no shell specified, try to detect
  if (!shell) {
    const shellEnv = process.env.SHELL || '';
    if (shellEnv.includes('zsh')) {
      shell = 'zsh';
    } else if (shellEnv.includes('fish')) {
      shell = 'fish';
    } else {
      shell = 'bash';
    }

    if (!options.quiet) {
      console.error(chalk.gray(`Detected shell: ${shell}\n`));
    }
  }

  let script;
  let installInstructions;

  switch (shell.toLowerCase()) {
    case 'bash':
      script = generateBashCompletion();
      installInstructions = `
${chalk.cyan('To install:')}
  ${chalk.white('# Add to ~/.bashrc:')}
  ${chalk.green('proagents completion bash >> ~/.bashrc')}
  ${chalk.white('# Or save to a file:')}
  ${chalk.green('proagents completion bash > /etc/bash_completion.d/proagents')}
  ${chalk.white('# Then reload:')}
  ${chalk.green('source ~/.bashrc')}
`;
      break;

    case 'zsh':
      script = generateZshCompletion();
      installInstructions = `
${chalk.cyan('To install:')}
  ${chalk.white('# Save to completions directory:')}
  ${chalk.green('proagents completion zsh > ~/.zsh/completions/_proagents')}
  ${chalk.white('# Or add to ~/.zshrc:')}
  ${chalk.green('proagents completion zsh >> ~/.zshrc')}
  ${chalk.white('# Then reload:')}
  ${chalk.green('source ~/.zshrc')}
`;
      break;

    case 'fish':
      script = generateFishCompletion();
      installInstructions = `
${chalk.cyan('To install:')}
  ${chalk.white('# Save to completions directory:')}
  ${chalk.green('proagents completion fish > ~/.config/fish/completions/proagents.fish')}
  ${chalk.white('# Completions are loaded automatically')}
`;
      break;

    default:
      console.error(chalk.red(`Unknown shell: ${shell}`));
      console.error(chalk.gray('Supported shells: bash, zsh, fish'));
      return;
  }

  // Output script
  console.log(script);

  // Show install instructions to stderr (so they don't pollute piped output)
  if (!options.quiet) {
    console.error(installInstructions);
  }
}
