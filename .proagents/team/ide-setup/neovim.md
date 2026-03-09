# Neovim Setup Guide

Configure Neovim for optimal ProAgents development.

---

## Overview

Neovim provides a powerful, extensible environment for ProAgents workflows. This guide covers setup with modern Lua-based configuration using lazy.nvim or Packer.

---

## Prerequisites

- Neovim 0.9+ (0.10+ recommended)
- Node.js 18+ (for LSP servers)
- ripgrep (for Telescope)
- A Nerd Font (for icons)

```bash
# macOS
brew install neovim ripgrep fd

# Ubuntu/Debian
sudo apt install neovim ripgrep fd-find

# Verify installation
nvim --version
```

---

## Plugin Manager Setup

### Using lazy.nvim (Recommended)

Create `~/.config/nvim/init.lua`:

```lua
-- Bootstrap lazy.nvim
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.fn.isdirectory(lazypath) then
  vim.fn.system({
    "git", "clone", "--filter=blob:none",
    "https://github.com/folke/lazy.nvim.git",
    "--branch=stable", lazypath,
  })
end
vim.opt.rtp:prepend(lazypath)

-- Leader key (set before lazy)
vim.g.mapleader = " "
vim.g.maplocalleader = " "

-- Load plugins
require("lazy").setup("plugins")
```

### Using Packer (Alternative)

```lua
-- Bootstrap Packer
local ensure_packer = function()
  local fn = vim.fn
  local install_path = fn.stdpath('data')..'/site/pack/packer/start/packer.nvim'
  if fn.empty(fn.glob(install_path)) > 0 then
    fn.system({'git', 'clone', '--depth', '1',
      'https://github.com/wbthomason/packer.nvim', install_path})
    vim.cmd [[packadd packer.nvim]]
    return true
  end
  return false
end

local packer_bootstrap = ensure_packer()

require('packer').startup(function(use)
  use 'wbthomason/packer.nvim'
  -- Add plugins here
  if packer_bootstrap then
    require('packer').sync()
  end
end)
```

---

## Essential Plugins

Create `~/.config/nvim/lua/plugins/init.lua`:

```lua
return {
  -- Core
  { "nvim-lua/plenary.nvim" },

  -- File Explorer
  {
    "nvim-neo-tree/neo-tree.nvim",
    dependencies = {
      "nvim-lua/plenary.nvim",
      "nvim-tree/nvim-web-devicons",
      "MunifTanjim/nui.nvim",
    },
    config = function()
      require("neo-tree").setup({
        filesystem = {
          filtered_items = {
            hide_dotfiles = false,
            hide_gitignored = false,
            hide_by_name = { "node_modules", ".git" },
          },
        },
      })
    end,
  },

  -- Fuzzy Finder
  {
    "nvim-telescope/telescope.nvim",
    dependencies = {
      "nvim-lua/plenary.nvim",
      { "nvim-telescope/telescope-fzf-native.nvim", build = "make" },
    },
    config = function()
      local telescope = require("telescope")
      telescope.setup({
        defaults = {
          file_ignore_patterns = { "node_modules", ".git", ".next", "dist" },
        },
      })
      telescope.load_extension("fzf")
    end,
  },

  -- LSP
  {
    "neovim/nvim-lspconfig",
    dependencies = {
      "williamboman/mason.nvim",
      "williamboman/mason-lspconfig.nvim",
    },
  },

  -- Autocompletion
  {
    "hrsh7th/nvim-cmp",
    dependencies = {
      "hrsh7th/cmp-nvim-lsp",
      "hrsh7th/cmp-buffer",
      "hrsh7th/cmp-path",
      "L3MON4D3/LuaSnip",
      "saadparwaiz1/cmp_luasnip",
    },
  },

  -- Treesitter
  {
    "nvim-treesitter/nvim-treesitter",
    build = ":TSUpdate",
    config = function()
      require("nvim-treesitter.configs").setup({
        ensure_installed = {
          "typescript", "tsx", "javascript", "json",
          "html", "css", "lua", "markdown", "yaml",
        },
        highlight = { enable = true },
        indent = { enable = true },
      })
    end,
  },

  -- Formatting
  {
    "stevearc/conform.nvim",
    config = function()
      require("conform").setup({
        formatters_by_ft = {
          javascript = { "prettier" },
          typescript = { "prettier" },
          typescriptreact = { "prettier" },
          javascriptreact = { "prettier" },
          json = { "prettier" },
          css = { "prettier" },
          markdown = { "prettier" },
        },
        format_on_save = {
          timeout_ms = 500,
          lsp_fallback = true,
        },
      })
    end,
  },

  -- Linting
  {
    "mfussenegger/nvim-lint",
    config = function()
      require("lint").linters_by_ft = {
        javascript = { "eslint" },
        typescript = { "eslint" },
        typescriptreact = { "eslint" },
        javascriptreact = { "eslint" },
      }
    end,
  },

  -- Git
  {
    "lewis6991/gitsigns.nvim",
    config = function()
      require("gitsigns").setup()
    end,
  },

  -- Status Line
  {
    "nvim-lualine/lualine.nvim",
    config = function()
      require("lualine").setup({
        options = { theme = "auto" },
      })
    end,
  },

  -- Terminal
  {
    "akinsho/toggleterm.nvim",
    config = function()
      require("toggleterm").setup({
        open_mapping = [[<c-\>]],
        direction = "horizontal",
        size = 15,
      })
    end,
  },

  -- AI Integration (choose one)
  { "github/copilot.vim" },
  -- OR
  -- { "Exafunction/codeium.vim" },

  -- Which Key (keybinding helper)
  {
    "folke/which-key.nvim",
    config = function()
      require("which-key").setup()
    end,
  },

  -- Comments
  {
    "numToStr/Comment.nvim",
    config = function()
      require("Comment").setup()
    end,
  },

  -- Autopairs
  {
    "windwp/nvim-autopairs",
    config = function()
      require("nvim-autopairs").setup()
    end,
  },
}
```

---

## LSP Configuration

Create `~/.config/nvim/lua/plugins/lsp.lua`:

```lua
return {
  {
    "williamboman/mason.nvim",
    config = function()
      require("mason").setup()
    end,
  },
  {
    "williamboman/mason-lspconfig.nvim",
    config = function()
      require("mason-lspconfig").setup({
        ensure_installed = {
          "tsserver",      -- TypeScript
          "eslint",        -- ESLint
          "tailwindcss",   -- Tailwind CSS
          "lua_ls",        -- Lua
          "jsonls",        -- JSON
          "html",          -- HTML
          "cssls",         -- CSS
        },
      })
    end,
  },
  {
    "neovim/nvim-lspconfig",
    config = function()
      local lspconfig = require("lspconfig")
      local capabilities = require("cmp_nvim_lsp").default_capabilities()

      -- TypeScript
      lspconfig.tsserver.setup({
        capabilities = capabilities,
        on_attach = function(client, bufnr)
          -- Disable formatting (use Prettier instead)
          client.server_capabilities.documentFormattingProvider = false
        end,
      })

      -- ESLint
      lspconfig.eslint.setup({
        capabilities = capabilities,
      })

      -- Tailwind CSS
      lspconfig.tailwindcss.setup({
        capabilities = capabilities,
      })

      -- JSON
      lspconfig.jsonls.setup({
        capabilities = capabilities,
      })
    end,
  },
}
```

---

## Autocompletion Configuration

Create `~/.config/nvim/lua/plugins/cmp.lua`:

```lua
return {
  {
    "hrsh7th/nvim-cmp",
    config = function()
      local cmp = require("cmp")
      local luasnip = require("luasnip")

      cmp.setup({
        snippet = {
          expand = function(args)
            luasnip.lsp_expand(args.body)
          end,
        },
        mapping = cmp.mapping.preset.insert({
          ["<C-b>"] = cmp.mapping.scroll_docs(-4),
          ["<C-f>"] = cmp.mapping.scroll_docs(4),
          ["<C-Space>"] = cmp.mapping.complete(),
          ["<C-e>"] = cmp.mapping.abort(),
          ["<CR>"] = cmp.mapping.confirm({ select = true }),
          ["<Tab>"] = cmp.mapping(function(fallback)
            if cmp.visible() then
              cmp.select_next_item()
            elseif luasnip.expand_or_jumpable() then
              luasnip.expand_or_jump()
            else
              fallback()
            end
          end, { "i", "s" }),
          ["<S-Tab>"] = cmp.mapping(function(fallback)
            if cmp.visible() then
              cmp.select_prev_item()
            elseif luasnip.jumpable(-1) then
              luasnip.jump(-1)
            else
              fallback()
            end
          end, { "i", "s" }),
        }),
        sources = cmp.config.sources({
          { name = "nvim_lsp" },
          { name = "luasnip" },
          { name = "buffer" },
          { name = "path" },
        }),
      })
    end,
  },
}
```

---

## Key Mappings

Create `~/.config/nvim/lua/config/keymaps.lua`:

```lua
local keymap = vim.keymap.set
local opts = { noremap = true, silent = true }

-- General
keymap("n", "<leader>w", ":w<CR>", { desc = "Save file" })
keymap("n", "<leader>q", ":q<CR>", { desc = "Quit" })
keymap("n", "<Esc>", ":noh<CR>", { desc = "Clear search" })

-- File Explorer
keymap("n", "<leader>e", ":Neotree toggle<CR>", { desc = "Toggle explorer" })
keymap("n", "<leader>o", ":Neotree focus<CR>", { desc = "Focus explorer" })

-- Telescope (Fuzzy Finding)
keymap("n", "<leader>ff", ":Telescope find_files<CR>", { desc = "Find files" })
keymap("n", "<leader>fg", ":Telescope live_grep<CR>", { desc = "Live grep" })
keymap("n", "<leader>fb", ":Telescope buffers<CR>", { desc = "Find buffers" })
keymap("n", "<leader>fh", ":Telescope help_tags<CR>", { desc = "Help tags" })
keymap("n", "<leader>fr", ":Telescope oldfiles<CR>", { desc = "Recent files" })
keymap("n", "<leader>fs", ":Telescope grep_string<CR>", { desc = "Grep string" })

-- LSP
keymap("n", "gd", vim.lsp.buf.definition, { desc = "Go to definition" })
keymap("n", "gr", vim.lsp.buf.references, { desc = "Go to references" })
keymap("n", "gi", vim.lsp.buf.implementation, { desc = "Go to implementation" })
keymap("n", "K", vim.lsp.buf.hover, { desc = "Hover documentation" })
keymap("n", "<leader>ca", vim.lsp.buf.code_action, { desc = "Code action" })
keymap("n", "<leader>rn", vim.lsp.buf.rename, { desc = "Rename" })
keymap("n", "<leader>d", vim.diagnostic.open_float, { desc = "Line diagnostics" })
keymap("n", "[d", vim.diagnostic.goto_prev, { desc = "Previous diagnostic" })
keymap("n", "]d", vim.diagnostic.goto_next, { desc = "Next diagnostic" })

-- Formatting
keymap("n", "<leader>fm", function()
  require("conform").format({ async = true, lsp_fallback = true })
end, { desc = "Format file" })

-- Git
keymap("n", "<leader>gs", ":Telescope git_status<CR>", { desc = "Git status" })
keymap("n", "<leader>gc", ":Telescope git_commits<CR>", { desc = "Git commits" })
keymap("n", "<leader>gb", ":Telescope git_branches<CR>", { desc = "Git branches" })

-- Terminal
keymap("n", "<leader>tt", ":ToggleTerm<CR>", { desc = "Toggle terminal" })
keymap("t", "<Esc>", [[<C-\><C-n>]], { desc = "Exit terminal mode" })

-- Buffers
keymap("n", "<S-h>", ":bprevious<CR>", { desc = "Previous buffer" })
keymap("n", "<S-l>", ":bnext<CR>", { desc = "Next buffer" })
keymap("n", "<leader>bd", ":bdelete<CR>", { desc = "Delete buffer" })

-- Windows
keymap("n", "<C-h>", "<C-w>h", { desc = "Move to left window" })
keymap("n", "<C-j>", "<C-w>j", { desc = "Move to bottom window" })
keymap("n", "<C-k>", "<C-w>k", { desc = "Move to top window" })
keymap("n", "<C-l>", "<C-w>l", { desc = "Move to right window" })

-- ProAgents Commands (via terminal)
keymap("n", "<leader>ps", ":TermExec cmd='proagents status'<CR>", { desc = "ProAgents status" })
keymap("n", "<leader>pf", ":TermExec cmd='proagents feature list'<CR>", { desc = "ProAgents features" })
keymap("n", "<leader>pc", ":TermExec cmd='proagents checklist current'<CR>", { desc = "ProAgents checklist" })
```

---

## ProAgents Integration

### Custom Commands

Add to your config:

```lua
-- ProAgents custom commands
vim.api.nvim_create_user_command("ProAgentsStatus", function()
  vim.cmd("TermExec cmd='proagents status'")
end, { desc = "Show ProAgents status" })

vim.api.nvim_create_user_command("ProAgentsFeature", function(opts)
  local cmd = "proagents feature " .. opts.args
  vim.cmd("TermExec cmd='" .. cmd .. "'")
end, { nargs = "+", desc = "ProAgents feature command" })

vim.api.nvim_create_user_command("ProAgentsAnalyze", function()
  vim.cmd("TermExec cmd='proagents analyze'")
end, { desc = "Analyze codebase" })

vim.api.nvim_create_user_command("ProAgentsChecklist", function(opts)
  local checklist = opts.args ~= "" and opts.args or "current"
  vim.cmd("TermExec cmd='proagents checklist " .. checklist .. "'")
end, { nargs = "?", desc = "Run checklist" })
```

### Telescope Extension for ProAgents

Create `~/.config/nvim/lua/plugins/proagents.lua`:

```lua
-- ProAgents Telescope picker
local pickers = require("telescope.pickers")
local finders = require("telescope.finders")
local conf = require("telescope.config").values
local actions = require("telescope.actions")
local action_state = require("telescope.actions.state")

local proagents_commands = function(opts)
  opts = opts or {}
  pickers.new(opts, {
    prompt_title = "ProAgents Commands",
    finder = finders.new_table({
      results = {
        { "status", "Show workflow status" },
        { "feature list", "List active features" },
        { "feature start", "Start new feature" },
        { "analyze", "Analyze codebase" },
        { "checklist current", "Current phase checklist" },
        { "checklist pre-deployment", "Pre-deployment checklist" },
        { "doc", "Generate documentation" },
        { "test", "Run tests" },
      },
      entry_maker = function(entry)
        return {
          value = entry[1],
          display = entry[1] .. " - " .. entry[2],
          ordinal = entry[1],
        }
      end,
    }),
    sorter = conf.generic_sorter(opts),
    attach_mappings = function(prompt_bufnr, map)
      actions.select_default:replace(function()
        actions.close(prompt_bufnr)
        local selection = action_state.get_selected_entry()
        vim.cmd("TermExec cmd='proagents " .. selection.value .. "'")
      end)
      return true
    end,
  }):find()
end

-- Register command
vim.api.nvim_create_user_command("ProAgents", proagents_commands, {})
vim.keymap.set("n", "<leader>pa", proagents_commands, { desc = "ProAgents commands" })
```

---

## Editor Options

Create `~/.config/nvim/lua/config/options.lua`:

```lua
local opt = vim.opt

-- Line numbers
opt.number = true
opt.relativenumber = true

-- Tabs & Indentation
opt.tabstop = 2
opt.shiftwidth = 2
opt.softtabstop = 2
opt.expandtab = true
opt.smartindent = true

-- Line wrapping
opt.wrap = false

-- Search
opt.ignorecase = true
opt.smartcase = true
opt.hlsearch = true
opt.incsearch = true

-- Appearance
opt.termguicolors = true
opt.signcolumn = "yes"
opt.cursorline = true
opt.scrolloff = 8
opt.sidescrolloff = 8

-- Behavior
opt.splitright = true
opt.splitbelow = true
opt.clipboard = "unnamedplus"
opt.undofile = true
opt.updatetime = 250
opt.timeoutlen = 300

-- File handling
opt.backup = false
opt.swapfile = false
opt.fileencoding = "utf-8"
```

---

## Troubleshooting

### LSP Not Working

```vim
:LspInfo          " Check LSP status
:Mason            " Check/install LSP servers
:checkhealth lsp  " Health check
```

### Treesitter Issues

```vim
:TSUpdate         " Update parsers
:TSInstall <lang> " Install specific parser
:checkhealth nvim-treesitter
```

### Plugin Issues

```vim
:Lazy             " Open plugin manager
:Lazy sync        " Sync plugins
:Lazy clean       " Remove unused plugins
```

### Performance

```vim
:checkhealth      " Full health check
:StartupTime      " Profile startup (with plugin)
```

---

## Quick Reference

| Keybinding | Action |
|------------|--------|
| `<Space>ff` | Find files |
| `<Space>fg` | Live grep |
| `<Space>e` | Toggle file explorer |
| `gd` | Go to definition |
| `gr` | Find references |
| `K` | Hover docs |
| `<Space>ca` | Code actions |
| `<Space>fm` | Format file |
| `<Space>pa` | ProAgents commands |
| `<C-\>` | Toggle terminal |
