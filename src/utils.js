/**
 * Filtre un tableau de lieux selon un mot-clé (recherche dans la barre)
 * @param {Array} records - La liste complète des parcs
 * @param {string} texteRecherche - Ce que l'utilisateur a tapé
 * @returns {Array} La liste filtrée
 */
export const filtrerLesLieux = (records, texteRecherche) => {
    if (!texteRecherche) return records; // Si la barre est vide, on renvoie tout
    
    const rechercheLower = texteRecherche.toLowerCase();

    return records.filter((parc) => {
        if (!parc.nom_complet) return false;
        return parc.nom_complet.toLowerCase().includes(rechercheLower);
    });
};

/**
 * Trie une liste de parcs et jardins en limitant le nombre d'éléments à 5 par catégorie
 * @param {Array} records - La liste brute des résultats de l'API (ou la liste filtrée par la recherche)
 * @returns {Object} Un objet contenant trois tableaux équilibrés : parcs, squares, et jardins
 */
export const trierLesLieux = (records) => {
    const listesTriees = {
        parcs: [],
        squares: [],
        jardins: []
    };

    if (!Array.isArray(records)) return listesTriees;

    // Le nombre maximum que tu veux par colonne
    const LIMITE_PAR_CATEGORIE = 5; 

    records.forEach((parc) => {
        if (!parc.nom_complet) return;

        const nomLower = parc.nom_complet.toLowerCase();

        if (nomLower.includes("square")) {
            // On l'ajoute UNIQUEMENT si la colonne n'est pas encore pleine
            if (listesTriees.squares.length < LIMITE_PAR_CATEGORIE) {
                listesTriees.squares.push(parc);
            }
        } else if (nomLower.includes("jardin")) {
            if (listesTriees.jardins.length < LIMITE_PAR_CATEGORIE) {
                listesTriees.jardins.push(parc);
            }
        } else {
            if (listesTriees.parcs.length < LIMITE_PAR_CATEGORIE) {
                listesTriees.parcs.push(parc);
            }
        }
    });

    return listesTriees;
};