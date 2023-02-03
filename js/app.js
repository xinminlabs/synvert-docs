document.addEventListener("DOMContentLoaded", function(event) {
  var currentLinks = document.querySelectorAll('a[href="' + window.location.pathname + '"]');
  currentLinks.forEach(function(link) { link.classList.add('current'); });
});