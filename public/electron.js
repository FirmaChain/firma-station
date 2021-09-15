const { app, BrowserWindow } = require("electron");

function initialize() {
  function createWindow() {
    const windowOptions = {
      width: 1600,
      height: 900,
      title: app.getName(),
    };
    mainWindow = new BrowserWindow(windowOptions);
    mainWindow.setMenu(null);
    mainWindow.loadURL("http://localhost:3001");

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
