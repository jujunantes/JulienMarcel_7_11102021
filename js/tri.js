/*
    tri.js

    trieAvecFiltres( ) prend en entrée du html de cartes et renvoie
    ce html filtré en fonction des crtitères ajoutés par Dromdown.

    metAJourRecettes() Affiche toutes les recettes filtrées en
    prenant en compte la barre de recherche et les filtres DropDown,
    puis mets à jour les listes DropDowns en fonction de ces recettes.

    filtrerRecettes() Filtre les recettes en fonction du seul contenu de
    la barre de recherche. Appelé par metAJourRecettes(). C'est cet
    algorithme qui est testé en deux versions pour rapidité.
*/

import {afficheRecettes} from "./affichage.js"
import {genereListesCriteres} from './gestionCriteres.js'

/**
 * Prend en entrée du html de cartes et renvoie ce html filtré en fonction des crtitères ajoutés par Dromdown
 * @param { String } htmlRecettes
 * @return { String }
 */
export function trieAvecFiltres(htmlRecettes) {
    IngredientsJSON.length = 0
    AppareilsJSON.length = 0
    UstensilesJSON.length = 0
    let mesRecettes = new DOMParser().parseFromString(htmlRecettes, 'text/html').querySelectorAll('.divRecette')
    const mesFiltres = document.querySelectorAll('.critere')
    let htmlInjecte = ''
    RecettesFiltrees.length = 0
    for (const monFiltre of mesFiltres) {
      const monCritere = monFiltre.innerHTML.substring(0, monFiltre.innerHTML.indexOf('<button>')).replace(/(\r\n|\n|\r)/gm, '').replace(/^\s+/g, '').replace(/\s+$/g, '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      if (htmlInjecte !== '') { mesRecettes = new DOMParser().parseFromString(htmlInjecte, 'text/html').querySelectorAll('.divRecette')}
      htmlInjecte = ''
      for (const maRecette of mesRecettes) {
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

   const maRecherche = document.getElementById('inputRecherche')

   /**
    * Quand la barre de recherche principale est vidée, rétabli
    * les recettes en tenant compte des critères éventuellement présents
    */
   function restaureRecettes() {
    if (document.getElementById('criteres').innerHTML.indexOf('span') < 1) { // Il n'y a pas de critères actifs
      document.getElementById('affichageRecettes').innerHTML = htmlToutesRecettes
    } else { // Il y a des critères actifs : 
      document.getElementById('affichageRecettes').innerHTML = trieAvecFiltres(htmlToutesRecettes)
    }
  }

  /**
    * Affiche toutes les recettes filtrées en
    * prenant en compte la barre de recherche et les filtres DropDown,
    * puis mets à jour les listes DropDowns en fonction de ces recettes.
    */
  export function metAJourRecettes() {
    if (maRecherche.value.length > 2) { // A-t-on entré un critère via la barre de recherche ?
      filtrerRecettes() // Oui : on affiche les recettes concernées par ce critère
      // Puis, s'il reste des critères ajoutés via les menus, on trie encore, avec les filtres encore affichés
      if (document.getElementById('criteres').innerHTML.indexOf('span') !== -1) {
        document.getElementById('affichageRecettes').innerHTML = trieAvecFiltres(document.getElementById('affichageRecettes').innerHTML)
      }
    } else { // Non : on affiche toutes les recettes, en les filtrant via les filtres encore affichés
      if (document.getElementById('criteres').innerHTML.indexOf('span') !== -1) {
        document.getElementById('affichageRecettes').innerHTML = trieAvecFiltres(htmlToutesRecettes)
      } else {
        document.getElementById('affichageRecettes').innerHTML = htmlToutesRecettes
      }
    }
    if (document.getElementById('criteres').innerHTML.indexOf('span') === -1) {document.getElementById('criteres').innerHTML = '' } 
    // On met à jour la liste des filtres
    genereListesCriteres()
  }

  /**
    * Renvoie (true) si (chaine1) contient (chaine2), et (false) sinon
    * @param { String } chaine1
    * @param { String } chaine2
    * @return { Boolean }
    */
  function chaineContientChaine(chaine1, chaine2){
    if (chaine1.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(chaine2.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) !== -1) {return true} else {return false}
  }

  /**
    * Filtre les recettes en fonction du seul contenu de
    * la barre de recherche. Appelé par metAJourRecettes(). C'est cet
    * algorithme qui est testé en deux versions pour rapidité.
    */
  export function filtrerRecettes() {
    RecettesFiltrees.length = 0 // Nous utilisons un tableau, plutôt que de générer immédiatement le html, car nous devrons aussi mettre à jour les ingrédients / appareils / ustensiles
    IngredientsJSON.length = 0
    AppareilsJSON.length = 0
    UstensilesJSON.length = 0
    Recettes.forEach(maRecette => {
      let recetteTrouvee = false
      if (chaineContientChaine(maRecette.description, maRecherche.value) // dans la description ?
        || chaineContientChaine(maRecette.name, maRecherche.value) // ou le nom de la recette ?
        || chaineContientChaine(maRecette.appliance, maRecherche.value)) {// ou ses appareils ?
          RecettesFiltrees.push(maRecette)
          recetteTrouvee = true
      } else { // recherche dans les ingredients si pas encore de succès pour cette recette
        for (const monIngredient of maRecette.ingredients) {
          if (chaineContientChaine(monIngredient.ingredient, maRecherche.value)) {
            RecettesFiltrees.push(maRecette)
            recetteTrouvee = true
          }
        }
        if (recetteTrouvee === false) { // encore rien trouvé : on tente dans les ustensiles
          for (const monUstensile of maRecette.ustensils) {
            if (chaineContientChaine(monUstensile.ustensil, maRecherche.value)) {
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
        //genereListesCriteres(true)
      }
    })
    // On affiche les recettes
    RecettesFiltrees.sort(function (a, b) {return a.name.localeCompare(b.name)}) // On trie le tableau par ordre alphabétique du nom des recettes
    afficheRecettes(true)
    genereListesCriteres()
  }

  maRecherche.addEventListener('keyup', (event) => {
    if (maRecherche.value.length > 2) {metAJourRecettes()}
    else {
      restaureRecettes()
      genereListesCriteres()
    }
  })