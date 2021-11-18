/*
    rechercheDropDown.js

    Ce fichier prend en charge la recherche intégrée à chaque
    menu DropDown.

    Des écouteurs d'événements détectent l'entrée de texte dans
    la barre de recherche de chacun des menus et transmets ce
    texte à la fonction filtrerDropDown, qui n'affiche dans le
    menu concerné que les critères qui incluent le texte recherché.
*/

const maRechercheIngredients = document.getElementById('rechercheIngredients')
const maRechercheAppareils = document.getElementById('rechercheAppareils')
const maRechercheUstensiles = document.getElementById('rechercheUstensiles')

/**
 * Filtre les entrées du menu (affichageMenu) en fonction du contenu de sa barre de recherche (critereEntre)
 * @param { Object } critereEntre
 * @param { String } affichageMenu
 */
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