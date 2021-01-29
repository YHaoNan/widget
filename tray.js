const {Tray,Menu} = require('electron')

module.exports = function(app,bindWindow){
    if(process.platform === 'win32'){
        var trayMenuTemplate = [
            {
                label: "Exit",
                click: ()=>{
                    app.quit()
                }
            }
        ]

        var trayContextMenu = Menu.buildFromTemplate(trayMenuTemplate)

        const appTray = new Tray('./assets/icon/tray.ico')

        appTray.setToolTip("Widget Tray")
        appTray.setContextMenu(trayContextMenu)
        appTray.on('click',()=>{
            bindWindow.show()
        })
        appTray.on('right-click', () => {
            appTray.popUpContextMenu(trayMenuTemplate);
        });
    }
}
