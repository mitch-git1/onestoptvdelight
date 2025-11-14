(function() {
  document.addEventListener("DOMContentLoaded", function() {
    const genreDropdownList = document.getElementById("genre-select");
    const dateDropdownList = document.getElementById("date-select");
    const ageRatingDropdownList = document.getElementById("age-rating-select");

    if (!genreDropdownList || !dateDropdownList || !ageRatingDropdownList) {
      console.error("One or more dropdown elements not found.");
      return;
    }

    const uniqueGenres = new Set();
    const uniqueYears = new Set();
    const uniqueAgeRatings = new Set();
    const allAniContainers = Array.from(document.querySelectorAll(".aniContainer"));

    // --- Collect all dropdown data ---
    allAniContainers.forEach(container => {
      const genreElement = container.querySelector(".aniGenre.name .value");
      const dateElement = container.querySelector(".aniDate.name .value");
      const ageRatingElement = container.querySelector(".aniAgeRating.name .value");

      if (genreElement) {
        genreElement.textContent.split(",").forEach(g => uniqueGenres.add(g.trim()));
      }
      if (dateElement) {
        const year = dateElement.textContent.trim().split("/")[0];
        if (year) uniqueYears.add(year);
      }
      if (ageRatingElement) {
        uniqueAgeRatings.add(ageRatingElement.textContent.trim());
      }
    });

    // --- Populate dropdowns ---
    function populateDropdown(dropdown, values, label = "All") {
      dropdown.innerHTML = "";
      const allOption = document.createElement("option");
      allOption.value = "all";
      allOption.textContent = label;
      dropdown.appendChild(allOption);
      values.forEach(v => {
        const option = document.createElement("option");
        option.value = v;
        option.textContent = v;
        dropdown.appendChild(option);
      });
    }

    populateDropdown(
      genreDropdownList,
      Array.from(uniqueGenres).sort((a, b) => a.localeCompare(b))
    );
    populateDropdown(
      dateDropdownList,
      Array.from(uniqueYears).sort((a, b) => parseInt(b) - parseInt(a))
    );
    populateDropdown(
      ageRatingDropdownList,
      Array.from(uniqueAgeRatings).sort((a, b) => a.localeCompare(b))
    );

    // --- Central filtering function ---
    function filterResults() {
      const selectedGenre = genreDropdownList.value.toLowerCase();
      const selectedYear = dateDropdownList.value;
      const selectedAgeRating = ageRatingDropdownList.value.toLowerCase();

      window.FilterPagination.applyFilters(container => {
        const genreText = container.querySelector(".aniGenre.name .value")?.textContent.toLowerCase() || "";
        const dateText = container.querySelector(".aniDate.name .value")?.textContent || "";
        const ratingText = container.querySelector(".aniAgeRating.name .value")?.textContent.toLowerCase() || "";
        const year = dateText.split("/")[0] || "";

        const genreMatch = selectedGenre === "all" || genreText.includes(selectedGenre);
        const yearMatch = selectedYear === "all" || year === selectedYear;
        const ratingMatch = selectedAgeRating === "all" || ratingText === selectedAgeRating;

        return genreMatch && yearMatch && ratingMatch;
      });
    }

    // --- Hook dropdown changes ---
    genreDropdownList.addEventListener("change", filterResults);
    dateDropdownList.addEventListener("change", filterResults);
    ageRatingDropdownList.addEventListener("change", filterResults);

    // --- Initialize system ---
    if (window.FilterPagination) window.FilterPagination.init();
    filterResults();
  });
})();
