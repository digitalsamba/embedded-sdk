# Changelog

Historical list of changes in releases

## [v0.0.46] - 2025-04-30
* Update allowBroadcast types to reflect new API ([#71949475](https://github.com/digitalsamba/embedded-sdk/commit/7194947501c83ed40b727f6fd85d4df8fc59881f)).

## [v0.0.45] - 2025-04-14
* Add video virtual backgrounds support ([#bee6e78e](https://github.com/digitalsamba/embedded-sdk/commit/bee6e78e303b8219a5a26c36bbb45e8549e452cc)).
* Add new methods for managing custom tiles ([#6f0fa570](https://github.com/digitalsamba/embedded-sdk/commit/6f0fa57028d332d6fd21c5257980e93355ebcb9c)).

## [v0.0.44] - 2025-01-23
* Add new `createWhiteboard` method, and update exist whiteboard methods ([#48058f61](https://github.com/digitalsamba/embedded-sdk/commit/48058f61a85a5f8095a4d8bf7eabd1b4be57ad02)).
* Add new methods for managing library files ([#870ce040](https://github.com/digitalsamba/embedded-sdk/commit/870ce040e618131106595fd242f2f6b8db4b9cd8)).

## [v0.0.43] - 2025-01-09
* Add a `templateParams` param to init options ([#c8c5c43e](https://github.com/digitalsamba/embedded-sdk/commit/8f3fb6c678cd285afdf031990d9bdfb8ad3790fe)).

## [v0.0.42] - 2024-12-27
* Don't try to request user media to enumerate media devices if no devices were preconfigured ([#cce3487](https://github.com/digitalsamba/embedded-sdk/commit/cce34876ad17935c76d0d94f3472ff822a43bd72)).
* Add a list of new methods for whiteboard management `openWhiteboard`, `closeWhiteboard`, `toggleWhiteboard` [#cd611f3](https://github.com/digitalsamba/embedded-sdk/commit/cd611f377a64ccaa47273b72bde82c05a3f39212)
* Add `addImageToWhiteboard` method (#4694a47)[https://github.com/digitalsamba/embedded-sdk/commit/4694a478b960465af58f6c29f1ae1000afe8765c]
* Add `speakerStoppedTalking` event to type definitions (#d0510bb)[https://github.com/digitalsamba/embedded-sdk/commit/d0510bbcad6d4cfb74a2d089af279ae84f866637]

## [v0.0.41] - 2024-09-17
* Support `userLeftBatch` event from frontend, emit individual `userLeft` events for users in the payload. ([#6474ee5](https://github.com/digitalsamba/embedded-sdk/commit/6474ee5a38b1d557ade2ed6fcc9411eab0287f83)).

## [v0.0.40] - 2024-07-12
* Add a `requireRemoveUserConfirmation` param to initial settings ([#564e3ac](https://github.com/digitalsamba/embedded-sdk/commit/564e3acc718ed2f3a172d96b07b538fda2ed8fb3)).

## [v0.0.37] - 2024-06-13
* Add support for custom 'tileActions' ([#64](https://github.com/digitalsamba/embedded-sdk/pull/64)).
* Add `chatMessageReceived`  event to type definitions ([#ed7cd15](https://github.com/digitalsamba/embedded-sdk/commit/ed7cd15c8e5fdde32935c814e2573f6a4d72ce9d))
* Add `requireConfirmation` prop to `endSession` command (true by default) ([#e5476c6](https://github.com/digitalsamba/embedded-sdk/commit/e5476c6af06a05d0f4ff8c404e1270073cf65f91))

## [v0.0.35] - 2023-11-16
* Add `sessionEnded`  event to type definitions ([#146f159](https://github.com/digitalsamba/embedded-sdk/commit/146f1599e74590aa0a3f130bf38cee1071120874))

## [v0.0.34] - 2023-11-01
* Add `UICallback` commands to attach listeners for custom interface actions in embedded app ([#59](https://github.com/digitalsamba/embedded-sdk/pull/59))
* Add `changeRole` command and `roleChanged` event ([#60](https://github.com/digitalsamba/embedded-sdk/pull/60))


## [v0.0.33] - 2023-10-05
* Add `appLanguage` field to room state to match rooms localization language
* Add virtual background image `name` field to room state
* Expose list of active media devices in room state

## [v0.0.31] - 2023-09-07
* Allow listening to document or window events fired inside the frame ([#47](https://github.com/digitalsamba/embedded-sdk/pull/47))
* Allow pre-selecting app language using init options ([#48](https://github.com/digitalsamba/embedded-sdk/pull/48))

## [v0.0.29] - 2023-09-01
* Fix an issue with EventEmitter import in typescript declaration

## [v0.0.28] - 2023-08-24
* Connect demos to test drive endpoint to dynamically create demo rooms
* Allow pre-selecting media devices through initial settings ([#44](https://github.com/digitalsamba/embedded-sdk/pull/44))
* Add support for custom CNAME, handle cname property in init options ([#45](https://github.com/digitalsamba/embedded-sdk/pull/45))

## [v0.0.27] - 2023-08-09
* Fix an issue with stored state not resetting properly when creating a new control instance

## [v0.0.26] - 2023-08-09
* Add missing type definitions for newest methods and state fields ([#01a3bf1](https://github.com/digitalsamba/embedded-sdk/commit/01a3bf1730b03db453acf091e39e4c2c6ea61e22))
