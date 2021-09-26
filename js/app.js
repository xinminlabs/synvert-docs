document.addEventListener("DOMContentLoaded", function(event) {
  var language = window.location.href.split('/')[3];
  var element = document.querySelector('.languages .' + language);
  if (element) {
    element.classList.add('active');
  }
});