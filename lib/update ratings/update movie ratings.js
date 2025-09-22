fetch('ratings csv/full movies.csv')
  .then(response => response.text())
  .then(csvData => {
    const data = csvToArray(csvData);
    const htmlCode = document.documentElement.innerHTML;

    // Iterate over the rows in the CSV file
    data.forEach(row => {
      console.log(row); // Debugging statement

      // Find the matching row based on the name and year
      const name = row['name'];
      const year = row['year'];
      const matchingElements = htmlCode.split(`<div class="aniName name">`);
      for (let i = 0; i < matchingElements.length; i++) {
        const element = matchingElements[i];
        if (element.includes(name) && element.includes(year)) {
          console.log(element); // Debugging statement

          // Extract the rating element
          const ratingElement = matchingElements[i + 1].split('<div class="aniRating name">')[0];
          console.log(ratingElement); // Debugging statement

          // Extract the rating value
          const ratingValue = ratingElement.split('<span class="value">')[1].split('</span>')[0];
          // Extract the number of votes value
          const votesValue = row["votes"];
          // Replace the rating with the value from the CSV file and add the number of votes
          const updatedRatingElement = `<div class="aniRating name"><span class="titleNoBlock">Rating:</span><span class="value">${ratingValue}</span><span class="star">&#9733;</span><span class="votes">(${votesValue})</span></div>`;
          htmlCode = htmlCode.replace(ratingElement, updatedRatingElement);
          break;
        }
      }
    });

    // Write the updated HTML code back to the document
    document.documentElement.innerHTML = htmlCode;
  });

function csvToArray(csv) {
  const lines = csv.split('\n');
  const headers = lines[0].split(',');
  const result = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const row = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = values[j];
    }
    result.push(row);
  }
  return result;
}