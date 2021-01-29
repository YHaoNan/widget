jQuery(() => {
    const { ipcRenderer } = require('electron')
    const path = require('path')

    $(".minimize").on("click", () => {
        ipcRenderer.send("minimize")
    })
    $(".maximize").on("click", () => {
        ipcRenderer.send("maximize")
    })
    $(".close").on("click", () => {
        ipcRenderer.send("minimize-to-system-tray")
    })
    $("#open-widgets-switch").on("change", (e) => {
        if (e.delegateTarget.checked) {
            ipcRenderer.send("open-widget-container")
        } else {
            ipcRenderer.send("close-widget-container")
        }
    })

    ipcRenderer.on('add-widget-to-ui', (e, widget) => {
        console.log(widget['avater'])
        $("#widgets").append(
            buildWidgetCardElement(widget)
        )
    })
    function widgetCardClicked(){
        console.log($(this).attr("widget-id"))
        ipcRenderer.send("widget-card-clicked",$(this).attr("widget-id"))
    }

    function buildWidgetCardElement(widget) {
        let source = $('<div class="widget" widget-id="'+widget['id']+'" style="background-image:url(' + widget['avater'].replaceAll("\\","\\\\") + ')">' +
            '<div class="widget-masker"></div>' +
            '<div class="widget-content">' +
            '<h2 class="widget-name">' + widget['config']['name'] + '</h2>' +
            '<p class="widget-description">' + widget['config']['description'] + '</p>' +
            '<div class="widget-footer">' +
            '<span class="widget-author">' + widget['config']['author'] + '</span>' +
            '<object class="widget-setting" data="../assets/icon/setting.svg" type="image/svg+xml"></object>' +
            '</div>' +
            '</div>' +
            '</div>');
        source.on("click",widgetCardClicked)
        return source
    }
})