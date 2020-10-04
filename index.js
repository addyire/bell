var { menubar } = require('menubar')
var {ipcMain, nativeTheme, dialog} = require('electron')

var classParser = require('./modules/parser')
var manager = require('./modules/filemanager.js')
var menuText = require('./modules/menutext')

var AutoLaunch = require('auto-launch')
var os = require('os')
var path = require('path')

const mb = menubar({
    browserWindow: {
        width: 700,
        height: 500,
        webPreferences: {
            nodeIntegration: true
        }
    },
    icon: manager.iconPath,
    index: manager.indexFile
})

mb.on('show', () => {

    mb.window.webContents.send('dark', nativeTheme.shouldUseDarkColors)

    mb.app.dock.hide()

})


mb.on('ready', () => {
    
    if(manager.hasSettings()) {

        settings = manager.getSettings().options

        if(settings.textInBar) {

            menuText.start(mb)

        }

        /*
        if(settings.autoStart) {

            var bellAutoLaunch = new AutoLaunch({
                name: "Bell",
                path: process.execPath
            })

            bellAutoLaunch.isEnabled().then(isEnabled => {

                if(isEnabled) return;

                bellAutoLaunch.enable()

            }).catch(err => {
                console.error(err)
            })

        }*/

    } else {

        mb.app.show()
        askForOptions()

    }

})



//Window Updates
ipcMain.on('updateData', (event, data) => {

    classes = manager.getSettings()

    if(classes) {
        messageData = classParser(classes)
    } else {
        messageData = undefined
    }
    

    event.returnValue = messageData

})

ipcMain.on('resize', (event, data) => {

    options = manager.getSettings()

    if(!options) return;

    width = parseInt(data.x)
    height = parseInt(data.y)

    winPad = options.options.windowPadding

    height += winPad*2
    width += winPad*2

    mb.window.setSize(width, height)

})

function askForOptions() {

    var settingsPath = dialog.showOpenDialogSync({
        title: "Open Your Data File",
        defaultPath: "~/Downloads",
        properties: ['openFile'],
        filters: [{
            extensions: ['.json']
        }]
    })

    if(settingsPath) {

        var result = manager.loadSettings(settingsPath[0])

        if(result.success) {    

            mb.window.reload()

        } else {

            console.log(result)
            mb.window.hide()

        }

    } else {

        console.log('no file', settingsPath)

        mb.window.hide()

    }

    

}