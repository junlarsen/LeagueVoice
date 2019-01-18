const lcuConnector = require('lcu-connector');
const connector = new lcuConnector();
const request = require('request');
const debug = require('../common/exceptions');

class LcuRequester {
    constructor() {
        this.error = new debug();
    }

    /**
     * Get the authentication credentials from lockfile.
     *
     * @returns {Promise<*>}
     */
    async getAuth() {
        return new Promise((resolve, reject) => {
            connector.on('connect', data => {
                resolve(data);
            });
            connector.start();
        });
    };

    /**
     * Get the authentication credentials or get them if they
     * have not already been pulled.
     *
     * @returns {Promise<*>}
     */
    async auth() {
        return new Promise(async (resolve, reject) => {
            if (typeof this.creds !== "undefined") {
                resolve(this.creds);
            } else {
                await this.start();
                resolve(this.creds);
            }
        })
    }

    /**
     * Get the credentials
     *
     * @returns {Promise<*>}
     */
    async start() {
        let cred = await this.getAuth();
        this.creds = cred;
        return cred;
    }

    /**
     * Send a request to the LCU API
     *
     * @param options
     * @returns {Promise<*>}
     */
    request(options) {
        return new Promise(async (resolve, reject) => {
            // Get credentials
            this.auth().then(cred => {
                // Set up request params
                let params = {
                    url: `${cred.protocol}://127.0.0.1:${cred.port}${options.url}`,
                    method: options.method,
                    body: typeof options.body !== "undefined" ? options.body : null,
                    headers: {
                        Accept: "application/json",
                        Authorization: "Basic " + Buffer.from(`riot:${cred.password}`).toString("base64")
                    },
                    rejectUnauthorized: false
                };
                // Make request
                request(params, (err, res, items) => {
                    // Reject any request errors
                    if (err) {
                        reject(err)
                    } else {
                        // If debug check returns true reject with it
                        
                        if (this.error.debug(items)) {
                            console.log(this.error.debug(items));
                        } else {
                            // If there was 204 no content return true
                            if (items.length === 0) {
                                resolve(true);
                            } else {
                                // Else return a parsed json object
                                resolve(JSON.parse(items));
                            }
                        }
                    }
                })
            })
        })
    }
}

module.exports = LcuRequester;
