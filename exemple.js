// On récupère la div list
const list = document.querySelector(".list");

const insertCard = (equipment) => {
  const card = `<div class="card">
    <p> ${equipment.nom} </p>
    <p> ${equipment.arrondissement}</p>
  </div>`
  list.insertAdjacentHTML("beforeend", card);
  // list.innerHTML = card;
}

// Récupérer toute la donnée du fichier JSON
fetch("data.json")
  .then(response => response.json())
  .then((data) => {
    // itérer sur toutes les données
    data.forEach((equipment) => {
      insertCard(equipment)
    })
  })

// J'ai pas accès à la donnée

fetch("https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?limit=10")
  .then(response => response.json())
  .then((data) => {
    console.log(data.results)
    const agenda = data.results.filter((eventGroup) => {
      return eventGroup.group === "Agenda"
    })
    console.log(agenda)
    agenda.forEach((event) => {
      console.log(event.title)
      // On va pouvoir construire la card
    })
  })