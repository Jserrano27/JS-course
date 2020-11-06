const second = () => {
    setTimeout(() => {
        console.log('Async');
    }, 2000);

}

const first = () => {
    console.log('Hey there');
    second();
    console.log('The end');
}

first();


const getRecipe = () => {
    setTimeout(() => {
        const ID = [312, 132, 745, 438];
        console.log(ID);

        setTimeout(id => {
            const recipe = {
                title: 'Fresh Tomato',
                publisher: 'Jonas'
            }
            console.log(`${id}: ${recipe.title}`);

            setTimeout(() => {
                console.log(recipe);
            }, 1000)

        }, 1000, ID[2]);

    }, 1500);
}
getRecipe();


const getIds = new Promise((resolve, reject) => {
    setTimeout(() => {
        const ids = [312, 132, 745, 438];
        resolve(ids);
    }, 1500)
})

const getRecipe = recID => {
    return new Promise((resolve, reject) => {
        setTimeout(id => {
            const recipe = {
                title: 'Fresh Tomato',
                publisher: 'Jonas'
            }
            resolve(`${id}: ${recipe.title}`);
        }, 1500, recID);
    })
}

const getRelated = author => {
    return new Promise((resolve, reject) => {
        setTimeout(aut => {
            const recipe = {
                title: 'Italian Pizza',
                publisher: aut
            }

            resolve(recipe);
        }, 1000, author)
    })
}

//ES5

getIds
    .then(ids => {
        console.log(ids);
        return getRecipe(ids[2]);
    })
    .then(recipe => {
        console.log(recipe)
        return getRelated('Jonas Brothers');
    })
    .then(aut => {
        console.log(aut);
    })
    .catch(() => {
        console.log('ERROR!');
    })

// ASYNC AWAIT ES8

async function getRecipesAW() {
    const ids = await getIds;
    console.log(ids);
    const rec = await getRecipe(ids[2]);
    console.log(rec);
    const rel = await getRelated('The Jonas Bros');
    console.log(rel);

    return rec;
}

getRecipesAW().then(result => console.log(`${result} is the best ever!`));




// AJAX AND APIS

// Promises
function getWeather(cityID) {
    fetch(`https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/${cityID}/`)
        .then(result => {
            //console.log(result);
            return result.json();
        })
        .then(data => {
            //console.log(data);
            const today = data.consolidated_weather[0];
            console.log(
                `The weather in ${data.title} today stays between ${today.min_temp} and ${today.max_temp}`
            );
        })
        .catch(error => console.log(error));
}
getWeather(2487956);
getWeather(44418);


// ASYNC AWAIT

async function getWeatherAW(cityID) {
    try {
        const result = await fetch(
            `https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/${cityID}/`
        );
        const data = await result.json();
        const tomorrow = data.consolidated_weather[1];
        console.log(
            `The weather in ${data.title} tomorrow stays between ${tomorrow.min_temp} and ${tomorrow.max_temp}`
        );
    } catch (error) {
        console.log(error);
    }

}
getWeatherAW(2487956);
getWeatherAW(44418);