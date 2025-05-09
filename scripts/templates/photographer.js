/* exported photographerTemplate */
function photographerTemplate(data) {
  // On extrait directement les propriétés utiles de l'objet data
  const { id, name, portrait, city, country, tagline, price } = data;

  // Chemin vers l'image du photographe
  const picture = `assets/photographers/idphotos/${portrait}`;

  /**
   * Génère le DOM complet de la carte photographe
   * @returns {HTMLElement} L'élément <article> contenant la carte
   */
  function getUserCardDOM() {
    // Création de l'élément article qui contient toute la carte
    const article = document.createElement("article");

    // Description pour les lecteurs d'écran
    article.setAttribute(
      "aria-label",
      `Photographe : ${name}, ${city}, ${country}. "${tagline}". Tarif : ${price}€ par jour.`
    );
    

    // Lien cliquable vers la page du photographe
    const link = document.createElement("a");
    link.href = `./photographer.html?id=${id}`;
    link.setAttribute("aria-label", `Voir le profil de ${name}`);

    // Image du photographe dans le lien
    const img = document.createElement("img");
    img.src = picture;
    img.alt = `Portrait de ${name}`;
    link.appendChild(img);

    // Nom du photographe en titre
    const h2 = document.createElement("h2");
    h2.textContent = name;

    // Localisation (ville, pays)
    const locationEl = document.createElement("p");
    locationEl.textContent = `${city}, ${country}`;
    locationEl.classList.add("photographer-location");

    // Slogan ou citation du photographe
    const taglineEl = document.createElement("p");
    taglineEl.textContent = tagline;
    taglineEl.classList.add("photographer-tagline");

    // Prix journalier
    const priceEl = document.createElement("p");
    priceEl.textContent = `${price}€/jour`;
    priceEl.classList.add("photographer-price");
    priceEl.setAttribute("aria-label", `${price} euros par jour`);

    // Assemblage final de la carte
    article.appendChild(link);
    article.appendChild(h2);
    article.appendChild(locationEl);
    article.appendChild(taglineEl);
    article.appendChild(priceEl);

    return article;
  }

  // On retourne les données utiles et la fonction de création du DOM
  return { name, picture, city, country, tagline, price, getUserCardDOM };
}
