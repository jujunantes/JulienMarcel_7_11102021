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

function genereListesCriteres(estCeTrie) {
  if (estCeTrie) { // doit-on générer les listes depuis le tableau des recettes filtrées ?
    for (const maRecette of RecettesFiltrees) {
      for(const list of maRecette.ingredients){IngredientsJSON.push(list.ingredient)}
      AppareilsJSON.push(maRecette.appliance) // Il n'y a qu'un seul appareil par recette
      for(const list of maRecette.ustensils){UstensilesJSON.push(list.ustensil)}
    }
  } else { // ... ou bien depuis celui des recttes non filtrées ?
    for (const maRecette of Recettes) {
      for(const list of maRecette.ingredients){IngredientsJSON.push(list.ingredient)}
      AppareilsJSON.push(maRecette.appliance) // Il n'y a qu'un seul appareil par recette
      for(const list of maRecette.ustensils){UstensilesJSON.push(list.ustensil)}
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

function ajouteFiltre(event) {
  document.getElementById('criteres').innerHTML += `
      <span class="critere critere-${event.target.className.split(' ').pop()}">
        ${event.target.innerHTML}
        <button>
          <svg class="retireCritere" alt="supprimer ce filtre" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.59 6L10 8.59L7.41 6L6 7.41L8.59 10L6 12.59L7.41 14L10 11.41L12.59 14L14 12.59L11.41 10L14 7.41L12.59 6ZM10 0C4.47 0 0 4.47 0 10C0 15.53 4.47 20 10 20C15.53 20 20 15.53 20 10C20 4.47 15.53 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z" fill="white"/>
          </svg>
          </button>
      </span>
  `
  // Maintenant, filtrons les recettes à partir de ce qui a été ajouté
  const critereAjoute = event.target.innerHTML.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  let htmlInjecte = ''
  const mesRecettes = document.getElementsByClassName('divRecette')
  IngredientsJSON.length = 0
  AppareilsJSON.length = 0
  UstensilesJSON.length = 0
  for (const maRecette of mesRecettes) {
    // Nous allons retrouver la recette par son nom
    const nomRecette = maRecette.getElementsByTagName('h5')[0].innerHTML
    switch (event.target.className.split(' ').pop()) {
    case 'filtreIngredient' :
      for (const recetteConsideree of Recettes) {
        if (recetteConsideree.name === nomRecette){
          // Recette trouvée. Contient-elle cet ingrédient ?
          for (const monIngredient of recetteConsideree.ingredients) {
            if (monIngredient.ingredient.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(critereAjoute) !== -1) {
              htmlInjecte += recetteConsideree.html
              for(const list of recetteConsideree.ingredients){IngredientsJSON.push(list.ingredient)}
              AppareilsJSON.push(recetteConsideree.appliance)
              for(const list of recetteConsideree.ustensils){UstensilesJSON.push(list.ustensil)}
            }
          }
        } 
      }
      break
    case 'filtreAppareil' :
      for (const recetteConsideree of Recettes) {
        if (recetteConsideree.name === nomRecette){
          // Recette trouvée. Contient-elle cet Appareil ?
          if (recetteConsideree.appliance.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(critereAjoute) !== -1) {
            htmlInjecte += recetteConsideree.html
            for(const list of recetteConsideree.ingredients){IngredientsJSON.push(list.ingredient)}
            AppareilsJSON.push(recetteConsideree.appliance)
            for(const list of recetteConsideree.ustensils){UstensilesJSON.push(list.ustensil)}
          }
        } 
      }
      break
    case 'filtreUstensile' :
      for (const recetteConsideree of Recettes) {
        if (recetteConsideree.name === nomRecette){
          // Recette trouvée. Contient-elle cet ingrédient ?
          for (const monUstensile of recetteConsideree.ustensils) {
            if (monUstensile.ustensil.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(critereAjoute) !== -1) {
              htmlInjecte += recetteConsideree.html
              for(const list of recetteConsideree.ingredients){IngredientsJSON.push(list.ingredient)}
              AppareilsJSON.push(recetteConsideree.appliance)
              for(const list of recetteConsideree.ustensils){UstensilesJSON.push(list.ustensil)}
            }
          }
        } 
      }  
    }
  }
  genereListesCriteres(true)
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

function retireCritere(event) {
  event.target.parentNode.parentNode.parentNode.removeChild(event.target.parentNode.parentNode);
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
    if (recetteTrouvee) { // On peut mettre à jour les ingrédients, appareils et ustensiles
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

maRecherche.addEventListener('keyup', (event) => {
  if (maRecherche.value.length > 2) {filtrerRecettes()}
  else {
    document.getElementById('affichageRecettes').innerHTML = htmlToutesRecettes
    genereListesCriteres(false)
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
    console.log(monLi)
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