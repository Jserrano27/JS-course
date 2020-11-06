import {
    url
} from '../config';
import axios from 'axios';

export default class Recipe {

    constructor(id) {
        this.id = id;
    }


    async getRecipe(id) {
        try {
            const res = await axios(`${url}get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.image = res.data.recipe.image_url;
            this.ingredients = res.data.recipe.ingredients;
            this.author = res.data.recipe.publisher;
            this.url = res.data.recipe.source_url;
        } catch (e) {
            console.log(e);
            alert('Something went wrong :(')
        }
    }

    calcTime() {
        // Assuming 15 mins each 3 ingridients
        const cantIng = this.ingredients.length;
        this.time = Math.ceil(cantIng / 3) * 15;
    }

    calcPortions() {
        this.portions = 4;
    }

    parseIngredients() {
        // Add units to be replaced into these arrays (mantaining index)
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds', 'slices'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pund', 'slice'];
        // Add new units here
        const units = [...unitsShort, 'g', 'kg']

        const newIngredients = this.ingredients.map(el => {
            let ingredient = el.toLowerCase();

            // 1) Uniform units
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // 2) Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3) Parse ingredients into count, unit and ingredient
            const ingArr = ingredient.split(' ');
            const unitIndex = ingArr.findIndex(el2 => units.includes(el2));

            let objIng;
            if (unitIndex > -1) {
                // If there is a unit
                let count;

                if (unitIndex === 1) {
                    count = eval(ingArr[0].replace('-', '+'));
                } else {
                    count = eval(ingArr.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: ingArr[unitIndex],
                    ingredient: ingArr.slice(unitIndex + 1).join(' ')
                }
            } else if (parseInt(ingArr[0], 10)) {
                // There is NO unit but first element is number
                objIng = {
                    count: parseInt(ingArr[0], 10),
                    unit: '',
                    ingredient: ingArr.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                // If there NO a unit and first element is NOT a number
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            return objIng;
        })

        this.ingredients = newIngredients;
    }

    updatePortions(type) {
        // update portions
        const newPortions = type === 'inc' ? this.portions + 1 : this.portions - 1;

        // update ingredient count
        this.ingredients.forEach(ing => {
            ing.count = ing.count * (newPortions / this.portions);
        });


        this.portions = newPortions;
    }
}






//https://forkify-api.herokuapp.com/api/get
//query parameter accepted: rId
//ie: https://forkify-api.herokuapp.com/api/get?rId=47746