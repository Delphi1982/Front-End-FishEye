/* global closeLightbox */
/* global closeModal */

/**
 * Écoute globale des touches pour fermer les modales au besoin
 */
window.addEventListener("keydown", (e) => {
    // Si l'utilisateur appuie sur Échap
    if (e.key === "Escape") {
      // Cherche la lightbox
      const lightboxModal = document.getElementById("lightbox-modal");
      // Si la lightbox est ouverte (display: flex), on la ferme
      if (lightboxModal && getComputedStyle(lightboxModal).display === "flex") {
        closeLightbox();
        return; // on arrête là pour ne pas fermer autre chose
      }
  
      // Sinon, cherche la modale de contact
      const contactModal = document.getElementById("contact-modal");
      // Si elle est ouverte (display: flex), on la ferme
      if (contactModal && getComputedStyle(contactModal).display === "flex") {
        closeModal();
      }
    }
  });
  