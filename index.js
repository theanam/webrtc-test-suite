import checkPeerConnection from "./checks/peerConnection";
import checkMediaCapture from "./checks/mediaCapture";
import checkInternetSpeed from "./checks/internet";
import countDevies from "./checks/count_devices";
let _RTCTest = {
    checkPeerConnection,
    checkMediaCapture,
    checkInternetSpeed,
    countDevies
}
if(typeof window !== "undefined") window._RTCTest = _RTCTest;

export default _RTCTest;