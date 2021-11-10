import { Recette } from './classes.js';

let IngredientsJSON = []
let AppareilsJSON = []
let UstensilesJSON = []
let Recettes = []
let RecettesFiltrees = []
let htmlToutesRecettes = ''
let htmlTousIngredients = ''
let htmlTousAppareils = ''
let htmlTousUstensiles = ''

function afficheRecettes(estCeTrie) {
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

function retireEntreeTableau(arr, value) {
  var i = 0;
  while (i < arr.length) {
    if (arr[i] === value) {
      arr.splice(i, 1);
    } else {++i;}
  }
  return arr;
}

function genereListesCriteres(estCeTrie) {
  if (estCeTrie) { // doit-on générer les listes depuis le tableau des recettes filtrées ?
    for (const maRecette of RecettesFiltrees) {
      for(const list of maRecette.ingredients){IngredientsJSON.push(list.ingredient)}
      AppareilsJSON.push(maRecette.appliance) // Il n'y a qu'un seul appareil par recette
      for(const list of maRecette.ustensils){UstensilesJSON.push(list.ustensil)}
    }
  } else { // ... ou bien depuis celui des recettes non filtrées ?
    for (const maRecette of Recettes) {
      for(const list of maRecette.ingredients){IngredientsJSON.push(list.ingredient)}
      AppareilsJSON.push(maRecette.appliance) // Il n'y a qu'un seul appareil par recette
      for(const list of maRecette.ustensils){UstensilesJSON.push(list.ustensil)}
    }
  }
  // On élimline les ingrédients qui sont dans les filtres
  const mesFiltres = document.getElementsByClassName('critere')
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
  IngredientsJSON = Array.from(new Set(IngredientsJSON))
  AppareilsJSON = Array.from(new Set(AppareilsJSON))
  UstensilesJSON = Array.from(new Set(UstensilesJSON))
  // On trie les tableaux
  IngredientsJSON.sort(function (a, b) {return a.localeCompare(b)}) // Pour tenir compte des caractères accentués
  AppareilsJSON.sort(function (a, b) {return a.localeCompare(b)})
  UstensilesJSON.sort(function (a, b) {return a.localeCompare(b)})

  // On peut maintenant peupler les listes déroulantes
  const affichageIngredients = document.getElementById('listeIngredients')
  affichageIngredients.innerHTML = ''
  IngredientsJSON.forEach((element) => {
    affichageIngredients.innerHTML += `<li class="filtre filtreIngredient">${element}</li>`;
  })

  const affichageAppareils = document.getElementById('listeAppareils')
  affichageAppareils.innerHTML = ''
  AppareilsJSON.forEach((element) => {
    affichageAppareils.innerHTML += `<li class="filtre filtreAppareil">${element}</li>`;
  })

  const affichageUstensiles = document.getElementById('listeUstensiles')
  affichageUstensiles.innerHTML = ''
  UstensilesJSON.forEach((element) => {
    affichageUstensiles.innerHTML += `<li class="filtre filtreUstensile">${element}</li>`;
  })
}

const chargeRecettes = async () => {
  const affichageRecettes = document.getElementById('affichageRecettes')
  const fetchRecettes = await fetch('js/recettes.json')
    .then((reponse) => reponse.json())
    .then((donnees) => {
      for (const recette of donnees.recipes) {
        const maRecette = new Recette(recette.id, recette.name, recette.servings, recette.ingredients, recette.time, recette.description, recette.appliance, recette.ustensils);
        maRecette.genereCarteRecette()
        Recettes.push(maRecette)
      }
    });
    Recettes.sort(function (a, b) {return a.name.localeCompare(b.name)}) // On trie le tableau par ordre alphabétique du nom des recettes
    afficheRecettes(false)
    genereListesCriteres(false)
    htmlToutesRecettes = document.getElementById('affichageRecettes').innerHTML // On sauvegarde le html de toutes les recettes, et des menus dropdown
    htmlTousIngredients = document.getElementById('listeIngredients').innerHTML
    htmlTousAppareils = document.getElementById('listeAppareils').innerHTML
    htmlTousUstensiles = document.getElementById('listeUstensiles').innerHTML
}

// Gestion des liste déroulantes

// fermeture des listes en cas de clic hors d'elles ou sur une autre liste
document.addEventListener('click', (event) => {
  document.querySelectorAll('.listeDropdown').forEach(element => {
    if (!element.contains(event.target)) { element.removeAttribute("open") }
  })
})

function trieAvecFiltres(htmlRecettes) {
  // Prend en entrée du html contenant des recettes
  // Renvoie ce même html mais circonscrit aux seules recettes correspondant aux filtres ajoutés (ingrédients, appareils, ustensiles)
  IngredientsJSON.length = 0
  AppareilsJSON.length = 0
  UstensilesJSON.length = 0
  let recettesAvecFiltres = []
  let mesRecettes = new DOMParser().parseFromString(htmlRecettes, 'text/html').getElementsByClassName('divRecette')
  const mesFiltres = document.getElementsByClassName('critere')
  let htmlInjecte = ''
  RecettesFiltrees.length = 0
  for (const monFiltre of mesFiltres) {
    const monCritere = monFiltre.innerHTML.substring(0, monFiltre.innerHTML.indexOf('<button>')).replace(/(\r\n|\n|\r)/gm, '').replace(/^\s+/g, '').replace(/\s+$/g, '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    if (htmlInjecte !== '') { mesRecettes = new DOMParser().parseFromString(htmlInjecte, 'text/html').getElementsByClassName('divRecette')}
    htmlInjecte = ''
    for (const maRecette of mesRecettes) {
      if (maRecette.dejaTrouvee === true) {continue} // On a déjà ajouté cette recette
      // Nous allons retrouver la recette par son nom
      const nomRecette = maRecette.getElementsByTagName('h5')[0].innerHTML
      let recetteTrouvee = false
      switch (monFiltre.className.split(' ').pop()) {
        case 'critere-filtreIngredient' :
          for (const recetteConsideree of Recettes) {
            if (recetteConsideree.name === nomRecette){
              // Recette trouvée. Contient-elle cet ingrédient ?
              for (const monIngredient of recetteConsideree.ingredients) {
                if (monIngredient.ingredient.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(monCritere) !== -1) {
                  RecettesFiltrees.push(recetteConsideree)
                  htmlInjecte += recetteConsideree.html
                  recetteTrouvee = true
                  for(const list of recetteConsideree.ingredients){IngredientsJSON.push(list.ingredient)}
                  AppareilsJSON.push(recetteConsideree.appliance)
                  for(const list of recetteConsideree.ustensils){UstensilesJSON.push(list.ustensil)}
                }
                if (recetteTrouvee) {break}
              }
            }
            if (recetteTrouvee) {break} 
          }
        break
        case 'critere-filtreAppareil' :
          for (const recetteConsideree of Recettes) {
            if (recetteConsideree.name === nomRecette){
              if (recetteConsideree.appliance.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(monCritere) !== -1) {
                RecettesFiltrees.push(recetteConsideree)
                htmlInjecte += recetteConsideree.html
                recetteTrouvee = true
                for(const list of recetteConsideree.ingredients){IngredientsJSON.push(list.ingredient)}
                AppareilsJSON.push(recetteConsideree.appliance)
                for(const list of recetteConsideree.ustensils){UstensilesJSON.push(list.ustensil)}
              }
            } 
            if (recetteTrouvee) {break}
          }
        break
        case 'critere-filtreUstensile' :
          for (const recetteConsideree of Recettes) {
            if (recetteConsideree.name === nomRecette){
              for (const monUstensile of recetteConsideree.ustensils) {
                if (monUstensile.ustensil.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(monCritere) !== -1) {
                  RecettesFiltrees.push(recetteConsideree)
                  htmlInjecte += recetteConsideree.html
                  recetteTrouvee = true
                  for(const list of recetteConsideree.ingredients){IngredientsJSON.push(list.ingredient)}
                  AppareilsJSON.push(recetteConsideree.appliance)
                  for(const list of recetteConsideree.ustensils){UstensilesJSON.push(list.ustensil)}
                }
                if (recetteTrouvee) {break}
              }
            }
            if (recetteTrouvee) {break}
          }
      }
    }
  }
  return htmlInjecte
}

function ajouteFiltre(event) {
  document.getElementById('criteres').innerHTML += `
      <span class="critere critere-${event.target.className.split(' ').pop()}">
        ${event.target.innerHTML}<button>
          <svg class="retireCritere" alt="supprimer ce filtre" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.59 6L10 8.59L7.41 6L6 7.41L8.59 10L6 12.59L7.41 14L10 11.41L12.59 14L14 12.59L11.41 10L14 7.41L12.59 6ZM10 0C4.47 0 0 4.47 0 10C0 15.53 4.47 20 10 20C15.53 20 20 15.53 20 10C20 4.47 15.53 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z" fill="white"/>
          </svg>
          </button>
      </span>
  `
  let htmlInjecte = trieAvecFiltres(document.getElementById('affichageRecettes').innerHTML) // Maintenant, filtrons les recettes à partir de ce qui a été ajouté
  genereListesCriteres(true) // Générons les critères mis à jour
  if (htmlInjecte !== '') { // Et affichons le html généré des recettes filtrées
    document.getElementById('affichageRecettes').innerHTML = htmlInjecte
  } else {
    document.getElementById('affichageRecettes').innerHTML = `
      <div class="alert alert-primary card" role="alert">
        Aucune recette ne correspond à ces critères !
      </div>
    `
  }
}

function retireCritere(event) {
  event.target.parentNode.parentNode.parentNode.removeChild(event.target.parentNode.parentNode);
  trieAvecFiltres(htmlToutesRecettes)
}

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('retireCritere')) { retireCritere(event) }
  if (event.target.classList.contains('filtre')) {ajouteFiltre(event)}
})

chargeRecettes();

// Recherche générale
const maRecherche = document.getElementById('inputRecherche')

function filtrerRecettes() {
  RecettesFiltrees.length = 0 // Nous utilisons un tableau, plutôt que de générer immédiatement le html, car nous devrons aussi mettre à jour les ingrédients / appareils / ustensiles
  IngredientsJSON.length = 0
  AppareilsJSON.length = 0
  UstensilesJSON.length = 0
  for (const maRecette of Recettes) {
    let recetteTrouvee = false
    if (
      (maRecette.description.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(maRecherche.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) !== -1) // dans la description ?
      || (maRecette.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(maRecherche.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) !== -1) // ou le nom de la recette ?
      || (maRecette.appliance.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(maRecherche.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) !== -1) // ou ses appareils ?
      ) {
        RecettesFiltrees.push(maRecette)
        recetteTrouvee = true
    } else { // recherche dans les ingredients si pas encore de succès pour cette recette
      for (const monIngredient of maRecette.ingredients) {
        if (monIngredient.ingredient.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(maRecherche.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) !== -1) {
          RecettesFiltrees.push(maRecette)
          recetteTrouvee = true
        }
      }
      if (recetteTrouvee === false) { // encore rien trouvé : on tente dans les ustensiles
        for (const monUstensile of maRecette.ustensils) {
          if (monUstensile.ustensil.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(maRecherche.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) !== -1) {
            RecettesFiltrees.push(maRecette)
            recetteTrouvee = true
          }
        }
      }
    }
    if (recetteTrouvee) { // On met à jour les ingrédients, appareils et ustensiles
      for(const list of maRecette.ingredients){IngredientsJSON.push(list.ingredient)}
      AppareilsJSON.push(maRecette.appliance)
      for(const list of maRecette.ustensils){UstensilesJSON.push(list.ustensil)}
      genereListesCriteres(true)
    }
  }
  // On affiche les recettes
  RecettesFiltrees.sort(function (a, b) {return a.name.localeCompare(b.name)}) // On trie le tableau par ordre alphabétique du nom des recettes
  afficheRecettes(true)
}
function restaureRecettes() {
  const conteneurCriteres = document.getElementById('criteres')
  if (conteneurCriteres.innerHTML === '') { // Il n'y a pas de critères actifs
    document.getElementById('affichageRecettes').innerHTML = htmlToutesRecettes
  } else { // Il y a des critères actifs : 
    trieAvecFiltres(htmlToutesRecettes)
  }
}

maRecherche.addEventListener('keyup', (event) => {
  if (maRecherche.value.length > 2) {filtrerRecettes()}
  else {
    restaureRecettes()
   // genereListesCriteres(false)
  }
})

// Recherche menus DropDown
const maRechercheIngredients = document.getElementById('rechercheIngredients')
const maRechercheAppareils = document.getElementById('rechercheAppareils')
const maRechercheUstensiles = document.getElementById('rechercheUstensiles')

function filtrerDropdown(critereEntre, affichageMenu) {
  const monCritereEntre = critereEntre.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  const monAffichageMenu = document.getElementById(affichageMenu)
  const mesLi = monAffichageMenu.getElementsByTagName('li')
  let htmlInsere = ''
  for (const monLi of mesLi) {
    if (monLi.textContent.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(monCritereEntre) !== -1) { htmlInsere += monLi.outerHTML }
  }
  monAffichageMenu.innerHTML = htmlInsere
}

maRechercheIngredients.addEventListener('keyup', (event) => {
  if (maRechercheIngredients.value.length > 2) {filtrerDropdown(maRechercheIngredients, 'listeIngredients')}
  else { document.getElementById('listeIngredients').innerHTML = htmlTousIngredients }
})
maRechercheAppareils.addEventListener('keyup', (event) => {
  if (maRechercheAppareils.value.length > 2) {filtrerDropdown(maRechercheAppareils, 'listeAppareils')}
  else { document.getElementById('listeAppareils').innerHTML = htmlTousAppareils }
})
maRechercheUstensiles.addEventListener('keyup', (event) => {
  if (maRechercheUstensiles.value.length > 2) {filtrerDropdown(maRechercheUstensiles, 'listeUstensiles')}
  else { document.getElementById('listeUstensiles').innerHTML = htmlTousUstensiles }
})