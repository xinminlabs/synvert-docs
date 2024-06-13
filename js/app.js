document.addEventListener("DOMContentLoaded", function (event) {
  var currentLinks = document.querySelectorAll('a[href="' + window.location.pathname + '"]');
  currentLinks.forEach(function (link) {
    link.classList.add("current");
  });

  var macDownloadLink = document.getElementById("mac-download");
  if (macDownloadLink) {
    macDownloadLink.addEventListener("click", function (event) {
      event.preventDefault();
      fetch("https://api.github.com/repos/synvert-hq/synvert-gui/releases/latest")
        .then((response) => response.json())
        .then((data) => {
          const zipAsset = data.assets.find((asset) => asset.content_type === "application/zip");
          if (zipAsset) {
            window.location.href = zipAsset.browser_download_url;
          }
        })
        .catch((error) => console.error("Error:", error));
    });
  }

  var winDownloadLink = document.getElementById("win-download");
  if (winDownloadLink) {
    winDownloadLink.addEventListener("click", function (event) {
      event.preventDefault();
      fetch("https://api.github.com/repos/synvert-hq/synvert-gui/releases/latest")
        .then((response) => response.json())
        .then((data) => {
          const zipAsset = data.assets.find((asset) => asset.content_type === "application/x-msdos-program");
          if (zipAsset) {
            window.location.href = zipAsset.browser_download_url;
          }
        })
        .catch((error) => console.error("Error:", error));
    });
  }
});
