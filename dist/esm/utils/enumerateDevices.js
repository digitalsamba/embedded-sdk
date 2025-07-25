var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const enumerateDevices = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let devices = [];
    try {
        // Try to enumerate without requesting permissions
        devices = yield navigator.mediaDevices.enumerateDevices();
        console.log('SDK: enumerateDevices devices', devices);
        // Check if we got real device IDs and labels (indicates we already have permissions)
        const hasRealDeviceIds = devices.some((device) => device.deviceId &&
            device.deviceId !== '' &&
            device.deviceId !== 'default' &&
            device.label !== '');
        console.log('SDK: enumerateDevices hasRealDeviceIds', hasRealDeviceIds);
        if (!hasRealDeviceIds) {
            // We don't have permissions yet, request them with minimal constraints
            const stream = yield navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false,
                },
                video: {
                    width: { ideal: 320 },
                    height: { ideal: 240 },
                    frameRate: { ideal: 15 },
                },
            });
            console.log('SDK: enumerateDevices stream', stream);
            devices = yield navigator.mediaDevices.enumerateDevices();
            (_a = stream.getTracks()) === null || _a === void 0 ? void 0 : _a.forEach((track) => track.stop());
        }
    }
    catch (err) {
        console.error('Could not enumerate available devices, ', err);
        devices = yield navigator.mediaDevices.enumerateDevices();
    }
    return devices;
});
