document.querySelectorAll('.anilink').forEach((div) => {
  const infoTextContainer = div.closest('.infoTextContainer');
  const aniName = infoTextContainer.querySelector('.aniName .value').textContent;
  const aniDate = infoTextContainer.querySelector('.aniDate .value').textContent;

  const nameDate = `${aniName} (${aniDate.substring(0, 4)})`;
  div.querySelector('.trailer-link').setAttribute('data-movie-name-date', nameDate);
});
