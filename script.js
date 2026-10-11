const works = [
  { title: "Untitled Landscape", details: "Featured work", src: "assets/sunlit-valley.png" },
  { title: "Counterpoint", details: "Ink and graphite on paper, 2026", src: "assets/counterpoint.svg" },
  { title: "Low Tide", details: "Oil and charcoal on canvas, 2026", src: "assets/low-tide.svg" },
  { title: "A Field Note", details: "Archival pigment print, edition of 30, 2026", src: "assets/field-note.svg" },
  { title: "Blue Hour", details: "Conte and wash on paper, 2026", src: "assets/blue-hour.svg" },
  { title: "After the Rain", details: "Acrylic, chalk, and collage on board, 2026", src: "assets/after-rain.svg" },
];

const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxTitle = document.querySelector("#lightbox-title");
const lightboxDetails = document.querySelector(".lightbox-details");
const lightboxCount = document.querySelector(".lightbox-count");
const artworkButtons = [...document.querySelectorAll(".artwork")];
const config = window.MAUFORGE_CONFIG || {};
let activeIndex = 0;

function safeExternalUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
}

function configureExternalLinks() {
  const configuredLinks = document.querySelectorAll("[data-config-link]");
  const configuredCount = [...configuredLinks].reduce((count, link) => {
    const destination = safeExternalUrl(config[link.dataset.configLink]);
    if (!destination) {
      link.setAttribute("tabindex", "-1");
      return count;
    }
    link.href = destination;
    link.removeAttribute("aria-disabled");
    link.removeAttribute("tabindex");
    link.classList.remove("is-pending");
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    return count + 1;
  }, 0);

  if (configuredCount) {
    document.querySelector(".setup-message").textContent = "Secure destinations open in a new tab.";
  }
}

function showWork(index) {
  activeIndex = (index + works.length) % works.length;
  const work = works[activeIndex];
  lightboxImage.src = work.src;
  lightboxImage.alt = work.title;
  lightboxTitle.textContent = work.title;
  lightboxDetails.textContent = work.details;
  lightboxCount.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(works.length).padStart(2, "0")}`;
}

function openWork(index) {
  showWork(index);
  lightbox.showModal();
  document.querySelector(".close-button").focus();
}

artworkButtons.forEach((button) => button.addEventListener("click", () => openWork(Number(button.dataset.index))));
document.querySelector(".close-button").addEventListener("click", () => lightbox.close());
document.querySelector(".previous-button").addEventListener("click", () => showWork(activeIndex - 1));
document.querySelector(".next-button").addEventListener("click", () => showWork(activeIndex + 1));

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.open) return;
  if (event.key === "ArrowLeft") showWork(activeIndex - 1);
  if (event.key === "ArrowRight") showWork(activeIndex + 1);
});

document.querySelectorAll(".filter").forEach((filter) => {
  filter.addEventListener("click", () => {
    const category = filter.dataset.filter;
    document.querySelectorAll(".filter").forEach((item) => {
      const selected = item === filter;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    artworkButtons.forEach((artwork) => {
      artwork.hidden = category !== "all" && artwork.dataset.category !== category;
    });
  });
});

configureExternalLinks();
