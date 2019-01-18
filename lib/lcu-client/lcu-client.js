const Events = require('events');

const Champions = require('./champ-select/champions');
const Summoner = require('./summoner/summoner');
const Selection = require('./champ-select/selection');
const Runes = require('./perks/runes');
const LCURequester = require('./lcu-requester');
const Exception = require('../common/exceptions');
const WebSocket = require('./../socket/websocket');
const Link = require('./notifications/link');
const Spells = require('./spells/spells');
const Listener = require('../google-client/listener');

const locate = require('../common/locate');

/**
 * This class serves as an entry point
 * for the LCU Api wrapper.
 *
 * TODO:  fix listener
 */
class LCU extends Events {

    constructor() {
        super();
        let req = new LCURequester();
        req.start();
        this.req = req;

        this.listen = new Listener(req);
        this.champions = new Champions(req);
        this.summoner = new Summoner(req);
        this.selection = new Selection(req);
        this.runes = new Runes(req);
        this.link = new Link(req);
        this.spells = new Spells(req);
        this.ws = new WebSocket(req)

        this.error = new Exception();
    }

    start() {
        return new Promise(async (resolve, reject) => {
            let res = await locate();
            if (!!res) {
                resolve(true);
                this.ws.start();
                return;
            }
            resolve("League Client could not be found.");
        });
    }

}

module.exports = LCU;