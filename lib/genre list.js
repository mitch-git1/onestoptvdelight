// Get the existing dropdown list element
const dropdownList = document.getElementById('genre-select');

// Remove any existing options
while (dropdownList.firstChild) {
  dropdownList.removeChild(dropdownList.firstChild);
}

// Create a Set to store unique genres
const uniqueGenres = new Set();

// Get the .aniGenre.name elements
const anigenreElements = document.querySelectorAll('.aniGenre.name');

// Populate the uniqueGenres Set with genres
anigenreElements.forEach((element) => {
  const genres = element.querySelector('.value').textContent.trim().split(', ');
  genres.forEach((genre) => {
    uniqueGenres.add(genre);
  });
});

// Convert the Set to an array and sort it in alphabetical order
const sortedGenres = Array.from(uniqueGenres).sort((a, b) => a.localeCompare(b));

// Populate the dropdown list with the sorted genres
sortedGenres.forEach((genre) => {
  const option = document.createElement('option');
  option.value = genre;
  option.textContent = genre;
  dropdownList.appendChild(option);
});

// Add the default "All" option
const allOption = document.createElement('option');
allOption.value = 'all';
allOption.textContent = 'All';
dropdownList.insertBefore(allOption, dropdownList.firstChild);

function filterByGenre() {
  const dropdownList = document.getElementById('genre-select');
  const selectedGenre = dropdownList.value;
  const anicontainerElements = document.querySelectorAll('.aniContainer');

  if (selectedGenre === 'all') {
    // Show all containers if "All" is selected
    anicontainerElements.forEach((element) => {
      element.style.display = 'block';
    });
  } else {
    // Hide all containers initially
    anicontainerElements.forEach((element) => {
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
}

// Remove the second declaration of dropdownList
dropdownList.addEventListener('change', filterByGenre);

$(document).ready(function() {
  $("#genre-select").val("all");
});