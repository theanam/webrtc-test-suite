export default function checkFeatureSupport(verbose = false){
    let result = {
        video             : {
            basic   : false
        },
        audio             : {
            basic    : false,
            webAudio : false
        },
        rtcPeerConnection : false,
        rtcDataChannel    : false,
        getUserMedia      : false,
        getDisplayMedia   : false
    }
    // check video
    verbose && console.log(`[feature-test] Checking for video availability`);
    let vid = document.createElement("video");
    if(typeof vid.play === "function") result.video.basic = true;
    // check Audio
    verbose && console.log(`[feature-test] Checking for audio availability`);
    let aud = document.createElement("audio");
    if(typeof aud.play === "function") result.audio.basic    = true;
    verbose && console.log(`[feature-test] Checking for web-audio API availability`);
    if("AudioContext" in window) result.audio.webAudio       = true;
    else if("webkitAudioContext" in window) result.audio.webAudio = "prefix-webkit";
    // check getUserMedia
    verbose && console.log(`[feature-test] Checking for getUserMedia`);
    if((navigator && "mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices)) result.getUserMedia = true;
    else if(navigator && "getUserMedia" in navigator) result.getUserMedia = "old";
    else if("webkitGetUserMedia" in navigator) result.getUserMedia = "prefix-webkit";
    else if("mozGetUserMedia" in navigator) result.getUserMedia = "prefix-moz";
    // Check GetDisplayMedia
    if((navigator && "mediaDevices" in navigator && "getDisplayMedia" in navigator.mediaDevices)) result.getDisplayMedia = true;
    // check RTCPeerConnection
    verbose && console.log(`[feature-test] Checking for rtcPeerConnection`);
    if("RTCPeerConnection" in window) result.rtcPeerConnection = true;
    // check RTCDataChannel
    if(!result.rtcPeerConnection) result.rtcDataChannel = false;
    else {
        verbose && console.log(`[feature-test] Checking for RTC Data Channel`);
        let rpc = new RTCPeerConnection();
        if("createDataChannel" in rpc) result.rtcDataChannel = true; 
    }
    return result;
}