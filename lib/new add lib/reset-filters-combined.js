(function () {
    document.addEventListener("DOMContentLoaded", function () {

        const genreSelect  = document.getElementById("genre-select");
        const yearSelect   = document.getElementById("date-select");
        const ageSelect    = document.getElementById("age-rating-select");
        const ratingSelect = document.getElementById("rating-select");
        const searchBox    = document.getElementById("search_box");
        const resetBtn     = document.getElementById("reset-filters-button");

        if (!resetBtn) {
            console.warn("[ResetCombined] Reset button not found.");
            return;
        }

        function dispatchAllEvents(el) {
            if (!el) return;
            ["input", "change", "click"].forEach(ev => {
                el.dispatchEvent(new Event(ev, { bubbles: true }));
            });
        }

        function resetFilters() {
            // Reset dropdowns
            if (genreSelect)  { genreSelect.value = "all"; dispatchAllEvents(genreSelect); }
            if (yearSelect)   { yearSelect.value = "all"; dispatchAllEvents(yearSelect); }
            if (ageSelect)    { ageSelect.value = "all"; dispatchAllEvents(ageSelect); }
            if (ratingSelect) { ratingSelect.value = "all"; dispatchAllEvents(ratingSelect); }

            // Reset search (optional, remove if not needed)
            if (searchBox) {
                searchBox.value = "";
                dispatchAllEvents(searchBox);
            }

            // Run this page’s main filter function
            if (typeof filterCombined === "function") {
                filterCombined();
                console.debug("[ResetCombined] filterCombined() executed.");
            } else {
                console.warn("[ResetCombined] filterCombined() not found.");
            }
        }

        resetBtn.addEventListener("click",      resetFilters);
        resetBtn.addEventListener("touchstart", resetFilters);
    });
})();
