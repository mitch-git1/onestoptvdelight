// lib/dropdownlist.js
const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

dropdownToggles.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const dropdownList = toggle.nextElementSibling;
    toggle.classList.toggle('open');
    dropdownList.classList.toggle('open');
  });
});

let sidebarToggle = document.querySelector('.sidebar-toggle-button');
let sidebar = document.querySelector('.sidebar');
let sidebarToggleElement = document.querySelector('.sidebar-toggle');

sidebarToggle.addEventListener('click', () => {
  sidebar.classList.toggle('open');
  sidebarToggleElement.classList.toggle('open');
});

//search stuff 
const searchInput = document.getElementById('search-input');
const imageGallery = document.getElementById('image-gallery');
const images = imageGallery.querySelectorAll('img');

console.log('Search input:', searchInput);
console.log('Image gallery:', imageGallery);
console.log('Images:', images);

searchInput.addEventListener('input', (e) => {
  console.log('Search input event triggered');
  const searchTerm = e.target.value.toLowerCase();
  console.log('Search term:', searchTerm);

  const filteredImages = [];

  images.forEach((image) => {
    const caption = image.nextElementSibling.textContent.toLowerCase();
    console.log('Caption:', caption);
    if (caption.includes(searchTerm)) {
      filteredImages.push(image);
    }
  });

  console.log('Filtered images:', filteredImages);

  images.forEach((image) => {
    if (filteredImages.includes(image)) {
      image.style.display = 'block';
      image.parentNode.style.display = 'block';
    } else {
      image.style.display = 'none';
      image.parentNode.style.display = 'none';
    }
  });

  const noResultsMessage = imageGallery.querySelector('.no-results-message');

  if (filteredImages.length === 0 && searchTerm !== '') {
    if (!noResultsMessage) {
      const newMessage = document.createElement('div');
      newMessage.textContent = 'No results found, please use one of the following keywords: "full list anime movies", "full list anime tv shows", "full list movies", "full list tv shows", "newly added anime movies", "newly added anime tv shows", "newly added movies", "newly added tv shows".';
      newMessage.classList.add('no-results-message');
      imageGallery.appendChild(newMessage);
    }
  } else {
    if (noResultsMessage) {
      noResultsMessage.remove();
    }
  }
});
