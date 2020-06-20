import getUserMedia from "../utils/user_media";
import * as _stream from "../utils/media_stream_tools";
export default function checkMediaCapture(constraints, verbose = false, getStream = false){
    return new Promise((resolve,reject)=>{
        if(!constraints.audio && !constraints.video) return reject(new Error("Constraints are not correct"));
        verbose && console.log(`[media-capture]: Requesting user media`);
        getUserMedia(constraints, verbose)
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
                    if(!functional){
                        _stream.stopMediaStream(stream);
                        return reject(new Error("All requested tracks are not active"));
                    } 
                    if(constraints.video && !videoTrack) {
                        _stream.stopMediaStream(stream);
                        return reject(new Error("Video Track not found"));
                    }
                    if(constraints.audio && !audioTrack){
                        _stream.stopMediaStream(stream);
                        return reject(new Error("Audio Track not found"));
                    } 
                    if(!getStream){
                        verbose && console.log(`[media-capture]: Stopping media track(s)`);
                        _stream.stopMediaStream(stream);
                    }
                    if(getStream) return resolve(stream);
                    return resolve(true);
                }
            })
            .catch(reject);
    });
}