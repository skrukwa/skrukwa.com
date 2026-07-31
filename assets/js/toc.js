let observer = new IntersectionObserver(handler, {
  threshold: [0],
});
let paragraphs = [...document.querySelectorAll("article > div > *")];
let submenu = [...document.querySelectorAll(".toc a")];
let tocElement = document.querySelector(".toc");

function previousHeaderId(p) {
  while (p && !p.matches("h1, h2, h3, h4")) {
    p = p.previousElementSibling;
  }
  return p?.id;
}

let paragraphMenuMap = paragraphs.reduce((acc, p) => {
  let h = previousHeaderId(p);
  p.previousHeader = h;
  if (h) {
    let entry = submenu.find((a) => decodeURIComponent(a.hash) === "#" + h);
    acc[h] = entry;
  }
  return acc;
}, {});

paragraphs.forEach((elem) => observer.observe(elem));

let selection;
let isSticky = false;

function clearTOCStyles() {
  document.querySelectorAll(".toc .selected, .toc .parent").forEach((el) => {
    el.classList.remove("selected", "parent");
  });
}

function applyStyles() {
  if (!isSticky || !selection) return;

  clearTOCStyles();

  for (let s of selection) {
    if (s.isIntersecting) {
      let parentElem = paragraphMenuMap[s.target.previousHeader]?.closest("li");
      parentElem?.classList.add("selected");
      
      if (!parentElem) continue;

      let a = parentElem.firstChild;
      a.scrollIntoView({
        block: "nearest",
        inline: "nearest",
      });
      
      while (parentElem) {
        parentElem?.classList.add("parent");
        parentElem = parentElem.parentElement.closest("li");
      }
    }
  }
}

function handler(updates) {
  selection = (selection || updates).map(
    (s) => updates.find((e) => e.target === s.target) || s,
  );
  applyStyles();
}

const resizeObserver = new ResizeObserver(() => {
  if (!tocElement) return;
  
  const currentlySticky = window.getComputedStyle(tocElement).position === "sticky";
  
  if (currentlySticky !== isSticky) {
    isSticky = currentlySticky;
    
    if (!isSticky) {
      clearTOCStyles();
    } else {
      applyStyles();
    }
  }
});

resizeObserver.observe(document.body);
