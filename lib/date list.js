const dateDropdownList = document.getElementById('date-select');
const anidateElements = document.querySelectorAll('.aniDate.name');

// Create a Set to store unique years
const uniqueYears = new Set();

// Populate the Set with unique years
anidateElements.forEach((element) => {
  const value = element.querySelector('.value').textContent.trim();
  const year = value.split('/')[0]; // extract the year from the date
  uniqueYears.add(year);
});

// Sort the uniqueYears Set in descending order
const sortedYears = Array.from(uniqueYears).sort((a, b) => b - a);

// Create the dropdown list options
sortedYears.forEach((year) => {
  const option = document.createElement('option');
  option.value = year;
  option.textContent = year;
  dateDropdownList.appendChild(option);
});

// Add the default "All" option
const defaultOption = document.createElement('option');
defaultOption.value = 'all';
defaultOption.textContent = 'All';
dateDropdownList.insertBefore(defaultOption, dateDropdownList.firstChild);

// Add event listener to the dropdown list
dateDropdownList.addEventListener('change', filterByYear);

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
}