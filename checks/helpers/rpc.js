import createRTCPeerConnection from "../../utils/peerconn";
export default function peerTransfer(rtcConfig, payload, verbose = false, timeout = 30000){
    return new Promise((resolve,reject)=>{
        let rtc1 = createRTCPeerConnection(rtcConfig);
        let rtc2 = createRTCPeerConnection(rtcConfig);
        let dc   = rtc1.createDataChannel("sender");
        let _ts  = Date.now();
        let _to  = null;
        if(timeout && Number.isInteger(timeout)) _to = setTimeout(()=>reject(new Error(`Timeout of ${timeout}ms reached`)), timeout);
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
                if(msg.data === payload){
                    let _rcvTS = Date.now();
                    let _bin   = new Blob([msg.data]);
                    rtc1.close();
                    rtc2.close();
                    if(_to) clearTimeout(_to);
                    return resolve({
                        elapsed : _rcvTS - _ts,
                        size    : _bin.size
                    });
                }
                if(_to) clearTimeout(_to);
                return reject(new Error("message integrity failure"));
            });
        });
        dc.addEventListener("open", ()=>dc.send(payload));
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
                                .catch(e1=>{
                                    if(_to) clearTimeout(_to);
                                    reject(e1);
                                });
                        }).catch(e2=>{
                            if(_to) clearTimeout(_to);
                            reject(e2);
                        }));
            }).catch(e3=>{
                if(_to) clearTimeout(_to);
                reject(e3);
            });
    });
}