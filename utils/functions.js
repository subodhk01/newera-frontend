export function fancyTimeFormat(duration) {
    // Hours, minutes and seconds
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}

export function fancyToNormalTimeFormat(time){
    console.log("fancyTime: ", time)
    var result = "", hr = 0, min = 0, sec = 0
    if(time){
        if (time.split(":").length === 2){
            var [ min, sec ] = time.split(":")
            min = parseInt(min)
            sec = parseInt(sec)
        }else if(time.split(":").length === 3){
            var [ hr, min, sec ] = time.split(":")
            hr = parseInt(hr)
            min = parseInt(min)
            sec = parseInt(sec)
        }
        if(hr) result += `${hr} hour${hr > 1 ? 's' : ''} `
        if(min) result += `${min} minute${min > 1 ? 's' : ''} `
        if(sec) result += `${sec} second${sec > 1 ? 's' : ''} `
    }
    return result === "" ? "0 second" : result
}

export function arrayRemove(arr, value) {  
    return arr.filter(function(ele){ 
        return ele != value; 
    });
}