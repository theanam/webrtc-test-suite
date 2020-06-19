export default function countDevices(verbose = false){
    return new Promise((resolve,reject)=>{
        let result = {
            audio   : {in: 0, out: 0},
            video   : {in: 0, out: 0},
            unknown : 0
        }
        verbose && console.log(`[count-devices]: Requesting device list`);
        navigator.mediaDevices.enumerateDevices()
            .then(devices=>{
                verbose && console.log(`[count-devices]: Received device list. Total devices: ${devices.length}`);
                Array.prototype.forEach.call(devices,_d=>{
                    switch(_d.kind){
                    case "audioinput":
                        result.audio.in ++;
                        break;
                    case "audiooutput":
                        result.audio.out ++;
                        break;
                    case "videoinput":
                        result.video.in ++;
                        break;
                    case "videooutput":
                        result.video.out ++; // doesnt work
                        break;
                    default:
                        result.unknown ++;
                    }
                });
                return resolve(result);
            })
            .catch(reject);
    });
}