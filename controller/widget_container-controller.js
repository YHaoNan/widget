const electron = require('electron')
const ipcRenderer = electron.ipcRenderer
const win = electron.remote.getCurrentWindow()
const utils = require('../utils')
const path = require('path')
const { off } = require('process')
const { normalize } = require('../utils')

jQuery(()=>{
    let widgets = $(".widget-body")
    let screenWH = [$("#widget-container").width(),$("#widget-container").height()]
    widgets.mouseenter(()=>{
        win.setIgnoreMouseEvents(false)
    })
    widgets.mouseleave(()=>{
        win.setIgnoreMouseEvents(true,{forward: true})
    })

    ipcRenderer.on("receive-notification",(e,notification)=>{
        
    })

    ipcRenderer.on("show-widget-to-container",(e,widget)=>{
        // 创建widget的iframe
        let widgetFrame = $('<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" allowTransparency="true" class="widget-entity" src="'+widget['entry']+'" id="'+widget['id']+'"></iframe>')
        // 添加到窗体中，使得后面的逻辑能够执行
        $("#widget-container").append(widgetFrame)
        let widgetWH = [widgetFrame.width(),widgetFrame.height()]
        let position2D = utils.normalize(widget['config']['position'],widgetWH,screenWH)
        console.log(position2D[0],position2D[1],widgetWH[0],widgetWH[1])
        let widgetElem = $("#"+widget['id'])
        widgetElem.on("load",()=>{
            // 确定位置，确定插件的一些信息
            widgetFrame.css({
                left: position2D[0],
                top: position2D[1],
                width: widgetWH[0],
                height: widgetWH[1]
            })
            // 如果widget被指定了focusable，添加对应的mouse event
            if(widget['config']['focusable']){
                widgetElem.mouseenter(()=>{
                    win.setIgnoreMouseEvents(false)
                })
                widgetElem.mouseleave(()=>{
                    win.setIgnoreMouseEvents(true,{forward: true})
                })
            }
            // // 如果widget被指定了dragable，添加对应的拖动事件
            // if(widget['config']['dragable']){
            //     let mousedowned = false
            //     widgetElem.contents().find("html").children().on({
            //         mouseover (e){e.stopPropagation()},
            //     })
            //     widgetElem.contents().find("html").on({
            //         mousedown:function(e){
            //             console.log("mousedown")
            //             mousedowned = true
            //         },
            //         mouseup: function(e){
            //             console.log("mouseup")
            //             mousedowned = false
            //         },
            //         mouseover: function(e){
            //             console.log(mousedowned,e.pageX,e.pageY,e.clientX,e.clientY)
            //             if(mousedowned){
            //                 xy = normalize([e.pageX,e.pageY],widgetWH,screenWH)
            //                 widgetElem.css({
            //                     left: xy[0],
            //                     top: xy[1] 
            //                 })
            //             }
            //         },
            //     })
            // }
            // 注入Jquery
            let jquery_path = path.resolve(__dirname,'..','assets','script','jquery3.5.1-min.js')
            console.log(jquery_path)
            widgetElem.contents().find("body").prepend('<script src="'+jquery_path+'"/>')
            // widgetElem.contents().find("body").prepend("<script>if (typeof module === 'object') {window.jQuery = window.$ = module.exports;};</script>")

            // 调用widgetloaded
            let loadedListener = document.getElementById(widget['id']).contentWindow.onwidgetloaded
            if(loadedListener){
                loadedListener()
            }
        })

        
    })

    ipcRenderer.on("remove-widget-to-container",(e,widget)=>{
        $("#"+widget['id']).remove()
    })
})