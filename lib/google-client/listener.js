const Events = require('events');
const firebase = require('firebase');
const Summoner = require('./../lcu-client/summoner/summoner');
const request = require('request');
require('firebase/auth');
require('firebase/firestore');

firebase.initializeApp({
    apiKey: 'AIzaSyBKu9WdVHaxJn4UPUoqzvLBdS1CGGPwh_k',
    authDomain: 'leagueassistant-d385f.firebaseapp.com',
    projectId: 'leagueassistant-d385f'
});

class Observer extends Events {
    constructor() {
        super();
    }
}

class Listener extends Events {
    /**
     * Set up event emitter and firebase
     *
     * @param requester
     */
    constructor(requester) {
        super();
        this.summoner = new Summoner(requester);
        this.db = firebase.firestore();
        this.db.settings({
            timestampsInSnapshots: true
        });
        this.observers = [];
    }


    /**
     * Retrieve the summoner data
     *
     * @returns {Promise<any>}
     */
    retrieve() {
        return new Promise(async (resolve, reject) => {
            this.summoner.getSummoner()
                .then(data => {
                    resolve(data);
                }).catch(data => {
                reject(data);
            })
        })
    }

    /**
     * Retrieve the CustomToken based on PUUID
     *
     * @returns {Promise<any>}
     */
    signin() {
        return new Promise(async (resolve, reject) => {
            try {
                let summoner = await this.retrieve();
                if (summoner.puuid) {
                    let params = {
                        url: 'https://us-central1-leagueassistant-d385f.cloudfunctions.net/retrieveCustomToken',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({puuid: summoner.puuid})
                    };
                    request(params, (err, res, items) => {
                        items = JSON.parse(items);
                        if (items.Result) {
                            resolve(items);
                        } else {
                            reject(items);
                        }
                    })
                }
            } catch (e) {
                reject(e);
            }
        })
    }

    /**
     * Listen for changes in document
     *
     * @returns {Promise<any>}
     */
    listen(collection, doc, callback) {
        return new Promise((resolve, reject) => {
            this.signin().then(creds => {
                firebase.auth().signInWithCustomToken(creds.CustomToken)
                    .then(() => {
                        let ob = new Observer();
                        ob.evt = this.db.collection('linkedAccounts').doc(firebase.auth().currentUser.uid)
                            .collection(collection).doc(doc)
                            .onSnapshot(document => {
                                ob.emit(`rcv-${collection.toLowerCase()}-${doc.toLowerCase()}`, document);
                            });
                        resolve(true)
                        callback(ob);
                    })
            }).catch(() => {
                callback(false);
            })
        })
    }

    /**
     * Get a document
     * 
     * @param collection
     * @param document
     * @returns {Promise<any>}
     */
    get(collection, document) {
        return new Promise(async (resolve, reject) => {
            this.signin().then(credentials => {
                firebase.auth().signInWithCustomToken(credentials.CustomToken)
                    .then(() => {
                        let ref = this.db
                            .collection('linkedAccounts')
                            .doc(firebase.auth().currentUser.uid)
                            .collection(collection)
                            .doc(document);
                        ref.get().then(doc => {
                            if (doc.exists) {
                                resolve(doc.data())
                            } else {
                                reject(false);
                            }
                        })
                    })
            })
        })
    }

    /**
     * Update a collection for the google
     * assistant to recieve
     *
     * @param collection
     * @param document
     * @param metadata
     * @param callback
     * @returns {Promise<any>}
     */
    update(collection, document, metadata, callback) {
        return new Promise(async (resolve, reject) => {
            // Get creds
            this.signin().then(credentials => {
                firebase.auth().signInWithCustomToken(credentials.CustomToken)
                    .then(() => {
                        // Write to collection
                        let ref = this.db
                            .collection('linkedAccounts')
                            .doc(firebase.auth().currentUser.uid)
                            .collection(collection)
                            .doc(document);
                        ref.get().then(doc => {
                            if (doc.exists) {
                                ref.update(metadata)
                                    .then(resolve)
                                    .catch(reject)
                                this.emit('document-update', {doc: document, col: collection, data: metadata})
                            } else {
                                ref.set(metadata)
                                    .then(resolve)
                                    .catch(reject)
                                this.emit('document-set', {doc: document, col: collection, data: metadata})
                            }
                        })
                    }).catch(reject)
            }).catch(reject)

        })
    }

}

module.exports = Listener;