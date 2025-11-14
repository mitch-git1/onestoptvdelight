(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const selectId = 'age-rating-select';
    const dropdown = document.getElementById(selectId);
    if (!dropdown) return;

    // gather unique age ratings
    const set = new Set();
    document.querySelectorAll('.aniAgeRating.name .value').forEach(el => {
      const t = (el.textContent || '').trim();
      if (t) set.add(t);
    });

    dropdown.innerHTML = '';
    const allOpt = document.createElement('option');
    allOpt.value = 'all';
    allOpt.textContent = 'All';
    dropdown.appendChild(allOpt);

    Array.from(set).sort((a,b)=> a.localeCompare(b)).forEach(item => {
      const opt = document.createElement('option');
      opt.value = item;
      opt.textContent = item;
      dropdown.appendChild(opt);
    });

    function ensureNoResults() {
      let msg = document.getElementById('no-results-message');
      if (!msg) {
        msg = document.createElement('div');
        msg.id = 'no-results-message';
        msg.className = 'no-results-message';
        msg.style.display = 'none';
        const parent = document.querySelector('.infoContainer') || document.body;
        parent.appendChild(msg);
      }
      return msg;
    }

    function filterByAgeRating() {
      const selected = (dropdown.value || 'all').trim().toLowerCase();
      const containers = Array.from(document.querySelectorAll('.aniContainer'));
      let found = false;

      if (selected === 'all') {
        containers.forEach(c => { c.style.display = 'block'; found = true; });
      } else {
        containers.forEach(c => { c.style.display = 'none'; });
        containers.forEach(c => {
          const el = c.querySelector('.aniAgeRating.name .value');
          if (!el) return;
          const val = (el.textContent || '').trim().toLowerCase();
          if (val === selected) {
            c.style.display = 'block';
            found = true;
          }
        });
      }

      const msg = ensureNoResults();
      if (!found) {
        msg.style.display = 'block';
        msg.textContent = 'No results found for the selected age rating.';
      } else {
        msg.style.display = 'none';
      }
      document.dispatchEvent(new Event('filters-updated'));
    }

    dropdown.addEventListener('change', filterByAgeRating);
    if (!dropdown.value) dropdown.value = 'all';
    filterByAgeRating();
  });
})();
