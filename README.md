# Real life Capability testing and utilities for WebRTC. 
 Testing webRTC capabilities by trying to use them. Not a feature detector. A capability tester.Also packs some utilities to make developer's live easier while making webRTC tools. 

## What It's not: 
This is not a replacement of [Modernizr](https://modernizr.com/) or similar tools. This will not check if a feature is supported by the browser. For example a browser might have support for `getUserMedia`. Which Modernizr or similar tool will find out. But having support for `getUserMedia` does not mean that the user is guaranteed to access the feature. Maybe the user does not have a webcam, or the user's audio input device might be broken.

Or in a different scenario, maybe the users's firewall will block any Peer connection and you need to know if the user's internet connection supports peer connection. 

this package will help you test for these real life scenarios in your webRTC application.

> Please include the [webRTC Adapter](https://www.npmjs.com/package/webrtc-adapter) package in  your project. This plugin tries to cover most of the variations of the API but adapter covers almost all of it. 
## What Can It do

* Test If `getUserMedia` Actually works.
* Test if the browser and internet is capable of `RTCPeerConnection`
* Test if the internet Speed is good enough for WebRTC streaming.
* Handle API differences for `getUserMedia`, adding stream to DOM.
* Provide utility functions for webRTC media application.

## Installation:

### Using a package manager:
To install the package use this command. 
```sh
yarn add webrtc-test-suite
```
Then you can import it in your code like this:
```js
import _rtc from "webrtc-test-suite";
```

### Including the JS file directly:
Add this to your HTML file:
```html
<script src="https://unpkg.com/webrtc-test-suite@1.2.3/dist/index.js"></script>
```
Yoou will get a global object called: `_rtc`. And you can access all the functionalities from that object.

## How to use
This tool comes with a lot of capability test and utility functions. You can use them to create WebRTC enabled application and positively determine feature support. All the functions are described below.

> Functions that return a promise has a `silent` version that does not reject the promise on error. Instead returns null. Good for working with `async-await`.

> Functions that accepts the `verbose` (Boolean) argument, will generate logs in the console if `verbose` is set to `true`. Default is `false`.

### 1. `checkMediaCapture` and `checkMediaCaptureSilent`:
> `checkMediaCapture(constraints, [verbose = false]); // Returns Promise`

Example Use: 
```js
_rtc.checkMediaCapture({audio: true, video: true})
    .then(()=>console.log("Could capture media stream"))
    .catch(()=>console.error("Could not capture media stream"));
```
This function takes [MediaTrackConstraints](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints) as argument, calls `getUserMedia` API with those constraints, retrieves the Media stream, Checks if audio and video stream is active and according to the [constraints](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints) provided. Then automatically stops the media capture and returns the result.

### 2. `checkPeerConnection` and `checkPeerConnectionSilent`:
> `checkPeerConnection(RTCConfiguration, [verbose = false]) // Returns Promise`

Example Use: 
```js
_rtc.checkPeerConnection({})
    .then(()=>console.log("Peer connection works"))
    .catch(()=>console.log("Peer connection does not work"));
```
This function takes [RTCConfiguration](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/RTCPeerConnection#RTCConfiguration_dictionary) as argument Creates two `RTCPeerConnection` with the provided RTCConfiguration and creates a data channel between those two. Check if data transfer is possible between the two `RTCPeerConnection` instances. And returns the results. 

> Tip: If you want to test your STUN (relay) server, pass `iceTransportPolict: "relay"` ([See Documentation](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/RTCPeerConnection#RTCIceTransportPolicy_enum)) with your RTCConfiguration. This will force the two PeerConnection to communicate through the relay server. 

### 3. `checkInternetSpeed` and `checkInternetSpeedSilent`:
> `checkInternetSpeed("probe/file.url", [verbose]) // Returns Promise`

Example use: 
```js
_rtc.checkInternetSpeed("https://example-file.com/file.jpg")
    .then(speed=>console.log(`Your speed is ${speed}mbps`))
    .catch(()=>console.log("could not test Internet Speed"))
```
This function takes a file URL (Give at least >1mb for better results), somewhere in the web (better if it's in the same server as your TURN server), downloads the file and observes the download speed. This function makes use of the `fetch` API, so won't work with browsers that doesn't have `fetch` support (you can use a polyfill). This function returns the internet speed in `mbps`.

 One might Argue, Internet speed is not part of WebRTC. Well, If you don't have a decent internet connection WebRTC applications might now work. And it's always good to know if it will work or not. Hence, this function got a place here. 

 > Make sure the file you supplied isn't too large `>2mb` and also make sure the file is CORS enabled (has `access-control-allow-origin` header);

**Please note:** The users's *actual* internet speed and speed measured here can be different. This measures internet speed between the user's computer and the server the file was in and can be affected by a lot of factors. In my testing roughly `~1mbps` speed was enough for a smooth video call.

 ### 4. `countDevies` and `countDeviesSilent`:
 > `countDevies([verbose = false]) // Returns Promise`

Example use:
```js
_rtc.countDevices()
    .then(result=>console.log(`You have ${result.audio.in} audio input devices`)
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
> A point to note here: The current API does not give a count of video output devices, so the count will always be 0. The value is put there just for aesthetics. Besides, if you can see the output on your display, You definitely have at least one video output, so nothing to freak out 🤞🏼



### 5. `getUserMedia` and `getUserMediaSilent`: 

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

## Utility Functions:
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

made with 🖤 and JavaScript.