---
layout: index
title: Voxt — Modern Developer & AI Single Page Showcase
name: Voxt
headline: Portable, Disposable AI Developer Environments
lead: Ultra-performant dev containers featuring a 4-pane TMUX IDE, stdio Model Context Protocol (MCP) AI agents, git worktree pairing, and sub-500ms startup times.
permalink: /
language: en-GB
date: 2026-08-29
---

<section id="overview" class="section">
  <div class="container text-center">
    <h2 class="section-title">Engineered for Autonomous AI Agents & Developers</h2>
    <p class="section-desc">A unified container runtime that eliminates context friction between human developers and terminal AI coding agents.</p>
    <div class="grid-2x2">
      <div class="card">
        <h3>4-Pane TMUX IDE (Prefix + i)</h3>
        <p>Pre-configured VS Code style terminal multiplexer grid with Project Explorer, Neovim LSP, bash CLI, and AI Agent pane.</p>
      </div>
      <div class="card">
        <h3>Parallel AI Task Worktrees (muxtree)</h3>
        <p>Automate isolated Git worktrees paired with separate TMUX sessions for concurrent multi-agent and human feature branches.</p>
      </div>
      <div class="card">
        <h3>Model Context Protocol (MCP)</h3>
        <p>Native JSON-RPC 2.0 stdio server enabling Claude Code, Cursor, and Aider to execute sandbox queries and diagnostics directly.</p>
      </div>
      <div class="card">
        <h3>High-Speed Context Packer (ai-pack)</h3>
        <p>Format entire repository codebases into token-efficient XML or Markdown prompt contexts with zero external dependencies.</p>
      </div>
    </div>
  </div>
</section>

<section id="quickstart" class="section">
  <div class="container narrow">
    <h2 class="section-title text-center">Quick Start in 30 Seconds</h2>
    <p class="section-desc text-center">Disposable development environments running on Docker or Podman.</p>
    <pre><code># 1. Clone the repository
git clone https://github.com/sebastienrousseau/langdev.git
cd langdev

# 2. Build and launch 4-pane TMUX IDE
make up

# 3. Mobile WebTTY (port 7681) & Mosh roaming
make web
make mosh</code></pre>
  </div>
</section>

<section id="suite" class="section">
  <div class="container">
    <h2 class="section-title text-center">Unified Multi-Language Suite</h2>
    <p class="section-desc text-center">Every container shares an identical security baseline, TMUX shortcuts, and MCP interfaces.</p>
    <div class="table-responsive">
      <table>
        <thead>
          <tr>
            <th>Container</th>
            <th>Language Stack</th>
            <th>Built-in Tooling</th>
            <th>Version</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>langdev</strong></td>
            <td>Core Foundation</td>
            <td>TMUX IDE, MCP server, ai-pack, WebTTY, OSC 52</td>
            <td>v0.0.4</td>
          </tr>
          <tr>
            <td><strong>pythondev</strong></td>
            <td>Python 3.12+</td>
            <td>uv, ruff, mypy, pytest, debugpy, Pyright</td>
            <td>v0.0.4</td>
          </tr>
          <tr>
            <td><strong>rustdev</strong></td>
            <td>Rust 1.85+</td>
            <td>rustup, rust-analyzer, clippy, cargo-audit, sccache</td>
            <td>v0.0.4</td>
          </tr>
          <tr>
            <td><strong>godev</strong></td>
            <td>Go 1.24+</td>
            <td>gopls, golangci-lint, delve, Go toolchain</td>
            <td>v0.0.4</td>
          </tr>
          <tr>
            <td><strong>javadev</strong></td>
            <td>Java 21+</td>
            <td>OpenJDK 21, Maven, Gradle, JDTLS</td>
            <td>v0.0.4</td>
          </tr>
          <tr>
            <td><strong>kotlindev</strong></td>
            <td>Kotlin 2.1+</td>
            <td>kotlinc, OpenJDK 21, Gradle, Maven, KLS</td>
            <td>v0.0.4</td>
          </tr>
          <tr>
            <td><strong>swiftdev</strong></td>
            <td>Swift 6.0+</td>
            <td>Swift toolchain, SourceKit-LSP, swift-format</td>
            <td>v0.0.4</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</section>

<section id="security" class="section">
  <div class="container text-center">
    <h2 class="section-title">Zero-Trust Hardened Security</h2>
    <p class="section-desc">Strict security guarantees verified in CI and container runtime.</p>
    <div class="grid-2x2">
      <div class="card">
        <h3>Unprivileged Non-Root</h3>
        <p>Runs as unprivileged dev user (UID/GID 1000). Drops all Linux capabilities (<code>cap_drop: [ALL]</code>) with <code>no-new-privileges:true</code>.</p>
      </div>
      <div class="card">
        <h3>Read-Only Root Filesystem</h3>
        <p>Immutable rootfs prevents container modification or persistent malware. Writable state is restricted to explicit tmpfs mounts.</p>
      </div>
      <div class="card">
        <h3>Supply Chain Integrity</h3>
        <p>Base images pinned to cryptographic SHA256 digests. Zero unpinned curl-to-sh scripts. Automated CycloneDX SBOM generation.</p>
      </div>
      <div class="card">
        <h3>Hermetic CI & SAST</h3>
        <p>100% unit tested with Bats, ShellCheck linting, Hadolint OCI auditing, and Trivy CVE vulnerability scans.</p>
      </div>
    </div>
  </div>
</section>

<section id="faq" class="section">
  <div class="container narrow">
    <h2 class="section-title text-center">Frequently Asked Questions</h2>
    <div class="stack" style="display:flex; flex-direction:column; gap:1.5rem; margin-top:2rem;">
      <div class="card">
        <h3>What is the startup overhead?</h3>
        <p>Under 500 milliseconds. All dotfiles and plugins are pre-baked at image build time, ensuring immediate zero-network launch.</p>
      </div>
      <div class="card">
        <h3>Can I customize the dotfiles?</h3>
        <p>Yes. Pass <code>DOTFILES_REPO</code> and <code>DOTFILES_REF</code> build arguments to inject your own chezmoi repository directly.</p>
      </div>
      <div class="card">
        <h3>How does WebTTY work on mobile/tablets?</h3>
        <p><code>make web</code> launches an authenticated ttyd session with OSC 52 clipboard synchronization accessible from Safari or Chrome.</p>
      </div>
    </div>
  </div>
</section>
