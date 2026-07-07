/**
 * Reçoit un objet brut de l'API, retourne un objet propre
 */
export const formaterDonnee = (item) => {
  // On récupère la zone qui contient les données de l'équipement
  const data = item.properties || item.fields || item;

  return {
    nom: data.nom_complet || "Nom inconnu",
    adresse: data.adresse || "Nantes"
  };
};