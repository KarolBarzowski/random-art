const app = document.querySelector("#app");
const controlClick = document.querySelector("#click");
const controlWheel = document.querySelector("#wheel");
const cursor = document.querySelector(".cursor");
const headingWrapper = document.querySelector(".headingWrapper");

let isLoading = false;

const imgWrapper = document.createElement("div");
imgWrapper.classList.add("imageWrapper");
app.appendChild(imgWrapper);

const img = document.createElement("img");
img.classList.add("image");
img.setAttribute("sizes", "(min-width: 1640px) 843px, (min-width: 1200px) 843px, (min-width: 900px) 843px, (min-width: 600px) 90.63vw,  90.63vw");
imgWrapper.appendChild(img);

let dims = img.getBoundingClientRect();

const aboutWrapper = document.createElement("div");
aboutWrapper.classList.add("aboutWrapper");
imgWrapper.appendChild(aboutWrapper);

const row = document.createElement("div");
row.classList.add("row");
aboutWrapper.appendChild(row);

const row2 = document.createElement("div");
row2.classList.add("row");
aboutWrapper.appendChild(row2);

const titleLabelWrapper = document.createElement("div");
row.appendChild(titleLabelWrapper);

const titleLabel = document.createElement("span");
titleLabel.textContent = "Origin";
titleLabelWrapper.appendChild(titleLabel);

const titleParagraph = document.createElement("p");
titleLabelWrapper.appendChild(titleParagraph);

const dateLabelWrapper = document.createElement("div");
row.appendChild(dateLabelWrapper);

const dateLabel = document.createElement("span");
dateLabel.textContent = "Medium";
dateLabelWrapper.appendChild(dateLabel);

const dateParagraph = document.createElement("p");
dateLabelWrapper.appendChild(dateParagraph);

const artistLabelWrapper = document.createElement("div");
row2.appendChild(artistLabelWrapper);

const artistLabel = document.createElement("span");
artistLabel.textContent = "Dimensions";
artistLabelWrapper.appendChild(artistLabel);

const artistParagraph = document.createElement("p");
artistLabelWrapper.appendChild(artistParagraph);

const moreLabelWrapper = document.createElement("div");
row2.appendChild(moreLabelWrapper);

const moreLabel = document.createElement("span");
moreLabel.textContent = "Style";
moreLabelWrapper.appendChild(moreLabel);

const moreParagraph = document.createElement("p");
moreLabelWrapper.appendChild(moreParagraph);

const reloadIcon = document.createElement("img");
reloadIcon.classList.add("reloadIcon");
reloadIcon.src = "refresh.svg";
app.appendChild(reloadIcon);

function generateArt() {
  isLoading = true;
  reloadIcon.classList.remove("fadeOut");
  reloadIcon.classList.add("fadeIn");
  img.classList.remove("fadeIn");
  img.classList.add("fadeOut");
  headingWrapper.classList.remove("fadeIn");
  headingWrapper.classList.add("fadeOut");
  imgWrapper.classList.remove("half");
  aboutWrapper.classList.remove("visible");

  const rng = Math.floor(Math.random() * 9654);

  window
    .fetch(`https://api.artic.edu/api/v1/artworks?page=${rng}`)
    .then((res) => res.json())
    .then((obj) => {
      const imgRng = Math.floor(Math.random() * obj.data.length);
      const data = obj.data[imgRng];
      const { image_id, title, artist_title: artist, date_display, medium_display, dimensions, style_title, place_of_origin } = data;
      try {
        const { h, s, l } = data.color;
        document.body.style.backgroundColor = `hsla(${h}, ${s}%, ${l}%, 0.38)`;
      } catch (e) {
        generateArt();
      }
      document.querySelector("#heading").textContent = title;
      document.querySelector("#artist").textContent = artist ? `@${artist}, ${date_display}` : `@Unknown, ${date_display}`;
      titleParagraph.textContent = place_of_origin;
      artistParagraph.textContent = dimensions;
      dateParagraph.textContent = medium_display;
      moreParagraph.textContent = style_title ? style_title : "Unknown";

      const identifier = image_id;
      img.srcset = `https://www.artic.edu/iiif/2/${identifier}/full/200,/0/default.jpg 200w,
                        https://www.artic.edu/iiif/2/${identifier}/full/400,/0/default.jpg 400w,
                        https://www.artic.edu/iiif/2/${identifier}/full/843,/0/default.jpg 843w`;
      reloadIcon.classList.remove("rotate");
    });
}

img.addEventListener("load", () => {
  isLoading = false;
  img.classList.remove("fadeOut");
  img.classList.add("fadeIn");
  headingWrapper.classList.remove("fadeOut");
  headingWrapper.classList.add("fadeIn");
  reloadIcon.classList.remove("fadeIn");
  reloadIcon.classList.add("fadeOut");
  dims = img.getBoundingClientRect();
});

generateArt();

document.addEventListener("click", (e) => {
  imgWrapper.classList.toggle("half");
  aboutWrapper.classList.toggle("visible");
  controlClick.classList.add("fadeOut");
});

function createWheelStopListener(element, callback, timeout) {
  let handle = null;
  const onScroll = function () {
    if (handle) {
      clearTimeout(handle);
    }
    handle = setTimeout(callback, timeout || 200);
  };

  element.addEventListener("wheel", onScroll);

  return function () {
    element.removeEventListener("wheel", onScroll);
  };
}

createWheelStopListener(document, () => {
  if (!isLoading) {
    generateArt();
    controlWheel.classList.add("fadeOut");
  }
});

document.addEventListener("mousemove", ({ clientX, clientY }) => {
  cursor.style.transform = `translate(${clientX - 32}px, ${clientY - 32}px)`;
});
