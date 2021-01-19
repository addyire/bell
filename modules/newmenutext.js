var parser = require('./parser')
var setup = require('./sm')

var moment = require('moment')

const OPTIONS = setup.readData().data
const CLOCK_INTERVAL = 60 * 1000 //Refresh every minute
var disableClock = false

module.exports = (mb) => {

    

    timer(mb)

}


function timer(mb) {

    var displayData = parser(OPTIONS.blocks, OPTIONS.lang)

    console.log(displayData)

    if(displayData) {

        var actualInterval = CLOCK_INTERVAL //Refresh every minute

        if(displayData.special) {

            if(OPTIONS.options.barShowNothingForSpecial) {

                mb.tray.setTitle("")

            } else {

                mb.tray.setTitle(displayData.current)

            }

        } else if(displayData.end) {

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