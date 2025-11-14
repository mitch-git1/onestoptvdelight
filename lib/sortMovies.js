(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("movies-container") || document.getElementById("largeContainer");
    if (!container) {
      console.warn("sortMovies: movies container not found.");
      return;
    }

    const nodes = Array.from(container.querySelectorAll(".aniContainer"));
    if (nodes.length === 0) return;

    const list = nodes.map(el => {
      const idMatch = (el.id || "").match(/movie_(\d+)$/);
      return {
        el,
        originalId: idMatch ? idMatch[1] : null,
        title: (el.querySelector(".aniName .value")?.textContent || el.querySelector(".name .value")?.textContent || "").trim().toLowerCase()
      };
    });

    // Sort by title
    list.sort((a, b) => a.title.localeCompare(b.title));

    // Re-append and update attributes per item
    list.forEach((item, idx) => {
      const newIdNum = idx + 1;
      const orig = item.originalId;
      const el = item.el;

      // move into container in new order
      container.appendChild(el);

      // update top-level id
      el.id = `movie_${newIdNum}`;

      // update descendant IDs that end with _<orig>
      if (orig) {
        Array.from(el.querySelectorAll('[id]')).forEach(node => {
          if (node.id && node.id.endsWith(`_${orig}`)) {
            node.id = node.id.replace(new RegExp(`_${orig}$`), `_${newIdNum}`);
          }
        });

        // update data-plotid attributes equal to orig
        Array.from(el.querySelectorAll('[data-plotid]')).forEach(node => {
          if (String(node.getAttribute('data-plotid')) === String(orig)) {
            node.setAttribute('data-plotid', String(newIdNum));
          }
        });

        // update rel attributes equal to orig
        Array.from(el.querySelectorAll('[rel]')).forEach(node => {
          if (String(node.getAttribute('rel')) === String(orig)) {
            node.setAttribute('rel', String(newIdNum));
          }
        });

        // update a few common custom attributes if present
        ['data-rel','data-id','data-itemid'].forEach(attr => {
          Array.from(el.querySelectorAll(`[${attr}]`)).forEach(node => {
            if (String(node.getAttribute(attr)) === String(orig)) {
              node.setAttribute(attr, String(newIdNum));
            }
          });
        });
      }

      // Update visible # identifier text if present
      const showId = el.querySelector('.showId');
      if (showId) showId.textContent = `#${newIdNum}`;

      // --- Update trailer link data attribute with correct title + year ---
      const titleEl = el.querySelector('.aniName .value');
      const yearEl = el.querySelector('.aniDate .value');
      const trailerLink = el.querySelector('.anilink.name a');

      if (trailerLink) {
        const titleText = titleEl ? titleEl.textContent.trim() : "";
        const yearText = yearEl ? yearEl.textContent.trim().split("/")[0] : "";
        const combined = yearText ? `${titleText} (${yearText})` : titleText;

        // set both possible attributes so both movie/tv handlers can read it
        trailerLink.setAttribute('data-movie-name-date', combined);
        trailerLink.setAttribute('data-show-name-date', combined);
      }
    });

    // After sorting: re-initialize FilterPagination/pagination (retry until available)
    function refreshPaginationWhenReady(attemptsLeft = 12) {
      if (window.FilterPagination && typeof window.FilterPagination.init === "function") {
        try {
          window.FilterPagination.init();
          window.FilterPagination.applyPagination(1);
        } catch (e) {
          console.warn("sortMovies: FilterPagination init failed, retrying...", e);
        }
      } else if (attemptsLeft > 0) {
        setTimeout(() => refreshPaginationWhenReady(attemptsLeft - 1), 200);
      }
    }
    refreshPaginationWhenReady();
  });
})();

