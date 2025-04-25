// Variables globales pour gérer la liste de médias et l’index courant
let galleryItems = [];
let currentIndex = 0;

// On retient l’élément qui avait le focus avant d’ouvrir la lightbox
let lastFocusedElement = null;

/**
 * Ferme la lightbox (fenêtre modale plein écran)
 */
function closeLightbox() {
  const lightboxModal = document.getElementById("lightbox-modal");
  if (!lightboxModal) return;

  // Masquer la modale
  lightboxModal.style.display = "none";
  lightboxModal.setAttribute("aria-hidden", "true");
  document.getElementById("main").removeAttribute("aria-hidden");

  // Restaurer le focus sur l’élément d’origine
  if (lastFocusedElement) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
}

/**
 * Met à jour le contenu de la lightbox selon currentIndex
 * @param {HTMLElement} modal  L’élément DOM de la lightbox
 */
function updateLightboxContent(modal) {
  const item = galleryItems[currentIndex];
  const title = item.dataset.title;
  const mediaContainer = modal.querySelector('.lightbox-media-container');
  mediaContainer.innerHTML = "";

  // Si le média contient une vidéo
  const videoEl = item.querySelector("video");
  if (videoEl) {
    const videoElement = document.createElement("video");
    const sourceEl = videoEl.querySelector("source");
    videoElement.src = sourceEl ? sourceEl.src : videoEl.src;
    videoElement.controls = true;
    videoElement.autoplay = true;
    mediaContainer.appendChild(videoElement);
  } else {
    // Sinon, c’est une image
    const imgEl = item.querySelector("img");
    if (imgEl) {
      const imgElement = document.createElement("img");
      imgElement.src = imgEl.src;
      imgElement.alt = imgEl.alt || "Média affiché";
      imgElement.classList.add("lightbox-image");
      mediaContainer.appendChild(imgElement);
    }
  }

  // Affiche le titre sous le média
  modal.querySelector(".lightbox-caption").textContent = title;
}

/**
 * Ouvre la lightbox pour un media cliqué
 * @param {HTMLElement} item  L’élément .gallery-item cliqué
 */
function openLightbox(item) {
  // 1) Retenir l’élément qui avait le focus
  lastFocusedElement = document.activeElement;

  // 2) Définir l’index courant et créer la modale si besoin
  currentIndex = galleryItems.indexOf(item);
  let lightboxModal = document.getElementById("lightbox-modal");

  if (!lightboxModal) {
    lightboxModal = document.createElement("div");
    lightboxModal.id = "lightbox-modal";
    lightboxModal.classList.add("lightbox-modal");
    lightboxModal.setAttribute("aria-hidden", "true");
    lightboxModal.innerHTML = `
      <div class="lightbox-container" tabindex="0">
        <button class="close-lightbox" aria-label="Fermer">×</button>
        <div class="image-frame">
          <button class="prev-button" aria-label="Média précédent">❮</button>
          <div class="lightbox-media-texte">
            <div class="lightbox-media-container"></div>
            <p class="lightbox-caption"></p>
          </div>
          <button class="next-button" aria-label="Média suivant">❯</button>
        </div>
      </div>
    `;
    document.getElementById("lightbox-parent").appendChild(lightboxModal);

    // Listeners de contrôle
    lightboxModal.querySelector(".close-lightbox").addEventListener("click", closeLightbox);
    lightboxModal.querySelector(".next-button").addEventListener("click", e => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % galleryItems.length;
      updateLightboxContent(lightboxModal);
    });
    lightboxModal.querySelector(".prev-button").addEventListener("click", e => {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
      updateLightboxContent(lightboxModal);
    });
    lightboxModal.addEventListener("click", e => {
      if (!e.target.closest(".lightbox-container")) closeLightbox();
    });
  }

  // 3) Mettre à jour et afficher
  updateLightboxContent(lightboxModal);
  lightboxModal.style.display = "flex";
  lightboxModal.setAttribute("aria-hidden", "false");
  document.getElementById("main").setAttribute("aria-hidden", "true");

  // 4) Focus trap & escape
  const modalContainer = lightboxModal.querySelector(".lightbox-container");
  modalContainer.focus();
  modalContainer.addEventListener("keydown", function(e) {
    // Navigation flèches…
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
      updateLightboxContent(lightboxModal);
      return;
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      currentIndex = (currentIndex + 1) % galleryItems.length;
      updateLightboxContent(lightboxModal);
      return;
    }

    // Cycle Tab
    if (e.key === "Tab") {
      const focusable = Array.from(
        lightboxModal.querySelectorAll(
          "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
        )
      );
      if (!focusable.length) return e.preventDefault();
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
      return;
    }

    // Échap ferme la lightbox et restaure le focus
    if (e.key === "Escape" || e.key === "Esc") {
      e.preventDefault();
      closeLightbox();
    }
  });
}

/**
 * Ajoute un clic et un focus aux éléments de la galerie
 */
function addModalOpenEventListeners() {
  galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
  document.querySelectorAll(".gallery-item img, .gallery-item video").forEach(media => {
    media.addEventListener("click", e => {
      e.stopPropagation();
      openLightbox(media.closest(".gallery-item"));
    });
  });
}

// Au chargement de la page, on active les clics sur la galerie
document.addEventListener("DOMContentLoaded", () => {
  addModalOpenEventListeners();
});
