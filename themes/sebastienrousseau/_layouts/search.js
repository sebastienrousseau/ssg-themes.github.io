/* Instant Client-Side Search Engine for SSG Themes */
(function() {
  var searchModal = null;
  var searchInput = null;
  var searchResults = null;
  var searchData = [];

  function initSearch() {
    createSearchModal();
    fetchSearchData();
    bindEvents();
  }

  function createSearchModal() {
    var modalHtml = `
      <div id="ssgSearchModal" class="search-modal" hidden aria-hidden="true" role="dialog" aria-label="Site Search">
        <div class="search-modal-backdrop" id="searchBackdrop"></div>
        <div class="search-modal-card">
          <div class="search-header">
            <input type="search" id="ssgSearchInput" placeholder="Type to search pages, articles, case studies..." aria-label="Search site content" autocomplete="off">
            <button type="button" id="closeSearchBtn" class="search-close-btn" aria-label="Close search">✕</button>
          </div>
          <div id="ssgSearchResults" class="search-results" role="region" aria-live="polite">
            <p class="search-placeholder">Start typing to search...</p>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    searchModal = document.getElementById('ssgSearchModal');
    searchInput = document.getElementById('ssgSearchInput');
    searchResults = document.getElementById('ssgSearchResults');
  }

  function fetchSearchData() {
    fetch('search-index.json')
      .then(function(res) {
        if (!res.ok) throw new Error('Local search index not found');
        return res.json();
      })
      .then(function(data) { searchData = data; })
      .catch(function() {
        fetch('../search-index.json')
          .then(function(res) {
            if (!res.ok) throw new Error('Parent search index not found');
            return res.json();
          })
          .then(function(data) { searchData = data; })
          .catch(function() { searchData = []; });
      });
  }

  function bindEvents() {
    document.addEventListener('keydown', function(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      } else if (e.key === 'Escape' && searchModal && !searchModal.hidden) {
        closeSearch();
      }
    });

    var triggerBtns = document.querySelectorAll('.search-trigger');
    triggerBtns.forEach(function(btn) {
      btn.addEventListener('click', openSearch);
    });

    var closeBtn = document.getElementById('closeSearchBtn');
    if (closeBtn) closeBtn.addEventListener('click', closeSearch);

    var backdrop = document.getElementById('searchBackdrop');
    if (backdrop) backdrop.addEventListener('click', closeSearch);

    if (searchInput) {
      searchInput.addEventListener('input', handleSearch);
    }
  }

  function openSearch() {
    if (!searchModal) return;
    searchModal.hidden = false;
    searchModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(function() { if (searchInput) searchInput.focus(); }, 50);
  }

  function closeSearch() {
    if (!searchModal) return;
    searchModal.hidden = true;
    searchModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function handleSearch() {
    var query = searchInput.value.trim().toLowerCase();
    if (!query) {
      searchResults.innerHTML = '<p class="search-placeholder">Start typing to search...</p>';
      return;
    }

    var matches = searchData.filter(function(item) {
      return (item.title && item.title.toLowerCase().indexOf(query) !== -1) ||
             (item.description && item.description.toLowerCase().indexOf(query) !== -1) ||
             (item.content && item.content.toLowerCase().indexOf(query) !== -1);
    });

    if (matches.length === 0) {
      searchResults.innerHTML = '<p class="search-placeholder">No matching content found for "' + escapeHtml(query) + '".</p>';
      return;
    }

    var html = '<ul class="search-results-list">';
    matches.forEach(function(item) {
      html += '<li><a href="' + item.url + '"><strong>' + escapeHtml(item.title) + '</strong><br><small>' + escapeHtml(item.description || '') + '</small></a></li>';
    });
    html += '</ul>';
    searchResults.innerHTML = html;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
  } else {
    initSearch();
  }
})();
