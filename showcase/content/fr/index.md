---
name: "SSG Themes"
short_name: "SSG"
title: "SSG Themes — vingt-deux thèmes contrôlés pour Static Site Generator"
description: "Vingt-deux thèmes distincts pour Static Site Generator, couvrant l’édition, les portfolios, la finance, le commerce et les outils pour développeurs, chaque promesse étant vérifiée par un contrôle en CI."
keywords: "ssg themes, static site generator, accessible themes, apex, atlas, cadence, covenant, hearth, intent, kairo, kaishi, kinetic, lucid, noir, prism, quill, curio, signal, stablo, steward, velocity, visage, vista, voxt"
author: "SSG Theme Suite"
date: "2026-09-13"
layout: "index"
language: "fr-FR"
eyebrow: "Thèmes pour Static Site Generator"
headline: "Vingt-deux thèmes. Une architecture. Chaque promesse vérifiée."
lead: "Vingt-deux thèmes couvrent désormais l’édition, les portfolios, les produits, la finance, le commerce, la santé, le sport et les outils pour développeurs. Chacun possède son propre système de design et son jeu de gabarits, sur une architecture de templates partagée. Les chiffres ci-dessous sont produits par des contrôles exécutés à chaque commit — aucun badge de score n’est codé en dur ici."
news_publication_date: "2026-09-13"
nav_label_home: "Accueil"
nav_label_themes: "Thèmes"
nav_label_gates: "Contrôles"
nav_label_repo: "Dépôt"
repo_url: "https://github.com/sebastienrousseau/ssg-themes.github.io"
label_nav: "Principale"
label_menu: "Menu"
label_theme: "Apparence"
label_theme_system: "Système"
label_theme_light: "Clair"
label_theme_dark: "Sombre"
label_made_with: "Réalisé avec SSG"
copyright_year: "2026"
form_origin: "https://example.com"
changefreq: "weekly"
schema: "page"
lang_code: "FR"
lang_change: "Changer de langue"
label_langs: "Langue"
base_path: "/"
en_current: ""
fr_current: ' aria-current="true"'
translation_key: "home"
locale_path: "/fr/"
stat_tokens: "paires de jetons de couleur au contraste AAA, en clair et en sombre"
stat_a11y: "problèmes d’accessibilité sur l’ensemble des pages de thème"
stat_weight: "page la plus lourde, gzippée, CSS et JS compris"
stat_thirdparty: "requêtes tierces, sur chaque page"
---

<section class="section sc-gallery" aria-labelledby="themes-heading">
  <div class="container">
    <div class="sc-gallery-head">
      <h2 id="themes-heading">Choisir un thème</h2>
      <div class="sc-controls">
        <button id="trackPrev" type="button" aria-controls="themeTrack">
          <span class="visually-hidden">Faire défiler vers les thèmes précédents</span>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15 6l-6 6 6 6" /></svg>
        </button>
        <button id="trackNext" type="button" aria-controls="themeTrack">
          <span class="visually-hidden">Faire défiler vers d’autres thèmes</span>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      </div>
    </div>
    <div class="sc-track" id="themeTrack" role="region" aria-label="Themes, scrollable horizontally" tabindex="0">
      <article class="sc-slide">
        <figure class="sc-shot">
          <img src="../apex/images/card.webp" srcset="../apex/images/card.webp 640w, ../apex/images/tn.webp 900w, ../apex/images/screenshot.webp 1500w" sizes="(max-width: 48rem) 78vw, 30vw" alt="Aperçu de la page d’accueil du thème Apex." width="1500" height="1000" loading="lazy" decoding="async" />
        </figure>
        <div class="sc-body">
          <p class="eyebrow">Portfolio</p>
          <h3>Apex</h3>
          <p>Portfolio et conseil. Neutres froids rehaussés d’un bleu profond, une hero menée par l’image et une grille de chiffres.</p>
          <ul class="sc-meta"><li>7 gabarits</li><li>Conseils, dirigeants, consultants</li></ul>
          <div class="sc-actions">
            <a class="btn btn-primary" href="../apex/fr/">Voir la démo</a>
            <a class="btn btn-secondary" href="../downloads/apex.zip" download>.zip</a>
            <a class="btn btn-outline" href="../downloads/apex.tar.gz" download>.tar.gz</a>
          </div>
        </div>
      </article>
      <article class="sc-slide">
        <figure class="sc-shot">
          <img src="../atlas/images/card.webp" srcset="../atlas/images/card.webp 640w, ../atlas/images/tn.webp 900w, ../atlas/images/screenshot.webp 1500w" sizes="(max-width: 48rem) 78vw, 30vw" alt="Aperçu de la page d’accueil du thème Atlas." width="1500" height="1000" loading="lazy" decoding="async" />
        </figure>
        <div class="sc-body">
          <p class="eyebrow">Publication</p>
          <h3>Atlas</h3>
          <p>Pôles éditoriaux et de connaissance. Une colonne de lecture en serif sur une justification de 72 caractères, accent vert forêt.</p>
          <ul class="sc-meta"><li>8 gabarits</li><li>Recherche, essais, référence</li></ul>
          <div class="sc-actions">
            <a class="btn btn-primary" href="../atlas/fr/">Voir la démo</a>
            <a class="btn btn-secondary" href="../downloads/atlas.zip" download>.zip</a>
            <a class="btn btn-outline" href="../downloads/atlas.tar.gz" download>.tar.gz</a>
          </div>
        </div>
      </article>
      <article class="sc-slide">
        <figure class="sc-shot">
          <img src="../kaishi/images/card.webp" srcset="../kaishi/images/card.webp 640w, ../kaishi/images/tn.webp 900w, ../kaishi/images/screenshot.webp 1500w" sizes="(max-width: 48rem) 78vw, 30vw" alt="Aperçu de la page d’accueil du thème Kaishi." width="1500" height="1000" loading="lazy" decoding="async" />
        </figure>
        <div class="sc-body">
          <p class="eyebrow">Marketing</p>
          <h3>Kaishi</h3>
          <p>Un starter d’inspiration Apple. En-tête translucide collant, contrôles en pilule et typographie généreuse, sur une palette contrôlée au niveau AAA.</p>
          <ul class="sc-meta"><li>6 gabarits</li><li>Nouveaux sites, starters, prototypes</li></ul>
          <div class="sc-actions">
            <a class="btn btn-primary" href="../kaishi/fr/">Voir la démo</a>
            <a class="btn btn-secondary" href="../downloads/kaishi.zip" download>.zip</a>
            <a class="btn btn-outline" href="../downloads/kaishi.tar.gz" download>.tar.gz</a>
          </div>
        </div>
      </article>
      <article class="sc-slide">
        <figure class="sc-shot">
          <img src="../kinetic/images/card.webp" srcset="../kinetic/images/card.webp 640w, ../kinetic/images/tn.webp 900w, ../kinetic/images/screenshot.webp 1500w" sizes="(max-width: 48rem) 78vw, 30vw" alt="Aperçu de la page d’accueil du thème Kinetic." width="1500" height="1000" loading="lazy" decoding="async" />
        </figure>
        <div class="sc-body">
          <p class="eyebrow">Marketing</p>
          <h3>Kinetic</h3>
          <p>Marketing de plateforme de travail. Dégradés violet-cyan purement décoratifs, visite de la plateforme par onglets et tableau tarifaire enrichi par îlot.</p>
          <ul class="sc-meta"><li>5 gabarits</li><li>SaaS multi-produits, sites de lancement</li></ul>
          <div class="sc-actions">
            <a class="btn btn-primary" href="../kinetic/fr/">Voir la démo</a>
            <a class="btn btn-secondary" href="../downloads/kinetic.zip" download>.zip</a>
            <a class="btn btn-outline" href="../downloads/kinetic.tar.gz" download>.tar.gz</a>
          </div>
        </div>
      </article>
      <article class="sc-slide">
        <figure class="sc-shot">
          <img src="../lucid/images/card.webp" srcset="../lucid/images/card.webp 640w, ../lucid/images/tn.webp 900w, ../lucid/images/screenshot.webp 1500w" sizes="(max-width: 48rem) 78vw, 30vw" alt="Aperçu du thème de documentation Lucid." width="1500" height="1000" loading="lazy" decoding="async" />
        </figure>
        <div class="sc-body">
          <p class="eyebrow">Documentation</p>
          <h3>Lucid</h3>
          <p>Documentation technique suivant le modèle de page du U.S. Web Design System. Navigation latérale, sommaire en page, fil d’Ariane, anglais et français.</p>
          <ul class="sc-meta"><li>4 gabarits</li><li>Documentation logicielle, manuels, références</li></ul>
          <div class="sc-actions">
            <a class="btn btn-primary" href="../lucid/fr/">Voir la démo</a>
            <a class="btn btn-secondary" href="../downloads/lucid.zip" download>.zip</a>
            <a class="btn btn-outline" href="../downloads/lucid.tar.gz" download>.tar.gz</a>
          </div>
        </div>
      </article>
      <article class="sc-slide">
        <figure class="sc-shot">
          <img src="../prism/images/card.webp" srcset="../prism/images/card.webp 640w, ../prism/images/tn.webp 900w, ../prism/images/screenshot.webp 1500w" sizes="(max-width: 48rem) 78vw, 30vw" alt="Aperçu de la page d’accueil du thème Prism." width="1500" height="1000" loading="lazy" decoding="async" />
        </figure>
        <div class="sc-body">
          <p class="eyebrow">Marketing</p>
          <h3>Prism</h3>
          <p>Infrastructure financière. Bandeau bleu marine avec méga-menu à divulgation, hero incliné présentant des maquettes produit et quatre teintes sémantiques sur un blanc cassé chaud.</p>
          <ul class="sc-meta"><li>4 gabarits</li><li>Fintech, paiements, plateformes d’entreprise</li></ul>
          <div class="sc-actions">
            <a class="btn btn-primary" href="../prism/fr/">Voir la démo</a>
            <a class="btn btn-secondary" href="../downloads/prism.zip" download>.zip</a>
            <a class="btn btn-outline" href="../downloads/prism.tar.gz" download>.tar.gz</a>
          </div>
        </div>
      </article>
      <article class="sc-slide">
        <figure class="sc-shot">
          <img src="../quill/images/card.webp" srcset="../quill/images/card.webp 640w, ../quill/images/tn.webp 900w, ../quill/images/screenshot.webp 1500w" sizes="(max-width: 48rem) 78vw, 30vw" alt="Aperçu de la page d’accueil du thème Quill." width="1500" height="1000" loading="lazy" decoding="async" />
        </figure>
        <div class="sc-body">
          <p class="eyebrow">Blog</p>
          <h3>Quill</h3>
          <p>Typographique et monochrome. Un grand logotype à approche resserrée, une hero pleine page, des en-têtes d’article sur deux colonnes.</p>
          <ul class="sc-meta"><li>4 gabarits</li><li>Blogs portés par l’écriture, essais, journaux de version</li></ul>
          <div class="sc-actions">
            <a class="btn btn-primary" href="../quill/fr/">Voir la démo</a>
            <a class="btn btn-secondary" href="../downloads/quill.zip" download>.zip</a>
            <a class="btn btn-outline" href="../downloads/quill.tar.gz" download>.tar.gz</a>
          </div>
        </div>
      </article>
      <article class="sc-slide">
        <figure class="sc-shot">
          <img src="../stablo/images/card.webp" srcset="../stablo/images/card.webp 640w, ../stablo/images/tn.webp 900w, ../stablo/images/screenshot.webp 1500w" sizes="(max-width: 48rem) 78vw, 30vw" alt="Aperçu de la page d’accueil du thème Stablo." width="1500" height="1000" loading="lazy" decoding="async" />
        </figure>
        <div class="sc-body">
          <p class="eyebrow">Blog</p>
          <h3>Stablo</h3>
          <p>Aéré et éditorial. Un logotype centré encadré par la navigation, de grandes cartes à la une avec étiquettes de catégorie.</p>
          <ul class="sc-meta"><li>4 gabarits</li><li>Blogs éditoriaux, magazines, écriture personnelle</li></ul>
          <div class="sc-actions">
            <a class="btn btn-primary" href="../stablo/fr/">Voir la démo</a>
            <a class="btn btn-secondary" href="../downloads/stablo.zip" download>.zip</a>
            <a class="btn btn-outline" href="../downloads/stablo.tar.gz" download>.tar.gz</a>
          </div>
        </div>
      </article>
      <article class="sc-slide">
        <figure class="sc-shot">
          <img src="../velocity/images/card.webp" srcset="../velocity/images/card.webp 640w, ../velocity/images/tn.webp 900w, ../velocity/images/screenshot.webp 1500w" sizes="(max-width: 48rem) 78vw, 30vw" alt="Aperçu de la page d’accueil du thème Velocity." width="1500" height="1000" loading="lazy" decoding="async" />
        </figure>
        <div class="sc-body">
          <p class="eyebrow">Marketing</p>
          <h3>Velocity</h3>
          <p>Pages produit et starters. Ardoise rehaussée de bronze, rayons serrés et jeu de gabarits délibérément restreint.</p>
          <ul class="sc-meta"><li>7 gabarits</li><li>Pages SaaS, sites de projet</li></ul>
          <div class="sc-actions">
            <a class="btn btn-primary" href="../velocity/fr/">Voir la démo</a>
            <a class="btn btn-secondary" href="../downloads/velocity.zip" download>.zip</a>
            <a class="btn btn-outline" href="../downloads/velocity.tar.gz" download>.tar.gz</a>
          </div>
        </div>
      </article>
      <article class="sc-slide">
        <figure class="sc-shot">
          <img src="../vista/images/card.webp" srcset="../vista/images/card.webp 640w, ../vista/images/tn.webp 900w, ../vista/images/screenshot.webp 1500w" sizes="(max-width: 48rem) 78vw, 30vw" alt="Aperçu de la page d’accueil du thème Vista." width="1500" height="1000" loading="lazy" decoding="async" />
        </figure>
        <div class="sc-body">
          <p class="eyebrow">Marketing</p>
          <h3>Vista</h3>
          <p>Matériel d’informatique spatiale. Une scène sombre pleine page, un rail de fonctionnalités à défilement magnétique et un panneau silicium, sur anthracite et blanc cassé.</p>
          <ul class="sc-meta"><li>4 gabarits</li><li>Appareils, matériel, lancements de produit</li></ul>
          <div class="sc-actions">
            <a class="btn btn-primary" href="../vista/fr/">Voir la démo</a>
            <a class="btn btn-secondary" href="../downloads/vista.zip" download>.zip</a>
            <a class="btn btn-outline" href="../downloads/vista.tar.gz" download>.tar.gz</a>
          </div>
        </div>
      </article>
      <article class="sc-slide">
        <figure class="sc-shot">
          <img src="../voxt/images/card.webp" srcset="../voxt/images/card.webp 640w, ../voxt/images/tn.webp 900w, ../voxt/images/screenshot.webp 1500w" sizes="(max-width: 48rem) 78vw, 30vw" alt="Aperçu de la page d’accueil du thème Voxt." width="1500" height="1000" loading="lazy" decoding="async" />
        </figure>
        <div class="sc-body">
          <p class="eyebrow">Marketing</p>
          <h3>Voxt</h3>
          <p>Vitrine d’outils pour développeurs et d’environnements IA. Aperçu d’IDE en terminal à fort contraste, grilles de fonctionnalités nettes et conformité de sécurité stricte.</p>
          <ul class="sc-meta"><li>3 gabarits</li><li>Outils pour développeurs, vitrine CLI &amp; IA, page unique</li></ul>
          <div class="sc-actions">
            <a class="btn btn-primary" href="../voxt/fr/">Voir la démo</a>
            <a class="btn btn-secondary" href="../downloads/voxt.zip" download>.zip</a>
            <a class="btn btn-outline" href="../downloads/voxt.tar.gz" download>.tar.gz</a>
          </div>
        </div>
      </article>
      <article class="sc-slide">
        <figure class="sc-shot">
          <img src="../steward/images/card.webp" srcset="../steward/images/card.webp 640w, ../steward/images/tn.webp 900w, ../steward/images/screenshot.webp 1500w" sizes="(max-width: 48rem) 78vw, 30vw" alt="Aperçu de la page d’accueil du thème Steward." width="1500" height="1000" loading="lazy" decoding="async" />
        </figure>
        <div class="sc-body">
          <p class="eyebrow">Marketing</p>
          <h3>Steward</h3>
          <p>Finance institutionnelle. Typographie serif éditoriale, grille comptable rigoureuse et récits de service fondés sur la confiance.</p>
          <ul class="sc-meta"><li>3 gabarits</li><li>Conseils, family offices, institutions</li></ul>
          <div class="sc-actions">
            <a class="btn btn-primary" href="../steward/fr/">Voir la démo</a>
            <a class="btn btn-secondary" href="../downloads/steward.zip" download>.zip</a>
            <a class="btn btn-outline" href="../downloads/steward.tar.gz" download>.tar.gz</a>
          </div>
        </div>
      </article>
      <article class="sc-slide">
        <figure class="sc-shot">
          <img src="../kairo/images/card.webp" srcset="../kairo/images/card.webp 640w, ../kairo/images/tn.webp 900w, ../kairo/images/screenshot.webp 1500w" sizes="(max-width: 48rem) 78vw, 30vw" alt="Aperçu de la page d’accueil du thème Kairo." width="1500" height="1000" loading="lazy" decoding="async" />
        </figure>
        <div class="sc-body">
          <p class="eyebrow">Portfolio</p>
          <h3>Kairo</h3>
          <p>Direction de création. Typographie cinématographique, géométrie orange énergique et mise en scène substantielle des études de cas.</p>
          <ul class="sc-meta"><li>3 gabarits</li><li>Designers, studios, directions artistiques</li></ul>
          <div class="sc-actions">
            <a class="btn btn-primary" href="../kairo/fr/">Voir la démo</a>
            <a class="btn btn-secondary" href="../downloads/kairo.zip" download>.zip</a>
            <a class="btn btn-outline" href="../downloads/kairo.tar.gz" download>.tar.gz</a>
          </div>
        </div>
      </article>
      <article class="sc-slide">
        <figure class="sc-shot">
          <img src="../visage/images/card.webp" srcset="../visage/images/card.webp 640w, ../visage/images/tn.webp 900w, ../visage/images/screenshot.webp 1500w" sizes="(max-width: 48rem) 78vw, 30vw" alt="Aperçu de la page d’accueil du thème Visage." width="1500" height="1000" loading="lazy" decoding="async" />
        </figure>
        <div class="sc-body">
          <p class="eyebrow">Marketing</p>
          <h3>Visage</h3>
          <p>Santé esthétique. Blancs cliniques apaisés, discours guidé par le consentement et parcours de consultation privée.</p>
          <ul class="sc-meta"><li>3 gabarits</li><li>Cliniques, praticiens, services de bien-être</li></ul>
          <div class="sc-actions">
            <a class="btn btn-primary" href="../visage/fr/">Voir la démo</a>
            <a class="btn btn-secondary" href="../downloads/visage.zip" download>.zip</a>
            <a class="btn btn-outline" href="../downloads/visage.tar.gz" download>.tar.gz</a>
          </div>
        </div>
      </article>
      <article class="sc-slide">
        <figure class="sc-shot">
          <img src="../signal/images/card.webp" srcset="../signal/images/card.webp 640w, ../signal/images/tn.webp 900w, ../signal/images/screenshot.webp 1500w" sizes="(max-width: 48rem) 78vw, 30vw" alt="Aperçu de la page d’accueil du thème Signal." width="1500" height="1000" loading="lazy" decoding="async" />
        </figure>
        <div class="sc-body">
          <p class="eyebrow">Marketing</p>
          <h3>Signal</h3>
          <p>Intelligence des revenus. Surfaces de tableau de bord lumineuses, capacités modulaires et discours d’IA explicable.</p>
          <ul class="sc-meta"><li>3 gabarits</li><li>SaaS, analytique, plateformes de revenus</li></ul>
          <div class="sc-actions">
            <a class="btn btn-primary" href="../signal/fr/">Voir la démo</a>
            <a class="btn btn-secondary" href="../downloads/signal.zip" download>.zip</a>
            <a class="btn btn-outline" href="../downloads/signal.tar.gz" download>.tar.gz</a>
          </div>
        </div>
      </article>
      <article class="sc-slide">
        <figure class="sc-shot">
          <img src="../cadence/images/card.webp" srcset="../cadence/images/card.webp 640w, ../cadence/images/tn.webp 900w, ../cadence/images/screenshot.webp 1500w" sizes="(max-width: 48rem) 78vw, 30vw" alt="Aperçu de la page d’accueil du thème Cadence." width="1500" height="1000" loading="lazy" decoding="async" />
        </figure>
        <div class="sc-body">
          <p class="eyebrow">Marketing</p>
          <h3>Cadence</h3>
          <p>Cyclisme de performance. Mise en scène sombre et cinématographique, typographie surdimensionnée et contenu technique fondé sur les preuves.</p>
          <ul class="sc-meta"><li>3 gabarits</li><li>Fabricants de vélos, équipes, marques d’endurance</li></ul>
          <div class="sc-actions">
            <a class="btn btn-primary" href="../cadence/fr/">Voir la démo</a>
            <a class="btn btn-secondary" href="../downloads/cadence.zip" download>.zip</a>
            <a class="btn btn-outline" href="../downloads/cadence.tar.gz" download>.tar.gz</a>
          </div>
        </div>
      </article>
      <article class="sc-slide">
        <figure class="sc-shot">
          <img src="../noir/images/card.webp" srcset="../noir/images/card.webp 640w, ../noir/images/tn.webp 900w, ../noir/images/screenshot.webp 1500w" sizes="(max-width: 48rem) 78vw, 30vw" alt="Aperçu de la page d’accueil du thème Noir." width="1500" height="1000" loading="lazy" decoding="async" />
        </figure>
        <div class="sc-body">
          <p class="eyebrow">Marketing</p>
          <h3>Noir</h3>
          <p>Commerce streetwear. Mise en scène de catalogue quasi noire, filets marqués et information produit transparente.</p>
          <ul class="sc-meta"><li>3 gabarits</li><li>Marques de mode, lookbooks, catalogues</li></ul>
          <div class="sc-actions">
            <a class="btn btn-primary" href="../noir/fr/">Voir la démo</a>
            <a class="btn btn-secondary" href="../downloads/noir.zip" download>.zip</a>
            <a class="btn btn-outline" href="../downloads/noir.tar.gz" download>.tar.gz</a>
          </div>
        </div>
      </article>
      <article class="sc-slide">
        <figure class="sc-shot">
          <img src="../covenant/images/card.webp" srcset="../covenant/images/card.webp 640w, ../covenant/images/tn.webp 900w, ../covenant/images/screenshot.webp 1500w" sizes="(max-width: 48rem) 78vw, 30vw" alt="Aperçu de la page d’accueil du thème Covenant." width="1500" height="1000" loading="lazy" decoding="async" />
        </figure>
        <div class="sc-body">
          <p class="eyebrow">Marketing</p>
          <h3>Covenant</h3>
          <p>Capital privé. Géométrie noire, ivoire et rouge, avec des récits de portefeuille et d’information rigoureux.</p>
          <ul class="sc-meta"><li>3 gabarits</li><li>Sociétés d’investissement, groupes de portefeuille, institutions</li></ul>
          <div class="sc-actions">
            <a class="btn btn-primary" href="../covenant/fr/">Voir la démo</a>
            <a class="btn btn-secondary" href="../downloads/covenant.zip" download>.zip</a>
            <a class="btn btn-outline" href="../downloads/covenant.tar.gz" download>.tar.gz</a>
          </div>
        </div>
      </article>
      <article class="sc-slide">
        <figure class="sc-shot">
          <img src="../hearth/images/card.webp" srcset="../hearth/images/card.webp 640w, ../hearth/images/tn.webp 900w, ../hearth/images/screenshot.webp 1500w" sizes="(max-width: 48rem) 78vw, 30vw" alt="Aperçu de la page d’accueil du thème Hearth." width="1500" height="1000" loading="lazy" decoding="async" />
        </figure>
        <div class="sc-body">
          <p class="eyebrow">Marketing</p>
          <h3>Hearth</h3>
          <p>Catalogue de mobilier. Mise en scène produit aérée, tonalités de matières chaudes et contenu pratique sur l’usage.</p>
          <ul class="sc-meta"><li>3 gabarits</li><li>Fabricants de mobilier, intérieurs, studios produit</li></ul>
          <div class="sc-actions">
            <a class="btn btn-primary" href="../hearth/fr/">Voir la démo</a>
            <a class="btn btn-secondary" href="../downloads/hearth.zip" download>.zip</a>
            <a class="btn btn-outline" href="../downloads/hearth.tar.gz" download>.tar.gz</a>
          </div>
        </div>
      </article>
      <article class="sc-slide">
        <figure class="sc-shot">
          <img src="../intent/images/card.webp" srcset="../intent/images/card.webp 640w, ../intent/images/tn.webp 900w, ../intent/images/screenshot.webp 1500w" sizes="(max-width: 48rem) 78vw, 30vw" alt="Aperçu de la page d’accueil du thème Intent." width="1500" height="1000" loading="lazy" decoding="async" />
        </figure>
        <div class="sc-body">
          <p class="eyebrow">Portfolio</p>
          <h3>Intent</h3>
          <p>Design éditorial. Typographie serif expressive, aplats monochromes et motif de ruban de studio éclatant.</p>
          <ul class="sc-meta"><li>3 gabarits</li><li>Designers, illustrateurs, directions de création</li></ul>
          <div class="sc-actions">
            <a class="btn btn-primary" href="../intent/fr/">Voir la démo</a>
            <a class="btn btn-secondary" href="../downloads/intent.zip" download>.zip</a>
            <a class="btn btn-outline" href="../downloads/intent.tar.gz" download>.tar.gz</a>
          </div>
        </div>
      </article>
      <article class="sc-slide">
        <figure class="sc-shot">
          <img src="../curio/images/card.webp" srcset="../curio/images/card.webp 640w, ../curio/images/tn.webp 900w, ../curio/images/screenshot.webp 1500w" sizes="(max-width: 48rem) 78vw, 30vw" alt="Aperçu de la page d’accueil du thème Curio." width="1500" height="1000" loading="lazy" decoding="async" />
        </figure>
        <div class="sc-body">
          <p class="eyebrow">Marketing</p>
          <h3>Curio</h3>
          <p>Achat assisté par IA. Typographie commerciale affirmée, cartes produit modulaires et principes de recommandation transparents.</p>
          <ul class="sc-meta"><li>3 gabarits</li><li>Comparateurs, places de marché, agents d’achat</li></ul>
          <div class="sc-actions">
            <a class="btn btn-primary" href="../curio/fr/">Voir la démo</a>
            <a class="btn btn-secondary" href="../downloads/curio.zip" download>.zip</a>
            <a class="btn btn-outline" href="../downloads/curio.tar.gz" download>.tar.gz</a>
          </div>
        </div>
      </article>
      <article class="sc-slide">
        <figure class="sc-shot">
          <img src="../scout/images/card.webp" srcset="../scout/images/card.webp 640w, ../scout/images/tn.webp 900w, ../scout/images/screenshot.webp 1500w" sizes="(max-width: 48rem) 78vw, 30vw" alt="Aperçu de la page d’accueil du thème Scout." width="1500" height="1000" loading="lazy" decoding="async" />
        </figure>
        <div class="sc-body">
          <p class="eyebrow">Outils pour développeurs</p>
          <h3>Scout</h3>
          <p>Diagnostic de protocole. Un verdict d’abord, un registre de sévérité et des preuves au niveau de la requête pour les outils de vérification locaux.</p>
          <ul class="sc-meta"><li>3 gabarits</li><li>Scanners, outils de protocole, rapports d’ingénierie</li></ul>
          <div class="sc-actions">
            <a class="btn btn-primary" href="../scout/fr/">Voir la démo</a>
            <a class="btn btn-secondary" href="../downloads/scout.zip" download>.zip</a>
            <a class="btn btn-outline" href="../downloads/scout.tar.gz" download>.tar.gz</a>
          </div>
        </div>
      </article>
    </div>
  </div>
</section>

<section class="section sc-gates" aria-labelledby="gates-heading">
  <div class="container stack">
      <h2 id="gates-heading">Ce que vérifie chaque contrôle</h2>
      <div class="scroll">
        <table>
          <caption class="visually-hidden">Les contrôles d’intégration continue et ce que chacun garantit</caption>
          <thead>
            <tr><th scope="col">Contrôle</th><th scope="col">Garantit</th></tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Contraste</th>
              <td>Paires de jetons de texte à 7:1 (WCAG 1.4.6, AAA) ; bordures et anneau de focus à 3:1 (1.4.11) — en clair comme en sombre</td>
            </tr>
            <tr>
              <th scope="row">Structure</th>
              <td>Les manifestes concordent, les captures respectent les dimensions du registre, aucun hôte tiers n’apparaît dans la source d’un thème</td>
            </tr>
            <tr>
              <th scope="row">Poids de page</th>
              <td>Chaque page sous 20 Ko gzippés, CSS et JS compris ; chaque thème sous 50 Kio transférés, images comprises ; aucune sous-ressource tierce</td>
            </tr>
            <tr>
              <th scope="row">Accessibilité</th>
              <td>Le rapport du générateur ne relève aucun problème ; axe-core valide<code>wcag22aa</code>et<code>wcag2aaa</code> ; pa11y valide<code>WCAG2AAA</code>dans ses deux moteurs ; et le texte posé sur un dégradé ou une photographie est mesuré à partir des pixels rendus</td>
            </tr>
            <tr>
              <th scope="row">Audit du générateur</th>
              <td>JSON-LD, hreflang, CSP et SRI, HTML5, liens morts, Open Graph, flux, index de recherche</td>
            </tr>
          </tbody>
        </table>
      </div>
      </div>
  </div>
</section>
