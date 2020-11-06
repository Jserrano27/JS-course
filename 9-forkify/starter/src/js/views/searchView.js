import {
    elements
} from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchPages.innerHTML = '';
};

export const highLightSelected = id => {
    document.querySelectorAll('.results__link--active').forEach(el => el.classList.remove('results__link--active'));

    document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
};

/**
'Pizza with spinach and sauce'
acc: 0 // 
acc: 0 // newTitle = ['Pizza'];
acc: 5 // newTitle = ['Pizza', 'with'];
acc: 9 // newTitle = ['Pizza', 'with', 'spinach'];
acc: 16 // newTitle = ['Pizza', 'with', 'spinach', 'and'];
acc: 19 // newTitle = ['Pizza', 'with', 'spinach', 'and'];
 */
export const limitRecipeTitle = (title, limit = 18) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);

        return `${newTitle.join(' ')} ...`;
    }
    return title;
};

const showRecipe = recipe => {
    const html = `
    <li>
        <a class="likes__link" href="#${recipe.recipe_id}">
            <figure class="likes__fig">
              <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="likes__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;

    elements.searchResList.insertAdjacentHTML('beforeend', html);
};

const createPaginationButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto="${type === 'next' ? page + 1 : page - 1}">
        <span>Page ${type === 'next' ? page + 1 : page - 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'next' ? 'right' : 'left'}"></use>
        </svg>
    </button>
`;

const renderButtons = (page, resPerPage, numResults) => {
    const pages = Math.ceil(numResults / resPerPage);
    let buttonElement;

    if (page === 1) {
        // Render next button
        buttonElement = createPaginationButton(page, 'next')
    } else if (page < pages) {
        // Render prev and next button
        buttonElement = `
        ${createPaginationButton(page, 'prev')}
        ${createPaginationButton(page, 'next')}
        `
    } else if (page === pages) {
        // Render prev button
        buttonElement = createPaginationButton(page, 'prev')
    }

    elements.searchPages.insertAdjacentHTML('afterbegin', buttonElement);
};

export const showResults = (recipes, page = 1, resPerPage = 10) => {
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(showRecipe);
    renderButtons(page, resPerPage, recipes.length);
};