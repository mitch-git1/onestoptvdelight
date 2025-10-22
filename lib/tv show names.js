// Get all the divs with the class "anilink"

const anilinks = document.querySelectorAll('.anilink');

// Loop through each div

anilinks.forEach((anilink) => {
  // Get the parent div with the class "infoTextContainer"
  const infoTextContainer = anilink.closest('.infoTextContainer');

  // Get the name from the div with the class "aniName" inside the infoTextContainer
  const name = infoTextContainer.querySelector('.aniName .value').textContent;

  // Update the data-show-name attribute with the name
  anilink.querySelector('.trailer-link').setAttribute('data-show-name', name);
});