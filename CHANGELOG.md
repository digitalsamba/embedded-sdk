# Changelog

Historical list of changes in releases
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
