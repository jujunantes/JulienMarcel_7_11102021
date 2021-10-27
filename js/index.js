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
      affichageIngredients.innerHTML += `<li>${element}</li>`;
    })
    document.getElementById("conteneur-1_deplie").style.display = "block"

    const affichageAppareils = document.getElementById('listeAppareils')
    AppareilsJSON.forEach((element) => {
      affichageAppareils.innerHTML += `<li>${element}</li>`;
    })
    document.getElementById("conteneur-2_deplie").style.display = "block"

    const affichageUstensiles = document.getElementById('listeUstensiles')
    UstensilesJSON.forEach((element) => {
      affichageUstensiles.innerHTML += `<li>${element}</li>`;
    })
    document.getElementById("conteneur-3_deplie").style.display = "block"
};

// Gestion des liste déroulantes


chargeRecettes();
