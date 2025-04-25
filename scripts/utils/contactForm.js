// Crée et configure une fenêtre modale pour le formulaire de contact
function createContactModal() {
  // On crée un <div> modal caché au départ
  const modal = document.createElement("div");
  modal.id = "contact-modal";
  modal.className = "contact-modal";
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");

  // On ajoute le HTML de la modale : titre, formulaire et bouton de fermeture
  modal.innerHTML = `
    <div class="contact-modal-container">
      <button class="close-button" aria-label="Fermer" onclick="closeModal()">×</button>
      <h2>
        <span id="contact-text">Contactez-moi</span><br />
        <span id="photographer-name"></span>
      </h2>
      <form id="contact-form">
        <label for="firstname">Prénom</label>
        <input type="text" id="firstname" name="firstname" required />
        
        <label for="name">Nom</label>
        <input type="text" id="name" name="name" required />
        
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required />
        
        <label for="message">Message</label>
        <textarea id="message" name="message" required></textarea>
        
        <button type="submit" class="submit-button">Envoyer</button>
      </form>
    </div>
  `;

  // On ajoute la modale au <body> de la page
  document.body.appendChild(modal);

  // On empêche le formulaire de recharger la page à l'envoi
  const form = modal.querySelector("#contact-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // bloque le rafraîchissement

    // On récupère et affiche chaque valeur dans la console
    const firstname = modal.querySelector("#firstname").value.trim();
    console.log("Prénom :", firstname);

    const name = modal.querySelector("#name").value.trim();
    console.log("Nom :", name);

    const email = modal.querySelector("#email").value.trim();
    console.log("Email :", email);

    const message = modal.querySelector("#message").value.trim();
    console.log("Message :", message);

    // On ferme la modale sans rediriger la page
    closeModal();
  });
}

// On crée la modale dès que la page est prête
document.addEventListener("DOMContentLoaded", () => {
  createContactModal();

  // On gère la navigation au clavier dans la modale (boucle Tab)
  const modal = document.getElementById("contact-modal");
  if (modal) {
    modal.addEventListener("keydown", (event) => {
      if (event.key === "Tab") {
        const focusable = modal.querySelectorAll("input, textarea, button");
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        // Si on fait Shift+Tab sur le premier champ, on va au dernier
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
        // Si on Tab sur le dernier, on boucle au premier
        else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }
});

// Affiche la modale et met le focus sur le premier champ
/* exported displayModal */
function displayModal() {
  const modal = document.getElementById("contact-modal");
  const nameEl = document.getElementById("photographer-name");
  if (modal && nameEl) {
    // Récupère le nom du photographe et l’affiche dans la modale
    const photographerName = document.querySelector(".photographer-name").textContent;
    nameEl.textContent = photographerName;

    // Montre la modale et cache le contenu principal pour l’accessibilité
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    document.getElementById("main").setAttribute("aria-hidden", "true");

    // Place le focus sur le premier champ du formulaire
    const firstField = modal.querySelector("input, textarea, button");
    if (firstField) firstField.focus();
  } else {
    console.error("Modale ou nom du photographe introuvable.");
  }
}

// Ferme la modale sans rechargement ni redirection
function closeModal() {
  const modal = document.getElementById("contact-modal");
  if (modal) {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    document.getElementById("main").removeAttribute("aria-hidden");
  } else {
    console.error("Le formulaire n'a pas été trouvée.");
  }
}
