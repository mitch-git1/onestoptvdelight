/* ------------------------------
   deadsix.js  — patched version
   integrates search with filter-pagination-handler.js
   supports live search with debounce
--------------------------------*/

let lastHilight = "";

// ------------------------------
// Utility functions
// ------------------------------
function GetUrlValue(VarSearch) {
  const SearchString = window.location.search.substring(1);
  const VariableArray = SearchString.split("&");
  for (let i = 0; i < VariableArray.length; i++) {
    const KeyValuePair = VariableArray[i].split("=");
    if (KeyValuePair[0] == VarSearch) {
      return KeyValuePair[1];
    }
  }
  return "none";
}

function showPlot(divID) {
  $("#plot_" + divID).fadeIn();
  $("#plot_" + divID + "_icon").fadeOut();
}

function hidePlot(divID) {
  $("#plot_" + divID).fadeOut();
  $("#plot_" + divID + "_icon").fadeIn();
}

function closeTrailer(divID) {
  $("#video_" + divID).html("");
  $("#closeButton_" + divID).fadeOut();
  $("#overlay").animate({ height: "1%", opacity: 0 }, 500, function () {
    $("#overlay").hide();
  });
}

function openTrailer(youtubeID, divID, start) {
  if (youtubeID.substring(0, 6) === "daily_") {
    youtubeID = youtubeID.substring(6, youtubeID.length);
    if (start !== "") start = "&start=" + start;
    $("#video_" + divID).html(
      `<iframe src="http://www.dailymotion.com/embed/video/${youtubeID}?autoPlay=1&forcedQuality=hd720&wmode=transparent${start}"></iframe>`
    );
  } else {
    if (start !== "") start = "#t=" + start;
    $("#video_" + divID).html(
      `<iframe src="http://www.youtube-nocookie.com/embed/${youtubeID}?autoplay=1&wmode=transparent&iv_load_policy=3${start}"></iframe>`
    );
  }
  $("#closeButton_" + divID).fadeIn();
  $("#overlay").show().animate({ height: "100%", opacity: 0.8 }, 500);
}

function clearHilight() {
  $(lastHilight).css({
    "box-shadow": "",
    border: "",
    "border-radius": ""
  });
}

function checkHash() {
  const urlHash = window.location.hash;
  lastHilight = urlHash;

  $(".aniContainer").show(); // show all
  $("#search_result").text(""); // remove error message

  if (urlHash && urlHash !== " ") {
    $(urlHash).css({
      "box-shadow": "0 0 25px #0DF3FF",
      border: "0 px solid",
      "border-radius": "11px"
    });
    $(urlHash)
      .delay(500)
      .effect("shake", { direction: "left", times: 2, distance: 20 }, 500);
  }
}

function startUP() {
  checkHash();
  $("img.lazyLoad").lazyload();
}

// ------------------------------
// Search (patched version)
// ------------------------------
let searchDebounceTimer = null;

function searchOnPage(searchTermRaw) {
  // Debounce to avoid excessive calls on fast typing
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    const searchTerm = (searchTermRaw || "").trim().toLowerCase();

    const pagination =
      window.filterPaginationHandler ||
      window.FilterPagination ||
      window.FilterPaginationHandler;

    // If the new handler exists, use it
    if (pagination && typeof pagination.applyFilters === "function") {
      if (searchTerm === "") {
        // Clear search → show all
        pagination.applyFilters(() => true);
        $("#search_result").html("");
        $("#no-results-message").hide();
        return;
      }

      // Apply filter based on title
      pagination.applyFilters((container) => {
        const nameEl = container.querySelector(".aniName .value");
        if (!nameEl) return false;
        const nameText = (nameEl.textContent || "").toLowerCase();
        return nameText.includes(searchTerm);
      });

      // Get count of filtered items
      if (typeof pagination.getState === "function") {
        const state = pagination.getState();
        if (state.totalFiltered === 0) {
          $("#search_result").html(
            "No results found for '" +
              $("<div>").text(searchTerm).html() +
              "'."
          );
          $("#no-results-message")
            .text("No results found for '" + searchTerm + "'.")
            .show();
        } else {
          $("#search_result").html("");
          $("#no-results-message").hide();
          // Always reset to page 1 for fresh search
          if (typeof pagination.applyPagination === "function") {
            pagination.applyPagination(1);
          }
        }
      }
      return;
    }

    // Fallback if pagination handler missing
    let hasResults = false;
    if (searchTerm === "") {
      $(".aniContainer").show();
      $("#search_result").html("");
      $("#no-results-message").hide();
    } else {
      $(".aniContainer").each(function () {
        const showName = $(this)
          .find(".aniName .value")
          .text()
          .toLowerCase();
        if (showName.includes(searchTerm)) {
          $(this).show();
          hasResults = true;
        } else {
          $(this).hide();
        }
      });

      if (!hasResults) {
        $("#search_result").html(
          "No results found for '" +
            $("<div>").text(searchTerm).html() +
            "'."
        );
        $("#no-results-message")
          .text("No results found for '" + searchTerm + "'.")
          .show();
      } else {
        $("#search_result").html("");
        $("#no-results-message").hide();
      }
    }

    // Try refreshing pagination if available
    if (pagination && typeof pagination.applyPagination === "function") {
      try {
        pagination.applyPagination(1);
      } catch (e) {
        console.warn("searchOnPage: pagination refresh failed", e);
      }
    }
  }, 300);
}

// ------------------------------
// Original XML search (unchanged)
// ------------------------------
function searchVideo(searchStr, type, htmlFn, HtmlExt, evt) {
  let xmlFile = "";
  let nodeName = "";
  if (type == "t") {
    xmlFile = "tvShowPageIndex.xml";
    nodeName = "tvshow";
  }
  if (type == "m") {
    xmlFile = "moviePageIndex.xml";
    nodeName = "movie";
  }
  let pressedKey = "";
  if (typeof event != "undefined") {
    if (event.keyCode) pressedKey = String.fromCharCode(event.keyCode);
  } else if (evt) {
    pressedKey = String.fromCharCode(evt.which);
  }
  searchStr = searchStr + pressedKey.toLowerCase();
  if (searchStr != " " && searchStr != "") {
    $.ajax({
      type: "GET",
      url: xmlFile,
      cache: false,
      dataType: "xml",
      success: function (xml) {
        const $xml = $(xml);
        let output = "";
        $xml.find(nodeName).each(function () {
          const $car = $(this);
          const $name = $car.attr("name");
          const $videoID = $car.attr("id");
          let $page = $car.text();
          if ($name.toLowerCase().indexOf(searchStr) != -1) {
            if ($page == "0") $page = "";
            else $page = "_" + $page;
            if (type == "m") {
              output +=
                '<a href="./' +
                htmlFn +
                $page +
                HtmlExt +
                "#movie_" +
                $videoID +
                '">' +
                $name +
                "</a></br>";
            }
            if (type == "t") {
              output +=
                '<a href="./' +
                htmlFn +
                $page +
                HtmlExt +
                "#tvshow_" +
                $videoID +
                '">' +
                $name +
                "</a></br>";
            }
          }
        });
        if (output == "") output = "No matches found";
        $("#search_result").html(output);
      }
    });
  }
}

