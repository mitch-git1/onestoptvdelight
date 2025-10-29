// Function to create and show the YouTube player in a modal
function createYouTubePlayerInModal(videoId, movieName) {
  // Find the modal element
  var modal = document.getElementById('modal');
     modal.classList.add('show-modal');
     modal.classList.remove('hide-modal');

  // Create the iframe container
  var iframeContainer = document.createElement('div');
  iframeContainer.className = 'modal-video-container';

  // Create the iframe
  var iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&fs=1`;
  iframe.frameBorder = '0';
  iframe.allowFullScreen = true;
  iframe.webkitallowfullscreen = true;
  iframe.mozallowfullscreen = true;

  // Append the iframe to the container
  iframeContainer.appendChild(iframe);

  // Create the title
  var title = document.createElement('div');
  title.className = 'modal-title';
  title.textContent = movieName; // Set the movie name

  // Add the YouTube icon and " Trailer: " text
  const youtubeIconHTML = '<i class="fa-brands fa-youtube" style="color: #d40d0d;"></i>';
  let currentText = title.textContent.replace(" Trailer: ", ""); // Remove " Trailer: " if it exists (shouldn't at this point, but good practice)
  title.innerHTML = youtubeIconHTML + " Trailer: " + currentText;


  // Create the close button
  var closeButton = document.createElement('div');
  closeButton.className = 'close';
  closeButton.textContent = 'X';
  closeButton.addEventListener('click', hideYouTubePlayerAndCloseModal); // Add event listener to close button

  // Append the title and close button to the banner
  var banner = document.createElement('div');
  banner.className = 'modal-banner';
  banner.appendChild(title);
  banner.appendChild(closeButton);

  // Append the banner and iframe container to the modal content
  var modalContent = document.getElementById('modal-content');
  modalContent.innerHTML = '';
  modalContent.appendChild(banner);
  modalContent.appendChild(iframeContainer);

  // Append the modal content to the modal
  modal.appendChild(modalContent);
}

// Function to hide the YouTube player and close the modal
function hideYouTubePlayerAndCloseModal() {
  // Find the modal element
  var modal = document.getElementById('modal');
    modal.classList.remove('show-modal'); // Remove the 'show-modal' class 
    modal.classList.add('hide-modal'); // Add the 'hide-modal' class

  // Remove the YouTube player iframe from the modal video container
  var modalContent = document.getElementById('modal-content');
  modalContent.innerHTML = '';
}

// Add an event listener to trailer links
document.addEventListener('DOMContentLoaded', function() {
  var trailerLinks = document.querySelectorAll('.anilink.name a');
  trailerLinks.forEach(function(link) {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      var url = link.href;
      var movieName = link.getAttribute('data-movie-name-date'); // Get the movie name attribute

      // Basic check for YouTube video URL
      if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
        var videoId = url.split('v=')[1] || url.split('.be/')[1];
        if (videoId) {
          const ampIndex = videoId.indexOf('&');
          if (ampIndex !== -1) {
            videoId = videoId.substring(0, ampIndex);
          }
          createYouTubePlayerInModal(videoId, movieName); // Pass the movie name to the function
        } else {
          console.error("Could not extract YouTube video ID from URL:", url);
        }
      } else {
        console.warn("Link does not appear to be a YouTube video:", url);
      }
    });
  });
});
