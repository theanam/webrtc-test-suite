import _rtc from "../index";

function init(){
    _rtc.checkMediaCapture({audio:true,video: true},true)
        .then(_rtc.checkPeerConnection({},true))
        .then(result=>console.log("All tests passed"))
        .catch(err=>console.log("err",err))
    _rtc.countDevies(true).then(list=>console.log(list));
    _rtc.getUserMediaSilent({video: true})
        .then(stream=>{
            if(!stream) return console.log("No stream could be retrieved");
            _rtc.utils.dom.addStreamToDOM(document.querySelector(".vid"),stream).play();
            setTimeout(()=>_rtc.utils.stream.stopMediaStreamSilent(stream),4000);
        });
}

document.querySelector(".start").addEventListener("click",init);


