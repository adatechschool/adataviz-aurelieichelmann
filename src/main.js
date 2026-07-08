// 1. On importe nos deux fonctions de logique métier depuis utils.js
import { trierLesLieux, filtrerLesLieux } from "./utils.js";

// On récupère nos éléments HTML
const listParcs = document.getElementById("container-parcs");
const listSquares = document.getElementById("container-squares");
const listJardins = document.getElementById("container-jardins");
const searchInput = document.getElementById("search-input"); // Ta barre de recherche

// Variable globale pour stocker les parcs reçus de l'API afin que la recherche puisse fouiller dedans
let tousLesParcs = [];

// Fonction pour injecter une carte dans un conteneur donné (avec gestion du clic pour l'adresse)
const insertCard = (parc, conteneur) => {
    const cardElement = document.createElement("div");
    cardElement.className = "card-circle";
    
    cardElement.innerHTML = `
        <div class="card-content">
            <p class="parc-name">${parc.nom_complet || "Inconnu"}</p>
            <p class="parc-address" style="display: none;">
                📍 ${parc.adresse_complete || parc.adresse || parc.adresse_lieu || "Adresse non disponible"}
            </p>
        </div>
    `;

    cardElement.addEventListener("click", () => {
        const nameText = cardElement.querySelector(".parc-name");
        const addressText = cardElement.querySelector(".parc-address");

        if (addressText.style.display === "none") {
            nameText.style.display = "none";
            addressText.style.display = "block";
            cardElement.classList.add("active");
        } else {
            nameText.style.display = "block";
            addressText.style.display = "none";
            cardElement.classList.remove("active");
        }
    });

    conteneur.appendChild(cardElement);
};

// Fonction intermédiaire qui s'occupe de vider et de ré-afficher les cartes triées
const rafraichirAffichage = (listeDeParcs) => {
    // On vide les colonnes avant d'injecter
    listParcs.innerHTML = "";
    listSquares.innerHTML = "";
    listJardins.innerHTML = "";

    // On utilise la fonction de tri importée de utils.js
    const resultatsTries = trierLesLieux(listeDeParcs);

    // On affiche les éléments triés dans leurs colonnes respectives
    resultatsTries.parcs.forEach(parc => insertCard(parc, listParcs));
    resultatsTries.squares.forEach(square => insertCard(square, listSquares));
    resultatsTries.jardins.forEach(jardin => insertCard(jardin, listJardins));
};

// 2. Ton code d'origine validé pour récupérer les données avec async/await
const fetchData = async () => {
    try {
        const response = await fetch("https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_parcs-jardins-nantes/records?limit=50");
        const data = await response.json(); 
        console.log("Données chargées avec async/await :", data);

        // NOUVEAUTÉ : On stocke les parcs dans notre variable globale pour que la recherche y ait accès
        tousLesParcs = data.results;

        // On appelle l'affichage initial avec tous les parcs
        rafraichirAffichage(tousLesParcs);

    } catch (error) {
        console.error(error.message, "Une erreur est survenue lors de la récupération :");
    }
};

// 3. Écouteur sur la barre de recherche
searchInput.addEventListener("input", (event) => {
    const texteSaisi = event.target.value;
    
    // On filtre notre tableau global grâce à la fonction de utils.js
    const parcsFiltres = filtrerLesLieux(tousLesParcs, texteSaisi);
    
    // On met à jour l'écran avec les parcs restants
    rafraichirAffichage(parcsFiltres);
});

// Lancement au chargement de la page
fetchData();