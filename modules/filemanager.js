var fs = require('fs')
var path = require('path')
var {app} = require('electron')

const DATA_PATH = path.join(app.getPath('userData'), 'data.json')
var dataExists = fs.existsSync(DATA_PATH)

console.log(DATA_PATH)

var settings = undefined

var indexPath = 'file://' + path.join(__dirname, '..', 'views', 'index.html')
var iconPath = path.join(__dirname,'..', 'icons', 'smallicon@3x.png')

if(dataExists) {
    settings = tryToOpen(DATA_PATH)
}

module.exports.hasSettings = () => {return fs.existsSync(DATA_PATH)}

module.exports.getSettings = () => {return tryToOpen(DATA_PATH)}

module.exports.indexFile = indexPath
module.exports.iconPath = iconPath

module.exports.loadSettings = function(path) {

    console.log(path)

    if(!fs.existsSync(path)) return {
        message: 'File Doesnt Exist',
        success: false
    }

    var data = tryToOpen(path)

    if(!data) return {
        message: 'Corrupted settings or wrong file',
        success: false
    }

    saveSettings(data)

    return {success: true}

}

function saveSettings(settings) {

    fs.writeFileSync(DATA_PATH, JSON.stringify(settings))

}

function tryToOpen(path) {

    try{
        fileData = fs.readFileSync(path)

        fileData = JSON.parse(fileData)

        return fileData

    }catch(err) {

        return undefined

    }

}