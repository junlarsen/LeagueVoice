class Exceptions {

    debug(data) {
        if (typeof data == "string") {
            try {
                data = JSON.parse(data);
            } catch (e) {
                return data;
            }

        }
        if (data.message) {

            //console.log(data.message)
            return this.verbose(data.message);
        } else {
            return false;
        }
    }

    /**
     * Get a more verbose and generic name
     * for a LCU error
     * @param data
     * @returns {*}
     */
    verbose(data) {
        if (typeof data == "string" ) {
            // TODO: Add more aliases
            //  and change the function name
            switch (data) {
                case "No active delegate":
                    return "You are currently not in an active champion select.";
                case "You are not logged in.":
                    return "You need to be logged into the League Client.";
                default:
                    return data;
            }
        } else {
            return null;
        }
    }
}

module.exports = Exceptions;