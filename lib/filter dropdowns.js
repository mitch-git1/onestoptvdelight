(function() { // Wrap in an IIFE to avoid polluting the global scope unnecessarily
    document.addEventListener('DOMContentLoaded', function() {
        // 1. Select dropdown elements
        const genreDropdownList = document.getElementById('genre-select');
        const dateDropdownList = document.getElementById('date-select');
        const ageRatingDropdownList = document.getElementById('age-rating-select');

        // Ensure dropdowns exist before proceeding
        if (!genreDropdownList || !dateDropdownList || !ageRatingDropdownList) {
            console.error('One or more dropdown elements not found.');
            return; // Stop execution if elements are missing
        }

        // 2. Gather data using more robust selectors
        const uniqueGenres = new Set();
        const uniqueYears = new Set();
        const uniqueAgeRatings = new Set();

        const allAniContainers = document.querySelectorAll('.aniContainer');

        allAniContainers.forEach(container => {
            // Genre (using class-based selector)
            const genreElement = container.querySelector('.aniGenre.name .value');
            if (genreElement) {
                const genres = genreElement.textContent.trim().split(', ');
                genres.forEach(genre => uniqueGenres.add(genre.trim()));
            }

            // Date/Year (using class-based selector for date)
            const dateElement = container.querySelector('.aniDate.name .value');
            if (dateElement) {
                 const dateValue = dateElement.textContent.trim();
                 const yearMatch = dateValue.split('/')[0]; // Assuming format YYYY/MM/DD
                 if (yearMatch) {
                     uniqueYears.add(yearMatch);
                 }
            }

            // Age Rating (using class-based selector)
            const ageRatingElement = container.querySelector('.aniAgeRating.name .value');
            if (ageRatingElement) {
                uniqueAgeRatings.add(ageRatingElement.textContent.trim());
            }
        });

        // Convert Sets to arrays and sort
        const sortedGenres = Array.from(uniqueGenres).sort((a, b) => a.localeCompare(b));
        const sortedYears = Array.from(uniqueYears).sort((a, b) => parseInt(b, 10) - parseInt(a, 10)); // Descending year
        const sortedAgeRatings = Array.from(uniqueAgeRatings).sort((a, b) => a.localeCompare(b));

        // 3. Populate dropdowns (Clear first if needed, or ensure this script runs after DOM is ready and before other scripts)
        // Clear existing options (safer if you are unsure about execution order)
        genreDropdownList.innerHTML = '';
        dateDropdownList.innerHTML = '';
        ageRatingDropdownList.innerHTML = '';


        // Add "All" option and sorted options for Genre
        const allGenreOption = document.createElement('option');
        allGenreOption.value = 'all';
        allGenreOption.textContent = 'All';
        genreDropdownList.appendChild(allGenreOption); // Append first, then add sorted
        sortedGenres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            genreDropdownList.appendChild(option);
        });


        // Add "All" option and sorted options for Date (Year)
        const allDateOption = document.createElement('option');
        allDateOption.value = 'all';
        allDateOption.textContent = 'All';
        dateDropdownList.appendChild(allDateOption); // Append first, then add sorted
        sortedYears.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            dateDropdownList.appendChild(option);
        });


        // Add "All" option and sorted options for Age Rating
        const allAgeRatingOption = document.createElement('option');
        allAgeRatingOption.value = 'all';
        allAgeRatingOption.textContent = 'All';
        ageRatingDropdownList.appendChild(allAgeRatingOption); // Append first, then add sorted
        sortedAgeRatings.forEach(ageRating => {
            const option = document.createElement('option');
            option.value = ageRating;
            option.textContent = ageRating;
            ageRatingDropdownList.appendChild(option);
        });


        // 4. Central filtering function
        function filterResults() {
            const selectedGenre = genreDropdownList.value.toLowerCase();
            const selectedYear = dateDropdownList.value;
            const selectedAgeRating = ageRatingDropdownList.value.toLowerCase();

            let foundMatch = false;

            allAniContainers.forEach(container => {
                // Get values using robust selectors
                const genreElement = container.querySelector('.aniGenre.name .value');
                const dateElement = container.querySelector('.aniDate.name .value');
                const ageRatingElement = container.querySelector('.aniAgeRating.name .value');

                const genreValues = genreElement ? genreElement.textContent.trim().toLowerCase().split(', ') : [];
                const dateValue = dateElement ? dateElement.textContent.trim() : '';
                const ageRatingValue = ageRatingElement ? ageRatingElement.textContent.trim().toLowerCase() : '';

                // Extract year from date string
                const containerYear = dateValue ? dateValue.split('/')[0] : '';

                // Check for matches
                const genreMatch = selectedGenre === 'all' || genreValues.includes(selectedGenre);
                const yearMatch = selectedYear === 'all' || containerYear === selectedYear;
                const ageRatingMatch = selectedAgeRating === 'all' || ageRatingValue === selectedAgeRating;

                // Show or hide based on combined match
                if (genreMatch && yearMatch && ageRatingMatch) {
                    container.style.display = 'block';
                    foundMatch = true;
                } else {
                    container.style.display = 'none';
                }
            });

            // Handle "No results" message (assuming it's already in the HTML or can be created)
            const noResultsMessage = document.getElementById('no-results-message');
            if (!foundMatch) {
                 if (noResultsMessage) {
                     noResultsMessage.style.display = 'block';
                     noResultsMessage.textContent = 'No Matches found for your selection.';
                 } else {
                     // Create the message element if it doesn't exist
                     const parentElement = document.querySelector('.infoContainer'); // Or a more appropriate parent
                     if (parentElement) {
                         const newMessageElement = document.createElement('div');
                         newMessageElement.id = 'no-results-message';
                         newMessageElement.style.display = 'block';
                         newMessageElement.textContent = 'No Matches found for your selection.';
                         const dropdownContainer = document.querySelector('.dropdown-container');
                         if (dropdownContainer && dropdownContainer.nextSibling) {
                             dropdownContainer.parentNode.insertBefore(newMessageElement, dropdownContainer.nextSibling);
                         } else if (parentElement.firstChild) {
                             parentElement.insertBefore(newMessageElement, parentElement.firstChild);
                         } else {
                             parentElement.appendChild(newMessageElement);
                         }
                     }
                }
            } else {
                 if (noResultsMessage) {
                     noResultsMessage.style.display = 'none';
                 }
            }
        }

        // 6. Add single event listener to each dropdown
        genreDropdownList.addEventListener('change', filterResults);
        dateDropdownList.addEventListener('change', filterResults);
        ageRatingDropdownList.addEventListener('change', filterResults);

        // 7. Call filterResults initially
        filterResults();
    });
})(); // End of IIFE