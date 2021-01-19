var fs = require('fs')
var path = require('path')
var os = require('os')
var app = require('electron')

const DATA_PATH = "./data.json"// path.join(app.getPath('userData'), 'data.json')
const INDEX_PATH = 'file://' + path.join(__dirname, '..', 'views', 'index.html')
const INPUT_PATH = 'file://' + path.join(__dirname, '..', 'views', 'input.html')
const ICON_PATH = path.join(__dirname,'..', 'icons', 'iconTemplate@3x.png')

const CLASS_ITEMS = ["start", "end", "name"]
const LANG_ITEMS = ["beforeSchool", "noClassesLeft", "passingPeriod", "noSchool"]
const OPTIONS_ITEMS = ["textInBar", "audibleDing", "barShowNothingForSpecial", "autoStart"]
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const SYS_OS = os.platform()

//console.log(verifySettings(require('../data.json')))

function readData() {

    var returnValue

    try{

        var text = fs.readFileSync(DATA_PATH)

        text = JSON.parse(text)

        returnValue = {
            "success": true,
            "data": text,
            "message": "Successfully read data"
        }

    } catch(err) {

        returnValue = {
            "success": false,
            "data": err,
            "message": "Failed to parse or open data"
        }

    }

    return returnValue

}

function hasData() {

    return fs.existsSync(DATA_PATH)

}

function verifySettings(settingsJSON) {

    if(!settingsJSON) return {
        "message": "Settings file is corrupt",
        "success": false
    }

    //Define some values
    var classes = settingsJSON.blocks
    var options = settingsJSON.options
    var lang = settingsJSON.lang

    console.log(classes, options, lang)

    ///CHECK CLASSES

    //For each day...
    for(var day in DAYS) {

        //Get items of the day
        var items = classes[day]
        //Define the day in english
        var day = DAYS[day]

        //If the day has no items continue
        if(!items) continue;

        //For each class in the day...
        for(var classs in items) {

            //For each object of the class...
            for(var item of CLASS_ITEMS) {

                //Store the value of the field
                var value = items[classs][item]

                //If value has no value then something is wrong
                if(!value) {
                    
                    return {
                        "message": `Theres no "${item}" value on ${day}`,
                        "success": false
                    }

                //If the field is start or end...
                } else if(item == "start" || item == "end") {

                    var valid = validTime(value)

                    if(valid) continue;

                    return {
                        "message": `The ${item} time on ${day} is not valid`,
                        "success": false
                    }

                }

            }

        }

    }

    //CHECK LANG VALUE

    if(!lang) return {
        "message": "You have not defined any language items",
        "success": false
    }

    for(var langItem in LANG_ITEMS) {

        var langKey = LANG_ITEMS[langItem]
        var langValue = lang[langKey]

        if(typeof langValue == "undefined") return {
            "message": `You are missing the ${langKey} value in your language items`,
            "success": false
        }

    }

    //CHECK OPTIONS

    if(typeof options == "undefined") return {
        "message": "You have no options in your configuration file",
        "success": false
    }

    for(var optionItem in OPTIONS_ITEMS) {

        var optionKey = OPTIONS_ITEMS[optionItem]
        var optionValue = options[optionKey]

        if(typeof optionValue == "undefined") {

            return {
                "message": `You are missing ${optionKey} in your options`,
                "success": false
            }

        } else if(typeof optionValue != "boolean") {

            return {
                "message": `Your ${optionKey} in options is not a boolean value`,
                "success": false
            }

        }

    }

    return {
        "message": "All settings valid!",
        "success": true
    }

}

function validTime(time) {

    var [h, m] = time.split(':')

    if(typeof h == 'undefined' || typeof m == 'undefined') return false

    var h = parseInt(h)
    var m = parseInt(m)

    if(isNaN(h) || isNaN(m)) return false
    if(h > 23 || m > 59) return false

    return true

}

function summary() {

    var dataFound = hasData()

    if(!dataFound) return {
        "code": "openInput",
        "data": undefined
    }

    var data = readData()

    console.log(data)

    if(!data.success) {
        
        deleteData()

    }

    var validConfig = verifySettings(data.data)

    if(!validConfig.success) return {
        "code": "openInput",
        "data": data.data,
        "hint": validConfig.message
    }

    return {
        "code": "continue",
        "data": data
    }


}

function deleteData() {

    fs.unlinkSync(DATA_PATH)

}

function saveData(data) {

    var stringData = JSON.stringify(data)

    fs.writeFileSync(DATA_PATH, stringData)

}

module.exports = {

    hasData: hasData,

    readData: readData,

    validateSettings: verifySettings,

    getSummary: summary,

    saveData: saveData,

    INDEX_PATH: INDEX_PATH,
    INPUT_PATH: INPUT_PATH,
    ICON_PATH: ICON_PATH,
    OS: SYS_OS

}
