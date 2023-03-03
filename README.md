## Description

Digital Samba Embedded SDK - control easily with JS your iframe integration.

### Usage with NPM

Add it to dependency list using your preferred package manager:

`npm install @digitalsamba/embedded-sdk`

or

`yarn install @digitalsamba/embedded-sdk`

After installation, use it in your application code using provided import:

```js
const DigitalSambaEmbedded = require('@digitalsamba/embedded-sdk');

// or, using imports
import DigitalSambaEmbedded from '@digitalsamba/embedded-sdk';
```

This package is written in TypeScript, so type definitions are also available:

```ts
import { SendMessageType, ReceiveMessageType /* ...etc */ } from '@digitalsamba/embedded-sdk';
```

### Initialization

Library provides alternative initialization styles. Using the class constructor you can configure it and load the frame
in one call:

```js
const api = new DigitalSambaEmbedded(InitOptions, InstanceProperties /* optional */);
```

or you can pre-configure the instance and then load it on-demand:

```js
// notice `createControl` vs constructor call
const api = DigitalSambaEmbedded.createControl(InitOptions);

// ...
// when necessary, load the frame:
api.load(InstanceProperties /* optional */);
```

### InitOptions

`InitOptions` has the following fields:

- `root` - HTMLElement. If specified, target frame will be created within it.
- `frame` - HTMLIFrameElement to be wrapped.
- `url` - full URL to be applied as frame src. Must include protocol and `token` query param for private rooms;
- `team` - team name string
- `room` - room identifier string
- `token` - optional string for authentication, mainly for private rooms

To successfully initialize an instance of the wrapper one of following combinations needs to be used:

- `root + team + room` - will create a controlled frame inside `root` element
- `frame + team + room` - will attach to existing frame
- `frame` - will attach to existing frame (assuming you've manually specified correct frame src)
- `root + url` - will create a frame inside `root` element

Remember to always specify `allow="camera; microphone; display-capture; autoplay;"` and `allowFullscreen="true"` attributes on iframe if you want to wrap around an existing iframe.

### InstanceProperties

- `frameAttributes` - list of attributes to be applied to target iframe
- `reportErrors` - boolean, false by default. Whether to report misconfiguration or runtime errors to console

### Usage

To listen for events, attach listener for any of supported events:

```js
api.on('userJoined', (data) => {
  // ...
});

api.on('userLeft', (data) => {
  // ...
});
```

Error event can provide useful details:
```js
api.on('appError', (error) => {
  console.log(error);

  /* outputs  {
      name: 'not-allowed',
      message:
        'Recording disabled. You’ll need to edit this room’s properties to record sessions in this room',
      data: {
        type: 'recording'
      }
    },
  */
});
```


For debugging purposes, you can also listen to all events simultaneously
```js
api.on('*', (data) => {
  console.log(data);
});
```

Also see `dist/index.html` for more examples.

To send commands, api instance provides handy utilities:

```js
api.toggleVideo();
// ...
api.disableAudio();
```

---

### Available events:
- `appError`
- `userJoined`
- `userLeft`
- `videoEnabled`
- `videoDisabled`
- `audioEnabled`
- `audioDisabled`
- `screenshareStarted`
- `screenshareStopped`
- `recordingStarted`
- `recordingStopped`
- `recordingFailed`
- `layoutModeChanged`
- `activeSpeakerChanged`

### Available commands:
- `listParticipants()`
- `enableVideo()`
- `disableVideo()`
- `toggleVideo(newState?: boolean)`
- `enableAudio()`
- `disableAudio()`
- `toggleAudio(newState?: boolean)`
- `startScreenshare()`
- `stopScreenshare()`
- `startRecording()`
- `stopRecording()`
- `showToolbar()`
- `hideToolbar()`
- `toggleToolbar(newState?: boolean)`
- `changeLayoutMode(mode: 'tiled' | 'auto')`
- `leaveSession()`
- `endSession()`
- `requestToggleAudio(userId: string)`
- `requestMute(userId: string)`
- `requestUnmute(userId: string)`
