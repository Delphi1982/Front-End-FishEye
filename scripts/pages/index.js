/* global photographerTemplate */
/* global getPhotographers */

/**
 * Ajoute un style pour afficher une bordure de focus
 * seulement quand on navigue au clavier (avec Tab).
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
      outline: 3px solid #000; !important;
      outline-offset: 4px;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Affiche chaque photographe dans la page.
 * @param photographers Tableau d’objets photographe
 */
async function displayData(photographers) {
  const section = document.querySelector(".photographer_section");
  if (!section) return; // rien à faire si l’élément n’existe pas

  // Pour l’accessibilité, on dit que c’est une liste
  section.setAttribute("role", "list");
  section.setAttribute("aria-label", "Liste des photographes");

  photographers.forEach((photographer) => {
    // Crée la “carte” HTML du photographe
    const model = photographerTemplate(photographer);
    const card  = model.getUserCardDOM();

    // Chaque carte est un item de liste et peut être focusée
    card.setAttribute("role", "listitem");
    card.setAttribute("tabindex", "0");

    section.appendChild(card);
  });
}

/**
 * Démarre l’application :
 * 1. Ajoute le style de focus clavier
 * 2. Charge les données
 * 3. Affiche les photographes
 */
async function init() {
  injectFocusStyle();
  const { photographers } = await getPhotographers();
  displayData(photographers);
}

// Exécute init() quand la page est prête
document.addEventListener("DOMContentLoaded", init);
