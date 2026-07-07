import './style.css';
import { formaterDonnee } from './utils.js';

const URL_API = "https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_parcs-jardins-nantes/records?limit=10";

// On stocke la liste globale des équipements pour pouvoir la filtrer plus tard
let tousLesEquipements = [];

function afficherCompteur(total) {
  let compteur = document.getElementById('compteur-total');
  if (!compteur) {
    compteur = document.createElement('h3');
    compteur.id = 'compteur-total';
    const conteneur = document.getElementById('donnees-container');
    conteneur.before(compteur);
  }
  compteur.textContent = `📍 Nombre total de localisation : ${total}`;
}

function afficherEquipements(listeEquipements) {
  const conteneur = document.getElementById('donnees-container');
  conteneur.innerHTML = ""; 

  listeEquipements.forEach(equipement => {
    const carte = document.createElement('div');
    carte.className = 'bulle-parc';
    
    carte.innerHTML = `
      <strong>${equipement.nom}</strong>
      <small>📍 ${equipement.adresse}</small>
    `;

    conteneur.appendChild(carte);
  });
}

// 🌟 LA FONCTION MAGIQUE DE RECHERCHE
function configurerRecherche() {
  const barreRecherche = document.getElementById('search-input');
  
  if (!barreRecherche) return;

  // À chaque fois que l'utilisateur tape une lettre
  barreRecherche.addEventListener('input', (evenement) => {
    const texteRecherche = evenement.target.value.toLowerCase();

    // On filtre notre tableau global
    const equipementsFiltres = tousLesEquipements.filter(equipement => {
      return equipement.nom.toLowerCase().includes(texteRecherche);
    });

    // On met à jour l'affichage et le compteur avec les résultats filtrés
    afficherEquipements(equipementsFiltres);
    afficherCompteur(equipementsFiltres.length);
  });
}

async function chargerDonnees() {
  try {
    const reponse = await fetch(URL_API);
    if (!reponse.ok) throw new Error(`Erreur HTTP ! Statut : ${reponse.status}`);

    const donneesRecues = await reponse.json();
    const resultatsBruts = donneesRecues.results || [];
    
    // On remplit notre variable globale
    tousLesEquipements = resultatsBruts.map(item => formaterDonnee(item));
    
    // Premier affichage complet
    afficherCompteur(tousLesEquipements.length);
    afficherEquipements(tousLesEquipements);
    
    // On active la barre de recherche
    configurerRecherche();
    
  } catch (erreur) {
    console.error("Erreur de chargement :", erreur);
  }
}

chargerDonnees();