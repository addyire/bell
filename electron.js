var { menubar } = require('menubar')
var setupManager = require('./modules/sm')
var {app, ipcMain, nativeTheme, shell, BrowserWindow} = require('electron')
var classParser = require('./modules/parser')
var textInBar = require('./modules/newmenutext')

var os = require("os").platform();

function startApp() {

    let setup = setupManager.readData()

    if(!setup.success) return;
    setup = setup.data

    var mb = menubar({
        browserWindow: {
            width: 700,
            height: 500,
            webPreferences: {
                nodeIntegration: true
            },
            skipTaskbar: true
        },
        icon: setupManager.ICON_PATH,
        index: setupManager.INDEX_PATH
    })

    mb.on("show", () => {

        mb.window.webContents.send("dark", nativeTheme.shouldUseDarkColors)

        if(os === "darwin") {

            mb.app.dock.hide()

        }

    })

    mb.on("ready", () => {

        if(setup.options.textInBar) {textInBar(mb)}

    })

    ipcMain.on("updateData", (event, d) => {
        messageData = classParser(setup.blocks, setup.lang);
      
        event.returnValue = messageData;
    });


    ipcMain.on("resize", (event, data) => {
        width = parseInt(data.x);
        height = parseInt(data.y);
    
        winPad = 20;
    
        height += winPad * 2;
        width += winPad * 2;
    
        mb.window.setSize(width, height);
    });

    ipcMain.on("url", (event, data) => {
        shell.openExternal(data);
    });
}

class inputWindow {

    constructor(data, hint) {

        this.window = new BrowserWindow({
            width: 1000,
            height: 800,
            webPreferences: {
                nodeIntegration: true
            }
        })

        this.window.loadURL(setupManager.INPUT_PATH)
        this.window.webContents.openDevTools()

        this.window.webContents.once('did-finish-load', () => {

            this.window.webContents.send("dark", nativeTheme.shouldUseDarkColors)

        })

        ipcMain.on("save", (e, data) => {

            this.dataReturned(e, data)

        })

    }

    giveData(data, hint) {

        console.log('data recieved')

        this.window.webContents.once("did-finish-load", () => {
            console.log('done loading')

            this.window.webContents.send("data", data)
            this.window.webContents.send("hint", hint)

        })
    }

    onceReturned(callback) {

        this.callback = callback

    }

    dataReturned(e, data) {

        this.window.close()

        this.callback(data)

    }

}

function restartApp() {

    //Just quit for dev
    //app.relaunch()
    app.exit()

}

module.exports = {

    inputWindow: inputWindow,
    electronApp: app,
    restartApp: restartApp,
    startApp: startApp

}