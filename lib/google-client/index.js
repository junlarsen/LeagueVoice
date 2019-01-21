const LCUClient = require('../lcu-client/lcu-client');
const Converter = require('../common/converter/index');

/**
 * A "facade" type class to make requests using the
 * mini "lcu wrapper"
 */
class GoogleSelect {
    constructor() {
        this.client = new LCUClient();
    }

    /**
     * Set the primary spell with name
     *
     * @param spellName
     * @returns {Promise<any>}
     */
    primarySpell(spellName) {
        return new Promise(async (resolve, reject) => {
            let name = await Converter.spells.convert(spellName);
            if (name !== undefined) resolve(this.client.spells.primary(parseInt(name.key)));
            else reject("Invalid summoner spell");
        })
    }

    /**
     * Set the secondary spell with name
     *
     * @param spellName
     * @returns {Promise<any>}
     */
    secondarySpell(spellName) {
        return new Promise(async (resolve, reject) => {
            let name = await Converter.spells.convert(spellName);
            if (name !== undefined) resolve(this.client.spells.secondary(parseInt(name.key)));
            else reject("Invalid summoner spell");
        })
    }

    /**
     * Get info about the currently
     * logged in summoner
     *
     * @returns {Promise<*>}
     */
    summoner() {
        return this.client.summoner.getSummoner()
    }

    /**
     * Gets the current action name
     *
     * @returns {Promise<*>}
     */
    action() {
        return new Promise(async (resolve, reject) => {
            try {
                let items = await this.client.selection.getActions();
                resolve(items.type);
            } catch (e) {
                reject(this.client.error.debug(e));
            }
        })
    }

    /**
     * Make a pick or a ban
     *
     * @param id
     * @returns {Promise<*>}
     */
    act(id) {
        return new Promise((resolve, reject) => {
            Converter.champion.convert(id)
                .then(character => {
                    this.client.selection.getActions()
                        .then(actions => {
                            if (typeof actions === "object") {
                                this.client.selection.doAction(actions.id, parseInt(character.key), true)
                                    .catch(reject)
                                    .then(() => {
                                        return resolve(true);
                                    })
                            }
                        })
                        .catch(reject)
                })
                .catch(() => {
                    reject("The champion could not be found.");
                });

        })
    }
    
}

module.exports = GoogleSelect;