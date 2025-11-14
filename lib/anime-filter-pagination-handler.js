(function () {
  const itemSelector = ".aniContainer";

  function getItemsPerPage() {
    // Use matchMedia to detect real responsive breakpoints instead of pixel width
    if (window.matchMedia("(max-width: 900px)").matches) {
      return 15; // Mobile
    } else if (window.matchMedia("(max-width: 1200px)").matches) {
      return 20; // Tablet
    } else {
      return 30; // Desktop
    }
  }

  let itemsPerPage = getItemsPerPage();
  let container = null;
  let allItems = [];
  let filteredItems = [];
  let currentPage = 1;
  let listeners = [];

  function findContainer() {
    const tv = document.getElementById("tvshows-container");
    const movies = document.getElementById("movies-container");
    return tv || movies || document.body;
  }

  function scanItems() {
    container = findContainer();
    allItems = Array.from(container.querySelectorAll(itemSelector));
    allItems.forEach(it => {
      if (!it.dataset.__origDisplay) {
        const cs = window.getComputedStyle(it);
        it.dataset.__origDisplay = it.style.display || cs.display || "block";
      }
    });
    filteredItems = [...allItems];
  }

  function notify() {
    listeners.forEach(fn => {
      try {
        fn({
          filteredItems,
          currentPage,
          totalItems: allItems.length,
          totalFiltered: filteredItems.length,
          itemsPerPage
        });
      } catch (e) {
        console.error("FilterPagination listener error", e);
      }
    });
  }

  function init() {
    container = findContainer();
    scanItems();
    applyPagination(1);

    // Recheck after short delay to stabilize layout
    setTimeout(() => {
      const correctCount = getItemsPerPage();
      if (correctCount !== itemsPerPage) {
        itemsPerPage = correctCount;
        applyPagination(1);
      }
    }, 400);

    ["resize", "orientationchange"].forEach(evt => {
      window.addEventListener(evt, () => {
        const newCount = getItemsPerPage();
        if (newCount !== itemsPerPage) {
          itemsPerPage = newCount;
          applyPagination(1);
        }
      });
    });

    try {
      const mo = new MutationObserver(() => {
        const newList = Array.from(findContainer().querySelectorAll(itemSelector));
        if (newList.length !== allItems.length) {
          scanItems();
          applyPagination(1);
          notify();
        }
      });
      mo.observe(findContainer(), { childList: true, subtree: true });
    } catch (e) {}
  }

  function applyPagination(page = 1) {
    currentPage = Math.max(1, Math.floor(page));
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    console.log("DEBUG pagination:", { width: window.innerWidth, itemsPerPage, totalItems: allItems.length, start, end });

    allItems.forEach(item => (item.style.display = "none"));
    const pageItems = filteredItems.slice(start, end);
    if (pageItems.length > 0) {
      pageItems.forEach(item => {
        const orig = item.dataset.__origDisplay || "block";
        item.style.display = orig === "none" ? "block" : orig;
      });
      hideNoResultsMessage();
    } else {
      hideAllAndShowNoItems();
    }
    notify();
  }

  function hideAllAndShowNoItems() {
    allItems.forEach(it => (it.style.display = "none"));
    showNoResultsMessage("No items to display on this page.");
  }

  function applyFilters(filterFn) {
    filteredItems = allItems.filter(filterFn);
    if (filteredItems.length === 0) {
      hideAllAndShowNoItems();
    } else {
      applyPagination(1);
    }
    notify();
  }

  function showNoResultsMessage(msg) {
    let msgBox = document.getElementById("no-results-message");
    if (!msgBox) {
      msgBox = document.createElement("div");
      msgBox.id = "no-results-message";
      msgBox.style.textAlign = "center";
      msgBox.style.color = "#ccc";
      msgBox.style.margin = "20px 0";
      msgBox.style.fontSize = "18px";
      const parent = container || document.body;
      parent.appendChild(msgBox);
    }
    msgBox.textContent = msg;
    msgBox.style.display = "block";
  }

  function hideNoResultsMessage() {
    const msgBox = document.getElementById("no-results-message");
    if (msgBox) msgBox.style.display = "none";
  }

  function onChange(fn) {
    if (typeof fn === "function") listeners.push(fn);
    fn && fn({
      filteredItems,
      currentPage,
      totalItems: allItems.length,
      totalFiltered: filteredItems.length,
      itemsPerPage
    });
  }

  function getState() {
    return {
      filteredItems,
      currentPage,
      totalItems: allItems.length,
      totalFiltered: filteredItems.length,
      itemsPerPage
    };
  }

  window.FilterPagination = {
    init,
    applyFilters,
    applyPagination,
    onChange,
    getState
  };

  // ✅ Force immediate initialization and mobile check
  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(() => {
      init();
      const correctCount = getItemsPerPage();
      if (correctCount !== itemsPerPage) {
        itemsPerPage = correctCount;
        applyPagination(1);
      }
    }, 100);
  } else {
    window.addEventListener("DOMContentLoaded", () => {
      init();
      const correctCount = getItemsPerPage();
      if (correctCount !== itemsPerPage) {
        itemsPerPage = correctCount;
        applyPagination(1);
      }
    });
  }
})();