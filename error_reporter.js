const { dialog } = require('electron')

let application = null;

function buildErrorString(err){
    let datetime = new Date()
    return "Time: "+ datetime.toLocaleDateString() + "  " + datetime.toLocaleTimeString() + "\nError: "+err.name+"\nErrorMessage: "+err.message
}
module.exports = {
    initErrorReporter: function(app){application = app},
    crash: function(err,needexit){
        dialog.showMessageBoxSync({
            type: "error",
            title: "An error raised",
            message: buildErrorString(err)
        })
        if(needexit)
            application.quit()
    },
    error: function(title,message){
        dialog.showMessageBoxSync({
            type: "error",
            title: title,
            message: message
        })
    }
}