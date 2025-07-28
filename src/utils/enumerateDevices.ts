export const enumerateDevices = async () => {
  let devices: MediaDeviceInfo[] = [];

  try {
    // Try to enumerate without requesting permissions
    devices = await navigator.mediaDevices.enumerateDevices();

    // Check if we got real device IDs and labels (indicates we already have permissions)
    const hasRealDeviceIds = devices.some(
      (device) =>
        device.deviceId &&
        device.deviceId !== '' &&
        device.deviceId !== 'default' &&
        device.label !== ''
    );

    if (!hasRealDeviceIds) {
      // We don't have permissions yet, request them with minimal constraints
      const stream = await navigator.mediaDevices.getUserMedia({
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

      devices = await navigator.mediaDevices.enumerateDevices();

      stream.getTracks()?.forEach((track) => track.stop());
    }
  } catch (err) {
    devices = await navigator.mediaDevices.enumerateDevices();
  }

  return devices;
};
