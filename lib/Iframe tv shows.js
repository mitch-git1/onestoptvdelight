``
// Load the YouTube Iframe API
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// YouTube Iframe API settings
var player; // Keep track of the currently active player instance

// Function to create and show the YouTube player
function createYouTubePlayer(videoId, tvshowId) {
  var container = document.getElementById(tvshowId);
  if (!container) {
    console.error(`Container with ID ${tvshowId} not found.`);
    return;
  }

  // Check if a player is already open in this container and remove it
  var existingPlayerWrapper = container.querySelector('.youtube-player-wrapper');
  if (existingPlayerWrapper) {
    existingPlayerWrapper.remove();
  }

// Store the original content
container.dataset.originalContent = container.innerHTML;

// Hide all existing child elements of the container
for (let i = 0; i < container.children.length; i++) {
    const child = container.children[i];
    // Check if the child is not the player wrapper itself if it somehow already exists
    if (!child.classList.contains('youtube-player-wrapper')) {
        child.style.display = 'none'; // Hide the child element
    }
}


  // Create the container for the YouTube player and controls
  var playerWrapper = document.createElement('div');
  playerWrapper.className = 'youtube-player-wrapper'; // Class for styling
  playerWrapper.style.top = '0';
  playerWrapper.style.left = '0';
  playerWrapper.style.display = 'block'; // Ensure the wrapper is displayed
  playerWrapper.style.zIndex = '5'; // Ensure it's above the hidden content, adjust z-index if needed

  // Create the iframe
  var iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&fs=1`;
  iframe.frameBorder = '0';
  iframe.allowFullScreen = true;
  iframe.webkitallowfullscreen = true;
  iframe.mozallowfullscreen = true;

  // Add a close button
  var closeButton = document.createElement('button');
  closeButton.textContent = 'X';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '5px';
  closeButton.style.right = '5px';
  closeButton.style.background = '#fff';
  closeButton.style.border = 'none';
  closeButton.style.padding = '5px';
  closeButton.style.cursor = 'pointer';
  closeButton.style.zIndex = '10'; // Ensure close button is above the iframe
  closeButton.className = 'close-button';

  // Append iframe and close button to the player wrapper
  playerWrapper.appendChild(iframe);
  playerWrapper.appendChild(closeButton);

  // Append the player wrapper to the movie container
  container.appendChild(playerWrapper);


// Add an event listener to the close button
closeButton.addEventListener('click', () => {
  hideYouTubePlayer(playerWrapper.parentNode);
});

  // Initialize the YouTube Player once the iframe is loaded
  iframe.addEventListener('load', function() {
      // YT is available globally after the API script loads
      player = new YT.Player(iframe, {
        videoId: videoId,
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
  });
}

// Function to hide the YouTube player and show original content
function hideYouTubePlayer(container) {
  var playerWrapper = container.querySelector('.youtube-player-wrapper');
  if (playerWrapper) {
    playerWrapper.remove(); // Remove the player wrapper from the DOM
    container.innerHTML = container.dataset.originalContent; // Restore the original content

    // Reattach the event listener to the link
    var trailerLinks = container.querySelectorAll('.anilink.name a');
    trailerLinks.forEach(function(link) {
      link.addEventListener('click', function(event) {
        event.preventDefault();
        var url = link.href;
        // Basic check for YouTube video URL
        if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
          var videoId = url.split('v=')[1] || url.split('.be/')[1];
          if (videoId) {
            const ampIndex = videoId.indexOf('&');
            if (ampIndex !== -1) {
              videoId = videoId.substring(0, ampIndex);
            }

          var tvshowDiv = link.closest('.aniContainer');
          if (tvshowDiv && tvshowDiv.id) {
          createYouTubePlayer(videoId, tvshowDiv.id);
          } else {
          console.error("Could not find the tvshow container ID.");
          }
          } else {
            console.error("Could not extract YouTube video ID from URL:", url);
          }
        } else {
          console.warn("Link does not appear to be a YouTube video:", url);
        }
      });
    });
  }
}

// YouTube Iframe API event listeners
function onPlayerReady(event) {
  event.target.playVideo();
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    // Find the container (div#movie_N) by traversing up from the iframe
    var iframe = event.target.getIframe();
    var playerWrapper = iframe.parentNode; // Assuming iframe is direct child of playerWrapper
    var container = playerWrapper.parentNode; // This should be your div#movie_N
    hideYouTubePlayer(container);
  }
}

// Add event listener to trailer links
document.addEventListener('DOMContentLoaded', function() {
  var trailerLinks = document.querySelectorAll('.anilink.name a');
  trailerLinks.forEach(function(link) {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      var url = link.href;
      // Basic check for YouTube video URL
      if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
          var videoId = url.split('v=')[1] || url.split('.be/')[1];
          if (videoId) {
              const ampIndex = videoId.indexOf('&');
              if (ampIndex !== -1) {
                  videoId = videoId.substring(0, ampIndex);
              }
            var tvshowDiv = link.closest('.aniContainer');
            if (tvshowDiv && tvshowDiv.id) {
            createYouTubePlayer(videoId, tvshowDiv.id);
            } else {
            console.error("Could not find the tvshow container ID.");
           }
          } else {
              console.error("Could not extract YouTube video ID from URL:", url);
          }
      } else {
         console.warn("Link does not appear to be a YouTube video:", url);
      }
    });
  });
});