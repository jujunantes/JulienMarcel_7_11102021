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
        this.ingredient = ingredient || ''
        this.quantity = quantity
        this.unit = unit
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
        <div class="mt-5 col-12 col-lg-4">
            <div class="card">
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
        this.id = id || 0
        this.name = name || ''
        this.servings = servings || ''
        this.ingredients = ingredients.map(ingredient => new Ingredient(ingredient.ingredient, ingredient.quantity, ingredient.unit)) || null
        this.time = time || 0
        this.description = description || ''
        this.appliance = appliance || ''
        this.ustensils = ustensils.map(ustensils => new Ustensile(ustensils)) || null
        this.html = ''
    }
}

export { Ingredient, Ustensile, Recette }