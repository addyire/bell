var { menubar } = require("menubar");
var { ipcMain, nativeTheme, shell } = require("electron");

var classParser = require("./modules/parser");
var setup = require("./modules/setupmanager.js");
var menuText = require("./modules/menutext");

setup.init();

var AutoLaunch = require("auto-launch");
var os = require("os").platform();

console.log(setup.settings());

const mb = menubar({
  browserWindow: {
    width: 700,
    height: 500,
    webPreferences: {
      nodeIntegration: true,
    },
    skipTaskbar: true,
  },
  icon: setup.iconPath,
  index: setup.indexFile,
});

mb.on("show", () => {
  mb.window.webContents.send("dark", nativeTheme.shouldUseDarkColors);

  // mb.window.webContents.openDevTools()

  if (os === "darwin") {
    mb.app.dock.hide();
  }
});

mb.on("ready", () => {
  if (setup.settings().textInBar) {
    menuText.start(mb);
  }

  if (setup.settings().autoStart) {
    var bellAutoLaunch = new AutoLaunch({
      name: "Bell",
      path: process.execPath,
    });

    bellAutoLaunch
      .isEnabled()
      .then((isEnabled) => {
        if (isEnabled) return;

        bellAutoLaunch.enable();
      })
      .catch((err) => {
        console.error(err);
      });
  }
});

// Window Updates
ipcMain.on("updateData", (event, data) => {
  messageData = classParser(setup.classes(), setup.lang());

  event.returnValue = messageData;
});

ipcMain.on("resize", (event, data) => {
  width = parseInt(data.x);
  height = parseInt(data.y);

  winPad = setup.settings().windowPadding;

  height += winPad * 2;
  width += winPad * 2;

  mb.window.setSize(width, height);
});

ipcMain.on("url", (event, data) => {
  shell.openExternal(data);
});

/*
function askForOptions () {
  var settingsPath = dialog.showOpenDialogSync({
    title: 'Open Your Data File',
    defaultPath: '~/Downloads',
    properties: ['openFile'],
    filters: [{
      extensions: ['.json']
    }]
  })

  if (settingsPath) {
    var result = manager.loadSettings(settingsPath[0])

    if (result.success && mb.window) {
      mb.window.reload()
    } else if(mb.window) {
      console.log(result)
      mb.window.hide()
    }
  } else {
    console.log('no file', settingsPath)

    if(mb.window) {
      mb.window.hide()
    }
  }
} */
