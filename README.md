# webrtc-test-suite
Testing suite for Real life webRTC capability testing

## this is a work in progress

## How to use: 
To install the package use this command: 
### Module Bundler
```sh
yarn add webrtc-test-suite
```
If you are using a module bundler, you can import it with: 
```js
import _RTCTest from "webrtc-test-suite";
```
### Include JS file 
Add this to your HTML file:
```html
<script src="https://unpkg.com/webrtc-test-suite@1.0.2/dist/index.js"></script>
```
Yoou will get a global object called: `_RTCTest`

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
## A better documentation is comming soon

*** 
This package is released under the MIT license, feel free to contribute.

made with 🖤 and JavaScript.