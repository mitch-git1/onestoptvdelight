(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const selectId = 'date-select';
    const dropdown = document.getElementById(selectId);
    if (!dropdown) return;

    // gather years
    const years = new Set();
    document.querySelectorAll('.aniDate.name .value').forEach(el => {
      const text = (el.textContent || '').trim();
      if (!text) return;
      // support formats like "YYYY" or "YYYY/MM/DD"
      const year = text.split('/')[0].trim();
      if (year) years.add(year);
    });

    dropdown.innerHTML = '';
    const allOpt = document.createElement('option');
    allOpt.value = 'all';
    allOpt.textContent = 'All';
    dropdown.appendChild(allOpt);

    Array.from(years).sort((a,b) => parseInt(b,10) - parseInt(a,10)).forEach(y => {
      const opt = document.createElement('option');
      opt.value = y;
      opt.textContent = y;
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

    function filterByYear() {
      const selected = dropdown.value || 'all';
      const containers = Array.from(document.querySelectorAll('.aniContainer'));
      let found = false;

      if (selected === 'all') {
        containers.forEach(c => { c.style.display = 'block'; found = true; });
      } else {
        containers.forEach(c => { c.style.display = 'none'; });
        containers.forEach(c => {
          const dateEl = c.querySelector('.aniDate.name .value');
          if (!dateEl) return;
          const year = (dateEl.textContent || '').trim().split('/')[0];
          if (year === selected) {
            c.style.display = 'block';
            found = true;
          }
        });
      }

      const msg = ensureNoResults();
      if (!found) {
        msg.style.display = 'block';
        msg.textContent = 'No results found for the selected year.';
      } else {
        msg.style.display = 'none';
      }
      document.dispatchEvent(new Event('filters-updated'));
    }

    dropdown.addEventListener('change', filterByYear);
    if (!dropdown.value) dropdown.value = 'all';
    filterByYear();
  });
})();
