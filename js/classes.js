class Ingredient {
    genereIngredient() {
        if(this.quantity === undefined && this.unit === undefined ){
            return `<p class="pIngredient text-truncate"><span class="listeIngredientsGras">${this.ingredient}</span></p>`;
        }
        else if(this.unit == undefined){
            return `<p class="pIngredient text-truncate"><span class="listeIngredientsGras">${this.ingredient} : </span><span  class="listeIngredientsNormal">${this.quantity}</span></p>`;
        } 
        else return `<p class="pIngredient text-truncate"><span class="listeIngredientsGras">${this.ingredient} : </span><span  class="listeIngredientsNormal">${this.quantity} ${this.unit}</span></p>`;
    }

    constructor (ingredient, quantity, unit) {
        this.ingredient = null ?? ingredient
        this.quantity = null ?? quantity
        this.unit = null ?? unit
    }
}

class Ustensile {
    constructor (ustensil) {
        this.ustensil = ustensil
    }
}

class Recette {
    genereCarteRecette() {
        this.html = 
        `
        <div class="mt-5 col-12 col-lg-4 divRecette">
            <div class="card carteRecette">
                <div class="photoRecette"></div>
                <div class="card-body">
                    <div class="row ligneTitre">
                        <div class="col-8">
                            <h5 class="card-title titreRecette">${this.name}</h5>
                        </div>
                        <div class="col blocTemps">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 0C4.5 0 0 4.5 0 10C0 15.5 4.5 20 10 20C15.5 20 20 15.5 20 10C20 4.5 15.5 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18ZM10.5 5H9V11L14.2 14.2L15 12.9L10.5 10.2V5Z" fill="black"/>
                            </svg>                            
                            <p class="card-text tempsRecette">${this.time} min</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col card-text text-truncate blocIngredients">
                            ${this.ingredients.map(Ingredient => Ingredient.genereIngredient()).join('')}
                        </div>
                        <div class="col card-text text-wrap text-truncate">
                            <p class="card-text descriptionRecette">${this.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `
        return this.html
    }

    constructor (id, name, servings, ingredients, time, description, appliance, ustensils) {
        this.id = null ?? id
        this.name = null ?? name
        this.servings = null ?? servings
        this.ingredients = null ?? ingredients.map(ingredient => new Ingredient(ingredient.ingredient, ingredient.quantity, ingredient.unit))
        this.time = null ?? time
        this.description = null ?? description
        this.appliance = null ?? appliance
        this.ustensils = null ?? ustensils.map(ustensils => new Ustensile(ustensils))
        this.html = ''
    }
}

export { Ingredient, Ustensile, Recette }