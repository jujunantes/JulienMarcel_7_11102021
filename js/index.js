import { Recette } from './classes.js';

const fetchRecettes = [];
const mesRecettes = [];

const IngredientsJSON = [];
const AppareilsJSON = [];
const UstensilesJSON = [];

const chargeRecettes = async () => {
  const affichageRecettes = document.getElementById('affichageRecettes');
  const fetchRecettes = await fetch('js/recettes.json')
    .then((reponse) => reponse.json())
    .then((donnees) => {
      for (const recette of donnees.recipes) {
        const maRecette = new Recette(recette.id, recette.name, recette.servings, recette.ingredients, recette.time, recette.description, recette.appliance, recette.ustensils);
        affichageRecettes.innerHTML += maRecette.genereCarteRecette();
      }
    });
};

chargeRecettes();
