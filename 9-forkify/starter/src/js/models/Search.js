import axios from 'axios';
import {
    url
} from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        try {
            const res = await axios(`${url}search?q=${this.query}`);
            this.result = res.data.recipes;
        } catch (e) {
            console.log(e);
            alert('Something went wrong :(')
        }
    }

}



//https://forkify-api.herokuapp.com/api/search
//query parameter accepted: q= pizza/broccoli/bacon
// ie: https://forkify-api.herokuapp.com/api/search?q=pizza