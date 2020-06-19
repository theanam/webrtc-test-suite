import _test from "../index";

function init(){
    _test.checkMediaCapture({audio:true,video: true},true)
        .then(_test.checkPeerConnection({},true))
        .then(result=>console.log("All tests passed"))
        .catch(err=>console.log("err",err))
}

document.querySelector(".start").addEventListener("click",init);


