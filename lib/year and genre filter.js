// Date filter
function filterByYear() {
  const selectedYear = dateDropdownList.value;
  const aniContainerElements = document.querySelectorAll('.aniContainer');

  if (selectedYear === 'all') {
    // Show all containers if "All" is selected
    aniContainerElements.forEach((element) => {
      element.style.display = 'block';
    });
  } else {
    // Hide all containers initially
    aniContainerElements.forEach((element) => {
      element.style.display = 'none';
    });

    // Show containers that match the selected year
    aniContainerElements.forEach((element) => {
      const dateElement = element.querySelector('.aniDate.name .value');
      const year = dateElement.textContent.trim().split('/')[0];
      if (year === selectedYear) {
        element.style.display = 'block';
      }
    });
  }

  // Call the combined filter function
  combinedFilter();
}

// Genre filter
function filterByGenre() {
  const selectedGenre = dropdownList.value;
  const aniContainerElements = document.querySelectorAll('.aniContainer');

  if (selectedGenre === 'all') {
    // Show all containers if "All" is selected
    aniContainerElements.forEach((element) => {
      element.style.display = 'block';
    });
  } else {
    // Hide all containers initially
    aniContainerElements.forEach((element) => {
      element.style.display = 'none';
    });

    // Show containers that match the selected genre
    document.querySelectorAll('.aniGenre.name').forEach((element) => {
      const values = element.querySelector('.value').textContent.trim().toLowerCase().split(', ');
      if (values.includes(selectedGenre.toLowerCase())) {
        const container = element.closest('.aniContainer');
        container.style.display = 'block';
      }
    });
  }

  // Call the combined filter function
  combinedFilter();
}

// Combined filter function
function combinedFilter() {
  const selectedYear = dateDropdownList.value;
  const selectedGenre = dropdownList.value;
  const aniContainerElements = document.querySelectorAll('.aniContainer');

  if (selectedYear === 'all' && selectedGenre === 'all') {
    // Show all containers if both "All" options are selected
    aniContainerElements.forEach((element) => {
      element.style.display = 'block';
    });
  } else {
    // Hide all containers initially
    aniContainerElements.forEach((element) => {
      element.style.display = 'none';
    });

    // Show containers that match both filter criteria
    let matchFound = false;
    aniContainerElements.forEach((element) => {
      const dateElement = element.querySelector('.aniDate.name .value');
      const year = dateElement.textContent.trim().split('/')[0];
      const genreElement = element.querySelector('.aniGenre.name .value');
      const genre = genreElement.textContent.trim().toLowerCase().split(', ');

      if ((year === selectedYear || selectedYear === 'all') && (genre.includes(selectedGenre.toLowerCase()) || selectedGenre === 'all')) {
        element.style.display = 'block';
        matchFound = true;
      }
    });

    // Display "No results" message if no matches are found
    if (!matchFound) {
      const noResultsMessage = document.getElementById('no-results-message');
      noResultsMessage.style.display = 'block';
      noResultsMessage.textContent = 'No results found for the selected genre and year.';
    } else {
      const noResultsMessage = document.getElementById('no-results-message');
      noResultsMessage.style.display = 'none';
    }
  }
}

// Add event listeners to the dropdown lists
dateDropdownList.addEventListener('change', filterByYear);
dropdownList.addEventListener('change', filterByGenre);