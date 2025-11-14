document.addEventListener('DOMContentLoaded', function () {
  var menuBtn = document.getElementById('menu-button');
  var side = document.getElementById('sidebar-nav');

  menuBtn.addEventListener('click', function (e) {
    e.preventDefault();
    if (!side.classList.contains('open')) {
      side.classList.add('open');
      side.classList.remove('closed');
      document.body.classList.add('sidebar-open');
    } else {
      side.classList.remove('open');
      side.classList.add('closed');
      document.body.classList.remove('sidebar-open');
    }
  });

  // Optional: close sidebar when clicking outside it
  document.addEventListener('click', function (e) {
    var isClickInside = side.contains(e.target) || menuBtn.contains(e.target);
    if (!isClickInside && side.classList.contains('open')) {
      side.classList.remove('open');
      side.classList.add('closed');
      document.body.classList.remove('sidebar-open');
    }
  });
});

