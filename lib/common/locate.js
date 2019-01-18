const { exec } = require('child_process');

/**
 * Get the League process if it is running
 *
 * @returns {Promise<*>}
 */
const locate = async () => {
    return new Promise((resolve, reject) => {
        exec('WMIC PROCESS get Caption,Commandline', {maxBuffer: 1024 * 4096}, (err, stdout, stderr) => {
            // Reject any error
            if (err) {
                reject(err);
                return;
            }
            // Split lines
            let lines = stdout.split('\n');
            // Locate the LeagueClientUx.exe process
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].includes('LeagueClientUx.exe')) {
                    resolve(lines[i]);
                    return;
                }
            }
            resolve(false);
        });
    });
};

module.exports = locate;