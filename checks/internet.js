/**
 * Test Internet download speed
 * @param {checkFile} String, a file on the internet, that can be downloaded via AJAX (has access-control-allow-origin header)
 * @param {verbose} Boolean, prints out logs
 * @param {callback} Function, gets called once the function finishes or fails
 * @returns Promise
 */
function checkInternetSpeed(checkerFile, verbose = false, callback){
    return new Promise((resolve,reject)=>{
        if(!checkerFile) reject(new Error("Please provide a filename to download and check internet"));
        function _log(){
            if(!verbose) return false;
            console.log(...arguments);
        }
        function _err(err){
            if(callback) return callback(false);
            return reject(err);
        }
        let startTime = Date.now();
        _log(`🧲  Fetching the test file`);
        fetch(`${checkerFile}?rtccheckertimestamp_noconflict=${startTime}`)
            .then(resp=>resp.blob())
            .then(bl=>{
                _log(`😇  Test file fetched successfully`);
                let endTime  = Date.now();
                let timeDiff = (endTime - startTime)/1000; //convert millesecond diff to seconds
                let fileSize = bl.size * 8; // bits
                let bps      = fileSize / timeDiff;
                let mbps     = (bps / 1048576).toFixed(2); // 1024*1024
                _log(`🌎  Internet speed observed during fetch: ${mbps} Mbps`);
                if(callback) return callback(mbps);
                return resolve(mbps);
            })
            .catch(_err);
    })
}

export default checkInternetSpeed;