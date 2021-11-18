/*
    Gestion des critères

    Les critères sont les choix faits à partir des menus dropDown et qui sont
    ajoutés à cette occasion, ou détruits lorsque leur croix de fermeture est cliquée.

    Les recettes sont mises à jour en temps réel à ces occasions (tri puis affichage)
    puis le contenu des menus dropDown est lui-même mis à jour en fonction des
    recettes affichées.

    genereListesCriteres() Remplit les tableaux Ingredients, Appareils et Ustensiles
    en fonction des recettes affichées et des crtères sélectionnés (ôte ces derniers)
*/

import {metAJourRecettes} from './tri.js'

/**
 * Ajoute le critère choisit par un clic sur le DropDown puis met à jour les recettes
 * affichées et les contenus des dropdowns (via appel à metAJourRecettes())
 * @param { Object } event
 */
function ajouteCritere(event) {
    document.getElementById('criteres').innerHTML += `
        <span class="critere critere-${event.target.className.split(' ').pop()}">
          ${event.target.innerHTML}<button>
            <svg class="retireCritere" alt="supprimer ce filtre" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.59 6L10 8.59L7.41 6L6 7.41L8.59 10L6 12.59L7.41 14L10 11.41L12.59 14L14 12.59L11.41 10L14 7.41L12.59 6ZM10 0C4.47 0 0 4.47 0 10C0 15.53 4.47 20 10 20C15.53 20 20 15.53 20 10C20 4.47 15.53 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z" fill="white"/>
            </svg>
            </button>
        </span>
    `
    metAJourRecettes()
  }
  
/**
 * Retire le critère supprimé via un clic sur la croix de fermetures puis met à jour
 * les recettes affichées et les contenus des dropdowns (via appel à metAJourRecettes())
 * @param { Object } event
 */
function retireCritere(event) {
    event.target.parentNode.parentNode.remove() // On supprime le critère (le span parent du bouton parent du svg)
    metAJourRecettes() // Maintenant, il faut mettre à jour les recettes affichées
}

/**
 * Retire l'entrée (valeur) du (tableau) et renvoi celui-ci
 * @param {Array} tableau 
 * @param {*} valeur 
 * @returns  {Array}
 */
function retireEntreeTableau(tableau, valeur) {
  var i = 0;
  while (i < tableau.length) {
    if (tableau[i] === valeur) {tableau.splice(i, 1)}
    else {++i;}
  }
  return tableau;
}

/**
 * Met à jour les menus DropDown en fonction des recettes affichées
 */
export function genereListesCriteres() {
  IngredientsJSON.length = 0
  AppareilsJSON.length = 0
  UstensilesJSON.length = 0
  // On récupère les recettes affichées
  let mesRecettes = new DOMParser().parseFromString(document.getElementById('affichageRecettes').innerHTML, 'text/html').querySelectorAll('.divRecette')
  for (const maRecette of mesRecettes) {
    // Nous allons retrouver la recette par son nom
    let nomRecette = maRecette.getElementsByTagName('h5')[0].innerHTML
    for (const recetteConsideree of Recettes) {
      if (recetteConsideree.name === nomRecette) {
        for(const list of recetteConsideree.ingredients){IngredientsJSON.push(list.ingredient)}
        AppareilsJSON.push(recetteConsideree.appliance) // Il n'y a qu'un seul appareil par recette
        for(const list of recetteConsideree.ustensils){UstensilesJSON.push(list.ustensil)}
        break
      }
    }
  }
  // On élimline les ingrédients qui sont dans les filtres
  const mesFiltres = document.querySelectorAll('.critere')
  let index = null
  for (const monFiltre of mesFiltres) {
    const monCritere = monFiltre.innerHTML.substring(0, monFiltre.innerHTML.indexOf('<button>')).replace(/(\r\n|\n|\r)/gm, '').replace(/^\s+/g, '').replace(/\s+$/g, '')
    switch (monFiltre.className.split(' ').pop()) {
      case 'critere-filtreIngredient' :
        retireEntreeTableau(IngredientsJSON, monCritere)
      break
      case 'critere-filtreAppareil' :
        retireEntreeTableau(AppareilsJSON, monCritere)
      break
      case 'critere-filtreUstensile' :
        retireEntreeTableau(UstensilesJSON, monCritere)
    }
  }
  // On élimine les doubles
  IngredientsJSON = [...new Set(IngredientsJSON)]
  AppareilsJSON = [...new Set(AppareilsJSON)]
  UstensilesJSON = [...new Set(UstensilesJSON)]
  // On trie les tableaux
  IngredientsJSON.sort(function (a, b) {return a.localeCompare(b)}) // Pour tenir compte des caractères accentués
  AppareilsJSON.sort(function (a, b) {return a.localeCompare(b)})
  UstensilesJSON.sort(function (a, b) {return a.localeCompare(b)})

  // On peut maintenant peupler les listes déroulantes
  const affichageIngredients = document.getElementById('listeIngredients')
  affichageIngredients.innerHTML = ''
  if (IngredientsJSON.length > 0) {
    affichageIngredients.style.display = 'grid'
    IngredientsJSON.forEach((element) => {affichageIngredients.innerHTML += `<li class="filtre filtreIngredient">${element}</li>`})
  } else {
    affichageIngredients.style.display = 'block'
    affichageIngredients.innerHTML = 'Il n\'y a pas d\'ingrédients disponibles'
  }

  const affichageAppareils = document.getElementById('listeAppareils')
  affichageAppareils.innerHTML = ''
  if (AppareilsJSON.length > 0) {
    affichageAppareils.style.display = 'grid'
    AppareilsJSON.forEach((element) => {affichageAppareils.innerHTML += `<li class="filtre filtreAppareil">${element}</li>`})
  } else {
    affichageAppareils.style.display = 'block'
    affichageAppareils.innerHTML = 'Il n\'y a pas d\'appareils disponibles'
  }
  

  const affichageUstensiles = document.getElementById('listeUstensiles')
  affichageUstensiles.innerHTML = ''
  if (UstensilesJSON.length > 0) {
    affichageUstensiles.style.display = 'grid'
    UstensilesJSON.forEach((element) => {affichageUstensiles.innerHTML += `<li class="filtre filtreUstensile">${element}</li>`})
  } else {
    affichageUstensiles.style.display = 'block'
    affichageUstensiles.innerHTML = 'Il n\'y a pas d\'ustensiles disponibles'
  }
}

// Gestion des liste déroulantes

// fermeture des listes en cas de clic hors d'elles ou sur une autre liste
document.addEventListener('click', (event) => {
    document.querySelectorAll('.listeDropdown').forEach(element => {
      if (!element.contains(event.target)) { element.removeAttribute("open") }
    })
  })
  
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('retireCritere')) { retireCritere(event) }
    if (event.target.classList.contains('filtre')) {ajouteCritere(event)}
  })