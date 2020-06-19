function addStreamToDOM(domElement,stream){
    if(!domElement || !stream) return null;
    if(domElement.srcObject !== undefined) domElement.srcObject = stream;
    else domElement.src = window.URL.createObjectURL(stream);
    return domElement;
}
function removeStreamFromDOM(domElement){
    if(!domElement) return null;
    if(domElement.srcObject !== undefined) domElement.srcObject = null;
    else domElement.src = "";
    return domElement;
}

module.exports = {
    addStreamToDOM,
    removeStreamFromDOM
}