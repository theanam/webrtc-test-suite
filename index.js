import checkPeerConnection from "./checks/peerConnection";
import checkMediaCapture from "./checks/mediaCapture";
import checkInternetSpeed from "./checks/internet";
import countDevies from "./checks/count_devices";
// Utils
import flat from "./utils/simplify_promise";
import * as av from "./utils/dom_tag_tools";
import getUserMedia from "./utils/user_media";
// Exports
let _rtc = {
    checkPeerConnection,
    checkMediaCapture,
    checkInternetSpeed,
    countDevies,
    getUserMedia,
    checkPeerConnectionSilent(){return flat(checkPeerConnection(...arguments))},
    checkMediaCaptureSilent(){return flat(checkMediaCapture(...arguments))},
    checkInternetSpeedSilent(){return flat(checkInternetSpeed(...arguments))},
    countDeviesSilent(){return flat(countDevies(...arguments))},
    getUserMediaSilent(){return flat(getUserMedia(...arguments))},
    utils: {
        flat,
        av
    }
}
if(typeof window !== "undefined") window._rtc = _rtc;

export default _rtc;