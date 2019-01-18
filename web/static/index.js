const LeagueClient = require('../../lib/lcu-client/lcu-client');
const GoogleClient = require('../../lib/google-client/index');

const Events = require('events');

class Application extends Events {

    /**
     * Create new app
     */
    constructor() {
        super();
        this.League = new LeagueClient();
        this.Google = new GoogleClient();
        this.store = {};
    }

    /**
     * Connect to the web socket
     *
     * @returns {Promise<any>}
     */
    connect() {
        return new Promise(async (resolve, reject) => {
            this.League.listen.update('clientStates', 'selection', {
                banChampion: "", banState: "NOT", origin: "EXIT", phase: "NOT",
                primary: "", secondary: "", selectChampion: "", state: "NOT"
            }).then(() => {
                this.League.start()
                    .then((res) => {
                        if (res === true) {
                            this.emit('log', `Success: Started application.`);
                            resolve(true);
                        } else {
                            this.emit('log', `Error: ${res}`);
                            resolve(false);
                        }
                    })
            });
        })
    }

    /**
     * Initiate account linking
     *
     * @returns {Promise<any>}
     */
    link() {
        return new Promise(async (resolve, reject) => {
            this.League.link.link()
                .then((res) => {
                    if (!res) {
                        this.emit('log', `Error: Already Linked`);
                        this.emit('notice', `Already Linked`);
                        resolve(false);
                    } else {
                        this.emit('log', `Success: Requested Password`);
                        this.emit('notice', `Password: ${res}`);
                        resolve(true);
                    }
                })
        })
    }

    /**
     * Listen to web socket for events
     *
     * @returns {Promise<void>}
     */
    async events() {
        /**
         * WebSocket
         */
        this.League.ws.on('champ-select-join', () => {
            this.onSelectJoin();
        });

        this.League.ws.on('champ-select-exit', () => {
            this.onSelectExit()
        });

        this.League.ws.on('champ-select-do-pick', () => {
            this.onDoPick();
        });

        this.League.ws.on('champ-select-do-ban', () => {
            this.onDoBan();
        });

        this.League.ws.on('league-ws-open', () => {
            this.onSocketOpen();
        });

        this.League.ws.on('league-ws-close', () => {
            this.onSocketClose();
        });

        /**
         * Firebase
         */
        this.on('act-spell-primary', (res) => {
            this.primarySpell(res);
        });

        this.on('act-spell-secondary', (res) => {
            this.secondarySpell(res);
        });

        this.on('act-current-pick', (res) => {
            this.livePick(res);
        });

        this.on('act-current-ban', (res) => {
            this.liveBan(res);
        });

        this.on('act-future-pick', (res) => {
            this.futurePick(res);
        });

        this.on('act-future-ban', (res) => {
            this.futureBan(res);
        });
    }

    async boot() {
        this.League.listen.listen('clientStates', 'selection', (ref) => {
            if (ref) {
                ref.on('rcv-clientstates-selection', (res) => {
                    let live = res.data();
                    let old = this.store.selection;

                    /** Primary spell */
                    if (live.primary !== "" && live.primary !== old.primary) {
                        this.emit('act-spell-primary', {live: live, stash: old});
                    }

                    /** Secondary spell */
                    if (live.secondary !== "" && live.secondary !== old.secondary) {
                        this.emit('act-spell-secondary', {live: live, stash: old});
                    }

                    /** Future pick */
                    if (live.phase === "PICK" && old.state === "FUTURE" && live.state === "NOW" && live.selectChampion !== "" && live.origin === "PICK") {
                        this.emit('act-future-pick', {live: live, stash: old});
                    }

                    /** Live Pick */
                    if (live.phase === "PICK" && live.state === "NOW" && old.selectChampion === "" && live.selectChampion !== "" && live.origin === "PICK") {
                        this.emit('act-current-pick', {live: live, stash: old})
                    }

                    /** Future ban */
                    if (live.phase === "BAN" && old.banState === "FUTURE" && live.banState === "NOW" && live.banChampion !== "" && live.origin === "BAN") {
                        this.emit('act-future-ban', {live: live, stash: old});
                    }

                    if (live.phase === "BAN" && live.banState === "NOW" && live.banChampion !== "" && live.origin === "BAN") {
                        this.emit('act-current-ban', {live: live, stash: old});
                    }

                    this.store.selection = live;

                })
            }
        })
    }

    /**
     * ====================================================================================================
     *
     *                                          ACTION FUNCTIONS
     *
     * ====================================================================================================
     */


    /**
     * DoFuturePick
     *
     * @param context
     */
    async futurePick(context) {
        this.Google.act(context.stash.selectChampion)
            .catch((err) => {
                typeof err === "object" ? null : this.emit('log', `Error: ${err}`);
            })
            .then(() => {
                this.emit('log', `Action: I picked ${context.stash.selectChampion} for you.`);
            })
            .then(() => {
                this.League.listen.update('clientStates', 'selection', {selectChampion: ""});
            })
    }

    /**
     * DoFutureBan
     *
     * @param context
     */
    async futureBan(context) {
        this.Google.act(context.stash.banChampion)
            .catch((err) => {
                typeof err === "object" ? null : this.emit('log', `Error: ${err}`);
            })
            .then(() => {
                this.emit('log', `Action: I banned ${context.stash.banChampion} for you.`);
            })
            .then(() => {
                this.League.listen.update('clientStates', 'selection', {banChampion: ""});
            })
    }


    /**
     * DoLivePick
     * 
     * @param context
     */
    async livePick(context) {
        this.Google.act(context.live.selectChampion)
            .then(() => {
                this.emit('log', `Action: I picked ${context.live.selectChampion} for you.`);
            })
            .then(() => {
                this.League.listen.update('clientStates', 'selection', {selectChampion: ""});
            })
            .catch((err) => {
                /*typeof err === "object" ? null :*/
                this.emit('log', `Error: ${JSON.stringify(err)}`);
            })
    }

    /**
     * DoLiveBan
     *
     * @param context
     */
    async liveBan(context) {
        this.Google.act(context.live.banChampion)
            .then(() => {
                this.emit('log', `Action: I banned ${context.live.banChampion} for you.`);
            })
            .then(() => {
                this.League.listen.update('clientStates', 'selection', {banChampion: ""});
            })
            .catch((err) => {
                /*typeof err === "object" ? null :*/
                    this.emit('log', `Error: ${err}`);
            })
    }
    
    /**
     * SetPrimarySpell
     * 
     * @param context
     */
    async primarySpell(context) {
        this.Google.primarySpell(context.live.primary)
            .then(() => {
                this.emit('log', `Action: Changed primary summoner spell`);
            })
            .then(() => {
                this.League.listen.update('clientStates', 'selection', {primary: ""});
            })
            .catch((err) => {
                this.emit('log', `Error: ${err}`);
            });
    }

    /**
     * SetSecondarySpell
     *
     * @param context
     */
    async secondarySpell(context) {
        this.Google.secondarySpell(context.live.secondary)
            .then(() => {
                this.emit('log', `Action: Changed secondary summoner spell`);
            })
            .then(() => {
                this.League.listen.update('clientStates', 'selection', {secondary: ""});
            })
            .catch((err) => {
                this.emit('log', `Error: ${err}`);
            });
    }

    /**
     * OnDoPick
     */
    async onDoPick() {
        this.League.listen.update('clientStates', 'selection', {
            state: 'NOW',
            phase: "PICK",
            origin: "PICK",
            banChampion: ""
        });
        this.emit('log', `Action: It is your turn to make a selection.`);
    }

    /**
     * OnDoBan
     */
    async onDoBan() {
        this.League.listen.update('clientStates', 'selection', {
            banState: 'NOW',
            phase: "BAN",
            origin: "BAN"
        });
        this.emit('log', `Action: It is your turn to make a ban.`);
    }

    /**
     * OnSocketOpen
     */
    async onSocketOpen() {
        this.emit('log', `Action: Client connection opened.`);
    }

    /**
     * OnSocketClose
     */
    async onSocketClose() {
        this.emit('log', `Action: Client connection closed.`);
    }

    /**
     * OnSelectJoin
     */
    async onSelectJoin() {
        setTimeout(() => {
            this.League.listen.get('clientStates', 'selection')
                .then((res) => {
                    this.League.listen.update('clientStates', 'selection', {
                        state: res.state !== "NOT" ? res.state : 'FUTURE',
                        origin: res.origin !== "EXIT" ? res.origin : 'JOIN',
                        banState: res.banState !== "NOT" ? res.banState : 'FUTURE'
                    });
                });
        }, 1000);
        this.emit('log', `Action: You have joined champion select.`);
    }

    /**
     * OnChampionExit
     */
    async onSelectExit() {
        this.League.listen.update('clientStates', 'selection', {
            state: 'NOT',
            banState: 'NOT',
            selectChampion: "",
            banChampion: "",
            phase: "NOT",
            origin: "EXIT",
            primary: "",
            secondary: ""
        });
        this.emit('log', `Action: You have exited champion select.`);
    }

}

module.exports = Application;