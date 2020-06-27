export default function createRTCPeerConnection(configuration){
    if(window.RTCPeerConnection) return new RTCPeerConnection(configuration);
    else if(window.webkitRTCPeerConnection) return new webkitRTCPeerConnection(configuration);
    else if(window.mozRTCPeerConnection) return new mozRTCPeerConnection(configuration);
    else return null;
}