export default function checkPeerConnection(rtcConfig = {}, verbose = false){
    return new Promise((resolve,reject)=>{
        let rtc1 = new RTCPeerConnection(rtcConfig);
        let rtc2 = new RTCPeerConnection(rtcConfig);
        let dc   = rtc1.createDataChannel("sender");
        let _ts  = Date.now();
        rtc1.addEventListener("icecandidate",ice=>{
            if(!ice.candidate) return false;
            verbose && console.log("[peer-connection]: First Peer Generated Candidate:",ice.candidate);
            rtc2.addIceCandidate(ice.candidate);
        });
        rtc2.addEventListener("icecandidate",ice=>{
            if(!ice.candidate) return false;
            verbose && console.log("[peer-connection]: Second Peer Generated Candidate:",ice.candidate);
            rtc1.addIceCandidate(ice.candidate);
        });
        rtc2.addEventListener("datachannel",evt=>{
            evt.channel.addEventListener("message",(msg)=>{
                verbose && console.log("[peer-connection]: Message Transmission successful");
                if(msg.data === _ts.toString()){
                    let _rcvTS = Date.now();
                    rtc1.close();
                    rtc2.close();
                    return resolve(_rcvTS - _ts);
                }
                return reject(new Error("message integrity failure"));
            });
        });
        dc.addEventListener("open",()=>dc.send(_ts.toString()));
        rtc1.createOffer()
            .then(offer=>{
                verbose && console.log("[peer-connection]: First peer connection created RTC offer");
                rtc1.setLocalDescription(offer)
                    .then(()=>rtc2.setRemoteDescription(offer))
                    .then(()=>rtc2.createAnswer()
                        .then(answer=>{
                            verbose && console.log("[peer-connection]: Seocond peer connection created RTC answer");
                            rtc2.setLocalDescription(answer)
                                .then(rtc1.setRemoteDescription(answer))
                                .catch(reject);
                        }).catch(reject));
            }).catch(reject);
    });
}
