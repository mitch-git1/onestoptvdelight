// year and genre filter.js (fully unified + pagination integrated)
// Works with: filter-pagination-handler.js + tv pagination.js + other filters

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    // Dropdowns
    const genreDropdown = document.getElementById("genre-select");
    const dateDropdown = document.getElementById("date-select");
    const ratingDropdown = document.getElementById("rating-select");
    const ageRatingDropdown = document.getElementById("age-rating-select");

    // Ensure dropdowns exist
    if (!genreDropdown && !dateDropdown && !ratingDropdown && !ageRatingDropdown) {
      console.warn("No filter dropdowns found — combined filter not initialized.");
      return;
    }

    // --- Central unified filter function ---
    function combinedFilter() {
      const selectedGenre = genreDropdown ? genreDropdown.value.toLowerCase() : "all";
      const selectedYear = dateDropdown ? dateDropdown.value : "all";
      const selectedRatingRange = ratingDropdown ? ratingDropdown.value : "all";
      const selectedAgeRating = ageRatingDropdown ? ageRatingDropdown.value.toLowerCase() : "all";

      let minRating = 0,
        maxRating = 10;
      if (selectedRatingRange !== "all" && selectedRatingRange.includes("-")) {
        [minRating, maxRating] = selectedRatingRange.split("-").map(Number);
      }

      // Apply unified logic via FilterPagination
      window.FilterPagination.applyFilters((container) => {
        const genreText = container.querySelector(".aniGenre.name .value")?.textContent.toLowerCase() || "";
        const dateText = container.querySelector(".aniDate.name .value")?.textContent || "";
        const ratingText = container.querySelector(".aniRating.name .value")?.textContent || "";
        const ageText = container.querySelector(".aniAgeRating.name .value")?.textContent.toLowerCase() || "";

        const year = dateText.split("/")[0] || "";
        const ratingMatchNum = ratingText.match(/\d+(\.\d+)?/);
        const ratingValue = ratingMatchNum ? parseFloat(ratingMatchNum[0]) : null;

        const genreMatch = selectedGenre === "all" || genreText.includes(selectedGenre);
        const yearMatch = selectedYear === "all" || year === selectedYear;
        const ratingMatch =
          selectedRatingRange === "all" ||
          (ratingValue !== null && ratingValue >= minRating && ratingValue <= maxRating);
        const ageMatch = selectedAgeRating === "all" || ageText === selectedAgeRating;

        return genreMatch && yearMatch && ratingMatch && ageMatch;
      });
    }

    // --- Hook event listeners to all filters ---
    if (genreDropdown) genreDropdown.addEventListener("change", combinedFilter);
    if (dateDropdown) dateDropdown.addEventListener("change", combinedFilter);
    if (ratingDropdown) ratingDropdown.addEventListener("change", combinedFilter);
    if (ageRatingDropdown) ageRatingDropdown.addEventListener("change", combinedFilter);

    // --- Initialize pagination + first filter pass ---
    if (window.FilterPagination) window.FilterPagination.init();
    combinedFilter();
  });
})();
