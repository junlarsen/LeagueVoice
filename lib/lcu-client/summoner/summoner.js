class Summoner {
    /**
     * Set requester
     */
    constructor(requester) {
        this.handle = requester;
    }

    /**
     * Get info about the currently
     * logged in summoner
     *
     * @returns {Promise<void>}
     */
    getSummoner() {
        return this.handle.request({
            url: '/lol-summoner/v1/current-summoner',
            method: 'GET'
        })
    }
}

module.exports = Summoner;