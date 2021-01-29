window.onwidgetloaded = function(){
    console.log(fs.readFileSync("D:\\czxt.txt"))
    let e_time = $(".clock-time")
    let e_date = $(".clock-date")
    let e_apm = $(".clock-apm")
    let e_sentence = $(".clock-sentence")
    function strTimes(str,times){
        let result = "";
        for(let i=0;i<times;i++)
            result+=str
        return result
    }
    function addPrevZero(num,need_len){
        let numstr = num.toString()
        let zeroCnt = need_len - numstr.length
        return zeroCnt<=0?numstr:strTimes("0",zeroCnt)+numstr
    }
    function normalizeHours(date,base){
        let hours = date.getHours()
        return hours>base?hours-base:hours
    }


    function getAPM(date){
        return date.getHours()>12?"PM":"AM"
    }

    function getDateStr(date){
        return date.getFullYear() + " / " + (date.getMonth() + 1) + " / " + date.getDate()
    }

    function resetTime(){
        let date = new Date()
        console.log(date)
        e_time.text(addPrevZero(normalizeHours(date,12),2)+":"+addPrevZero(date.getMinutes(),2))
        e_apm.text(getAPM(date))
        e_date.text(getDateStr(date))
    }

    resetTime()
    setInterval(()=>{
        resetTime()
    },5000)

}
