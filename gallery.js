const galleryGridElement = document.querySelector("#gallery-grid");
const galleryTemplate = document.querySelector("#gallery-item-template");
const galleryEmptyState = document.querySelector("#gallery-empty-state");

let allPhotos = [];

initializeGallery();

function initializeGallery() {
  if (!Array.isArray(window.PHOTO_MANIFEST)) {
    galleryGridElement.innerHTML = "";

    const paragraph = document.createElement("p");
    paragraph.className = "loading-state";
    paragraph.textContent =
      "The gallery could not be loaded. Check that data/photos.js is present and loaded before gallery.js.";
    galleryGridElement.append(paragraph);
    return;
  }

  allPhotos = window.PHOTO_MANIFEST;
  renderGallery(allPhotos);
}

function renderGallery(photos) {
  galleryGridElement.innerHTML = "";

  if (photos.length === 0) {
    galleryEmptyState.hidden = false;
    return;
  }

  galleryEmptyState.hidden = true;

  photos.forEach((filename) => {
    const fragment = galleryTemplate.content.cloneNode(true);
    const img = fragment.querySelector(".gallery-image");
    const titleEl = fragment.querySelector(".gallery-title");
    const dateEl = fragment.querySelector(".gallery-date");

    img.src = `./data/photos/${filename}`;
    img.alt = filename;
    titleEl.textContent = filename;
    dateEl.textContent = "Added to gallery";

    galleryGridElement.append(fragment);
  });
}
