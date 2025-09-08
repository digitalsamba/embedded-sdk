// Global promise to batch all enumerateDevices calls
let pendingEnumerationRequest: Promise<MediaDeviceInfo[]> | null = null;

export const enumerateDevices = async (): Promise<MediaDeviceInfo[]> => {
  // If we're already enumerating devices, wait for that same request
  if (pendingEnumerationRequest) {
    console.log('SDK: enumerateDevices - waiting for pending enumeration request');
    return pendingEnumerationRequest;
  }

  // Create a single shared promise for the entire enumeration process
  pendingEnumerationRequest = (async () => {
    let devices: MediaDeviceInfo[] = [];

    try {
      console.log('SDK: Starting device enumeration (batched for multiple calls)');

      // Try to enumerate without requesting permissions first
      devices = await navigator.mediaDevices.enumerateDevices();

      console.log('SDK: enumerateDevices devices', devices);

      // Check if we got real device IDs and labels (indicates we already have permissions)
      const hasRealDeviceIds = devices.some(
        (device) =>
          device.deviceId &&
          device.deviceId !== '' &&
          device.deviceId !== 'default' &&
          device.label !== ''
      );

      console.log('SDK: enumerateDevices hasRealDeviceIds', hasRealDeviceIds);

      if (!hasRealDeviceIds) {
        console.log('SDK: Requesting permissions with getUserMedia (single batched call)');

        // Request permissions with minimal constraints to reduce video interference
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

        console.log('SDK: enumerateDevices stream acquired');

        // Now get the actual device list with permissions
        devices = await navigator.mediaDevices.enumerateDevices();

        // Clean up the stream immediately
        stream.getTracks()?.forEach((track) => track.stop());

        console.log('SDK: enumerateDevices completed with permissions, devices:', devices);
      }

      return devices;
    } catch (err) {
      console.error('SDK: enumerateDevices error', err);

      // Fallback - try to get devices without permissions
      try {
        devices = await navigator.mediaDevices.enumerateDevices();
      } catch (fallbackErr) {
        console.error('SDK: fallback enumerateDevices also failed', fallbackErr);
        devices = [];
      }

      return devices;
    } finally {
      // Clear the pending promise once completed (success or error)
      pendingEnumerationRequest = null;
    }
  })();

  // Return the shared promise - all concurrent calls will wait for this same request
  return pendingEnumerationRequest;
};
