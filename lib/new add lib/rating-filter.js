(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const selectId = 'rating-select';
    const dropdown = document.getElementById(selectId);
    if (!dropdown) return;

    // rating ranges (same as your existing ranges)
    const ratingRanges = [
      { label: 'All', value: 'all' },
      { label: '0 - 1', min: 0, max: 1 },
      { label: '1 - 2', min: 1, max: 2 },
      { label: '2 - 3', min: 2, max: 3 },
      { label: '3 - 4', min: 3, max: 4 },
      { label: '4 - 5', min: 4, max: 5 },
      { label: '5 - 6', min: 5, max: 6 },
      { label: '6 - 7', min: 6, max: 7 },
      { label: '7 - 8', min: 7, max: 8 },
      { label: '8 - 9', min: 8, max: 9 },
      { label: '9 - 10', min: 9, max: 10 },
    ];

    dropdown.innerHTML = '';
    ratingRanges.forEach(range => {
      const opt = document.createElement('option');
      opt.value = range.value === 'all' ? 'all' : `${range.min} to ${range.max}`;
      opt.textContent = range.label;
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

    function parseRatingFromText(text) {
      if (!text) return NaN;
      // find first number like 7.6 or 8
      const m = text.match(/(\d+(\.\d+)?)/);
      return m ? parseFloat(m[1]) : NaN;
    }

    function filterByRating() {
      const selected = dropdown.value || 'all';
      const containers = Array.from(document.querySelectorAll('.aniContainer'));
      let found = false;

      if (selected === 'all') {
        containers.forEach(c=> { c.style.display = 'block'; found = true; });
      } else {
        const [min, max] = selected.split(' to ').map(Number);
        containers.forEach(c => {
          const el = c.querySelector('.aniRating.name .value');
          if (!el) { c.style.display = 'none'; return; }
          const rating = parseRatingFromText(el.textContent || '');
          if (!isNaN(rating) && rating >= min && rating <= max) {
            c.style.display = 'block';
            found = true;
          } else {
            c.style.display = 'none';
          }
        });
      }

      const msg = ensureNoResults();
      if (!found) {
        msg.style.display = 'block';
        msg.textContent = 'No results found for the selected rating.';
      } else {
        msg.style.display = 'none';
      }
      document.dispatchEvent(new Event('filters-updated'));
    }

    dropdown.addEventListener('change', filterByRating);
    if (!dropdown.value) dropdown.value = 'all';
    filterByRating();
  });
})();
