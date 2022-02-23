const app = document.querySelector("#app");
const controlClick = document.querySelector("#click");
const controlWheel = document.querySelector("#wheel");
const cursor = document.querySelector(".cursor");
const cursorInner = document.querySelector(".cursorInner");
const headingWrapper = document.querySelector(".headingWrapper");
const controlsWrapper = document.querySelector(".controlsWrapper");

let isLoading = false;

const imgWrapper = document.createElement("div");
imgWrapper.classList.add("imageWrapper");
app.appendChild(imgWrapper);

const img = document.createElement("img");
img.classList.add("image");
img.setAttribute("sizes", "(min-width: 1640px) 843px, (min-width: 1200px) 843px, (min-width: 900px) 843px, (min-width: 600px) 90.63vw,  90.63vw");
imgWrapper.appendChild(img);

let dims = img.getBoundingClientRect();

const reloadIcon = document.createElement("img");
reloadIcon.classList.add("reloadIcon");
reloadIcon.src = "refresh.svg";
app.appendChild(reloadIcon);

let currentType;

// window
//   .fetch(`https://api.artic.edu/api/v1/artwork-types?limit=44`)
//   .then((res) => res.json())
//   .then(({ data }) => {
//     data.forEach((item) => {
//       const el = document.createElement("button");
//       el.type = "button";
//       el.textContent = item.title;
//       controlsWrapper.appendChild(el);
//     });
//   });

Array.from(controlsWrapper.children).forEach((el) => {
  el.addEventListener("click", () => {
    if (el.classList.contains("active")) {
      el.classList.remove("active");
      currentType = null;
    } else {
      document.querySelector(".active")?.classList.remove("active");
      el.classList.add("active");
      currentType = el.textContent;
    }
    generateArt();
  });
});

function generateArt() {
  isLoading = true;
  reloadIcon.classList.remove("fadeOut");
  reloadIcon.classList.add("fadeIn");
  img.classList.remove("fadeIn");
  img.classList.add("fadeOut");
  headingWrapper.classList.remove("fadeIn");
  headingWrapper.classList.add("fadeOut");
  imgWrapper.classList.remove("half");

  const rng = Math.floor(Math.random() * 9654);

  window
    .fetch(`https://api.artic.edu/api/v1/artworks?page=${rng}`)
    .then((res) => res.json())
    .then((obj) => {
      const imgRng = Math.floor(Math.random() * obj.data.length);
      let data = null;

      if (currentType) {
        obj.data.forEach((item, i) => {
          if (item.artwork_type_title === currentType) {
            data = item;
          }
        });
      } else {
        data = obj.data[imgRng];
      }

      if (data === null) {
        generateArt();
        return;
      }

      const { image_id, title, artist_title: artist, date_display, artwork_type_title } = data;
      try {
        const { h, s, l } = data.color;
        document.body.style.backgroundColor = `hsla(${h}, ${s}%, ${l}%, 0.38)`;
      } catch (e) {
        generateArt();
      }
      document.querySelector("#heading").textContent = title;
      document.querySelector("#heading").href = `https://www.google.com/search?q=${encodeURIComponent(artist ? title + " " + artist : title)}`;
      document.querySelector("#artist").textContent = artist ? `@${artist}, ${date_display}` : `@Unknown, ${date_display}`;
      document.querySelector("#type").textContent = artwork_type_title;

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

document.querySelector("#next").addEventListener("click", generateArt);

window.addEventListener("resize", () => {
  dims = img.getBoundingClientRect();
});

document.addEventListener("mousemove", ({ clientX, clientY }) => {
  cursor.style.transform = `translate(${clientX - 32}px, ${clientY - 32}px)`;
  if (clientX >= dims.x && clientX <= dims.x + dims.width && clientY >= dims.y && clientY <= dims.y + dims.height) {
    cursorInner.classList.remove("scaleOut");
    document.body.style.cursor = "none";
  } else {
    cursorInner.classList.add("scaleOut");
    document.body.style.cursor = "auto";
  }
});
