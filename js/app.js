document.addEventListener("DOMContentLoaded", function(event) {
  var currentLinks = document.querySelectorAll('a[href="' + window.location.pathname + '"]');
  currentLinks.forEach(function(link) { link.classList.add('current'); });

  var language = window.location.href.split('/')[3];
  var languageSelect = document.querySelector('#languages');
  languageSelect.addEventListener('change', function() {
    window.location.href = '/' + languageSelect.value + '/home/';
  });
  var element = languageSelect.querySelector('option[value="' + language + '"]');
  element.selected = 'selected';
});