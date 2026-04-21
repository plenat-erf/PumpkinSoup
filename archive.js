const archiveListElement = document.querySelector("#archive-list");
const archiveTemplate = document.querySelector("#archive-item-template");
const searchInput = document.querySelector("#search-input");
const emptyState = document.querySelector("#empty-state");

let allMessages = [];
let allPhotos = [];

initializeArchive();

function initializeArchive() {
  if (!Array.isArray(window.MORNING_NOTES)) {
    archiveListElement.innerHTML = "";

    const paragraph = document.createElement("p");
    paragraph.className = "loading-state";
    paragraph.textContent =
      "The notes could not be loaded. Check that data/messages.js is present and loaded before archive.js.";
    archiveListElement.append(paragraph);
    return;
  }

  allMessages = normalizeMessages(window.MORNING_NOTES);
  allPhotos = window.PHOTO_MANIFEST || [];
  renderArchive(allMessages);
}

function normalizeMessages(messages) {
  return [...messages]
    .filter((message) => message.date && message.title && message.message)
    .sort((left, right) => {
      const leftDate = new Date(`${left.date}T00:00:00`);
      const rightDate = new Date(`${right.date}T00:00:00`);

      return rightDate - leftDate;
    });
}

function renderArchive(messages) {
  archiveListElement.innerHTML = "";

  const searchTerm = searchInput.value.trim().toLowerCase();
  const filteredMessages = messages.filter((message) => {
    const searchTarget = [
      message.date,
      formatDate(message.date),
      message.title,
      message.message,
    ]
      .join(" ")
      .toLowerCase();

    return searchTarget.includes(searchTerm);
  });

  emptyState.hidden = filteredMessages.length !== 0;

  filteredMessages.forEach((message, index) => {
    const fragment = archiveTemplate.content.cloneNode(true);
    const details = fragment.querySelector(".archive-item");
    const date = fragment.querySelector(".archive-date");
    const title = fragment.querySelector(".archive-title");
    const preview = fragment.querySelector(".archive-preview");
    const action = fragment.querySelector(".archive-action");
    const body = fragment.querySelector(".archive-body");

    details.addEventListener("toggle", () => {
      action.textContent = details.open ? "Reading" : "Open";
    });

    date.textContent = formatDate(message.date, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    title.textContent = message.title;
    preview.textContent = createPreview(message.message);
    
    if (message.photo) {
      const img = document.createElement("img");
      img.className = "archive-item-image";
      img.src = `./data/photos/${message.photo}`;
      img.alt = "";
      body.append(img);
    }
    
    appendParagraphs(body, message.message);

    archiveListElement.append(fragment);
  });
}

function appendParagraphs(target, message) {
  const blocks = message
    .split(/\n\s*\n/g)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  blocks.forEach((paragraphText) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = paragraphText;
    target.append(paragraph);
  });
}

function createPreview(message) {
  const collapsed = message.replace(/\s+/g, " ").trim();

  if (collapsed.length <= 112) {
    return collapsed;
  }

  return `${collapsed.slice(0, 109).trimEnd()}...`;
}

function formatDate(dateString, options = {}) {
  const hasExplicitDateParts = ["weekday", "year", "month", "day"].some(
    (key) => key in options,
  );
  const formatterOptions = hasExplicitDateParts
    ? options
    : { dateStyle: "long", ...options };
  const formatter = new Intl.DateTimeFormat(undefined, formatterOptions);

  return formatter.format(new Date(`${dateString}T00:00:00`));
}

searchInput.addEventListener("input", () => {
  renderArchive(allMessages);
});
