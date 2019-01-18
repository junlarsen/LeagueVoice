const Selection = require('./../champ-select/selection');

class Spells {

    constructor(requester) {
        this.handle = requester;
        this.selection = new Selection(requester);
    }

    primary(spell) {
        return this.set({ spell1Id: spell });
    }

    secondary(spell) {
        return this.set({ spell2Id: spell });
    }

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