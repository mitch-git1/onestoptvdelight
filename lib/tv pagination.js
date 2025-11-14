(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("tvshows-container");
    if (!container) return;

    let currentPage = 1;

    // UI elements
    let paginationTop = document.getElementById("pagination-top");
    let paginationBottom = document.getElementById("pagination-bottom");
    let rangeDisplay = null;
    if (!paginationTop) {
      paginationTop = document.createElement("div");
      paginationTop.id = "pagination-top";
      container.insertBefore(paginationTop, container.firstChild);
    }
    if (!paginationBottom) {
      paginationBottom = document.createElement("div");
      paginationBottom.id = "pagination-bottom";
      container.appendChild(paginationBottom);
    }
    // range display (below bottom)
    rangeDisplay = document.createElement("div");
    rangeDisplay.className = "range-display";
    container.appendChild(rangeDisplay);

    // helper to build buttons
    function makeButton(label, page, disabled = false, active = false) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = label;
      if (disabled) btn.disabled = true;
      if (active) btn.classList.add("active");
      btn.addEventListener("click", () => goToPage(page));
      return btn;
    }

    // get current itemsPerPage from FilterPagination (fallback to 50)
    function getItemsPerPage() {
      try {
        return (window.FilterPagination && window.FilterPagination.getState && window.FilterPagination.getState().itemsPerPage) || 50;
      } catch (e) {
        return 50;
      }
    }

    // render controls with truncation
    function renderControls(activePage, totalFiltered) {
      const itemsPerPage = getItemsPerPage();
      const totalPages = Math.max(1, Math.ceil(totalFiltered / itemsPerPage));
      paginationTop.innerHTML = "";
      paginationBottom.innerHTML = "";

      if (totalPages <= 1) {
        // nothing to show
        rangeDisplay.textContent = `Showing all ${totalFiltered} results`;
        return;
      }

      function buildBar(containerEl) {
        const frag = document.createDocumentFragment();

        frag.appendChild(makeButton("First", 1, activePage === 1));
        frag.appendChild(makeButton("Prev", activePage - 1, activePage === 1));

        const maxVisible = 10;
        let startPage = Math.max(1, activePage - 4);
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);
        if (endPage - startPage < maxVisible - 1) {
          startPage = Math.max(1, endPage - maxVisible + 1);
        }

        if (startPage > 1) {
          frag.appendChild(makeButton("1", 1));
          if (startPage > 2) {
            const dots = document.createElement("span");
            dots.className = "pagination-dots";
            dots.textContent = "...";
            frag.appendChild(dots);
          }
        }

        for (let i = startPage; i <= endPage; i++) {
          frag.appendChild(makeButton(String(i), i, false, i === activePage));
        }

        if (endPage < totalPages) {
          if (endPage < totalPages - 1) {
            const dots2 = document.createElement("span");
            dots2.className = "pagination-dots";
            dots2.textContent = "...";
            frag.appendChild(dots2);
          }
          frag.appendChild(makeButton(String(totalPages), totalPages));
        }

        frag.appendChild(makeButton("Next", activePage + 1, activePage === totalPages));
        frag.appendChild(makeButton("Last", totalPages, activePage === totalPages));
        containerEl.appendChild(frag);
      }

      buildBar(paginationTop);
      buildBar(paginationBottom);
    }

    function updateRangeDisplay(activePage, totalFiltered) {
      const itemsPerPage = getItemsPerPage();
      const total = totalFiltered;
      const start = (activePage - 1) * itemsPerPage + 1;
      const end = Math.min(start + itemsPerPage - 1, total);
      if (total === 0) rangeDisplay.textContent = `Showing 0 results`;
      else rangeDisplay.textContent = `Showing ${start}–${end} of ${total} results`;
    }

    function goToPage(page) {
      const state = window.FilterPagination.getState();
      const totalFiltered = state.totalFiltered;
      const itemsPerPage = getItemsPerPage();
      const totalPages = Math.max(1, Math.ceil(totalFiltered / itemsPerPage));
      if (page < 1) page = 1;
      if (page > totalPages) page = totalPages;
      currentPage = page;
      // tell FilterPagination to apply pagination (it will hide/show items)
      window.FilterPagination.applyPagination(page);
      // scroll to top of container
      const top = container.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: Math.max(0, top - 10), behavior: "smooth" });
    }

    // subscribe to state changes
    if (window.FilterPagination && typeof window.FilterPagination.onChange === "function") {
      window.FilterPagination.onChange(({ filteredItems, currentPage: fpPage, totalFiltered }) => {
        const pageToRender = fpPage || currentPage;
        renderControls(pageToRender, totalFiltered);
        updateRangeDisplay(pageToRender, totalFiltered);
      });
    } else {
      console.warn("FilterPagination not found for TV pagination.");
    }
  });
})();