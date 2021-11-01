import { Recette } from './classes.js';

const fetchRecettes = [];
const mesRecettes = [];

let IngredientsJSON = [];
let AppareilsJSON = [];
let UstensilesJSON = [];

const chargeRecettes = async () => {
  const affichageRecettes = document.getElementById('affichageRecettes')
  const fetchRecettes = await fetch('js/recettes.json')
    .then((reponse) => reponse.json())
    .then((donnees) => {
      for (const recette of donnees.recipes) {
        const maRecette = new Recette(recette.id, recette.name, recette.servings, recette.ingredients, recette.time, recette.description, recette.appliance, recette.ustensils);
        // On en profite pour récupérer les ingrédients, appareils et ustensiles
        for(const list of maRecette.ingredients){IngredientsJSON.push(list.ingredient)}
        AppareilsJSON.push(maRecette.appliance) // Il n'y a qu'un seul appareil par recette
        for(const element of maRecette.ustensils){UstensilesJSON.push(element)}
        // Et on élimine les doubles
        IngredientsJSON = Array.from(new Set(IngredientsJSON))
        AppareilsJSON = Array.from(new Set(AppareilsJSON))
        UstensilesJSON = Array.from(new Set(UstensilesJSON))
        // On trie les tableaux
        IngredientsJSON.sort(function (a, b) {return a.localeCompare(b)}) // Pour tenir compte des caractères accentués
        AppareilsJSON.sort(function (a, b) {return a.localeCompare(b)})
        UstensilesJSON.sort(function (a, b) {return a.localeCompare(b)})
        // On affiche la recette
        affichageRecettes.innerHTML += maRecette.genereCarteRecette()
      }
    });
    /*console.log(IngredientsJSON)
    console.log(AppareilsJSON)
    console.log(UstensilesJSON)*/
    // On peut maintenant peupler les listes déroulantes
    const affichageIngredients = document.getElementById('listeIngredients')
    IngredientsJSON.forEach((element) => {
      affichageIngredients.innerHTML += `<li class="filtre filtreIngredient">${element}</li>`;
    })

    const affichageAppareils = document.getElementById('listeAppareils')
    AppareilsJSON.forEach((element) => {
      affichageAppareils.innerHTML += `<li class="filtre filtreAppareil">${element}</li>`;
    })

    const affichageUstensiles = document.getElementById('listeUstensiles')
    UstensilesJSON.forEach((element) => {
      affichageUstensiles.innerHTML += `<li class="filtre filtreUstensile">${element}</li>`;
    })
};

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
}

function retireCritere(event) {
  event.target.parentNode.parentNode.parentNode.removeChild(event.target.parentNode.parentNode);
}

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('retireCritere')) { retireCritere(event) }
  if (event.target.classList.contains('filtre')) {ajouteFiltre(event)}
})

chargeRecettes();
