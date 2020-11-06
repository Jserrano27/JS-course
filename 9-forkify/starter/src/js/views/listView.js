import {
    elements
} from './base';

export const renderItems = item => {
    const html =
        `
        <li class="shopping__item" id="${item.id}">
            <div class="shopping__count">
                <input type="number" value="${item.count ? item.count : 0}" step="${item.count}" class="shopping__count-value" min="0">
                <p>${item.unit}</p>
            </div>
            <p class="shopping__description">${item.ingredient}</p>
            <button class="shopping__delete btn-tiny">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-cross"></use>
                </svg>
            </button>
        </li>
    `;

    elements.shoppingList.insertAdjacentHTML('beforeend', html);

};

export const deleteItem = id => {
    const item = document.getElementById(`${id}`);

    item.parentElement.removeChild(item);
};