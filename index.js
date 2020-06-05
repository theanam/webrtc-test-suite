import checkPeerConnection from "./checks/peerConnection";
import testMediaCapture from "./checks/mediaCapture";

let _RTCTest = {
    checkPeerConnection,
    testMediaCapture
}
if(typeof window !== "undefined") window._RTCTest = _RTCTest;

export default _RTCTest;