(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const dateDropdown = document.getElementById("date-select");
    if (!dateDropdown) return;

    // --- Gather all unique years from the show/movie list ---
    const uniqueYears = new Set();
    document.querySelectorAll(".aniDate.name .value").forEach((el) => {
      const text = el.textContent.trim();
      const year = text.split("/")[0]; // Expected format: YYYY/MM/DD
      if (year && !isNaN(year)) uniqueYears.add(year);
    });

    // --- Populate dropdown ---
    dateDropdown.innerHTML = "";
    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "All";
    dateDropdown.appendChild(allOption);

    Array.from(uniqueYears)
      .sort((a, b) => parseInt(b) - parseInt(a)) // Descending order
      .forEach((year) => {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        dateDropdown.appendChild(option);
      });

    // --- Central combined filter function ---
    function combinedFilter() {
      const selectedYear = dateDropdown.value;

      // Retrieve other filter values if they exist
      const genreDropdown = document.getElementById("genre-select");
      const ratingDropdown = document.getElementById("rating-select");
      const ageRatingDropdown = document.getElementById("age-rating-select");

      const selectedGenre = genreDropdown ? genreDropdown.value.toLowerCase() : "all";
      const selectedRatingRange = ratingDropdown ? ratingDropdown.value : "all";
      const selectedAgeRating = ageRatingDropdown ? ageRatingDropdown.value.toLowerCase() : "all";

      let minRating = 0,
        maxRating = 10;
      if (selectedRatingRange !== "all" && selectedRatingRange.includes("-")) {
        [minRating, maxRating] = selectedRatingRange.split("-").map(Number);
      }

      // Apply unified filtering logic via FilterPagination
      window.FilterPagination.applyFilters((container) => {
        const dateText = container.querySelector(".aniDate.name .value")?.textContent || "";
        const year = dateText.split("/")[0] || "";

        const genreText = container.querySelector(".aniGenre.name .value")?.textContent.toLowerCase() || "";
        const ratingText = container.querySelector(".aniRating.name .value")?.textContent || "";
        const ageText = container.querySelector(".aniAgeRating.name .value")?.textContent.toLowerCase() || "";

        const ratingMatchNum = ratingText.match(/\d+(\.\d+)?/);
        const ratingValue = ratingMatchNum ? parseFloat(ratingMatchNum[0]) : null;

        const yearMatch = selectedYear === "all" || year === selectedYear;
        const genreMatch = selectedGenre === "all" || genreText.includes(selectedGenre);
        const ratingMatch =
          selectedRatingRange === "all" ||
          (ratingValue !== null && ratingValue >= minRating && ratingValue <= maxRating);
        const ageMatch = selectedAgeRating === "all" || ageText === selectedAgeRating;

        return yearMatch && genreMatch && ratingMatch && ageMatch;
      });
    }

    // --- Hook events to re-filter when dropdowns change ---
    dateDropdown.addEventListener("change", combinedFilter);

    const genreDropdown = document.getElementById("genre-select");
    if (genreDropdown) genreDropdown.addEventListener("change", combinedFilter);

    const ratingDropdown = document.getElementById("rating-select");
    if (ratingDropdown) ratingDropdown.addEventListener("change", combinedFilter);

    const ageRatingDropdown = document.getElementById("age-rating-select");
    if (ageRatingDropdown) ageRatingDropdown.addEventListener("change", combinedFilter);

    // --- Initialize pagination system if not already done ---
    if (window.FilterPagination) window.FilterPagination.init();

    // --- Initial filter run (show everything by default) ---
    combinedFilter();
  });
})();
