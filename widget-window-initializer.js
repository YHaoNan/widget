const { BrowserWindow,screen, dialog } = require('electron')
const utils = require('./utils')

let whpad = 4 // 如果全屏则会无法设置透明，具体原因未知，这个数是小控件容器宽高都要分别减去的一个数，最小可工作整数是3
let widgetContainerWindow = null    // 不要求永远在顶层的控件会被分配到这个窗口上
let widgetContainerWindowAWT = null // 永远在顶层的控件会被分配到这个窗口上
// 出于稳定性考虑，应该加上两个判断是否webContants已经加载完毕的代码，但考虑未加载完毕也不会发生什么，暂不实现
// let widgetContainerWindowLoaded = false
// let widgetContainerWindowAWTLoaded = false

function createWidgetContainerWindow(config) {
    let window = null
    window = new BrowserWindow(config)
    window.setIgnoreMouseEvents(true, { forward: true })
    window.loadFile('./ui/widget_container_layout.html')
    window.setSkipTaskbar(true)
    return window
}

module.exports = function (app, eventBus, widgetLoader) {
    let screenWH = [screen.getPrimaryDisplay().workAreaSize.width-whpad,screen.getPrimaryDisplay().workAreaSize.height-whpad]
    let windowConfig = {
        width: screenWH[0],
        height: screenWH[1],
        fullscreen: false,
        frame: false,
        titleBarStyle: 'hidden',
        transparent: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    }
    eventBus.on('open-widget-container', () => {
        widgetContainerWindow = createWidgetContainerWindow(windowConfig)
        let awtConfig = { alwaysOnTop: true }
        Object.assign(awtConfig, windowConfig)
        widgetContainerWindowAWT = createWidgetContainerWindow(awtConfig)
    })
    eventBus.on("close-widget-container", () => {
        if (widgetContainerWindow){
            widgetContainerWindow.close()
            widgetContainerWindow = null;
        }
        if (widgetContainerWindowAWT){
            widgetContainerWindowAWT.close()
            widgetContainerWindowAWT = null;
        }
    })
    eventBus.on("widget-card-clicked", (e, widget_id) => {
        if (widgetContainerWindow && widgetContainerWindowAWT){
            let widget = widgetLoader.widgetMap[widget_id]
            let targetWindow = widget['config']['alwaysOnTop'] ? widgetContainerWindowAWT : widgetContainerWindow;
            widget['showing'] = !widget['showing']
            console.log("main thread, widget-card-clicked, widget: " + widget['id'])
                if(widget['showing'])
                    targetWindow.webContents.send('show-widget-to-container', widget)
                else
                    targetWindow.webContents.send('remove-widget-to-container', widget)
            console.log("main thread, widget-card-clicked, widget: " + widget['id'])
        }else{
            dialog.showErrorBox("Emmm...","You must select the `Open Widgets` before you add a widget to the screen.")
        }
    })
}