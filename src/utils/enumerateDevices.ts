const isFirefox = () => navigator.userAgent.toLowerCase().includes('firefox');

export const enumerateDevices = async () => {
  let devices: MediaDeviceInfo[] = [];

  if (isFirefox()) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      devices = await navigator.mediaDevices.enumerateDevices();

      stream.getTracks().forEach((track) => track.stop());
    } catch (err) {
      devices = await navigator.mediaDevices.enumerateDevices();
    }
  } else {
    devices = await navigator.mediaDevices.enumerateDevices();
  }

  return devices;
};
