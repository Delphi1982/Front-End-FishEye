/* global mediaFactory */
/* global addModalOpenEventListeners */
/* global openLightbox */

/**
 * Ajoute un style pour n’afficher la bordure de focus qu’au clavier (Tab).
 */
function injectFocusStyle() {
  const style = document.createElement('style');
  style.textContent = `
    /* Pas de bordure quand on clique à la souris */
    :focus:not(:focus-visible) {
      outline: none !important;
    }
    /* Bordure épaisse quand focus au clavier */
    :focus-visible {
      outline: 3px solid #000 !important;
      outline-offset: 4px;
    }
    /* Permet à la bordure du cœur de dépasser si nécessaire */
    .likes-container {
      overflow: visible !important;
    }
    .heart:focus-visible {
      outline-offset: 6px;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Récupère l’ID du photographe depuis l’URL (paramètre ?id=).
 */
function getPhotographerIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get("id"), 10);
}

/**
 * Charge le fichier JSON contenant les photographes et les médias.
 */
async function getPhotographersData() {
  const response = await fetch("/data/photographers.json");
  return response.json();
}

/**
 * Remplit la partie header avec les infos du photographe sélectionné.
 * @param {Object} photographer 
 */
function updatePhotographerHeader(photographer) {
  // Nom et rôle titre
  const nameEl = document.querySelector(".photograph-header .photographer-name");
  nameEl.textContent = photographer.name;
  nameEl.setAttribute("role", "heading");
  nameEl.setAttribute("aria-level", "1");

  // Ville et pays
  const locEl = document.querySelector(".photograph-header .localisation");
  locEl.textContent = `${photographer.city}, ${photographer.country}`;

  // Tagline
  const tagEl = document.querySelector(".photograph-header .photographer-tagline");
  tagEl.textContent = photographer.tagline;

  // Photo de profil
  const picEl = document.querySelector(".photograph-header .profile-pic");
  picEl.src = `assets/photographers/idphotos/${photographer.portrait}`;
  picEl.alt = `Portrait de ${photographer.name}`;
}

/**
 * Affiche le tarif journalier du photographe.
 */
function updateDailyRate(photographer) {
  const rateEl = document.querySelector(".daily-rate");
  if (!rateEl) return;
  rateEl.textContent = `${photographer.price}€ / jour`;
  rateEl.setAttribute("aria-label", `${photographer.price} euros par jour`);
  rateEl.setAttribute("role", "status");
}

/**
 * Construit la galerie d’images/vidéos pour ce photographe.
 */
function updateGallery(mediaList, photographer) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = ""; // Vide la galerie avant de la remplir

  if (mediaList.length === 0) {
    gallery.innerHTML = "<p>Aucun média disponible pour ce photographe.</p>";
    return;
  }

  mediaList.forEach(media => {
    // Utilise le template pour créer la carte média
    const model = mediaFactory(media, photographer);
    const card  = model.getMediaCardDOM();
    card.setAttribute("tabindex", "0"); 
    gallery.appendChild(card);
  });

  attachHeartListeners(); // Active le like clavier/souris
  addEventForOpenLightbox();
}

/**
 * Tri les médias quand on clique sur un critère (popularité, date, titre).
 */
function handleSortModifie(photographerMedia, photographer) {
  const byPop   = document.getElementById("sort-popularite");
  const byDate  = document.getElementById("sort-date");
  const byTitle = document.getElementById("sort-titre");

  // Popularité
  byPop.addEventListener("click", () => {
    const sorted = [...photographerMedia].sort((a, b) => b.likes - a.likes);
    updateGallery(sorted, photographer);
    addModalOpenEventListeners();
  });

  // Date
  byDate.addEventListener("click", () => {
    const sorted = [...photographerMedia].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    updateGallery(sorted, photographer);
    addModalOpenEventListeners();
  });

  // Titre
  byTitle.addEventListener("click", () => {
    const sorted = [...photographerMedia].sort((a, b) =>
      a.title.localeCompare(b.title)
    );
    updateGallery(sorted, photographer);
    addModalOpenEventListeners();
  });
}

/**
 * Rend le menu de tri ouvert/fermé au clic et au clavier (Enter/Espace).
 */
function openSort() {
  const arrowBtn = document.querySelector(".sort-arrow");
  const menuList = document.querySelector(".sort-arrow + ul");
  const arrowImg = document.querySelector(".arrow-up");
  const items    = menuList.querySelectorAll("li");

  // Rendre le bouton et les items focusables
  arrowBtn.setAttribute("tabindex", "0");
  items.forEach(li => li.setAttribute("tabindex", "0"));

  // Fonction de bascule
  const toggle = () => {
    menuList.classList.toggle("open");
    arrowImg.classList.toggle("direction-fleche");
  };
  arrowBtn.addEventListener("click", toggle);
  arrowBtn.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  });

  // Permet de sélectionner un critère au clavier
  items.forEach(li => {
    li.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        li.click();
      }
    });
  });
}

/**
 * Calcule et affiche le total des likes sous la galerie.
 */
function calculTotalLikes() {
  const likesEls = document.querySelectorAll(".likes");
  let total = 0;
  likesEls.forEach(el => {
    total += parseInt(el.textContent, 10);
  });
  const totalEl = document.querySelector(".total-likes");
  if (!totalEl) return;
  totalEl.textContent = total;
  totalEl.setAttribute("aria-live", "polite");
  totalEl.setAttribute("aria-label", `Total des likes: ${total}`);
}

/**
 * Active le like/unlike sur les cœurs, clavier et souris.
 */
function attachHeartListeners() {
  document.querySelectorAll(".likes-container").forEach(container => {
    const countEl    = container.querySelector(".likes");
    const heartBtn   = container.querySelector(".heart");

    // Rendre le cœur focusable et identifiable comme bouton
    heartBtn.setAttribute("tabindex", "0");
    heartBtn.setAttribute("role", "button");

    // Fonction qui bascule le like
    const toggleLike = () => {
      let n = parseInt(countEl.textContent, 10);
      if (!countEl.classList.contains("heart-active")) {
        countEl.textContent = n + 1;
        countEl.classList.add("heart-active");
      } else {
        countEl.textContent = n - 1;
        countEl.classList.remove("heart-active");
      }
      calculTotalLikes();
    };

    // Clic souris
    heartBtn.addEventListener("click", e => {
      e.stopPropagation();
      toggleLike();
    });

    // Clavier (Enter ou Espace)
    heartBtn.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        toggleLike();
      }
    });
  });
}

/**
 * Ouvre la lightbox si on fait Enter sur une vignette de galerie.
 */
function addEventForOpenLightbox() {
  document.querySelectorAll(".gallery-item").forEach(item => {
    item.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        openLightbox(item);
      }
    });
  });
}

// Démarrage de tout le script quand la page est prête
document.addEventListener("DOMContentLoaded", async () => {
  injectFocusStyle();  // Active le style de focus clavier

  const id   = getPhotographerIdFromURL();
  const data = await getPhotographersData();
  const photographer = data.photographers.find(p => p.id === id);
  if (!photographer) {
    console.error(`Photographe introuvable pour l'ID ${id}`);
    return;
  }

  // Mise en place du header
  updatePhotographerHeader(photographer);

  // ──────────────── Gestion du focus clavier uniquement ─────────────────
  const photographerRegion = document.querySelector(".photograph-header");
  if (photographerRegion) {
    // rendre tabbable et accessible
    photographerRegion.setAttribute("role", "region");
    photographerRegion.setAttribute("tabindex", "0");
    photographerRegion.setAttribute("aria-labelledby", "photographer-info");

    // détecteur de modalité
    let hadKeyboardEvent = false;
    window.addEventListener("keydown", () => { hadKeyboardEvent = true; }, true);
    window.addEventListener("mousedown", () => { hadKeyboardEvent = false; }, true);

    // n’autoriser le focus que si c’est par Tab
    photographerRegion.addEventListener("focus", e => {
      if (!hadKeyboardEvent) {
        e.target.blur();
      }
    }, true);
  }
  // ───────────────────────────────────────────────────────────────────────

  updateDailyRate(photographer);

  const medias = data.media.filter(m => m.photographerId === id);
  updateGallery(medias, photographer);

  calculTotalLikes();
  handleSortModifie(medias, photographer);
  openSort();
  addModalOpenEventListeners();
  addEventForOpenLightbox();
});
