export default function checkMediaCapture(constraints, verbose = false){
    return new Promise((resolve,reject)=>{
        if(!constraints.audio && !constraints.video) return reject(new Error("Constraints are not correct"));
        verbose && console.log(`[media-capture]: Requesting user media`);
        navigator.mediaDevices.getUserMedia(constraints)
            .then(stream=>{
                verbose && console.log(`[media-capture]: Received media Stream`);
                if(stream.active){
                    let tracks     = stream.getTracks();
                    var audioTrack = false; // check by default
                    var videoTrack = false; // check by default
                    let functional = [].every.call(tracks,_track=>{
                        if(_track.kind === "audio") audioTrack = true;
                        if(_track.kind === "video") videoTrack = true;
                        return (_track.readyState === "live");
                    });
                    verbose && console.log(`[media-capture]: Received ${tracks.length} track(s)`);
                    verbose && console.log(`[media-capture]: Stopping media track(s)`);
                    Array.prototype.forEach.call(tracks, _track=>_track.stop());
                    if(!functional) return reject(new Error("All requested tracks are not active"));
                    if(constraints.video && !videoTrack) return reject(new Error("Video Track not found"));
                    if(constraints.audio && !audioTrack) return reject(new Error("Audio Track not found"));
                    return resolve(true);
                }
            })
            .catch(reject);
    });
}