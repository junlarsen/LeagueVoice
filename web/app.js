const { app, BrowserWindow } = require('electron');

let frame;

const create = () => {
    frame = new BrowserWindow({ width: 800, height: 600, title: "League Voice" });
    frame.loadFile('./web/index.html');

    frame.setMenu(null);
    frame.on('closed', () => {
        frame = null;
    })
};

app.on('ready', create);

app.on('window-all-closed', () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on('activate', () => {
    if (frame === null) {
        create();
    }
});