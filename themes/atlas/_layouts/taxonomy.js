/* Search dialog and mode toggle for the taxonomy pages.
 *
 * This was an inline <script> in _layouts/tera/base.html. Taxonomy pages
 * bypass the generator's transform chain (ssg #586), so unlike every other
 * page its inline script was never extracted to an external file - and the
 * theme's own script-src 'self' then blocked it. The dialog and the toggle
 * had never worked on these eight pages. As a file it is simply allowed. */
(function() {
  // 1. The mode toggle is main.js's, exactly as on every authored page.
  //    This file used to carry its own engine keyed on `theme-mode` and
  //    `.theme-btn`, which no Atlas page has used since the three-state
  //    #mode-toggle, so a choice made on a tag page never carried over.

  document.addEventListener('DOMContentLoaded', () => {

    // 2. Search Modal & Engine
    let searchIndex = null;
    // Results are built as DOM nodes with textContent, not HTML strings:
    // index fields and the typed query are never parsed as markup, and
    // there is no escaping for the generator's minifier to mangle.
    const note = (text) => {
      const div = document.createElement('div');
      div.className = 'search-empty';
      div.textContent = text;
      results.replaceChildren(div);
    };
    const modal = document.getElementById('searchModal');
    const input = document.getElementById('searchInput');
    const results = document.getElementById('searchResults');
    const trigger = document.getElementById('ssg-search-btn');
    const closeBtn = document.getElementById('searchClose');

    async function loadSearch() {
      if (!searchIndex) {
        try {
          // The index is per site (/atlas/search-index.json), not at the
          // host root; the template hands over the right URL.
          const res = await fetch(modal.dataset.index || 'search-index.json');
          // The generator writes `{ entries: [...] }`, not a bare array.
          if (res.ok) {
            const data = await res.json();
            searchIndex = Array.isArray(data) ? data : (data.entries || []);
          }
        } catch (e) {
          searchIndex = [];
        }
      }
    }

    function openSearch() {
      if (!modal) return;
      modal.hidden = false;
      modal.style.display = 'flex';
      loadSearch();
      setTimeout(() => input && input.focus(), 50);
    }

    function closeSearch() {
      if (!modal) return;
      modal.style.display = 'none';
      modal.hidden = true;
      if (input) input.value = '';
      if (results) note('Type to search...');
    }

    if (trigger) trigger.addEventListener('click', openSearch);
    if (closeBtn) closeBtn.addEventListener('click', closeSearch);
    if (modal) {
      modal.querySelector('.search-backdrop').addEventListener('click', closeSearch);
    }

    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      } else if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
        closeSearch();
      }
    });

    if (input) {
      input.addEventListener('input', () => {
        const query = input.value.trim().toLowerCase();
        if (!query || !searchIndex || searchIndex.length === 0) {
          note('Type to search...');
          return;
        }
        const matches = searchIndex.filter(item => 
          (item.title && item.title.toLowerCase().includes(query)) ||
          (item.description && item.description.toLowerCase().includes(query)) ||
          (item.content && item.content.toLowerCase().includes(query))
        ).slice(0, 8);

        if (matches.length === 0) {
          note('No results found for \u201c' + input.value.trim() + '\u201d');
          return;
        }

        results.replaceChildren(...matches.map((item) => {
          const link = document.createElement('a');
          link.className = 'search-item';
          // Entry URLs are site-relative (`/about/index.html`); the site
          // itself is served under a prefix (`/atlas`).
          link.href = (modal.dataset.base || '') + item.url;
          const title = document.createElement('div');
          title.className = 'search-item-title';
          title.textContent = item.title || '';
          const desc = document.createElement('div');
          desc.className = 'search-item-desc';
          desc.textContent = item.description || item.content || '';
          link.append(title, desc);
          return link;
        }));
      });
    }
  });
})();
