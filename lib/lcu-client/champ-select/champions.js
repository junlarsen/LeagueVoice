class Champions {
    /**
     * Set up requester
     */
    constructor(requester) {
        this.handle = requester;
    }

    /**
     * Get list of champions that can
     * be banned
     *
     * @returns {Promise<*>}
     */
    getBannableChampions() {
        return this.handle.request({
            url: '/lol-champ-select/v1/bannable-champions',
            method: 'GET'
        })
    }

    /**
     * Get the currently picked champion
     * 
     * @returns {Promise<*>}
     */
    getCurrent() {
        return this.handle.request({
            url: '/lol-champ-select/v1/current-champion',
            method: 'GET'
        })
    }

    /**
     * Get the list of diabled champions
     * TODO: Resolve the TeamBuilder error
     *
     * @returns {Promise<*>}
     */
    getDisabled() {
        return this.handle.request({
            url: '/lol-champ-select/v1/disabled-champions',
            method: 'GET'
        })
    }

    /**
     * Get the list of champions that
     * can be picked
     *
     * @returns {Promise<*>}
     */
    getPickableChampions() {
        return this.handle.request({
            url: '/lol-champ-select/v1/pickable-champions',
            method: 'GET'
        })
    }

    /**
     * Get the list of skins that can be
     * selected
     * TODO: Resolve the TeamBuilder Error
     *
     * @returns {Promise<void>}
     */
    getPickableSkins() {
        return this.handle.request({
            url: '/lol-champ-select/v1/pickable-skins',
            method: 'GET'
        })
    }
}

module.exports = Champions;