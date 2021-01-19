var setup = require('./modules/setupmanager')

var ready = setup.ready()

if(ready) {

    require('./src')

} else {

    var {app, dialog} = require('electron')

    app.on('ready', () => {

        getSettingsPath(app)

    })

}

function getSettingsPath(app) {

    var settingsPath = dialog.showOpenDialogSync({
        title: 'Open Your Data File',
        defaultPath: '~/Downloads',
        properties: ['openFile'],
        filters: [{
          extensions: ['.json']
        }]
    })

    if(settingsPath) {

        var result = setup.storeSettings(settingsPath[0])

        if(result.success) {

            app.relaunch()
            app.quit()

        } else {

            option = fileError(dialog, result)

            if(option == 0) {
                getSettingsPath(app)
            } else {
                app.quit()
            }
        }

    } else {

        app.quit()

    }

}

function fileError(dialog, result) {

    var selection = dialog.showMessageBoxSync({
        title: "Error!",
        type: "error",
        buttons: ["Retry", "Close"],
        defaultId: 0,
        title: "Options Error",
        message: result.message
    })

    return selection

}