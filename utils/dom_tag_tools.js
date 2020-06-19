function addStreamToDOM(domel,stream){
    if(!domel || !stream) return null;
    if(domel.srcObject !== undefined) domel.srcObject = stream;
    else domel.src = window.URL.createObjectURL(stream);
    return domel;
}
function removeStreamFromDOM(domel){
    if(!domel) return null;
    if(domel.srcObject !== undefined) domel.srcObject = null;
    else domel.src = "";
    return domel;
}

module.exports = {
    addStreamToDOM,
    removeStreamFromDOM
}