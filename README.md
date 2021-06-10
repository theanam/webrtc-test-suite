# Real life Capability testing and utilities for WebRTC. 
 Testing webRTC capabilities by trying to use them. Not a feature detector. A capability tester.Also packs some utilities to make developer's live easier while making webRTC tools. 

## 🚀 [Test Your Browser](https://theanam.github.io/webrtc-test-suite)

## What Can It do
* Test basic feature support.
* Test If `getUserMedia` Actually works.
* Test if the browser and internet is capable of `RTCPeerConnection`
* Test if the internet Speed is good enough for WebRTC streaming.
* Handle API differences for `getUserMedia`, adding stream to DOM.
* Provide utility functions for webRTC media application.

## Installation:

### Using a package manager:
To install the package use this command. 
```shell
yarn add webrtc-test-suite
```
Then you can import it in your code like this:
```js
import * as _rtc from "webrtc-test-suite";
```

### Including the JS file directly:
Add this to your HTML file:
```html
<script src="https://unpkg.com/webrtc-test-suite@2.1.2/dist/index.js"></script>
```
You will get a global object called: `_rtc`. And you can access all the functionalities from that object.

## How to use
This tool comes with a lot of capability test and utility functions. You can use them to create WebRTC enabled application and positively determine feature support. All the functions are described below.

> Please include the [webRTC Adapter](https://www.npmjs.com/package/webrtc-adapter) package in  your project. This plugin tries to cover most of the variations of the API but adapter covers almost all of it. 

> Functions that return a promise has a `silent` version that does not reject the promise on error. Instead returns null. Good for working with `async-await`.

> Functions that accepts the `verbose` (Boolean) argument, will generate logs in the console if `verbose` is set to `true`. Default is `false`.

> Function that accepts a timeout, that will automatically reject if the internal request does not fulfill before time. setting the timeout to `0` will disable timeout. The default timeout for peer connection related functions is 30000ms (30 seconds) and for media capture is 60000ms (1 minute).
### 0. `checkFeatureSupport`: 
> Please note: *Feaeture detection is not the primary objective of this tool, Detecting if the feature actually works is the primary objective. Feature detection is provided just as an additional tool*

> `checkFeatureSupport([verbose = false]) // Returns result object`.

This is the newest addition to this tool in version 1.2.9. This checks for the feature support in the browser. (e.g: if the browser supports HTML5 video and Audio elements or `RTCPeerConnection`). Much like [Modernizr](https://modernizr.com/). This wasn't primarily intended to be in this package since there's already tool like [Modernizr](https://modernizr.com/) that does this job really well. But since this detection is intended to be used internally, and it's always good to have one less dependency. It returns an output like this: 

```js
{
        video : {
            basic    : true
        },
        audio : {
            basic    : true,
            webAudio : true
        },
        rtcPeerConnection : true,
        rtcDataChannel    : false,
        getUserMedia      : "prefix-webkit",
        getDisplayMedia   : false
    }
```
Checks available: 

| Check | Meaning |
|-------|---------|
|video.basic|Basic HTML5 Video Support|
|audio.basic|Basic HTML5 Audio Support|
|audio.webAudio|Support for Web Audio API|
|rtcPeerConnection|Support for RTCPeerConnection API|
|rtcDataChannel|Support for RTC Data Channel API|
|getUserMedia|Support for the Audio Video Capture|
|getDisplayMedia|Support for Screen Capture|


All the options can have these values:
|Value | Meaning        |
|------|----------------|
|false | Unsupported    |
|"old" | Supported, but with older version of the API |
|"prefix-webkit"| Supported with `webkit` prefix|
|"prefix-moz"| Supported with `moz` prefix |


### 1. `checkMediaCapture` and `checkMediaCaptureSilent`:
> `checkMediaCapture(constraints, [verbose = false,getStream = false, timeout = 60000]); // Returns Promise`

Example Use: 
```js
_rtc.checkMediaCapture({audio: true, video: true})
    .then(()=>console.log("Could capture media stream"))
    .catch(()=>console.error("Could not capture media stream"));
```
This function takes [MediaTrackConstraints](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints) as argument, calls `getUserMedia` API with those constraints, retrieves the Media stream, Checks if audio and video stream is active and according to the [constraints](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints) provided. Then automatically stops the media capture and returns the result. If `getStream` is set to true, the `mediaStream` is not stopped, it's returned instead, on success.

### 2. `checkPeerConnection` and `checkPeerConnectionSilent`:
> `checkPeerConnection(RTCConfiguration, [verbose = false, timeout = 30000]) // Returns Promise`

Example Use: 
```js
_rtc.checkPeerConnection({})
    .then(()=>console.log("Peer connection works"))
    .catch(()=>console.log("Peer connection does not work"));
```
This function takes [RTCConfiguration](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/RTCPeerConnection#RTCConfiguration_dictionary) as argument Creates two `RTCPeerConnection` with the provided RTCConfiguration and creates a data channel between those two. Check if data transfer is possible between the two `RTCPeerConnection` instances. And returns the results. 

> Tip: If you want to test your STUN (relay) server, pass `iceTransportPolicy: "relay"` ([See Documentation](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/RTCPeerConnection#RTCIceTransportPolicy_enum)) with your RTCConfiguration. This will force the two PeerConnection to communicate through the relay server. 

### 3. `checkRelayPerformance` and `checkRelayPerformanceSilent`:
> `checkRelayPerformance(RTCConfiguration, [verbose = false, timeout = 30000]) // Returns Promise`

Example Use: 
```js
_rtc.checkRelayPerformance(rtcConfig)
    .then(()=>console.log("Peer connection works"))
    .catch(()=>console.log("Peer connection does not work"));
```
This function takes [RTCConfiguration](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/RTCPeerConnection#RTCConfiguration_dictionary) as argument. Which is mandatory.It also requires the user to supply at least one TURN server configuration, Against which the performance will be measured.This creates two `RTCPeerConnection` with the provided RTCConfiguration and creates a data channel between those two. Then transfers a relatively large random data between the two over the relay server, measures how much time it took to transfer the data. And returns the results. 

Sample Output:

```js
{
    elapsed : 305, // ms
    speed   : 5.8  // mbps
}
```
> If you are willing to run this test, you can `checkPeerConnection`. Also it shows an estimated result of what was observed at that time. 

### 4. `checkInternetSpeed` and `checkInternetSpeedSilent`:
> `checkInternetSpeed("probe/file.url", [verbose]) // Returns Promise`

Example use: 
```js
_rtc.checkInternetSpeed("https://example-file.com/file.jpg")
    .then(speed=>console.log(`Your speed is ${speed}mbps`))
    .catch(()=>console.log("could not test Internet Speed"));
```
This function takes a file URL (Give at least >1mb for better results), somewhere in the web (better if it's in the same server as your TURN server), downloads the file and observes the download speed. This function makes use of the `fetch` API, so won't work with browsers that doesn't have `fetch` support (you can use a polyfill). This function returns the internet speed in `mbps`.

 One might Argue, Internet speed is not part of WebRTC. Well, If you don't have a decent internet connection WebRTC applications might now work. And it's always good to know if it will work or not. Hence, this function got a place here. 

 > Make sure the file you supplied isn't too large `>2mb` and also make sure the file is CORS enabled (has `access-control-allow-origin` header);

**Please note:** The users's *actual* internet speed and speed measured here can be different. This measures internet speed between the user's computer and the server the file was in and can be affected by a lot of factors. In my testing roughly `~1mbps` speed was enough for a smooth video call.

> Also, transfer rate over WebRTC can be significantly different from the measured internet speed, as it may or may not involve the server and may use a different protocol.

> This function can only give and estimate of the observed download speed. Upload speed is not measured. 

### 5. `countDevies` and `countDeviesSilent`:
 > `countDevies([verbose = false]) // Returns Promise`

Example use:
```js
_rtc.countDevies()
    .then(result=>console.log(`You have ${result.audio.in} audio input devices`))
    .catch(()=>console.log("device count failed"));
```
 This function counts all the audio video input output devices available(sort of).It returns an object like this: 
```js
{
    audio   : {in: 0, out: 0},
    video   : {in: 0, out: 0},
    unknown : 0
}
```
> A point to note here: The current API does not give a count of video output devices In some cases doesn't give count for audio output devices too, so these counts will be 0 most of the time. The value is put there just for aesthetics. Besides, if you can see the output on your display, You definitely have at least one video output, so nothing to freak out 🤞🏼

## Utilities
These functions are internally used and are exposed to make RTC application development easier.

### 6. `getUserMedia` and `getUserMediaSilent`: 

> `getUserMedia(constraints, [verbose]) // Returns Promise`

Example use: 
```js
_rtc.getUserMedia(MediaTrackConstraints)
    .then(stream=>{
        document.querySelector(".video").srcObject = stream;
    })
    .catch(()=>console.log("could not get media stream"));
```
If you are tired of handling different versions of `getUserMedia`, `webkitGetUserMedia` and the latest `mediaDevices.getUserMedia`, this function handles it for you. No matter what version of the API your browser supports, this function will call that version of the API and returns a promise with your media stream (or error). 

this function takes [MediaTrackConstraints](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints) as argument.
### 7. `createRTCPeerConnection`: 
> `createRTCPeerConnection(peerConfiguration)`

This function creates a new RTCPeerConnection instance. It handles the API variations of `RTCPeerConnection`, `webkitRTCPeerConnection` and `mozRTCPeerConnection`. Returns `null` if none are supported.

## Misc Utility Functions:
This tool also comes with some utility functions for the app developer's convenience. The functions were made for internal use of the tool and then provided for the end user. 

### The `utils` object: 
Smaller utilities are in the utils object. Mostly related to webRTC.

#### 1. `utils.flat`: 
> Returns Promise

this function takes a **promise as argument** and returns **another promise**. If the source promise is resolved, this functions's promise resolves with the result. If the source promise is rejected. This function's promise resoves with `null`. If you are working with `async-await` this will save you a lot of `try-catch` block. This works with any types of promises. This function is used to generate all the `silent` versions of this tool.

#### 2. `utils.dom`: 
This consists of two functions. Both are used to attach and detatch media stream to a dom element (`video` or `audio` tag). Why you may ask, because, new implementation has the `srcObject` property, older browsers had to use `createObjectURI` function to convert the stream into a Object URI. this will handle the variation for you.
Both functions return the DOM element.
##### 1. `utils.dom.addStreamToDOM(domElement, stream)`: 
Adds a media stream to a DOM element. Example use: 
```js
// Let's assume we got a media stream called `stream`
let domElement = document.querySelector("video.test");
_rtc.utils.dom.addStreamToDOM(domElement,stream);
```
##### 2. `utils.dom.addStreamToDOM(domElement, stream)`: 
Removes any media astream from DOM element. Example use: 
```js
// Let's assume we got a media stream called `stream`
let domElement = document.querySelector("video.test");
_rtc.utils.dom.removeStreamToDOM(domElement);
```

#### 3. `utils.stream`:
this object only contains one utility function now. This namespace is kept to add more functions later. 

##### 1. `utils.stream.stopMediaStream` and `utils.stream.stopMediaStreamSilent`:
This function takes a media Stream and stops all the tracks associated with it. This also releases the input devices. This is the IDEAL way to stop a media stream once you are done with it.

> this does not return a promise but the silent version is there to automatically handle any errors that may appear (since they are mostly non important)

Example use: 
```js
// For example, if we have a media stream named `stream`.
_rtc.utils.stream.stopMediaStreamSilent(stream);
```

*** 
This package is released under the MIT license, feel free to contribute.

made with 🖤 and JavaScript by Anam Ahmed.
