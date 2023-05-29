# Description

Digital Samba Embedded SDK - control easily with JS your iframe integration.

## Usage with NPM

Add it to dependency list using your preferred package manager:

`npm install @digitalsamba/embedded-sdk`

or

`yarn install @digitalsamba/embedded-sdk`

[NPM Package link](https://www.npmjs.com/package/@digitalsamba/embedded-sdk)


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

## Initialization

---
### Secure context

️Since the embedded app relies on media device capabilities, it needs to be accessed in a [secure context](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts) (`https://` versus `http://`).

For local development, most browsers treat `http://localhost` and `http://127.0.0.1` as secure.

---
### Configuring SDK instance

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

## Usage
Once initialized you can listen to events emitted by embedded app and control it by sending commands.

Additional functionality like room [permission management](https://docs.digitalsamba.com/reference/sdk/properties/permissionmanager) and [exposed state](https://docs.digitalsamba.com/reference/sdk/properties/roomstate) is also available.

### Events
To listen for events, attach listener for any of supported events:

```js
api.on('userJoined', (data) => {
  // ...
});
```
---

💡 See the [events docs](https://docs.digitalsamba.com/reference/sdk/events) for a full list of available events.

---
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

### Commands

To send commands, api instance provides handy utilities:

```js
api.toggleVideo();
// ...
api.disableAudio();
```
---

💡 Full list of available commands with usage examples can be found on [documentation website](https://docs.digitalsamba.com/reference/sdk/methods).


### Examples

There are several demos available with example integrations
* [Simple Videoroom](https://digitalsamba.github.io/embedded-sdk/dist/demo/videoroom.html) - simple demo that showcases basic integration, listening to events and running commands
* [Initial settings](https://digitalsamba.github.io/embedded-sdk/dist/demo/initial-config.html) - examples of setting default settings prior to loading the frame
* [Managed State demo](https://digitalsamba.github.io/embedded-sdk/dist/demo/managed-state.html) - shows how to use exposed state in complex scenarios, listening to events, checking for permissions and accessing stored data.
