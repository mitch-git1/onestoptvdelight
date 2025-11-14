$(document).ready(function() {
  const toggle = $('#show-updated-toggle');

  toggle.on('change', function() {
    const showUpdatedOnly = $(this).is(':checked');

    $('.aniContainer').each(function() {
      const hasUpdate = $(this).find('.aniUpdate').length > 0;

      if (showUpdatedOnly) {
        if (!hasUpdate) $(this).hide();
        else $(this).show();
      } else {
        $(this).show();
      }
    });
  });
});

