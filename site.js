/* ═══════════════════════════════════════════════════════════
   site.js — SHARED BY EVERY PAGE
   Every page loads it with this line in its <head>:
     <script src="site.js" defer></script>
   (defer = wait until the page is built before running)

   It does two things:
     1. The ☰ menu button on phones
     2. Easter eggs
═══════════════════════════════════════════════════════════ */


/* ─────────────────────────────────────────────────────────
   1. PHONE MENU
   Adds a three-line button to the top menu. On a phone,
   tapping it opens the page links in a list going down.
   The look is in style.css, under "Phone menu".
───────────────────────────────────────────────────────── */
(function () {
  const links = document.querySelector(".nav-links");
  if (!links) return;                      // pages with no menu (like About) skip this
  const nav = links.closest("nav");

  // build the button: <button class="nav-toggle"><span></span>×3</button>
  const btn = document.createElement("button");
  btn.className = "nav-toggle";
  btn.type = "button";
  btn.setAttribute("aria-label", "Menu");
  btn.setAttribute("aria-expanded", "false");
  btn.innerHTML = "<span></span><span></span><span></span>";
  nav.appendChild(btn);

  function setOpen(open) {
    nav.classList.toggle("open", open);    // style.css shows the list when nav has "open"
    btn.setAttribute("aria-expanded", open);
  }

  btn.addEventListener("click", e => {
    e.stopPropagation();
    setOpen(!nav.classList.contains("open"));
  });
  links.addEventListener("click", () => setOpen(false));            // picked a page
  document.addEventListener("click", e => {                          // tapped anywhere else
    if (!nav.contains(e.target)) setOpen(false);
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") setOpen(false); });
})();


/* ─────────────────────────────────────────────────────────
   1b. PICTURE VIEWER
   Clicking a picture inside a .gallery, or anything with
   data-zoom="images/whatever.png", opens it big.
   Click the picture again to see it at full size.
   Click outside it (or press Esc) to close.
───────────────────────────────────────────────────────── */
(function () {
  function show(src, caption, dark) {
    const lb = document.createElement("div");
    lb.className = "lightbox" + (dark ? " dark" : "");
    lb.innerHTML = `<img src="${src}" alt="">` + (caption ? `<div class="lb-cap">${caption}</div>` : "");
    const close = () => { lb.remove(); document.removeEventListener("keydown", esc); };
    const esc = e => { if (e.key === "Escape") close(); };
    lb.addEventListener("click", close);
    // click the picture itself to flip between "fit the screen" and full size
    lb.querySelector("img").addEventListener("click", e => {
      e.stopPropagation();
      lb.classList.toggle("full");
    });
    document.addEventListener("keydown", esc);
    document.body.appendChild(lb);
  }
  document.addEventListener("click", e => {
    const a = e.target.closest(".gallery a, [data-zoom]");
    if (!a) return;
    e.preventDefault();
    const img = a.querySelector("img");
    show(a.dataset.zoom || a.getAttribute("href"), img ? img.alt : (a.dataset.caption || ""), a.hasAttribute("data-dark"));
  });
})();


/* ─────────────────────────────────────────────────────────
   2. EASTER EGGS
   Give ANY element a data-egg="..." and clicking it pops up
   a little text box beside it. Click it again, or anywhere
   else, to close it. For example:

     <img src="svgs/planet6.svg" data-egg="hi">

   The text can have HTML in it, like <em> or <br>.
   The look of the box is in style.css, under "Easter eggs".
───────────────────────────────────────────────────────── */
(function () {
  let bubble = null;      // the box that's open right now
  let owner = null;       // the thing that opened it

  function close() {
    if (bubble) bubble.remove();
    if (owner) owner.classList.remove("egg-open");
    bubble = owner = null;
  }

  function open(el) {
    close();
    owner = el;
    el.classList.add("egg-open");          // lets CSS react while the box is open
    bubble = document.createElement("div");
    bubble.className = "egg-bubble";
    if (el.dataset.eggClass) bubble.classList.add(el.dataset.eggClass);  // optional extra style
    bubble.innerHTML = el.dataset.egg;
    document.body.appendChild(bubble);

    // Put it to the right of the thing. No room? Left. Still no room (phones)? Below.
    const r = el.getBoundingClientRect();
    const b = bubble.getBoundingClientRect();
    const gap = 14, pad = 10, W = document.documentElement.clientWidth;
    let x, y, side;
    if (r.right + gap + b.width < W - pad) {
      side = "right"; x = r.right + gap;           y = r.top + r.height / 2 - b.height / 2;
    } else if (r.left - gap - b.width > pad) {
      side = "left";  x = r.left - gap - b.width;  y = r.top + r.height / 2 - b.height / 2;
    } else {
      side = "below"; x = r.left + r.width / 2 - b.width / 2;  y = r.bottom + gap;
    }
    x = Math.max(pad, Math.min(x, W - b.width - pad));      // keep it on screen
    y = Math.max(70, y);                                     // and below the top menu
    bubble.style.left = (x + window.scrollX) + "px";
    bubble.style.top  = (y + window.scrollY) + "px";
    bubble.dataset.side = side;
  }

  document.addEventListener("click", e => {
    const egg = e.target.closest("[data-egg]");
    if (egg) {
      e.preventDefault();                          // so an egg on a link doesn't leave the page
      egg === owner ? close() : open(egg);
    } else if (!e.target.closest(".egg-bubble")) {
      close();
    }
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  window.addEventListener("resize", close);
})();
