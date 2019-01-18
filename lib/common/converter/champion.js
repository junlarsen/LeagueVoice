const fs = require('fs');

class Champion {

    /**
     * Turn a champion name into a key
     *
     * @param key
     * @param type
     * @returns {Promise<any>}
     */
    static convert(key, type) {
        return new Promise(async (resolve, reject) => {
            fs.readFile('./lib/static/champion.json', 'utf8', (err, data) => {
                if (err) return reject(err);
                let items = JSON.parse(data);
                let results = [];
                results.push(items.filter(x => x.key == key)[0]);
                results.push(items.filter(x => x.name == key)[0]);
                results.push(items.filter(x => x.id == key)[0]);

                resolve(results.filter(x => x !== undefined)[0]);
            })
        });
    }

}

module.exports = Champion;