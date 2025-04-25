/* exported mediaTemplate */ // Indique que cette fonction est utilisée dans un autre fichier

/**
 * Crée et renvoie une carte média (image ou vidéo) pour la galerie.
 * @param {Object} media         Les données du média (titre, likes, image ou vidéo)
 * @param {Object} photographer  Les infos du photographe (pour le chemin d’accès)
 * @returns {Object}             Un objet contenant la méthode getMediaCardDOM()
 */
function mediaTemplate(media, photographer) {
  /**
   * Construit le DOM de la carte média
   * @returns {HTMLElement} Le <div> .gallery-item prêt à être inséré en page
   */
  function getMediaCardDOM() {
    // Crée le conteneur principal
    const galleryItem = document.createElement("div");
    galleryItem.classList.add("gallery-item");

    // On stocke quelques infos en data-attributes pour le tri et l’accessibilité
    galleryItem.dataset.likes = media.likes;
    galleryItem.dataset.date  = media.date;
    galleryItem.dataset.title = media.title;

    // Rendre cliquable et focusable au clavier
    galleryItem.setAttribute("tabindex", "0");
    galleryItem.setAttribute("role", "button");
    galleryItem.setAttribute(
      "aria-label",
      `${media.title}, ${media.likes} likes. Appuyez pour ouvrir.`
    );

    // Prépare le HTML du média (image ou vidéo)
    let mediaElement = "";
    if (media.image) {
      // Si c’est une image, on utilise une balise <img>
      mediaElement = `
        <img
          src="assets/photos/${photographer.name}/${media.image}"
          alt="${media.title}"
        />
      `;
    } else if (media.video) {
      // Si c’est une vidéo, on crée une balise <video> avec <source>
      mediaElement = `
        <video controls>
          <source
            src="assets/photos/${photographer.name}/${media.video}"
            type="video/mp4"
          />
          Votre navigateur ne supporte pas la vidéo.
        </video>
      `;
    }

    // On assemble le HTML complet de la carte
    galleryItem.innerHTML = `
      ${mediaElement}
      <div class="gallery-item-p">
        <p class="title">${media.title}</p>
        <div class="likes-container">
          <p class="likes">${media.likes}</p>
          <button class="heart" aria-label="Aimer ${media.title}">&hearts;</button>
        </div>
      </div>
    `;

    return galleryItem;
  }

  // On renvoie uniquement la méthode qui crée la carte
  return { getMediaCardDOM };
}
