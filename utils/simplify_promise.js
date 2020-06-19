export default function(_promise){
    return new Promise(resolve=>{
        _promise
        .then(result=>resolve(result))
        .catch(()=>resolve(null));
    })
}