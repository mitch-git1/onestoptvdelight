// script.js
const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

dropdownToggles.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    toggle.blur(); // Remove focus from the toggle element
    const dropdownMenu = toggle.nextElementSibling;
    dropdownMenu.classList.toggle('show');
  });
});

const imageGallery = document.querySelector('.image-gallery');
const imagesFolder = './tv shows and movies/'; // relative path

// assuming you have a list of image file names in the folder
const imageFiles = ['full list anime movies.png', 'full list movies.png', 'full list anime tv shows.png', 'full list tv shows.png', 'newly added anime movies.png', 'newly added anime tv shows.png', 'newly added movies.png', 'newly added tv shows.png'];

imageFiles.forEach((imageFile, index) => {
  const img = document.createElement('img');
  img.src = `${imagesFolder}${imageFile}`;
  img.alt = `Image ${index + 1}`;

  const caption = document.createElement('div');
  caption.classList.add('hi');
  caption.textContent = `Link to ${imageFile}`;

  const link = document.createElement('a');
  link.href = `https://example.com/${imageFile}`; // replace with your desired link
  link.textContent = 'View more';

  caption.appendChild(link);

  imageGallery.appendChild(img);
  imageGallery.appendChild(caption);
});
