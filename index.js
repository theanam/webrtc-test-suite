import checkPeerConnection from "./checks/peerConnection";
import checkMediaCapture from "./checks/mediaCapture";

let _RTCTest = {
    checkPeerConnection,
    checkMediaCapture
}
if(typeof window !== "undefined") window._RTCTest = _RTCTest;

export default _RTCTest;