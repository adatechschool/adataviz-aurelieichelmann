//Recup d'une API à partir d'une URL
//"https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_parcs-jardins-nantes/records?limit=10"
/*fetch("https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_parcs-jardins-nantes/records?limit=20")
.then(response => response.json())
.then((data) => {
console.log(data)
data.results.forEach((parc) => {
  console.log(parc.nom_complet)

  })
})
const list = document.getElementById("container");
const insertCard = (parc) => {
    const card =
       `<div class="card">
            <p>${parc.nom_complet}</p>
        </div>`
    list.insertAdjacentHTML("beforeend", card);
};*/

// 1. On récupère nos 3 listes HTML distinctes
const listParcs = document.getElementById("container-parcs");
const listSquares = document.getElementById("container-squares");
const listJardins = document.getElementById("container-jardins");

// 2. Fonction pour injecter une carte dans un conteneur donné
const insertCard = (parc, conteneur) => {
    const card = `
        <div class="card-circle">
            <p>${parc.nom_complet || "Inconnu"}</p>
        </div>
    `;
    conteneur.insertAdjacentHTML("beforeend", card);
};

// 3. Récupération des données
fetch("https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/244400404_parcs-jardins-nantes/records?limit=10")
    .then((response) => response.json())
    .then((data) => {
        // On vide les conteneurs
        listParcs.innerHTML = "";
        listSquares.innerHTML = "";
        listJardins.innerHTML = "";

        // 4. Tri intelligent selon le nom complet du lieu
        data.results.forEach((parc) => {
            const nomLower = parc.nom_complet.toLowerCase();

            if (nomLower.includes("square")) {
                insertCard(parc, listSquares);
            } else if (nomLower.includes("jardin")) {
                insertCard(parc, listJardins);
            } else {
                // Par défaut, si c'est un parc ou autre chose, on le met dans Parcs
                insertCard(parc, listParcs);
            }
        });
    })
    .catch((error) => console.error("Erreur :", error));