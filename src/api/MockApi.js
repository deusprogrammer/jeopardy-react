import data from './data.js';

export let getCategories = async () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(JSON.parse(data));
        }, 1000);
    })
}