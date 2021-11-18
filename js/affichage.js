/*
    affichage.js

    Construit le html des cartes à afficher et l'affiche.
    S'il n'y a pas de cartes, affiche une alerte.
*/

/**
 * Si (estCeTrie) alors na'affiche que les recettes filtrées, sinon affiche toutes les cartes
 * @param { Boolean } estCeTrie
 */
export function afficheRecettes(estCeTrie) {
    let htmlInjecte = ''
    if (estCeTrie) {for (const maRecetteFiltree of RecettesFiltrees) {htmlInjecte += maRecetteFiltree.html}}
    else {for (const maRecette of Recettes) {htmlInjecte += maRecette.html}}
    if (htmlInjecte !== '') {
      document.getElementById('affichageRecettes').innerHTML = htmlInjecte
    } else {
      document.getElementById('affichageRecettes').innerHTML = `
        <div class="alert alert-primary" role="alert">
          Aucune recette ne correspond à ces critères !
        </div>
      `
    }
  }
  