import checkPeerConnection from "./checks/peerConnection";
import checkMediaCapture from "./checks/mediaCapture";
import checkInternetSpeed from "./checks/internet";
import countDevies from "./checks/count_devices";
import checkFeatureSupport from "./checks/feature_support";
// Utils
import flat from "./utils/simplify_promise";
import * as dom from "./utils/dom_tag_tools";
import getUserMedia from "./utils/user_media";
import * as mediaStream from "./utils/media_stream_tools";
// Exports
let _rtc = {
    checkPeerConnection,
    checkMediaCapture,
    checkInternetSpeed,
    countDevies,
    getUserMedia,
    checkFeatureSupport,
    checkPeerConnectionSilent(rtcConfig = {}, verbose = false){return flat(checkPeerConnection(rtcConfig, verbose))},
    checkMediaCaptureSilent(constraints, verbose = false, getStream = false){return flat(checkMediaCapture(constraints, verbose, getStream))},
    checkInternetSpeedSilent(checkerFile, verbose = false){return flat(checkInternetSpeed(checkerFile, verbose))},
    countDeviesSilent(verbose = false){return flat(countDevies(verbose))},
    getUserMediaSilent(constraints, verbose = false){return flat(getUserMedia(constraints, verbose))},
    utils: {
        flat,
        dom,
        stream: mediaStream
    }
}
if(typeof window !== "undefined") window._rtc = _rtc;
export default _rtc;