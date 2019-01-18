const fs = require('fs');

class Spells {

    /**
     * Turn a spell name into a key
     *
     * @param key
     * @returns {Promise<any>}
     */
    static convert(key) {
        return new Promise(async (resolve, reject) => {
            fs.readFile('./lib/static/summonerSpells.json', 'utf8', (err, data) => {
                let items = JSON.parse(data);
                let results = [];
                results.push(items.filter(x => x.key == key)[0]);
                results.push(items.filter(x => x.display == key)[0]);
                results.push(items.filter(x => x.internal == key)[0]);

                resolve(results.filter(x => x !== undefined)[0]);
            })
        });
    }

}

module.exports = Spells;