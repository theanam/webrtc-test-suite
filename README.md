# webrtc-test-suite
Testing suite for Real life webRTC capability testing

## this is a work in progress

How to use: 

this will be in NPM Soon, but for now, all you need is the file: dist/index.js, 
Include it in the project and you will get a global object `_RTCTest`. 

If you are using a module bundler, you can import it with: 

    // NPM package coming soon
    import {checkPeerConnection} from "peertest/index.js";


All the check functions return a promise, or optionally you can supply a callback function as well. 

    // Function signatures: 
    // check peer connection capabilities
    checkPeerConnection(iceConfiguration,verbose[boolean],callback) // all the params are optional. Verbose creates logs
    // Check media capture
    checkMediaCapture(mediaConstraints,verbose[boolean],callback) // all the params are optional. Verbose creates logs
    // make sure testDownload is a file and can be downloaded with AJAX (this test uses fetch)
    checkInternetSpeed(testDownload,verbose[boolean],callback) // testDownload is required, return value in Mbps (Megabits Per second)

# A better documentation and npm package comming soon