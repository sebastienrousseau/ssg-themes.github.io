---
form_origin: "https://example.com"
layout: index
title: "Voxt — vitrine une page pour développeurs et IA"
description: "Environnements de développement IA portables et jetables : IDE TMUX à quatre volets, agents MCP et démarrage en moins de 500 ms."
eyebrow: "Outils de développement et IA"
author: "SSG Theme Suite"
name: Voxt
headline: "Des environnements de développement IA portables et jetables"
lead: "Des conteneurs de développement ultra-performants : IDE TMUX à quatre volets, agents Model Context Protocol (MCP) en stdio, appariement des worktrees Git et démarrage en moins de 500 ms."
language: "fr-FR"
lang_code: "FR"
lang_change: "Changer de langue"
date: 2026-08-29
news_publication_date: 2026-08-29
label_theme: "Changer le thème de couleur"
label_theme_system: "Système"
label_theme_light: "Clair"
label_theme_dark: "Sombre"
locale_path: "/voxt/fr/"
base_path: "/voxt/"
en_current: ""
fr_current: ' aria-current="true"'
label_home: "Accueil Voxt"
label_menu: "Menu"
label_menu_toggle: "Ouvrir ou fermer le menu de navigation"
label_nav: "Navigation principale"
label_langs: "Langue"
label_github: "Voir Voxt sur GitHub"
label_suite: "Suite Hyperbox"
label_docs: "Documentation"
label_security_model: "Modèle de sécurité"
label_security_policy: "Politique de sécurité"
label_contributing: "Contribuer"
label_made_with: "Réalisé avec SSG"
nav_overview: "Aperçu"
nav_features: "Fonctionnalités"
nav_ai_ide: "IDE IA"
nav_suite: "Suite"
nav_security: "Sécurité"
nav_faq: "FAQ"
cta_primary: "Commencer"
translation_key: "home"
---

<section id="overview" class="section">
  <div class="container text-center">
    <h2 class="section-title">Conçu pour les agents IA autonomes et les développeurs</h2>
    <p class="section-desc">Un environnement de conteneurs unifié qui supprime les frictions de contexte entre les développeurs et les agents de code IA en terminal.</p>
    <div class="grid-2x2" id="features">
      <div class="card">
        <h3>IDE TMUX à quatre volets (Prefix + i)</h3>
        <p>Une grille de multiplexeur de terminal préconfigurée, façon VS Code : explorateur de projet, Neovim avec LSP, interface bash et volet dédié à l’agent IA.</p>
      </div>
      <div class="card">
        <h3>Worktrees parallèles pour les tâches IA (muxtree)</h3>
        <p>Automatisez des worktrees Git isolés, appariés à des sessions TMUX distinctes, pour mener de front les branches des agents et celles des développeurs.</p>
      </div>
      <div class="card">
        <h3>Model Context Protocol (MCP)</h3>
        <p>Un serveur stdio JSON-RPC 2.0 natif qui permet à Claude Code, Cursor et Aider d’exécuter directement requêtes et diagnostics dans le bac à sable.</p>
      </div>
      <div class="card">
        <h3>Compacteur de contexte haute vitesse (ai-pack)</h3>
        <p>Transformez un dépôt entier en contexte de prompt XML ou Markdown économe en jetons, sans aucune dépendance externe.</p>
      </div>
    </div>
  </div>
</section>

<section id="quickstart" class="section">
  <div class="container narrow">
    <h2 class="section-title text-center">Démarrage en 30 secondes</h2>
    <p class="section-desc text-center">Un environnement de développement jetable, exécutable partout où Docker ou Podman fonctionne.</p>
    <pre><code>&#35; 1. Cloner le dépôt
git clone https://github.com/sebastienrousseau/voxt.git
cd voxt

&#35; 2. Construire et lancer l’IDE TMUX à quatre volets
make up

&#35; 3. WebTTY mobile (port 7681) et itinérance Mosh
make web
make mosh</code></pre>
  </div>
</section>

<section id="suite" class="section">
  <div class="container">
    <h2 class="section-title text-center">Une suite multilangage unifiée</h2>
    <p class="section-desc text-center">Chaque conteneur partage le même socle de sécurité, les mêmes raccourcis TMUX et les mêmes interfaces MCP.</p>
    <div class="table-responsive">
      <table>
        <thead>
          <tr>
            <th scope="col">Conteneur</th>
            <th scope="col">Pile de langage</th>
            <th scope="col">Outillage intégré</th>
            <th scope="col">Version</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><a href="https://github.com/sebastienrousseau/langdev/" class="suite-link"><strong>langdev</strong></a></td>
            <td>Socle commun</td>
            <td>TMUX IDE, MCP server, ai-pack, WebTTY, OSC 52</td>
            <td>v0.0.4</td>
          </tr>
          <tr>
            <td><a href="https://github.com/sebastienrousseau/pythondev/" class="suite-link"><strong>pythondev</strong></a></td>
            <td>Python 3.12+</td>
            <td>uv, ruff, mypy, pytest, debugpy, Pyright</td>
            <td>v0.0.4</td>
          </tr>
          <tr>
            <td><a href="https://github.com/sebastienrousseau/rustdev/" class="suite-link"><strong>rustdev</strong></a></td>
            <td>Rust 1.85+</td>
            <td>rustup, rust-analyzer, clippy, cargo-audit, sccache</td>
            <td>v0.0.4</td>
          </tr>
          <tr>
            <td><a href="https://github.com/sebastienrousseau/godev/" class="suite-link"><strong>godev</strong></a></td>
            <td>Go 1.24+</td>
            <td>gopls, golangci-lint, delve, Go toolchain</td>
            <td>v0.0.4</td>
          </tr>
          <tr>
            <td><a href="https://github.com/sebastienrousseau/javadev/" class="suite-link"><strong>javadev</strong></a></td>
            <td>Java 21+</td>
            <td>OpenJDK 21, Maven, Gradle, JDTLS</td>
            <td>v0.0.4</td>
          </tr>
          <tr>
            <td><a href="https://github.com/sebastienrousseau/kotlindev/" class="suite-link"><strong>kotlindev</strong></a></td>
            <td>Kotlin 2.1+</td>
            <td>kotlinc, OpenJDK 21, Gradle, Maven, KLS</td>
            <td>v0.0.4</td>
          </tr>
          <tr>
            <td><a href="https://github.com/sebastienrousseau/swiftdev/" class="suite-link"><strong>swiftdev</strong></a></td>
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
    <h2 class="section-title">Sécurité durcie, confiance zéro</h2>
    <p class="section-desc">Des garanties de sécurité strictes, vérifiées en intégration continue et à l’exécution du conteneur.</p>
    <div class="grid-2x2">
      <div class="card">
        <h3>Utilisateur non privilégié</h3>
        <p>S’exécute avec un utilisateur non privilégié (UID/GID 1000). Abandonne toutes les capacités Linux (<code>cap_drop: [ALL]</code>) avec <code>no-new-privileges:true</code>.</p>
      </div>
      <div class="card">
        <h3>Système de fichiers racine en lecture seule</h3>
        <p>Une racine immuable empêche toute modification du conteneur ou logiciel malveillant persistant. L’état modifiable est limité à des montages tmpfs explicites.</p>
      </div>
      <div class="card">
        <h3>Intégrité de la chaîne d’approvisionnement</h3>
        <p>Images de base épinglées à des empreintes SHA256. Aucun script curl-to-sh non épinglé. Génération automatique d’une nomenclature CycloneDX.</p>
      </div>
      <div class="card">
        <h3>Intégration continue hermétique et analyse statique</h3>
        <p>Couverture unitaire complète avec Bats, analyse ShellCheck, audit OCI Hadolint et détection de vulnérabilités Trivy.</p>
      </div>
    </div>
  </div>
</section>

<section id="faq" class="section">
  <div class="container narrow">
    <h2 class="section-title text-center">Questions fréquentes</h2>
    <div class="faq-stack">
      <div class="card">
        <h3>Quel est le temps de démarrage ?</h3>
        <p>Moins de 500 millisecondes. Les dotfiles et les greffons sont intégrés à la construction de l’image, ce qui garantit un lancement immédiat sans réseau.</p>
      </div>
      <div class="card">
        <h3>Puis-je personnaliser les dotfiles ?</h3>
        <p>Oui. Passez les arguments de construction <code>DOTFILES_REPO</code> et <code>DOTFILES_REF</code> pour injecter directement votre propre dépôt chezmoi.</p>
      </div>
      <div class="card">
        <h3>Comment fonctionne WebTTY sur mobile et tablette ?</h3>
        <p><code>make web</code> lance une session ttyd authentifiée, avec synchronisation du presse-papiers OSC 52, accessible depuis Safari ou Chrome.</p>
      </div>
    </div>
  </div>
</section>
