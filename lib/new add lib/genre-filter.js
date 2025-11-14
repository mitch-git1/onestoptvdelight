(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const selectId = 'genre-select';
    const dropdown = document.getElementById(selectId);
    if (!dropdown) return;

    // populate options
    const uniqueGenres = new Set();
    document.querySelectorAll('.aniGenre.name .value').forEach(el => {
      const text = (el.textContent || '').trim();
      if (!text) return;
      text.split(',').map(s => s.trim()).forEach(g => { if (g) uniqueGenres.add(g); });
    });

    // clear then add All + sorted genres
    dropdown.innerHTML = '';
    const allOpt = document.createElement('option');
    allOpt.value = 'all';
    allOpt.textContent = 'All';
    dropdown.appendChild(allOpt);

    Array.from(uniqueGenres).sort((a,b)=> a.localeCompare(b)).forEach(g => {
      const opt = document.createElement('option');
      opt.value = g;
      opt.textContent = g;
      dropdown.appendChild(opt);
    });

    function ensureNoResults() {
      let msg = document.getElementById('no-results-message');
      if (!msg) {
        msg = document.createElement('div');
        msg.id = 'no-results-message';
        msg.className = 'no-results-message';
        msg.style.display = 'none';
        // append to sensible place
        const parent = document.querySelector('.infoContainer') || document.body;
        parent.appendChild(msg);
      }
      return msg;
    }

    function filterByGenre() {
      const selected = (dropdown.value || 'all').toLowerCase();
      const containers = Array.from(document.querySelectorAll('.aniContainer'));
      let found = false;

      if (selected === 'all') {
        containers.forEach(c => { c.style.display = 'block'; found = true; });
      } else {
        containers.forEach(c => { c.style.display = 'none'; });
        document.querySelectorAll('.aniGenre.name .value').forEach(el => {
          const container = el.closest('.aniContainer');
          if (!container) return;
          const values = (el.textContent || '').trim().toLowerCase().split(',').map(s=>s.trim());
          if (values.includes(selected)) {
            container.style.display = 'block';
            found = true;
          }
        });
      }

      const msg = ensureNoResults();
      if (!found) {
        msg.style.display = 'block';
        msg.textContent = 'No results found for the selected genre.';
      } else {
        msg.style.display = 'none';
      }
      // notify other code if needed
      document.dispatchEvent(new Event('filters-updated'));
    }

    dropdown.addEventListener('change', filterByGenre);
    // default to "all"
    if (!dropdown.value) dropdown.value = 'all';
    filterByGenre();
  });
})();
