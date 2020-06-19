export default function checkInternetSpeed(checkerFile, verbose = false){
    return new Promise((resolve,reject)=>{
        if(!checkerFile) return reject(new Error("Please provide a filename to download and check internet"));
        if(typeof fetch !== "function") return reject(new Error("Fetch API support is required for this check"));
        verbose && console.log(`[internet-connection]: Will fetch the check file`);
        let startTime = Date.now();
        let glue = /\?/.test(checkerFile)?"&":"?"; // if the file path already has query params
        fetch(`${checkerFile}${glue}rtccheckertimestamp_noconflict=${startTime}`) // to avoid cache
            .then(resp=>resp.blob())
            .then(bl=>{
                verbose && console.log(`[internet-connection]: Fetched the checker file`);
                let endTime  = Date.now();
                let timeDiff = (endTime - startTime) / 1000; //convert millesecond diff to seconds
                let fileSize = bl.size * 8; // bits
                let bps      = fileSize / timeDiff;
                let mbps     = (bps / 1048576).toFixed(2); // 1024*1024
                verbose && console.log(`[internet-connection]: Speed observed: ${mbps}mbps`);
                return resolve(mbps);
            })
            .catch(reject);
    });
}