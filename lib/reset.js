// lib/reset-filters.js
(function () {
  function log(...args) { try { console.debug("[ResetFilters]", ...args); } catch(e){} }

  function safeDispatch(el, name) {
    if (!el) return;
    try {
      let ev;
      // 'input' and 'change' are common; include click for edge cases
      if (name === 'input' || name === 'change') {
        ev = new Event(name, { bubbles: true, cancelable: true });
      } else {
        ev = new MouseEvent(name, { bubbles: true, cancelable: true });
      }
      el.dispatchEvent(ev);
    } catch (err) {
      log("dispatch fallback", name, err);
      try {
        const ev2 = document.createEvent('HTMLEvents');
        ev2.initEvent(name, true, false);
        el.dispatchEvent(ev2);
      } catch (err2) {
        console.warn("[ResetFilters] dispatch failed for", name, err2);
      }
    }
  }

  function findAllSelectsInContainer() {
    const container = document.querySelector('.dropdown-container');
    if (!container) return [];
    return Array.from(container.querySelectorAll('select'));
  }

  function resetSelect(el) {
    if (!el) return false;
    // try to find an option with value 'all'
    const allOption = Array.from(el.options).find(o => String(o.value).toLowerCase() === 'all');
    if (allOption) {
      el.value = allOption.value;
      el.selectedIndex = allOption.index;
    } else {
      // fallback to first option
      el.selectedIndex = 0;
      el.value = el.options[0] ? el.options[0].value : "";
    }
    // ensure attribute/state is synced
    el.setAttribute('data-reset', '1');
    safeDispatch(el, 'input');
    safeDispatch(el, 'change');
    safeDispatch(el, 'click');
    log("reset select", el.id || el.name || el, "to", el.value);
    return true;
  }

  function resetEverything() {
    log("starting resetEverything");

    const selects = findAllSelectsInContainer();
    if (selects.length === 0) log("no selects found in .dropdown-container");

    selects.forEach(resetSelect);

    // Also attempt to reset specific selects by ID as backup
    ['genre-select','date-select','age-rating-select','rating-select'].forEach(id => {
      const s = document.getElementById(id);
      if (s && !selects.includes(s)) resetSelect(s);
    });

    // Reset search box
    const searchBox = document.getElementById('search_box') || document.querySelector('input[type="text"][id*="search"]');
    if (searchBox) {
      searchBox.value = "";
      safeDispatch(searchBox, 'input');
      safeDispatch(searchBox, 'change');
      log("cleared search box");
      if (typeof window.searchOnPage === 'function') {
        try {
          window.searchOnPage("");
          log("called searchOnPage(\"\")");
        } catch (err) {
          log("searchOnPage threw", err);
        }
      }
    } else {
      log("no search box found");
    }

    // Uncheck updated toggle if exists
    const updatedToggle = document.getElementById('show-updated-toggle') || document.querySelector('.toggle-container input[type="checkbox"]');
    if (updatedToggle) {
      updatedToggle.checked = false;
      safeDispatch(updatedToggle, 'change');
      log("unchecked updated-toggle");
    }

    // Use FilterPagination to force show-all
    if (window.FilterPagination && typeof window.FilterPagination.applyFilters === 'function') {
      try {
        window.FilterPagination.applyFilters(() => true);
        log("called FilterPagination.applyFilters(() => true)");
      } catch (err) {
        log("FilterPagination.applyFilters threw", err);
      }

      if (typeof window.FilterPagination.resetPagination === 'function') {
        try {
          window.FilterPagination.resetPagination();
          log("called FilterPagination.resetPagination()");
        } catch (err) { log("resetPagination threw", err); }
      } else if (typeof window.FilterPagination.init === 'function') {
        try {
          window.FilterPagination.init();
          log("called FilterPagination.init() fallback");
        } catch (err) { log("init() threw", err); }
      } else {
        log("no resetPagination or init methods on FilterPagination");
      }
    } else {
      log("window.FilterPagination not found or missing applyFilters");
    }

    // Optional: small delay then attempt to show all containers manually as a last resort
    setTimeout(() => {
      try {
        const allContainers = Array.from(document.querySelectorAll('.aniContainer'));
        if (allContainers.length) {
          allContainers.forEach(c => {
            c.style.display = ''; // clear inline hide
            c.classList.remove('filtered-out');
          });
          log("manually showed all .aniContainer elements as fallback");
        }
      } catch(e) {
        log("manual fallback show-all failed", e);
      }
    }, 80);
  }

  document.addEventListener('DOMContentLoaded', function() {
    const resetBtn = document.getElementById('reset-filters-button') || document.querySelector('.reset-filters');
    if (!resetBtn) {
      log("Reset button (#reset-filters-button or .reset-filters) not found in DOM");
      return;
    }
    resetBtn.addEventListener('click', function(ev){
      ev.preventDefault();
      resetEverything();
    }, { passive: false });

    resetBtn.addEventListener('touchstart', function(ev) {
      ev.preventDefault();
      resetEverything();
    }, { passive: false });

    log("reset-filters script attached to button", resetBtn);
  });
})();
