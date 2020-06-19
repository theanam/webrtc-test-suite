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
import _rtc from "webrtc-test-suite";
```
### Include JS file 
Add this to your HTML file:
```html
<script src="https://unpkg.com/webrtc-test-suite@1.2.0/dist/index.js"></script>
```
Yoou will get a global object called: `_rtc`

All the check functions return a promise.
```js
// Function signatures: 
// check peer connection capabilities
_rtc.checkPeerConnection(iceConfiguration,verbose[boolean]) // all the params are optional. If you chose to go verbose, pass a blank obe. Verbose creates logs
// Check media capture
_rtc.checkMediaCapture(mediaConstraints,verbose[boolean]) // Constraints is required. Verbose creates logs
// make sure testDownload is a file and can be downloaded with AJAX (this test uses fetch)
_rtc.checkInternetSpeed(testDownload,verbose[boolean]) // testDownload is required, return value in Mbps (Megabits Per second)
_rtc.countDevices([verbose = false]) // counts the number of audio video input output devices
```
## A better documentation is comming soon

*** 
This package is released under the MIT license, feel free to contribute.

made with 🖤 and JavaScript.