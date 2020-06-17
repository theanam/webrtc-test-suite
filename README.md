# webrtc-test-suite
Testing suite for Real life webRTC capability testing

## this is a work in progress

## How to use: 
To install the package use this command: 

```sh
yarn add webrtc-test-suite
```

Include it in the project and you will get a global object `_RTCTest`. 

If you are using a module bundler, you can import it with: 
```js
import _test from "webrtc-test-suite";
```

All the check functions return a promise, or optionally you can supply a callback function as well. 
```js
// Function signatures: 
// check peer connection capabilities
checkPeerConnection(iceConfiguration,verbose[boolean],callback) // all the params are optional. Verbose creates logs
// Check media capture
checkMediaCapture(mediaConstraints,verbose[boolean],callback) // all the params are optional. Verbose creates logs
// make sure testDownload is a file and can be downloaded with AJAX (this test uses fetch)
checkInternetSpeed(testDownload,verbose[boolean],callback) // testDownload is required, return value in Mbps (Megabits Per second)
```
## A better documentation and npm package comming soon

*** 
made with 🖤 and JavaScript.