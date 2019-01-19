const Champions = require('./champions');

class Selection {
    constructor(requester) {
        this.handle = requester;
        this.champs = new Champions(requester);
    }

    /**
     * Gets the current session based on the
     * currently logged in played
     *
     * @returns {Promise<*>}
     */
    getActions() {
        return new Promise(async (resolve, reject) => {
            this.getSession().then(items => {
                // Get the player cell id
                let player = items.localPlayerCellId;
                let iteration = items.actions;

                // Find the current non-completed action
                let current = iteration.filter(x => x.filter(y => !y.completed).length > 0)[0];

                // If the the current action is an action and our player has a cell
                if (typeof current === "object" && current.filter(x => x.actorCellId === player).length > 0) {
                    // Get the first cell for action in player
                    let action = current.filter(x => x.actorCellId === player);
                    // If the action is not emitted yet
                    if (action.length === 1) {
                        resolve(action[0]);
                    }
                }

            })
        });
    }

    /**
     * Gets the list of non pickable or bannable
     * champions in a game
     * 
     * @returns {Promise<any>}
     */
    getUnavailable() {
        return new Promise((resolve, reject) => {
            this.getSession()
                .then(feed => {
                    let items = feed.actions;
                    let complete = items.filter(x => x.filter(y => y.completed).length > 0);
                    let ids = [];

                    for (let i = 0; i < complete.length; i++) {
                        for (let j = 0; j < complete[i].length; j++) {
                            ids.push(complete[i][j].championId);
                        }
                    }
                    resolve(ids);
                })
        })
    }

    /**
     * Gets the current champion select
     * session data
     *
     * @returns {*}
     */
    getSession() {
        return this.handle.request({
            url: '/lol-champ-select/v1/session',
            method: 'GET'
        });
    }

    /**
     * Boolean function to check if user has active champ select
     *
     * @returns {Promise<any>}
     */
    isActive() {
        return new Promise(async (resolve, reject) => {
            this.getSession()
                .then(data => {
                    resolve(true);
                })
                .catch(data => {
                    resolve(false);
                })
        })
    }

    /**
     * Make a champion select action
     * ( pick / ban )
     *
     * @param action
     * @param champion
     * @param lock
     * @returns {*}
     */
    doAction(action, champion, lock) {
        return new Promise((resolve, reject) => {
            return this.getUnavailable()
                .then(items => {
                    if (!items.includes(champion)) {
                        this.handle.request({
                            url: '/lol-champ-select/v1/session/actions/' + action,
                            method: 'PATCH',
                            body: JSON.stringify({
                                championId: champion,
                                completed: !!lock,
                            })
                        })
                            .catch(reject)
                            .then(resolve);
                    } else {
                        reject("Champion has been picked or banned.");
                    }
                });
        });
    }
}

module.exports = Selection;