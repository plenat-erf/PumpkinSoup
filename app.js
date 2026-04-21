const latestNoteElement = document.querySelector("#latest-note");

let allMessages = [];
let allPhotos = [];

initializeMessages();

function initializeMessages() {
  if (!Array.isArray(window.MORNING_NOTES)) {
    latestNoteElement.innerHTML = "";

    const paragraph = document.createElement("p");
    paragraph.className = "loading-state";
    paragraph.textContent =
      "The notes could not be loaded. Check that data/messages.js is present and loaded before app.js.";
    latestNoteElement.append(paragraph);
    return;
  }

  allMessages = normalizeMessages(window.MORNING_NOTES);
  allPhotos = window.PHOTO_MANIFEST || [];
  renderLatest(allMessages[0]);
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

function renderLatest(message) {
  latestNoteElement.innerHTML = "";

  if (!message) {
    const paragraph = document.createElement("p");
    paragraph.className = "loading-state";
    paragraph.textContent = "Your first morning note will appear here.";
    latestNoteElement.append(paragraph);
    return;
  }

  latestNoteElement.append(createDatePill(message.date));

  const title = document.createElement("h3");
  title.className = "note-title";
  title.textContent = message.title;
  latestNoteElement.append(title);

  if (message.photo) {
    const img = document.createElement("img");
    img.className = "note-image";
    img.src = `./data/photos/${message.photo}`;
    img.alt = "";
    latestNoteElement.append(img);
  }

  const body = document.createElement("div");
  body.className = "note-body";
  appendParagraphs(body, message.message);
  latestNoteElement.append(body);
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

function createDatePill(dateString) {
  const pill = document.createElement("p");
  pill.className = "note-date";
  pill.textContent = formatDate(dateString, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return pill;
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
