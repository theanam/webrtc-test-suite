export default function getUserMedia(constraints){
    return new Promise((resolve,reject)=>{
        if(!constraints.audio && !constraints.video) return reject(new Error("Constraints inappropriate"));
        let gum = null;
        const _success = (stream)=> resolve(stream);
        const _err     = (err)=> reject(err);
        if(navigator.mediaDevices.getUserMedia){
            gum = navigator.mediaDevices.getUserMedia(constraints)
        }
        else if(navigator.getUserMedia){
            navigator.getUserMedia(constraints, _success, _err);
            gum = "getUserMedia";
        }
        else if(navigator.webkitGetUserMedia){
            navigator.webkitGetUserMedia(constraints, _success, _err);
            gum = "webkitGetUserMedia";
        } 
        if(!gum) return reject(new Error("No version of getusermedia was found"));
        if(gum.then) gum.then(resolve);
        if(gum.catch) gum.catch(reject);
    });
}