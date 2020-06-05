/**
 * Created By Anam Ahmed (https://anam.co)
 * Test the browser's capability to establish RTCPeerConnection with supplied RTC Configuration
 * How to use: probeRTC(RTCParam,false, callback) // will call callback function with true or false.
 * If you don't supply the callback function it will return a Promise.
 * The promise will resolve (with total time required for the whole round trip ,in ms) or reject (with error) based on the result.
 * Setting verbose = true will print logs in console
 * @param {RTCConfiguration} rtcConfig
 * @param {Boolean} verbose
 * @param {Function} callback [optional]
 * @return {Promise}
 */
function checkPeerConnection(rtcConfig = {}, verbose = false, callback){
    return new Promise((resolve,reject)=>{
        let rtc1 = new RTCPeerConnection();
        let rtc2 = new RTCPeerConnection();
        let dc   = rtc1.createDataChannel("sender");
        let _ts  = Date.now();
        function _err(err){
            if(callback) return callback(false);
            return reject(err);
        }
        function _log(){
            if(!verbose) return false;
            console.log(...arguments);
        }
        rtc1.addEventListener("icecandidate",ice=>{
            if(!ice.candidate) return false;
            _log("🚖  First Peer Generated Candidate:",ice.candidate);
            rtc2.addIceCandidate(ice.candidate);
        });
        rtc2.addEventListener("icecandidate",ice=>{
            if(!ice.candidate) return false;
            _log("🚖  Second Peer Generated Candidate:",ice.candidate);
            rtc1.addIceCandidate(ice.candidate);
        });
        rtc2.addEventListener("datachannel",evt=>{
            evt.channel.addEventListener("message",(msg)=>{
                _log("✉️  Message Transmission successful");
                if(msg.data === _ts.toString()){
                    if(callback) return callback(true);
                    let _rcvTS = Date.now();
                    rtc1.close();
                    rtc2.close();
                    return resolve(_rcvTS - _ts);
                }
                _err(new Error("message integrity failure"));
            });
        });
        dc.addEventListener("open",()=>dc.send(_ts.toString()));
        rtc1.createOffer()
            .then(offer=>{
                _log("🍎  Created RTC Offer");
                rtc1.setLocalDescription(offer)
                    .then(()=>rtc2.setRemoteDescription(offer))
                    .then(()=>rtc2.createAnswer()
                        .then(answer=>{
                            _log("🍏  Created RTC Answer");
                            rtc2.setLocalDescription(answer)
                                .then(()=>rtc1.setRemoteDescription(answer))
                                .catch(e=>_err(e));
                        }).catch(e=>_err(e)));
            }).catch(e=>_err(e));
    });
}

export default checkPeerConnection;
