import peerTransfer from "./helpers/rpc";
export default function checkPeerConnection(rtcConfig = {}, verbose = false, timeout = 30000){
    let testData = `test_${Date.now()}`;
    return peerTransfer(rtcConfig, testData, verbose, timeout);
}