document.addEventListener("DOMContentLoaded", function(event) {
  var currentLinks = document.querySelectorAll('a[href="' + window.location.pathname + '"]');
  currentLinks.forEach(function(link) { link.classList.add('current'); });

  var language = window.location.href.split('/')[3];
  var element = document.querySelector('.languages .' + language);
  if (element) {
    element.classList.add('active');
  }
});