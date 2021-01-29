const {app,ipcMain,screen,BrowserWindow} = require('electron')
const addTray = require('./tray')
const initIndexWindow = require('./index-window-initializer')
const initWidgetWindow = require('./widget-window-initializer')
const {initErrorReporter,crash} = require('./error_reporter')
const widgetLoader = require('./widget-loader')
const reloader = require('electron-reload')

reloader(__dirname)

app.on('ready',()=>{
    initErrorReporter(app)
    let mainWindow = initIndexWindow(app,ipcMain)
    mainWindow.webContents.on("did-finish-load",()=>{
      widgetLoader.loadWidgets(mainWindow)
      initWidgetWindow(app,ipcMain,widgetLoader)
      addTray(app,mainWindow)
    })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})