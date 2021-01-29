const {BrowserWindow} = require('electron')

let indexWindow = null

module.exports = function(app,eventBus){
    indexWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        frame: false,
        titleBarStyle: 'hidden',
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    })

    indexWindow.loadFile("./ui/main.html")
    eventBus.on('minimize-to-system-tray',()=>{
        indexWindow.hide()
    })
    eventBus.on('minimize',()=>{
        indexWindow.minimize()
    })
    eventBus.on('maximize',()=>{
        if(indexWindow.isMaximized()){
            indexWindow.restore()
        }else{
            indexWindow.maximize()
        }
    })
    return indexWindow
}