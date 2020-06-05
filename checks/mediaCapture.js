function testMediaCapture(contrains = {video: true, audio: true},verbose = false,callback){
    return new Promise((resolve,reject)=>{
        function _err(err){
            if(callback) return callback(false);
            return reject(err);
        }
        function _log(){
            if(!verbose) return false;
            console.log(...arguments);
        }
        navigator.mediaDevices.getUserMedia(contrains)
        .then(stream=>{
            _log("🏞  Got Media stream");
            if(stream.active){
                let tracks     = stream.getTracks();
                var audioTrack = false; // check by default
                var videoTrack = false; // check by default
                let functional = [].every.call(tracks,_track=>{
                    if(_track.kind === "audio") audioTrack = true;
                    if(_track.kind === "video") videoTrack = true;
                    return (_track.readyState === "live");
                });
                tracks.forEach(_track=>_track.stop());
                if(!functional) return _err(new Error("All requested tracks are not active"));
                if(contrains.video && !videoTrack) return _err(new Error("Video Track not found"));
                if(contrains.audio && !audioTrack) return _err(new Error("Audio Track not found"));
                return resolve(true);
            }
        })
        .catch(e=>{
            _log("🛑  Failed at getting media stream");
            _err(e);
        })
    })
}

export default testMediaCapture;