var parser = require('./parser')
var manager = require('./filemanager')

var moment = require('moment')

var disableClock = false
var options = undefined

try{

    if(options.clockTimer) {

        var CLOCK_INTERVAL = options.clockTimer

    }

} catch(err) {
    var CLOCK_INTERVAL = 60*1000
}

module.exports.start = (mb, specialSettings) => {

    var data = manager.getSettings()
    options = data.options

    if(!data) return;

    disableClock = false

    timer(mb)

}

module.exports.stop = () => {

    disableClock = true
    
}

function timer(mb) {

    var displayData = parser(manager.getSettings())

    console.log(displayData)

    if(displayData) {

        var actualInterval = CLOCK_INTERVAL //Refresh every minute

        if(displayData.special) {

            if(options.barShowNothingForSpecial) {

                mb.tray.setTitle("")

            } else {

                mb.tray.setTitle(displayData.current)

            }

        } else if(displayData.end && !displayData.special) {

            difference = moment(displayData.end).diff(moment().subtract(1, 'minute'))

            var actualInterval = (parseInt(moment.utc(difference).format('ss'))*1000) + 3000 //Add 3 second buffer

            console.log(actualInterval, '2', displayData.special)

            mb.tray.setTitle(moment.utc(difference).format('HH:mm'))

        }

    }

    if(!disableClock) setTimeout(() => {
        timer(mb)
    }, actualInterval)

}