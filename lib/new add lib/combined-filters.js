(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const genreSelect = document.getElementById('genre-select');
    const yearSelect = document.getElementById('date-select');
    const ageSelect = document.getElementById('age-rating-select');
    const ratingSelect = document.getElementById('rating-select');

    // if none exist, nothing to do
    if (!genreSelect && !yearSelect && !ageSelect && !ratingSelect) return;

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
      const m = text.match(/(\d+(\.\d+)?)/);
      return m ? parseFloat(m[1]) : NaN;
    }

    function filterCombined() {
      const selectedGenre = genreSelect ? (genreSelect.value || 'all').toString().trim().toLowerCase() : 'all';
      const selectedYear = yearSelect ? (yearSelect.value || 'all').toString().trim() : 'all';
      const selectedAge = ageSelect ? (ageSelect.value || 'all').toString().trim().toLowerCase() : 'all';
      const selectedRating = ratingSelect ? (ratingSelect.value || 'all').toString().trim() : 'all';

      const containers = Array.from(document.querySelectorAll('.aniContainer'));
      let found = false;

      // prepare rating bounds if applicable
      let ratingMin = -Infinity, ratingMax = Infinity;
      if (selectedRating !== 'all') {
        const parts = selectedRating.split(' to ').map(Number);
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          ratingMin = parts[0];
          ratingMax = parts[1];
        } else {
          ratingMin = -Infinity; ratingMax = Infinity;
        }
      }

      containers.forEach(c => {
        // fetch fields
        const genreEl = c.querySelector('.aniGenre.name .value');
        const dateEl = c.querySelector('.aniDate.name .value');
        const ageEl = c.querySelector('.aniAgeRating.name .value');
        const ratingEl = c.querySelector('.aniRating.name .value');

        const genreVals = genreEl ? (genreEl.textContent || '').trim().toLowerCase().split(',').map(s=>s.trim()) : [];
        const yearVal = dateEl ? ((dateEl.textContent || '').trim().split('/')[0]) : '';
        const ageVal = ageEl ? (ageEl.textContent || '').trim().toLowerCase() : '';
        const ratingVal = ratingEl ? parseRatingFromText(ratingEl.textContent || '') : NaN;

        const genreMatch = (selectedGenre === 'all') || (genreVals && genreVals.includes(selectedGenre));
        const yearMatch = (selectedYear === 'all') || (yearVal === selectedYear);
        const ageMatch = (selectedAge === 'all') || (ageVal === selectedAge);
        const ratingMatch = (selectedRating === 'all') || (!isNaN(ratingVal) && ratingVal >= ratingMin && ratingVal <= ratingMax);

        if (genreMatch && yearMatch && ageMatch && ratingMatch) {
          c.style.display = 'block';
          found = true;
        } else {
          c.style.display = 'none';
        }
      });

      const msg = ensureNoResults();
      if (!found) {
        msg.style.display = 'block';
        msg.textContent = 'No Matches found for your selection.';
      } else {
        msg.style.display = 'none';
      }
    }

    // listen to changes on selects
    [genreSelect, yearSelect, ageSelect, ratingSelect].forEach(s => {
      if (!s) return;
      s.addEventListener('change', function () {
        // run combined filter when any dropdown changes
        filterCombined();
      });
    });

    // also respond if other scripts dispatch this after they finish
    document.addEventListener('filters-updated', function () {
      // when other independent filters run they update single-filter state;
      // combined should run and ensure combined state if present.
      filterCombined();
    });

    // initial run
    filterCombined();
  });
})();
