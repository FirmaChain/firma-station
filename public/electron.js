const { app, BrowserWindow, shell } = require("electron");
const electron = require("electron");
const path = require("path");

function initialize() {
  function createWindow() {
    const size = electron.screen.getPrimaryDisplay().workAreaSize;
    const originWidth = size.width;
    const width = originWidth > 1080 ? parseInt(1080 + (originWidth - 1080) * 0.5) : originWidth;
    const height = parseInt(width / (1920 / 1080));

    const windowOptions = {
      minWidth: width,
      minHeight: height,
      width: width,
      height: height,
      title: app.getName(),
      titleBarStyle: "hiddenInset",
      webPreferences: {
        nodeIntegration: false,
        enableRemoteModule: false,
        nativeWindowOpen: true,
        preload: path.resolve(__dirname, "preload.js"),
      },
      resizable: true,
    };
    mainWindow = new BrowserWindow(windowOptions);
    mainWindow.setMenu(null);
    mainWindow.loadURL("http://localhost:3000");

    mainWindow.once("ready-to-show", () => {
      mainWindow.show();
    });

    mainWindow.on("closed", () => {
      mainWindow = null;
    });
    mainWindow.on("will-resize", (event) => {
      event.preventDefault();
    });
  }

  app.on("ready", createWindow);

  app.on("window-all-closed", function () {
    app.quit();
  });
}

initialize();
