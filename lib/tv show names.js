document.addEventListener("DOMContentLoaded", () => {
  const anilinks = document.querySelectorAll(".anilink");
  if (!anilinks.length) return;

  anilinks.forEach(div => {
    const infoTextContainer = div.closest(".infoTextContainer");
    if (!infoTextContainer) return;

    const aniNameEl = infoTextContainer.querySelector(".aniName .value");
    const aniDateEl = infoTextContainer.querySelector(".aniDate .value");
    const trailerLink = div.querySelector(".trailer-link");

    if (!aniNameEl || !aniDateEl || !trailerLink) return;

    const aniName = aniNameEl.textContent.trim();
    const aniDate = aniDateEl.textContent.trim();

    const year = aniDate.substring(0, 4);
    const nameDate = `${aniName} (${year})`;

    trailerLink.setAttribute("data-show-name-date", nameDate);
  });
});
