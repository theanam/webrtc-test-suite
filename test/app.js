import _rtc from "../index";
import $ from "jquery";

function loading(base,message){
    base.find(".status").addClass("loading");
    base.find(".message").html(message);
}
function yes(base,message){
    base.find(".status").addClass("yes").removeClass("loading");
    base.find(".message").html(message);
}
function no(base,message){
    base.find(".status").addClass("no").removeClass("loading");
    base.find(".message").html(message);
}
function init(){
    let pc = $(".peerconnection");
    loading(pc,"Testing Peer Connection");
    _rtc.checkPeerConnection({},true).then(()=>yes(pc,"Peer connection Established")).catch(()=>no(pc,"Peer connection did not work"));
    let _net = $(".internet");
    loading(_net,"Testing Internet Connection");
    _rtc.checkInternetSpeed("test.png",true).then(speed=>yes(_net,`Your speed is ${speed}mbps with this server`)).catch(()=>no(_net,"Could not test internet speed"));
    let _cd = $(".count");
    loading(_cd,"Counting devices");
    _rtc.countDevies(true).then(l=>yes(_cd,`You have ${l.audio.in} audio input, ${l.audio.out} audio output, ${l.video.in} video input`)).catch(e=>no(_cd,"Could not count hardware"));
    let um = $(".usermedia");
    loading(um,"Testing getUserMedia");
    _rtc.checkMediaCapture({audio:true, video: true},true).then(()=>yes(um,"Media Capture Successful")).catch(err=>no(um,"Media Capture failed"));
}

document.querySelector(".start").addEventListener("click",init);


