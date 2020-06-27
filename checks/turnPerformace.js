import peerTransfer from "./helpers/rpc";
export default function checkRelayPerformance(rtcConfig, verbose, timeout = 30000){
    return new Promise((resolve,reject)=>{
        if(!rtcConfig) return reject(new Error("RTC Config is required"));
        if(!/turn/.test(JSON.stringify(rtcConfig))) reject(new Error("At least one turn server is required"));
        rtcConfig.iceTransportPolicy = "relay"; // force TURN
        // Construct a big payload
        let payload = "";
        for(let i=0; i<100000; i++){
            payload += String.fromCharCode(Math.floor(255* Math.random()));
        }
        peerTransfer(rtcConfig, payload, verbose, timeout).then(data=>{
            let transferSize = data.size * 8;
            let inSeconds    = data.elapsed / 1000; 
            let speed        = ((transferSize / inSeconds) / 1048576).toFixed(2);
            verbose && console.log(`[turn-performance] Data transfer was measured ${speed}. transfer took ${data.elapsed}ms`);
            return resolve({
                speed   : parseFloat(speed),
                elapsed : data.elapsed
            });
        }).catch(reject);
    });
}