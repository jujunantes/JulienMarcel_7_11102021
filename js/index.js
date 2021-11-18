/*
  index.js

  Ce module est le premier module appelé une fois la page html chargée.
  Il commence par définir quelques variables globales appelées par les autres
  modules puis charge les recettes dans un tableau Recettes à partir du fichier
  recettes.json.
  Il appelle ensuite, dans affichage.js, la fonction afficheRecette() puis
  met à jour le contenu des menus dropdown (Ingredients/Appareil/Ustensiles)
  en appelant la fonction genereListeCriteres() du fichier gestionCriteres.js

  Note : le HTML charge ensuite le fichier rechercheDropDown, qui met en place
  la recherche au sein des menus dropdown.
*/

import {Recette} from './classes.js';
import {genereListesCriteres} from './gestionCriteres.js'
import { afficheRecettes } from "./affichage.js"

globalThis.IngredientsJSON = []
globalThis.AppareilsJSON = []
globalThis.UstensilesJSON = []
globalThis.Recettes = []

globalThis.RecettesFiltrees = []
globalThis.htmlToutesRecettes = ''
globalThis.htmlTousIngredients = ''
globalThis.htmlTousAppareils = ''
globalThis.htmlTousUstensiles = ''

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
    genereListesCriteres()
    htmlToutesRecettes = document.getElementById('affichageRecettes').innerHTML // On sauvegarde le html de toutes les recettes, et des menus dropdown
    htmlTousIngredients = document.getElementById('listeIngredients').innerHTML
    htmlTousAppareils = document.getElementById('listeAppareils').innerHTML
    htmlTousUstensiles = document.getElementById('listeUstensiles').innerHTML
}

chargeRecettes();