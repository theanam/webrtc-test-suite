import checkPeerConnection from "./checks/peerConnection";
import checkMediaCapture from "./checks/mediaCapture";
import checkInternetSpeed from "./checks/internet";
import countDevies from "./checks/count_devices";
import checkFeatureSupport from "./checks/feature_support";
import checkRelayPerformance from "./checks/turnPerformace";
// Utils
import flat from "./utils/simplify_promise";
import * as dom from "./utils/dom_tag_tools";
import getUserMedia from "./utils/user_media";
import * as mediaStream from "./utils/media_stream_tools";
import createRTCPeerConnection from "./utils/peerconn";
// Utils function
const checkPeerConnectionSilent=function(rtcConfig = {}, verbose = false){return flat(checkPeerConnection(rtcConfig, verbose))};
const checkMediaCaptureSilent=function(constraints, verbose = false, getStream = false){return flat(checkMediaCapture(constraints, verbose, getStream))};
const checkInternetSpeedSilent=function(checkerFile, verbose = false){return flat(checkInternetSpeed(checkerFile, verbose))};
const countDeviesSilent=function(verbose = false){return flat(countDevies(verbose))};
const getUserMediaSilent=function(constraints, verbose = false){return flat(getUserMedia(constraints, verbose))};
const checkRelayPerformanceSilent=function(rtcConfig, verbose, timeout){return flat(checkRelayPerformance(rtcConfig, verbose, timeout))};
const utils = {
    flat,
    dom,
    stream: mediaStream
}
// Exports
export {
    checkPeerConnection,
    checkMediaCapture,
    checkRelayPerformance,
    checkInternetSpeed,
    countDevies,
    getUserMedia,
    checkFeatureSupport,
    checkPeerConnectionSilent,
    checkMediaCaptureSilent,
    checkRelayPerformanceSilent,
    checkInternetSpeedSilent,
    countDeviesSilent,
    getUserMediaSilent,
    createRTCPeerConnection,
    utils
}