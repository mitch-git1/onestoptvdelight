// Get the rating dropdown list element
const ratingDropdownList = document.getElementById('rating-select');

// Define the rating ranges
const ratingRanges = [
  { label: '0 - 1', min: 0, max: 1 },
  { label: '1 - 2', min: 1, max: 2 },
  { label: '2 - 3', min: 2, max: 3 },
  { label: '3 - 4', min: 3, max: 4 },
  { label: '4 - 5', min: 4, max: 5 },
  { label: '5 - 6', min: 5, max: 6 },
  { label: '6 - 7', min: 6, max: 7 },
  { label: '7 - 8', min: 7, max: 8 },
  { label: '8 - 9', min: 8, max: 9 },
  { label: '9 - 10', min: 9, max: 10 },
];

// Populate the rating dropdown list with options
ratingRanges.forEach((range) => {
  const option = document.createElement('option');
  option.value = `${range.min} to ${range.max}`;
  option.textContent = range.label;
  ratingDropdownList.appendChild(option);
});

// Add event listener to the rating dropdown list
ratingDropdownList.addEventListener('change', filterByRating);

// Filter function for rating
function filterByRating() {
  const selectedRatingRange = ratingDropdownList.value;

  if (selectedRatingRange === 'all') {
    // Show all results
    const aniContainers = document.querySelectorAll('.aniContainer');
    aniContainers.forEach((container) => {
      container.style.display = 'block';
    });
    // Hide "No results" message
    const noResultsMessage = document.getElementById('no-results-message');
    noResultsMessage.style.display = 'none';
  } else {
    // Filter by rating range
    const [min, max] = selectedRatingRange.split(' to ').map(Number);

    const aniContainers = document.querySelectorAll('.aniContainer');
    let matchFound = false;

    aniContainers.forEach((container) => {
      const ratingElement = container.querySelector('.aniRating.name .value');
      const ratingValue = parseFloat(ratingElement.textContent);

      if (ratingValue >= min && ratingValue <= max) {
        container.style.display = 'block';
        matchFound = true;
      } else {
        container.style.display = 'none';
      }
    });

    // Display "No results" message if no matches are found
    if (!matchFound) {
      const noResultsMessage = document.getElementById('no-results-message');
      noResultsMessage.style.display = 'block';
      noResultsMessage.textContent = 'No results found for the selected rating.';
    } else {
      const noResultsMessage = document.getElementById('no-results-message');
      noResultsMessage.style.display = 'none';
    }
  }
}

// Add event listener to the rating dropdown list
ratingDropdownList.addEventListener('change', combinedFilter);