export default function getUserMedia(constraints, verbose = false){
    return new Promise((resolve,reject)=>{
        if(!constraints.audio && !constraints.video) return reject(new Error("Audio Video Constraints inappropriate"));
        const _success = (stream) => resolve(stream);
        const _err     = (err) => reject(err);
        if(navigator.mediaDevices.getUserMedia){
            verbose && console.log(`[get-user-media]: Using mediaDevices.getUserMedia`);
            navigator.mediaDevices.getUserMedia(constraints).then(resolve).catch(reject);
        }
        else if(navigator.getUserMedia){
            verbose && console.log(`[get-user-media]: Using navigator.getUserMedia`);
            navigator.getUserMedia(constraints, _success, _err);
        }
        else if(navigator.webkitGetUserMedia){
            verbose && console.log(`[get-user-media]: Using navigator.webkitGetUserMedia`);
            navigator.webkitGetUserMedia(constraints, _success, _err);
        }
        else if(navigator.mozGetUserMedia){
            verbose && console.log(`[get-user-media]: Using navigator.mozGetUserMedia`);
            navigator.mozGetUserMedia(constraints, _success, _err);
        }
        else reject(new Error("No version of getusermedia was found"));
    });
}