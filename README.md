FishEye – Projet P6 - Parcours Front-end

Ce projet consiste à construire un prototype fonctionnel du site FishEye, mettant en avant des photographes ainsi que leurs réalisations (photos/vidéos), à partir de données JSON fournies.  
Le site a été développé en HTML, CSS et JavaScript vanilla.

---

1. Prise en main du projet

Familiarisation avec les fichiers du projet, les maquettes et la structure existante afin de bien comprendre les attentes, les livrables et les éléments à développer.

---

2. Intégration des données JSON

Les données des photographes et des médias sont chargées dynamiquement depuis le fichier `photographers.json` grâce à la méthode native `fetch` :


async function getPhotographersData() {
  const response = await fetch("data/photographers.json");
  return response.json();
}

---

3. Intégration de la page d’accueil

Utilisation du template photographerTemplate pour générer dynamiquement chaque carte photographe.
L’accessibilité a été prise en compte (aria-label, tabindex, etc.).

---

4. Navigation dynamique vers les pages photographe

L’ID du photographe est récupéré dynamiquement depuis l’URL à l’aide de URLSearchParams.

function getPhotographerIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get("id"), 10);
}

Cela permet de charger les données spécifiques à chaque photographe sur sa page dédiée.

---

5. Contenu dynamique de la page photographe

Le profil du photographe est affiché à l’aide du photographerTemplate.

Une factory nommée mediaFactory a été développée pour afficher dynamiquement les médias (photos ou vidéos) selon leur type :


function mediaFactory(media, photographer) {
    ...
  function getMediaCardDOM() {
    ...
    if (media.image) {
      // Générer une image
    } 
    ...
    else if (media.video) {
      // Générer une vidéo
    }
    ...
    return galleryItem;
  }
  ...
  return { getMediaCardDOM };
}

---

6. Modale de contact

Une modale accessible est ouverte au clic sur “Contactez-moi”, avec :

    .Gestion du focus et des touches clavier (Esc, Tab)

    .Utilisation de aria-label, role et navigation clavier

    .console.log() des données du formulaire à la soumission

---

7. Lightbox

Mise en place d’une lightbox accessible pour :

    .Afficher une image ou vidéo en plein écran

    .Naviguer entre les médias au clavier

    .Fermer la modale via clic ou touche Esc

Accessibilité : role="dialog", aria-modal, navigation clavier complète.

---

8. Gestion des likes

Chaque média peut être liké une seule fois (clavier ou clic).
Le total des likes s’actualise automatiquement :


function calculTotalLikes() {
    ...
let total = 0;
likesEls.forEach(el => {
  total += parseInt(el.textContent, 10);
});

---

9. Tri des médias

Les médias peuvent être triés par :

Popularité 
Date
Titre

const sorted = [...photographerMedia].sort(...

---

10. Validation finale & Linter

Code validé avec ESLint.

Aucune erreur console.

Contrôle d’accessibilité effectué (checklist + AChecker).

Navigation 100 % possible sans souris.

Compatibilité testée avec des lecteurs d’écran comme VoiceOver, NVDA ou JAWS




