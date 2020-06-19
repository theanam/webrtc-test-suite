import checkPeerConnection from "./checks/peerConnection";
import checkMediaCapture from "./checks/mediaCapture";
import checkInternetSpeed from "./checks/internet";
import countDevies from "./checks/count_devices";
// Utils
import p from "./utils/simplify_promise";
import * as video from "./utils/tag_tools";

let _RTCTest = {
    checkPeerConnection,
    checkMediaCapture,
    checkInternetSpeed,
    countDevies,
    utils: {
        p,
        video
    }
}
if(typeof window !== "undefined") window._RTCTest = _RTCTest;

export default _RTCTest;