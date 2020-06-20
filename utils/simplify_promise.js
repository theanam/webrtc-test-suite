export default function(_promise){
    return new Promise(resolve=>{
        try{
            _promise
                .then(result=>resolve(result))
                .catch(()=>resolve(null));
        }
        catch(e){
            resolve(null);
        }
    })
}