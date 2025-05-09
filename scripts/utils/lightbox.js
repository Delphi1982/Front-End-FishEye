// Variables globales pour gérer la liste de médias et l’index courant
let galleryItems = [];
let currentIndex = 0;
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

  const captionEl = modal.querySelector('#lightbox-caption');
  let mediaElement;

  // Si le média est une vidéo
  const videoEl = item.querySelector('video');
  if (videoEl) {
    mediaElement = document.createElement('video');
    const source = videoEl.querySelector('source');
    mediaElement.src = source ? source.src : videoEl.src;
    mediaElement.controls = true;
    mediaElement.autoplay = true;
    mediaElement.setAttribute('aria-label', title);
  } else {
    // Sinon, c’est une image
    const imgEl = item.querySelector('img');
    mediaElement = document.createElement('img');
    mediaElement.src = imgEl.src;
    mediaElement.alt = imgEl.alt || title || 'Média affiché';
    mediaElement.classList.add('lightbox-image');
  }

  // Lier le média à sa légende
  mediaElement.setAttribute('aria-describedby', 'lightbox-caption');
  mediaContainer.appendChild(mediaElement);

  // Mettre à jour la légende (live region)
  captionEl.textContent = title;
}

/**
 * Ouvre la lightbox pour un media cliqué
 * @param {HTMLElement} item  L’élément .gallery-item cliqué
 */
function openLightbox(item) {
  // 1) Retenir l’élément qui avait le focus
  lastFocusedElement = document.activeElement;
  currentIndex = galleryItems.indexOf(item);

  let lightboxModal = document.getElementById("lightbox-modal");

  // 2) Si la modale n'existe pas encore, on la crée
  if (!lightboxModal) {
    lightboxModal = document.createElement("div");
    lightboxModal.id = "lightbox-modal";
    lightboxModal.classList.add("lightbox-modal");
    lightboxModal.setAttribute("role", "dialog");
    lightboxModal.setAttribute("aria-modal", "true");
    lightboxModal.setAttribute("aria-labelledby", "lightbox-caption");
    lightboxModal.setAttribute("aria-hidden", "true");

    // Conteneur principal pour trap focus
    const container = document.createElement("div");
    container.classList.add("lightbox-container");
    container.tabIndex = 0;

    // Bouton pour fermer
    const btnClose = document.createElement("button");
    btnClose.classList.add("close-lightbox");
    btnClose.setAttribute("aria-label", "Fermer la lightbox");
    btnClose.textContent = "×";
    btnClose.addEventListener("click", closeLightbox);

    // Bouton précédent
    const btnPrev = document.createElement("button");
    btnPrev.classList.add("prev-button");
    btnPrev.setAttribute("aria-label", "Média précédent");
    btnPrev.textContent = "❮";
    btnPrev.addEventListener("click", e => {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
      updateLightboxContent(lightboxModal);
    });

    // Bouton suivant
    const btnNext = document.createElement("button");
    btnNext.classList.add("next-button");
    btnNext.setAttribute("aria-label", "Média suivant");
    btnNext.textContent = "❯";
    btnNext.addEventListener("click", e => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % galleryItems.length;
      updateLightboxContent(lightboxModal);
    });

    // Frame image/vidéo + légende
    const frame = document.createElement("div");
    frame.classList.add("image-frame");

    const mediaText = document.createElement("div");
    mediaText.classList.add("lightbox-media-texte");

    const mediaContainer = document.createElement("div");
    mediaContainer.classList.add("lightbox-media-container");

    const caption = document.createElement("p");
    caption.id = "lightbox-caption";
    caption.classList.add("lightbox-caption");
    caption.setAttribute("role", "status");
    caption.setAttribute("aria-live", "polite");
    caption.setAttribute("aria-atomic", "true");

    mediaText.appendChild(mediaContainer);
    mediaText.appendChild(caption);
    frame.appendChild(btnPrev);
    frame.appendChild(mediaText);
    frame.appendChild(btnNext);

    container.appendChild(btnClose);
    container.appendChild(frame);
    lightboxModal.appendChild(container);
    document.getElementById("lightbox-parent").appendChild(lightboxModal);

    // Clic en dehors de la box = fermeture
    lightboxModal.addEventListener("click", e => {
      if (!e.target.closest(".lightbox-container")) closeLightbox();
    });

    // Gestion du clavier pour trap focus, flèches, escape
    container.addEventListener("keydown", function(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        return closeLightbox();
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        currentIndex = e.key === "ArrowLeft"
          ? (currentIndex - 1 + galleryItems.length) % galleryItems.length
          : (currentIndex + 1) % galleryItems.length;
        return updateLightboxContent(lightboxModal);
      }
      if (e.key === "Tab") {
        const focusable = Array.from(
          lightboxModal.querySelectorAll(
            "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
          )
        );
        if (!focusable.length) return e.preventDefault();
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  // 3) Mise à jour et affichage
  updateLightboxContent(lightboxModal);
  lightboxModal.style.display = "flex";
  lightboxModal.setAttribute("aria-hidden", "false");
  document.getElementById("main").setAttribute("aria-hidden", "true");

  // Trap focus initial
  lightboxModal.querySelector(".lightbox-container").focus();
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
