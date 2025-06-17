(function() {
  const parentElement = document.querySelector('div#largeContainer');
  if (!parentElement) {
    console.error('Parent element #largeContainer not found.');
    return;
  }

  const tvshowElements = Array.from(parentElement.querySelectorAll('div[id^="tvshow_"]'));

  const elementsWithName = [];

  for (const element of tvshowElements) {
    const nameElement = element.querySelector('.aniName .value');
    const idMatch = element.id.match(/^tvshow_(\d+)$/);
    const originalIdNumber = idMatch ? idMatch[1] : null;

    if (nameElement && nameElement.textContent && originalIdNumber !== null) {
      elementsWithName.push({
        element: element,
        name: nameElement.textContent.trim(),
        originalIdNumber: originalIdNumber
      });
    }
  }

  // Sort by name
  elementsWithName.sort((a, b) => a.name.localeCompare(b.name));

  // Create a document fragment to hold the reordered elements
  const fragment = document.createDocumentFragment();

  // Reorder elements and update IDs and internal references
  for (let i = 0; i < elementsWithName.length; i++) {
    const sortedItem = elementsWithName[i];
    const sortedElement = sortedItem.element;
    const originalIdNumber = sortedItem.originalIdNumber;
    const newIdNumber = i + 1;

    fragment.appendChild(sortedElement);

    sortedElement.id = `tvshow_${newIdNumber}`;

    sortedElement.querySelectorAll(`[id$="_${originalIdNumber}"]`).forEach(el => {
        if (el.id.endsWith(`_${originalIdNumber}`)) {
             const baseId = el.id.slice(0, el.id.length - originalIdNumber.length);
             el.id = baseId + newIdNumber;
        }
    });

     sortedElement.querySelectorAll(`[data-plotid="${originalIdNumber}"]`).forEach(el => {
        el.setAttribute('data-plotid', newIdNumber);
    });

    sortedElement.querySelectorAll(`[rel="${originalIdNumber}"]`).forEach(el => {
        el.setAttribute('rel', newIdNumber);
    });


    const showIdSpan = sortedElement.querySelector('.showId');
    if (showIdSpan) {
        showIdSpan.textContent = `#${newIdNumber}`;
    }
  }

  parentElement.appendChild(fragment);

  console.log(`Successfully sorted and reordered ${elementsWithName.length} TV show elements on page load.`);
})();