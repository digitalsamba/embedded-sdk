export const enumerateDevices = async () => {
  let devices: MediaDeviceInfo[] = [];

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    devices = await navigator.mediaDevices.enumerateDevices();

    stream.getTracks()?.forEach((track) => track.stop());
  } catch (err) {
    console.error('Could not enumerate available devices, ', err);
    devices = await navigator.mediaDevices.enumerateDevices();
  }

  return devices;
};
