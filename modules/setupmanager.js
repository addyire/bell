var fs = require('fs')
var path = require('path')
var {app} = require('electron')

const DATA_PATH = path.join(app.getPath('userData'), 'data.json')
const INDEX_PATH = 'file://' + path.join(__dirname, '..', 'views', 'index.html')
const ICON_PATH = path.join(__dirname,'..', 'icons', 'iconTemplate@3x.png')

var settings = undefined

console.log(DATA_PATH)

//Exists if: file exists, file is right

//Opening settings file
//Check file
//give error if bad
//save to local storage
//start actual program


const DEFAULT_OPTIONS = {
    "textInBar": true,
    "audibleDing": false,
    "barShowNothingForSpecial": true,
    "autoStart": true,
    "windowPadding": 20
}

const DEFAULT_LANG = {
    "beforeSchool": "😴 Before School 😴",
    "noClassesLeft": "🎉 Nothing Left 🎉",
    "passingPeriod": "🔔 Passing Period 🔔",
    "noSchool": "🎉 No School! 🎉"
}

module.exports = {

    indexFile: INDEX_PATH,
    iconPath: ICON_PATH,

    ready: () => {

        console.log(settingsExists())

        if(!settingsExists()) return false;

        rawData = read(DATA_PATH)

        return trySettings(rawData)

    },

    storeSettings: (loadFilePath) => {

        rawData = read(loadFilePath)

        valid = trySettings(rawData)

        if(valid.success) {

            storeToLocal(rawData)

        }

        return valid

    },

    init: () => {

        loadSettings()

    },

    settings: () => {return settings.options},
    classes: () => {return settings.blocks},
    lang: () => {return settings.lang},
    all: settings

}

function storeToLocal(data) {

    //Add exception for this

    fs.writeFileSync(DATA_PATH, data)

}

function settingsExists() {

    return fs.existsSync(DATA_PATH)

}

function read(path) {

    data = fs.readFileSync(path, "utf8")

    return data
    
}

function loadSettings() {

    rawData = read(DATA_PATH)

    console.log(rawData)

    parsed = JSON.parse(rawData)

    if(!parsed.lang || Object.keys(parsed.lang) != Object.keys(DEFAULT_LANG)) {

        parsed.lang = DEFAULT_LANG

    }

    if(!parsed.options || Object.keys(parsed.options) != Object.keys(DEFAULT_OPTIONS)) {

        parsed.options = DEFAULT_OPTIONS

    }

    settings = parsed

}

function trySettings(dataAsString) {

    var parsedData = undefined
    var result = {
        message: "Success!",
        success: true,
    }

    console.log(dataAsString)

    try {

        parsedData = JSON.parse(dataAsString)

    }catch(err) {

        console.log(err, "invalid")
        result.message = "JSON is invalid"
        result.success = false

    }

    return result

    //Check Classes

}