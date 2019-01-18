const Summoner = require('./../summoner/summoner');
const request = require('request');

class Link {
    constructor(requester) {
        this.handle = requester;
        this.summoner = new Summoner(requester);
    }

    /**
     * Link an account to the google account.
     *
     * @returns {Promise<any>}
     */
    link() {
        return new Promise(async (resolve, reject) => {
            try {
                // Fetch summoner data
                let summoner = await this.summoner.getSummoner();

                // Cloud post params
                let prelink = {
                    summonerName: summoner.displayName,
                    // accountId: summoner.accountId,
                    // summonerId: summoner.summonerId,
                    puuid: summoner.puuid
                };
                // Cloud request params
                let params = {
                    url: 'https://us-central1-leagueassistant-d385f.cloudfunctions.net/prelink',
                    method: 'POST',
                    body: JSON.stringify(prelink),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    rejectUnauthorized: false
                };
                // Make request
                request(params, (err, res, items) => {
                    let response = JSON.parse(items);
                    // Resolve with notify method response.
                    if (response.Passphrase !== "None") {
                        resolve(response.Passphrase);
                        return;
                    }
                    resolve(false);
                })
            } catch (e) {
                reject(e)
            }
        });
    }
    
}

module.exports = Link;