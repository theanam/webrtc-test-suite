function stopMediaStream(stream){
    if(!stream) return null;
    let tracks = stream.getTracks();
    Array.prototype.forEach.call(tracks, _track=>_track.stop());
    return tracks.length;
}
function stopMediaStreamSilent(stream){
    try{
        return stopMediaStream(stream);
    }
    catch(e){
        return 0;
    }
}
export {
    stopMediaStream,
    stopMediaStreamSilent
}