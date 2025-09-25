// Fetch the HTML content of the table
fetch('html-data-tables/full-movie-ratings.html')
  .then(response => response.text())
  .then(html => {
    // Parse the HTML content
    const $ = cheerio.load(html);

    // Get the table rows
    const rows = $('tr');

    // Get the header row
    const headerRow = $('tr:first-child');

    // Get the header cell values
    const headerCellValues = [];
    headerRow.find('th').each((index, cell) => {
      headerCellValues.push($(cell).text().trim());
    });

    // Iterate over the table rows
    rows.each((index, row) => {
      // Find the name and year for the row
      const name = $(row).find('.aniName .value').text();
      const year = $(row).find('.aniDate .value').text();

      // Get the header cell values for the current row
      const headerCellValuesForRow = [];
      $(row).find('th').each((index, cell) => {
        headerCellValuesForRow.push($(cell).text().trim());
      });

      // Find the matching row based on the header cell values
      const matchingRow = headerCellValues.findIndex((value, index) => value === headerCellValuesForRow[index]);

      // If there is a matching row, update the rating, number of votes, and URL
      if (matchingRow !== -1) {
        // Extract the rating, number of votes, and URL for the row
        const rating = $(row).find('.aniRating .star').next().text();
        const votes = $(row).find('.aniRating .star').next().next().text().trim().replace('Based on', '').replace('Votes', '');
        const url = $(row).find('.aniIMBDReviews .value a').attr('href');

        // Update the rating, number of votes, and URL
        const ratingDiv = $(row).find('.aniRating .value');
        const votesDiv = $(row).find('.aniRating .value .brackets');
        const urlDiv = $(row).find('.aniIMBDReviews .value a');

        // Update the rating div if it already has content
        if (ratingDiv.text().trim() !== `${rating} Based on (${votes}) Votes`) {
          ratingDiv.text(`${rating} Based on (${votes}) Votes`);
        }

        // Update the number of votes div if it already has content
        if (votesDiv.text().trim() !== `(${votes})`) {
          votesDiv.text(`(${votes})`);
        }

        // Update the URL div if it already has content
        if (urlDiv.attr('href') !== url) {
          urlDiv.attr('href', url);
        }

        // Update the reviews link with the new URL
        urlDiv.text(`IMDB User Review link`).attr('href', url);

        // Update the row name and year in the HTML
        $(row).find('.aniName .value').html(name);
        $(row).find('.aniDate .value').html(year);
      }
    });
  });