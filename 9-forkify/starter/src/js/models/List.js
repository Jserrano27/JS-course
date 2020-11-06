import uniqid from 'uniqid';

export default class List {

    constructor() {
        this.items = [];
    }

    newItem(count, unit, ingredient) {
        const item = {
            id: uniqid('list-'),
            count,
            unit,
            ingredient
        }

        this.items.push(item);
        return item;
    };

    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id);

        // DIFERENCIA ENTRE SPLICE() Y SLICE()
        // array = [1, 4, 9] -> splice(1, 2), devuelve [4, 9], array original = [1];
        // array = [1, 4, 9] -> slice(1, 2), devuelve [4], array original = [1, 4, 9];

        this.items.splice(index, 1);
    };

    updateCount(id, newCount) {
        this.items.find(el => el.id === id).count = newCount;
    }

};