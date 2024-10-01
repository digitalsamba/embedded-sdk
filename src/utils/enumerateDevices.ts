const isFirefox = () => navigator.userAgent.toLowerCase().includes('firefox');

export const enumerateDevices = async () => {
  let devices: MediaDeviceInfo[] = [];

  if (isFirefox()) {
    // getUserMedia call for FF;
    await navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then(async () => {
        devices = await navigator.mediaDevices.enumerateDevices();
      })
      .catch(async () => {
        devices = await navigator.mediaDevices.enumerateDevices();
      });
  } else {
    devices = await navigator.mediaDevices.enumerateDevices();
  }

  return devices;
};
