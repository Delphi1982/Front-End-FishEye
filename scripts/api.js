/* exported getPhotographers */ // pour dire qu'elle est utilisée ailleurs
async function getPhotographers() {
  // Ceci est un exemple de données pour avoir un affichage de photographes de test dès le démarrage du projet,
  // mais il sera à remplacer avec une requête sur le fichier JSON en utilisant "fetch".
  let photographers = [
    {
      name: "Mimi Keel",
      id: 243,
      city: "London",
      country: "UK",
      tagline: "Voir le beau dans le quotidien",
      price: 400,
      portrait: "MimiKeel.jpg",
    },
    {
      name: "Ellie-Rose Wilkens",
      id: 930,
      city: "Paris",
      country: "France",
      tagline: "Capturer des compositions complexes",
      price: 250,
      portrait: "EllieRoseWilkens.jpg",
    },
    {
      name: "Tracy Galindo",
      id: 82,
      city: "Montreal",
      country: "Canada",
      tagline: "Photographe freelance",
      price: 500,
      portrait: "TracyGalindo.jpg",
    },
    {
      name: "Nabeel Bradford",
      id: 527,
      city: "Mexico City",
      country: "Mexico",
      tagline: "Toujours aller de l'avant",
      price: 350,
      portrait: "NabeelBradford.jpg",
    },
    {
      name: "Rhode Dubois",
      id: 925,
      city: "Barcelona",
      country: "Spain",
      tagline: "Je crée des souvenirs",
      price: 275,
      portrait: "RhodeDubois.jpg",
    },
    {
      name: "Marcel Nikolic",
      id: 195,
      city: "Berlin",
      country: "Germany",
      tagline: "Toujours à la recherche de LA photo",
      price: 300,
      portrait: "MarcelNikolic.jpg",
    },
  ];
  // et bien retourner le tableau photographers seulement une fois récupéré
  return {
    photographers: [...photographers],
  };
}


