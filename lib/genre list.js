(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const genreDropdown = document.getElementById("genre-select");
    if (!genreDropdown) return;

    // --- Gather all genres ---
    const uniqueGenres = new Set();
    document.querySelectorAll(".aniGenre.name .value").forEach((el) => {
      const genres = el.textContent.split(",").map((g) => g.trim());
      genres.forEach((g) => uniqueGenres.add(g));
    });

    // --- Populate dropdown ---
    genreDropdown.innerHTML = "";
    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "All";
    genreDropdown.appendChild(allOption);

    Array.from(uniqueGenres)
      .sort((a, b) => a.localeCompare(b))
      .forEach((genre) => {
        const option = document.createElement("option");
        option.value = genre;
        option.textContent = genre;
        genreDropdown.appendChild(option);
      });

    // --- Central filter function (works with all other filters) ---
    function combinedFilter() {
      const selectedGenre = genreDropdown.value.toLowerCase();

      // get other filter values if present
      const dateDropdown = document.getElementById("date-select");
      const ratingDropdown = document.getElementById("rating-select");
      const ageRatingDropdown = document.getElementById("age-rating-select");

      const selectedYear = dateDropdown ? dateDropdown.value : "all";
      const selectedRatingRange = ratingDropdown ? ratingDropdown.value : "all";
      const selectedAgeRating = ageRatingDropdown ? ageRatingDropdown.value.toLowerCase() : "all";

      let minRating = 0,
        maxRating = 10;
      if (selectedRatingRange !== "all" && selectedRatingRange.includes("-")) {
        [minRating, maxRating] = selectedRatingRange.split("-").map(Number);
      }

      // Apply unified filtering logic
      window.FilterPagination.applyFilters((container) => {
        const genreText = container.querySelector(".aniGenre.name .value")?.textContent.toLowerCase() || "";
        const dateText = container.querySelector(".aniDate.name .value")?.textContent || "";
        const year = dateText.split("/")[0] || "";
        const ratingText = container.querySelector(".aniRating.name .value")?.textContent || "";
        const ageRatingText = container.querySelector(".aniAgeRating.name .value")?.textContent.toLowerCase() || "";

        const ratingMatchNum = ratingText.match(/\d+(\.\d+)?/);
        const ratingValue = ratingMatchNum ? parseFloat(ratingMatchNum[0]) : null;

        const genreMatch = selectedGenre === "all" || genreText.includes(selectedGenre);
        const yearMatch = selectedYear === "all" || year === selectedYear;
        const ratingMatch =
          selectedRatingRange === "all" ||
          (ratingValue !== null && ratingValue >= minRating && ratingValue <= maxRating);
        const ageMatch = selectedAgeRating === "all" || ageRatingText === selectedAgeRating;

        return genreMatch && yearMatch && ratingMatch && ageMatch;
      });
    }

    // --- Hook event listeners ---
    genreDropdown.addEventListener("change", combinedFilter);

    const dateDropdown = document.getElementById("date-select");
    if (dateDropdown) dateDropdown.addEventListener("change", combinedFilter);

    const ratingDropdown = document.getElementById("rating-select");
    if (ratingDropdown) ratingDropdown.addEventListener("change", combinedFilter);

    const ageRatingDropdown = document.getElementById("age-rating-select");
    if (ageRatingDropdown) ageRatingDropdown.addEventListener("change", combinedFilter);

    // --- Initialize pagination system if not already ---
    if (window.FilterPagination) window.FilterPagination.init();

    // --- Initial filter run ---
    combinedFilter();
  });
})();
