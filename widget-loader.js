const fs = require('fs')
const path = require('path')
const { crash, error } = require('./error_reporter')

const widgetMap = {}

let builtin_widgets_path = './builtin_widgets'

function readFile(filepath) {
    try {
        let string = fs.readFileSync(filepath)
        return string
    } catch (e) {
        error("An widget load faild", filepath + " load faild\nCause: " + e.name + "," + e.message)
    }
    return null
}
function access(filepath, checkCode) {
    try {
        fs.accessSync(filepath, checkCode)
        return true
    } catch (e) {
        error("An widget load faild", filepath + " load faild\nCause: " + e.name + "," + e.message)
    }
    return false
}

module.exports = {
    loadWidgets: function (mainUI) {
        // read built-in widget
        fs.readdir(builtin_widgets_path, (err, files) => {
            if (err) {
                crash(err, true)
                return
            }
            files.forEach((v, i) => {
                let widget_path = path.resolve(builtin_widgets_path, v)
                let config_path = path.resolve(widget_path, 'config.json')
                let settings_path = path.resolve(widget_path, 'settings.json')
                let entry_path = path.resolve(widget_path, 'widget.html')
                let avater_path = path.resolve(widget_path, 'avater.jpg')

                if (!(access(widget_path, fs.constants.R_OK) && access(config_path, fs.constants.R_OK) &&
                    access(settings_path, fs.constants.R_OK | fs.constants.W_OK) && access(entry_path, fs.constants.R_OK) &&
                    access(avater_path, fs.constants.R_OK))) return


                let widgetObj = {
                    id: v,
                    showing: false,
                    path: widget_path,
                    avater: avater_path,
                    entry: entry_path
                }
                let configstring = readFile(config_path)
                let settingsstring = readFile(settings_path)

                try{
                    widgetObj['config'] = JSON.parse(configstring)
                    widgetObj['settings'] = JSON.parse(settingsstring)
                }catch(e){
                    error("An widget load faild", widget_path + " load faild\nCause: " + e.name + "," + e.message)
                    return 
                }

                widgetMap[v] = widgetObj
                mainUI.webContents.send('add-widget-to-ui',widgetMap[v])
            })
        })
    },
    modifySettings: function(widgetId,settingId,value){
        let settings = widgetMap[widgetId]['settings']
        settings.forEach((v,i)=>{
            if(v['id'] == settingId){
                v['value'] = value
            }
        })
    },
    applySettingsModify: function(widgetId){
        // 1. applySettings用于在控件设置界面设置完成后点击应用更改时执行的动作
        // 2. applySettings会回写设置到磁盘中
        // 3. 最后会发送event给对应的控件实体
    },
    widgetMap: widgetMap
}
