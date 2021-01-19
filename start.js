var setupManager = require("./modules/sm")
var electron = require('./electron')

var setupSummary = setupManager.getSummary()

console.log(setupSummary)

if(setupSummary.code == "continue") {

    electron.startApp()

} else if(setupSummary.code == "openInput") {

    electron.electronApp.on('ready', () => {

        var input = new electron.inputWindow()

        if(setupSummary.data || setupSummary.hint) {

            input.giveData(setupSummary.data, setupSummary.hint)

        }

        input.onceReturned((data) => {
    
            //Write data and restart 
            setupManager.saveData(data)

            electron.restartApp()
    
        })

    })

}