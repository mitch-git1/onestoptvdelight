// Function to create and show the YouTube player in a modal
function createYouTubePlayerInModal(videoId, tvshowId, showName) {
  var modal = document.getElementById('modal');
  modal.classList.add('show-modal');
  modal.classList.remove('hide-modal');

  // Lock scroll
  document.body.style.overflow = 'hidden';

  var iframeContainer = document.createElement('div');
  iframeContainer.className = 'modal-video-container';

  var iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&fs=1`;
  iframe.frameBorder = '0';
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen";
  iframe.allowFullScreen = true;
  iframe.webkitallowfullscreen = true;
  iframe.mozallowfullscreen = true;

  iframeContainer.appendChild(iframe);

  var title = document.createElement('div');
  title.className = 'modal-title';
  const youtubeIconHTML = '<i class="fa-brands fa-youtube" style="color:#d40d0d;"></i>';
  title.innerHTML = youtubeIconHTML + " Trailer: " + showName;

  var closeButton = document.createElement('div');
  closeButton.className = 'close';
  closeButton.textContent = 'X';
  closeButton.addEventListener('click', hideYouTubePlayerAndCloseModal);

  var banner = document.createElement('div');
  banner.className = 'modal-banner';
  banner.appendChild(title);
  banner.appendChild(closeButton);

  var modalContent = document.getElementById('modal-content');
  modalContent.innerHTML = '';
  modalContent.appendChild(banner);
  modalContent.appendChild(iframeContainer);
  modal.appendChild(modalContent);

  // Add listeners for ESC and outside close
  addCloseEventListeners(modal, iframeContainer);
}

// Function to hide the YouTube player and close the modal
function hideYouTubePlayerAndCloseModal() {
  var modal = document.getElementById('modal');
  modal.classList.remove('show-modal');
  modal.classList.add('hide-modal');
  document.body.style.overflow = ''; // Unlock scroll

  var modalContent = document.getElementById('modal-content');
  modalContent.innerHTML = '';

  removeCloseEventListeners(modal);
}

function addCloseEventListeners(modal, iframeContainer) {
  function escClose(e) {
    if (e.key === 'Escape') hideYouTubePlayerAndCloseModal();
  }

  function outsideClose(e) {
    if (!iframeContainer.contains(e.target)) hideYouTubePlayerAndCloseModal();
  }

  modal._escListener = escClose;
  modal._outsideListener = outsideClose;

  document.addEventListener('keydown', escClose);
  modal.addEventListener('click', outsideClose);
  modal.addEventListener('touchstart', outsideClose);
}

function removeCloseEventListeners(modal) {
  if (modal._escListener) document.removeEventListener('keydown', modal._escListener);
  if (modal._outsideListener) {
    modal.removeEventListener('click', modal._outsideListener);
    modal.removeEventListener('touchstart', modal._outsideListener);
  }
  delete modal._escListener;
  delete modal._outsideListener;
}

// Add an event listener to trailer links
document.addEventListener('DOMContentLoaded', function () {
  var trailerLinks = document.querySelectorAll('.anilink.name a');
  trailerLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      var url = link.href;
      var showName = link.getAttribute('data-show-name-date');

      if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
        var videoId = url.split('v=')[1] || url.split('.be/')[1];
        if (videoId) {
          const ampIndex = videoId.indexOf('&');
          if (ampIndex !== -1) videoId = videoId.substring(0, ampIndex);
          var tvshowDiv = link.closest('.aniContainer');
          if (tvshowDiv && tvshowDiv.id) {
            createYouTubePlayerInModal(videoId, tvshowDiv.id, showName);
          }
        }
      }
    });
  });
});
