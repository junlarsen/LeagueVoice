// TODO: This entire file tbh
//  It is a simple mock that works
//  But it is not really great
class Runes {
    constructor(requester) {
        this.handle = requester;
    }

    /**
     * Gets all the players rune pages
     * @returns {Promise<*>}
     */
    getPages() {
        return this.handle.request({
            url: '/lol-perks/v1/pages',
            method: 'GET'
        });
    }

    /**
     * Gets amount of rune pages user has
     * @returns {Promise<*>}
     */
    totalPages() {
        return this.handle.request({
            url: '/lol-perks/v1/inventory',
            method: 'GET'
        });
    }

    /**
     * Deletes single rune page
     * TODO: Merge into deleteAll
     * @param id
     */
    deletePage(id) {
        this.handle.request({
            url: '/lol-perks/v1/pages/' + id,
            method: 'DELETE'
        });
    }

    /**
     * Deletes all rune pages
     * TODO: Merge into deletePage
     */
    deleteAll() {
        this.handle.request({
            url: '/lol-perks/v1/pages',
            method: 'DELETE'
        })
    }

    /**
     * Set the rune page
     * @param options
     */
    setAppPage(options) {
        let params = {
            "autoModifiedSelections": [],
            "id": 15000000,
            "current": true,
            "isActive": false,
            "isDeletable": true,
            "isEditable": true,
            "isValid": true,
            "lastModified": new Date().getTime,
            "name": "Google Select",
            "order": -1,
            "primaryStyleId": options.primary,
            "selectedPerkIds": options.perks,
            "subStyleId": options.sub
        };
        this.handle.request({
            url: '/lol-perks/v1/pages',
            method: 'POST',
            body: JSON.stringify(params)
        })
    }

}

module.exports = Runes;