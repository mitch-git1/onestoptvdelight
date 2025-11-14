(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const ratingDropdownList = document.getElementById("rating-select");
    if (!ratingDropdownList) return;

    // Define the rating ranges
    const ratingRanges = [
      { label: "All", min: null, max: null },
      { label: "0 - 1", min: 0, max: 1 },
      { label: "1 - 2", min: 1, max: 2 },
      { label: "2 - 3", min: 2, max: 3 },
      { label: "3 - 4", min: 3, max: 4 },
      { label: "4 - 5", min: 4, max: 5 },
      { label: "5 - 6", min: 5, max: 6 },
      { label: "6 - 7", min: 6, max: 7 },
      { label: "7 - 8", min: 7, max: 8 },
      { label: "8 - 9", min: 8, max: 9 },
      { label: "9 - 10", min: 9, max: 10 },
    ];

    // Populate dropdown
    ratingDropdownList.innerHTML = "";
    ratingRanges.forEach((range) => {
      const option = document.createElement("option");
      option.value = range.min === null ? "all" : `${range.min}-${range.max}`;
      option.textContent = range.label;
      ratingDropdownList.appendChild(option);
    });

    // --- Filter function integrated with pagination ---
    function filterByRating() {
      const selectedRange = ratingDropdownList.value;
      let min = 0,
        max = 10;

      if (selectedRange !== "all") {
        [min, max] = selectedRange.split("-").map(Number);
      } else {
        min = null;
        max = null;
      }

      window.FilterPagination.applyFilters((container) => {
        const ratingElement = container.querySelector(".aniRating.name .value");
        if (!ratingElement) return false;

        const match = ratingElement.textContent.match(/\d+(\.\d+)?/);
        if (!match) return false;

        const ratingValue = parseFloat(match[0]);
        if (selectedRange === "all") return true;

        return ratingValue >= min && ratingValue <= max;
      });
    }

    // --- Hook event ---
    ratingDropdownList.addEventListener("change", filterByRating);

    // --- Initialize pagination system if not already done ---
    if (window.FilterPagination) window.FilterPagination.init();

    // --- Apply default state ---
    filterByRating();
  });
})();
