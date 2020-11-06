import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {
    elements,
    renderLoader,
    removeLoader,
} from './views/base';


/**
 * - Search Object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes 
 */
const state = {};


/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {

    // 1) Get query from view
    const query = searchView.getInput();

    if (query) {
        // 2) New Search object and add to state
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4) Search for recipes
            await state.search.getResults();

            // 5) Render results on UI
            removeLoader();
            searchView.showResults(state.search.result);

        } catch (e) {
            console.log(e);
            removeLoader();
        }
    }

}

elements.search.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchRes.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');

    if (btn) {
        const goToPage = parseInt(btn.dataset.goto);

        searchView.clearResults();
        searchView.showResults(state.search.result, goToPage);
    }
});


/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
    // GET ID from URL
    const id = window.location.hash.replace('#', '');

    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected item
        if (state.search) {
            searchView.highLightSelected(id);
        }

        // Create new recipe object
        state.recipe = new Recipe(id);


        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();


            // Calculate time and portions
            state.recipe.calcTime();
            state.recipe.calcPortions();

            // Render recipe
            removeLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes ? state.likes.isLiked(id) : false
            );
        } catch (e) {
            console.log(e);
        }
    }
}

['hashchange', 'load'].forEach(event => addEventListener(event, controlRecipe));


/**
 * SHOPPING LIST CONTROLLER
 */

const controlList = () => {
    if (!state.list) {
        state.list = new List()
    };

    //1) Create List Items
    state.recipe.ingredients.forEach(el => {
        const item = state.list.newItem(el.count, el.unit, el.ingredient);

        // 2) Render item
        listView.renderItems(item);
    });

};

/**
 * LIKE CONTROLLER
 */

const controlLike = () => {
    if (!state.likes) {
        state.likes = new Likes();
    };

    const currentID = state.recipe.id;


    // If current recipe has NOT been liked
    if (!state.likes.isLiked(currentID)) {
        // Create like item
        const like = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.image
        );
        // Toogle like button
        likesView.toogleLikedButton(state.likes.isLiked(currentID));

        // Toogle menu if is not there yet
        likesView.toogleLikeMenu(state.likes.getNumLikes());

        // Add like to the UI list
        likesView.renderLike(like);
    }
    // If current recipe HAS been liked
    else {
        // Delete like item
        state.likes.deleteLike(currentID);

        // Toogle like button
        likesView.toogleLikedButton(state.likes.isLiked(currentID));

        // Toogle menu if numlikes = 0
        likesView.toogleLikeMenu(state.likes.getNumLikes());

        // Remove like from the UI list
        likesView.removeLike(currentID);
    }
};

// Restore local storage on load
window.addEventListener('load', () => {
    state.likes = new Likes();

    state.likes.readStorage();

    state.likes.likes.forEach(like => likesView.renderLike(like));

    likesView.toogleLikeMenu(state.likes.getNumLikes());
});


// HANDLE RECIPE BUTTON CLICKS
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.portions > 1) {
            state.recipe.updatePortions('dec')
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updatePortions('inc')
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn, .recipe__btn *')) {
        // Add to shopping list button is clicked
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like button is clicked
        controlLike();
    }
});


// HANDLE DELETE AND UPDATE LIST BUTTONS
elements.shoppingList.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').id;

    // Handle the DELETE button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from view
        listView.deleteItem(id);
    };

    // Handle the UPDATE button
    if (e.target.matches('.shopping__count-value')) {
        // Update from state
        const val = e.target.value;
        state.list.updateCount(id, val);
    }
});