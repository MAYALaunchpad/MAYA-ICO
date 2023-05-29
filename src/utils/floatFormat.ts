export function floatformat(value:string){
    let t1 = value
    .replace(/[^\d.]/g, "")
    .replace(/^\./g, "")
    .replace(/\.{2,}/g, ".")
    .replace(".", "$#$")
    .replace(/\./g, "")
    .replace("$#$", ".");
    let t2 = (t1 + "").replace(/^0+\./g, "0.");
    let t3 = t1.replace(/^0+/g, "");
    if (t1.match(/^0+[1-9]+/)) {
        t2 = t3;
    }
    return t2
}

export function posInvFormat(value:string){
    return value.replace(/[^\d.]/g, "").replace(/^\./g, "").replace(/^[^1-9]\d*$/,"").replace(/\./g,"")
}