import checkPeerConnection from "./checks/peerConnection";
import checkMediaCapture from "./checks/mediaCapture";
import checkInternetSpeed from "./checks/internet";

let _RTCTest = {
    checkPeerConnection,
    checkMediaCapture,
    checkInternetSpeed
}
if(typeof window !== "undefined") window._RTCTest = _RTCTest;

export default _RTCTest;