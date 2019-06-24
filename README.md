# EMOJI

## Run

run to install
`yarn`

run to run the app
`yarn start`

open [http://localhost:3000/](http://localhost:3000/)

or
[DEMO](http://emoji.doublem.tech)

## Requirements

### Create an application that draws emojis on parts of people's bodies

- [x] Use Media Devices API to access a camera.
- [x] Use TensorFlow.js with a pre-trained model to detect human poses.
- [x] The app should work on the newest stable version of a Chrome browser, both mobile and desktop.
- [x] Choose both emojis and body parts freely.
- [x] The app should scale content to fit a window.
- [x] There must be a single button to switch between all available cameras.
- [x] Host the app on a free hosting under a public domain, e.g. GitHub Pages or Firebase Hosting.
- [] Bonus: use TypeScript

## Learnings

- `getMediaDevice API` works only in https or remote debuging and portfowarding (mobile)
- canvas size calculation
- resize (toolbar is not counted when using `100vh`)
- mobile flip video

## Bibliography

- [Real-time Human Pose Estimation in the Browser with TensorFlow.js](https://medium.com/tensorflow/real-time-human-pose-estimation-in-the-browser-with-tensorflow-js-7dd0bc881cd5)
- [TensorFlow Demos](https://www.tensorflow.org/js/demos)
- [Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)
- [MediaDevices](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices)
