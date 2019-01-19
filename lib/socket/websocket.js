const socket = require('ws');
const Events = require('events');
const Selection = require('./../lcu-client/champ-select/selection');
const LCURequester = require('../lcu-client/lcu-requester');

class WebSocket extends Events {
    constructor(requester) {
        // Call Events constructor with no params
        super();
        this.handle = requester;
        this.select = new Selection(requester);
    }

    /**
     * Contact the ws and start emitting
     * events from the socket.
     *
     * @returns {Promise<void>}
     */
    async start() {
        this.handle.start();
        let creds = await this.handle.auth();

        const ws = new socket('wss://riot:' + creds.password + '@127.0.0.1:' + creds.port.toString(), {
            headers: {
                Authorization: 'Basic ' + Buffer.from('riot:' + creds.password).toString('base64'),
            },
            rejectUnauthorized: false
        });

        this.ws = ws;

        ws.on('open', () => {
            ws.send(JSON.stringify([5, 'OnJsonApiEvent']));
            this.emit('league-ws-start', this);
        });

        let emitted = [];
        let useractions = [];

        ws.on('message', message => {
            if (message != null && message !== '' && message !== ' ') {
                let data = JSON.parse(message);
                // Set uri and event
                const eventUri = data[2]["uri"];
                const eventType = data[2]["eventType"];

                // Switch the type
                switch (eventType) {
                    case "Create":
                        // Switch the event
                        switch (eventUri) {
                            case "/lol-champ-select/v1/session":
                                this.emit('champ-select-join', data);
                                break;
                            case "/lol-champ-select/v1/current-champion":
                                if (!(emitted.includes(5001))) {
                                    emitted.push(5001)
                                    this.emit('champ-select-pick', data);
                                }
                                break;
                        }
                        break;
                    case "Update":
                        // Switch the event
                        switch (eventUri) {
                            case "/lol-champ-select/v1/session":
                                this.select.isActive().then(resp => {
                                    // If in champ select
                                    this.emit('app-any', JSON.stringify(data));
                                    if (resp) {
                                        this.select.getSession().then(items => {
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
                                                if (action.length === 1 && (!emitted.includes(action[0].id))) {
                                                    // Only in pick or ban
                                                    switch (items.timer.phase) {
                                                        case "BAN_PICK":
                                                            // Emit the action
                                                            this.emit(`champ-select-do-${action[0].type}`);
                                                            emitted.push(action[0].id);
                                                    }
                                                }
                                            }

                                        })
                                    }
                                });
                            }
                            break;
                    case "Delete":
                        switch (eventUri) {
                            case "/lol-champ-select/v1/session":
                                emitted = [];
                                useractions = [];
                                this.emit('champ-select-exit', data);
                        }
                        break;
                    default:
                    }
                }
            }
        );

        ws.on('close', () => {
            this.emit('league-ws-close', this);
        })
    }
}

module.exports = WebSocket;