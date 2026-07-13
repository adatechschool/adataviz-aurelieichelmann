// importe nos deux fonctions de logique métier depuis utils.js
import { trierLesLieux, filtrerLesLieux } from "./utils.js";

// DOM
const listParcs = document.getElementById("container-parcs");
const listSquares = document.getElementById("container-squares");
const listJardins = document.getElementById("container-jardins");
const searchInput = document.getElementById("search-input"); 

// Variable globale pour stocker les parcs reçus de l'API afin que la recherche puisse fouiller dedans
let tousLesParcs = [];

/**
 * Fonction de création et gestion d'une carte (galets)
 */
const insertCard = (parc, conteneur) => {
    if (!conteneur) return;

    const cardElement = document.createElement("div");
    cardElement.className = "card-circle";
    
    cardElement.innerHTML = `
        <div class="card-content">
            <p class="parc-name">${parc.nom_complet || "Inconnu"}</p>
            <p class="parc-address" style="display: none;">📍 ${parc.adresse_complete || parc.adresse || "Adresse non disponible"}</p>
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

/**
 * Fonction intermédiaire qui s'occupe de vider et de ré-afficher les cartes triées
 */
const rafraichirAffichage = (listeDeParcs) => {
    // On vide les colonnes avant d'injecter (si elles existent)
    if (listParcs) listParcs.innerHTML = "";
    if (listSquares) listSquares.innerHTML = "";
    if (listJardins) listJardins.innerHTML = "";

    // utilise la fonction de tri importée de utils.js
    const resultatsTries = trierLesLieux(listeDeParcs);

    // affiche les éléments triés dans leurs colonnes respectives
    if (resultatsTries.parcs && listParcs) resultatsTries.parcs.forEach(parc => insertCard(parc, listParcs));
    if (resultatsTries.squares && listSquares) resultatsTries.squares.forEach(square => insertCard(square, listSquares));
    if (resultatsTries.jardins && listJardins) resultatsTries.jardins.forEach(jardin => insertCard(jardin, listJardins));
};

/**
 * Récupérer les données avec async/await
 */
const fetchData = async () => {
    try {
        const response = await fetch("https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_parcs-jardins-nantes/records?limit=50");
        
        if (!response.ok) throw new Error("Erreur réseau lors du fetch");
        
        const data = await response.json(); 
        
        // filtre pour ne garder que ceux qui ont des coordonnées réelles
        tousLesParcs = data.results.filter(parc => {
            return parc.location && parc.location.lat && parc.location.lon;
        });

        console.log("Données chargées et filtrées :", tousLesParcs);

        // Affichage initial avec uniquement les parcs valides
        rafraichirAffichage(tousLesParcs);

    } catch (error) {
        console.error("Une erreur est survenue lors de la récupération :", error.message);
    }
};

/**
 * Écouteur sur la barre de recherche
 */
if (searchInput) {
    searchInput.addEventListener("input", (event) => {
        const texteSaisi = event.target.value;
        
        //récupère le grand conteneur des colonnes pour lui ajouter un "mode recherche"
        const columnsContainer = document.querySelector(".categories-columns");

        if (columnsContainer) {
            if (texteSaisi.trim() !== "") {
                columnsContainer.classList.add("is-searching");
            } else {
                columnsContainer.classList.remove("is-searching");
            }
        }
        
        // Filtrage des lieux
        const parcsFiltres = filtrerLesLieux(tousLesParcs, texteSaisi);
        rafraichirAffichage(parcsFiltres);
    });
}

// Lancement au chargement de la page
fetchData();
