function min(x,y){
    return x<y?x:y
}
function normalizeOne(posi,widgeti,max){
    // 0 起始位置 -1 居中 -2 结束位置
    let wcenter = widgeti / 2
    let realMax = max - widgeti
    if(posi==-1)return max / 2 - wcenter
    else if(posi==-2)return realMax
    else return min(posi,realMax)
}
module.exports = {
    normalize(pos,widgetWH,screenWH){
        return [normalizeOne(pos[0],widgetWH[0],screenWH[0]),normalizeOne(pos[1],widgetWH[1],screenWH[1])]
    },

}