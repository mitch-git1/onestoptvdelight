/*
 * (C) Copyright DeadSix27 Tesch 2013-2014
 *
 * Contact: contact@dead6.eu
 * Website: www.Dead6.eu / www.moreIT.eu
 * IRC: irc.Dead6.eu
 * myXBMC HTML Generator
 *
 * This product is not affiliated with XBMC, every use of naming is just for reference to ensure the right usage of this Program.
 */
lastHilight = "";
function GetUrlValue(VarSearch) {
    var SearchString = window.location.search.substring(1);
    var VariableArray = SearchString.split('&');
    for (var i = 0; i < VariableArray.length; i++) {
        var KeyValuePair = VariableArray[i].split('=');
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
    $("#overlay").animate({ height: '1%', opacity: 0 }, 500, function () {
        $("#overlay").hide();
    });
}
function openTrailer(youtubeID, divID, start) {
    if (youtubeID.substring(0, 6) == "daily_") {
        youtubeID = youtubeID.substring(6, youtubeID.length);
        if (start != "") { start = "&start=" + start; }
        $("#video_" + divID).html("<iframe src=\"http://www.dailymotion.com/embed/video/" + youtubeID + "?autoPlay=1&forcedQuality=hd720&wmode=transparent" + start + "\"></iframe>");
    }
    else {
        if (start != "") { start = "#t=" + start; }
        $("#video_" + divID).html("<iframe src=\"http://www.youtube-nocookie.com/embed/" + youtubeID + "?autoplay=1&wmode=transparent&iv_load_policy=3" + start + "\"></iframe>");
    }
    $("#closeButton_" + divID).fadeIn();
    $("#overlay").show().animate({ height: '100%', opacity: 0.8 }, 500);
}
function clearHilight() {
    $(lastHilight).css('box-shadow', '');
    $(lastHilight).css('border', '');
    $(lastHilight).css('border-radius', '');
}
function checkHash() {
    var urlHash = window.location.hash;
    lastHilight = urlHash;
    //show all tvshow containers
    $(".aniContainer").each(function () {
        $(this).show();
    });
    //remove error message if there is one
    $("#search_result").text("");
    if ((urlHash != "") && (urlHash != " ")) {
        $(urlHash).css('box-shadow', '0 0 25px #0DF3FF');
        //$(urlHash).delay(1000).css('box-shadow','0 0 25px #0DF3FF');
        $(urlHash).css('border', '0 px solid');
        $(urlHash).css('border-radius', '11px');
        $(urlHash).delay(500).effect("shake", { direction: 'left', times: 2, distance: 20 }, 500);
    }
}
function startUP() {
    checkHash();
    $("img.lazyLoad").lazyload();
}

function searchOnPage(searchTerm) {
    let hasResults = false; // Flag to track if any results were found
    searchTerm = searchTerm.trim();
    if (searchTerm === '') {
        // if the search term is empty make sure all shows are visible
        $(".aniContainer").each(function () {
            $(this).show();
        });
        $("#search_result").text("");
    } else {
        // Get all TV show containers
        $(".aniContainer").each(function () {
            let showName = $(this).find(".aniName .value").text().toLowerCase(); // Get the show name
            if (showName.includes(searchTerm)) {
                $(this).show(); // Show the container if there's a match
                hasResults = true;
            } else {
                $(this).hide(); // Hide the container if there's no match
            }
        });
    }

    // Handle no results
    if (!hasResults) {
        $("#search_result").text("No results found.");
    } else {
        $("#search_result").text(""); // Clear any previous "no results" message
    }
}
function searchVideo(searchStr, type, htmlFn, HtmlExt, evt) {
    var xmlFile = ""
    var nodeName = "";
    if (type == "t") {
        xmlFile = "tvShowPageIndex.xml";
        nodeName = "tvshow";
    }
    if (type == "m") {
        xmlFile = "moviePageIndex.xml";
        nodeName = "movie";
    }
    var pressedKey = "";
    if (typeof event != 'undefined') {
        if (event.keyCode) {
            pressedKey = String.fromCharCode(event.keyCode);
        }
    }
    else if (evt) {
        pressedKey = String.fromCharCode(evt.which);
    }
    searchStr = searchStr + pressedKey.toLowerCase();
    if ((searchStr != " ") && (searchStr != "")) {
        $.ajax({
            type: "GET",
            url: xmlFile,
            cache: false,
            dataType: "xml",
            success: function (xml) {
                var $xml = $(xml);
                var result = "";
                var output = "";
                $xml.find(nodeName).each(
                    function (i) {
                        var $car = $(this);
                        var $name = $car.attr('name');
                        var $videoID = $car.attr('id');
                        var $page = $car.text();
                        if ($name.toLowerCase().indexOf(searchStr) != -1) {
                            result = $videoID;
                            if ($page == "0") {
                                $page = "";
                            } else {
                                $page = "_" + $page;
                            }
                            if (type == "m") {
                                output += '<a href="./' + htmlFn + $page + HtmlExt + '#movie_' + $videoID + '">' + $name + '</a></br>';
                            }
                            if (type == "t") {
                                output += '<a href="./' + htmlFn + $page + HtmlExt + '#tvshow_' + $videoID + '">' + $name + '</a></br>';
                            }
                        }
                    });
                if (output == "") {
                    output = "No matches found";
                }
                $("#search_result").html(output);
            }
        });
    }
}

