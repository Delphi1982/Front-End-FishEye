// Variables globales pour gérer la liste de médias et l’index courant
let galleryItems = [];
let currentIndex = 0;

/**
 * Ferme la lightbox (fenêtre modale plein écran)
 */
function closeLightbox() {
  const lightboxModal = document.getElementById("lightbox-modal");
  if (!lightboxModal) return;                    // Si pas de modal, on quitte
  lightboxModal.style.display = "none";          // Cache la modal
  lightboxModal.setAttribute("aria-hidden", "true"); 
  document.getElementById("main").removeAttribute("aria-hidden"); 
}

/**
 * Met à jour le contenu de la lightbox selon currentIndex
 * @param {HTMLElement} modal  L’élément DOM de la lightbox
 */
function updateLightboxContent(modal) {
  const item = galleryItems[currentIndex];        // Le média courant
  const title = item.dataset.title;               // Son titre depuis data-title
  const mediaContainer = modal.querySelector('.lightbox-media-container');
  mediaContainer.innerHTML = "";                  // On vide l’ancien média

  // Si le média contient une vidéo
  const videoEl = item.querySelector("video");
  if (videoEl) {
    // On crée un <video> pour la lightbox
    const videoElement = document.createElement("video");
    // On récupère la source depuis <source> ou directement src
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
  console.log("Ouverture de la lightbox");
  currentIndex = galleryItems.indexOf(item);      // Met à jour l’index

  // Cherche si la lightbox existe déjà
  let lightboxModal = document.getElementById("lightbox-modal");

  // Si elle n’existe pas, on la crée
  if (!lightboxModal) {
    lightboxModal = document.createElement("div");
    lightboxModal.id = "lightbox-modal";
    lightboxModal.classList.add("lightbox-modal");
    lightboxModal.setAttribute("aria-hidden", "true");

    // On injecte le HTML de la lightbox
    lightboxModal.innerHTML = `
      <div class="lightbox-container">
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
    // On place la lightbox dans le DOM
    document.getElementById("lightbox-parent").appendChild(lightboxModal);

    // Fermeture au clic sur la croix
    lightboxModal.querySelector(".close-lightbox")
      .addEventListener("click", () => closeLightbox());

    // Bouton suivant
    lightboxModal.querySelector(".next-button")
      .addEventListener("click", event => {
        event.stopPropagation();
        currentIndex = (currentIndex + 1) % galleryItems.length;
        updateLightboxContent(lightboxModal);
      });

    // Bouton précédent
    lightboxModal.querySelector(".prev-button")
      .addEventListener("click", event => {
        event.stopPropagation();
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        updateLightboxContent(lightboxModal);
      });

    // Fermer si on clique en dehors de la boîte
    lightboxModal.addEventListener("click", event => {
      if (!event.target.closest(".lightbox-container")) {
        console.log("Clic en dehors, on ferme");
        closeLightbox();
      }
    });
  }

  // On met à jour le contenu pour l’élément courant
  updateLightboxContent(lightboxModal);

  // On affiche la lightbox et cache le contenu principal
  lightboxModal.style.display = "flex";
  lightboxModal.setAttribute("aria-hidden", "false");
  document.getElementById("main").setAttribute("aria-hidden", "true");

  // On met le focus sur le conteneur pour l’accessibilité
  const modalContainer = lightboxModal.querySelector(".lightbox-container");
  modalContainer.setAttribute("tabindex", "0");
  modalContainer.focus();

  // Navigation clavier dans la lightbox
  modalContainer.addEventListener("keydown", function(e) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
      updateLightboxContent(lightboxModal);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      currentIndex = (currentIndex + 1) % galleryItems.length;
      updateLightboxContent(lightboxModal);
    } else if (e.key === "Tab") {
      // Gestion du focus cyclique dans la modal
      const focusable = Array.from(
        lightboxModal.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])")
      );
      if (focusable.length === 0) return e.preventDefault();
      const firstEl = focusable[0];
      const lastEl  = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault(); lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault(); firstEl.focus();
      }
    }
  });
}

/**
 * Ajoute un clic et un focus aux éléments de la galerie
 * pour ouvrir la lightbox
 */
function addModalOpenEventListeners() {
  // On récupère tous les .gallery-item dans galleryItems
  galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
  // Pour chaque image ou vidéo, on ouvre la lightbox au clic
  document.querySelectorAll(".gallery-item img, .gallery-item video")
    .forEach(media => {
      media.addEventListener("click", event => {
        event.stopPropagation();
        openLightbox(media.closest(".gallery-item"));
      });
    });
}

// Au chargement de la page, on active les clics sur la galerie
document.addEventListener("DOMContentLoaded", () => {
  addModalOpenEventListeners();
});
