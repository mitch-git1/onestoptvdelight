(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const bottom = document.getElementById("pagination-bottom");
    if (!bottom) return;

    const isMobileOrTablet = window.matchMedia("(max-width: 1024px)").matches;


    if (!isMobileOrTablet) {
      let lastY = window.scrollY;
      let ticking = false;
      let isHidden = bottom.classList.contains("hidden-pagination");

      function onScroll() {
        const y = window.scrollY;
        const delta = y - lastY;

        if (Math.abs(delta) > 10) {
          if (delta > 0 && !isHidden) {
            bottom.classList.add("hidden-pagination");
            isHidden = true;
          } else if (delta < 0 && isHidden) {
            bottom.classList.remove("hidden-pagination");
            isHidden = false;
          }
          lastY = y;
        }
        ticking = false;
      }

      window.addEventListener(
        "scroll",
        function () {
          if (!ticking) {
            window.requestAnimationFrame(onScroll);
            ticking = true;
          }
        },
        { passive: true }
      );
    } else {

      bottom.classList.remove("hidden-pagination");
      bottom.classList.add("sticky-pagination");
    }
  });
})();

