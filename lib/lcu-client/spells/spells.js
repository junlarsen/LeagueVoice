const Selection = require('./../champ-select/selection');

class Spells {

    constructor(requester) {
        this.handle = requester;
        this.selection = new Selection(requester);
    }

    /**
     * Sets the D key summoner spell
     *
     * @param spell
     */
    primary(spell) {
        return this.set({ spell1Id: spell });
    }

    /**
     * Sets the F key summoner spell
     * @param spell
     */
    secondary(spell) {
        return this.set({ spell2Id: spell });
    }

    /**
     * Sets a summoner spell
     * 
     * @param params
     * @returns {Promise<any>}
     */
    set(params) {
        return new Promise(async (resolve, reject) => {
            let active = await this.selection.isActive();
            if (active) {
                await this.handle.request({
                    url: '/lol-champ-select/v1/session/my-selection',
                    method: 'PATCH',
                    body: JSON.stringify(params)
                });
                resolve(true);
                return;
            }
            reject("You are currently not in an active champion select.");
        })
    }

}

module.exports = Spells;