export function generateUniqueID() {
  return (
    Math.random().toString(32).slice(-10) +
    Date.now() +
    Math.random().toString(34).slice(-5) +
    Math.random().toString(36).slice(-5)
  );
}

export function monkeyPatchEnumerateDevices(virtualDevice) {
  const enumerateDevicesFn = navigator.mediaDevices.enumerateDevices.bind(
    navigator.mediaDevices
  );
  navigator.mediaDevices.enumerateDevices = function () {
    return enumerateDevicesFn().then((devices) => {
      for (const device of devices) {
        if (device.deviceId === virtualDevice.deviceId) {
          return [...devices];
        }
      }
      return [...devices, virtualDevice];
    });
  };
}

export function monkeyPatchGetUserMedia(
  virtualDeviceId,
  devicePrefs,
  callback,
  canvas,
  onVirtualCamSelected
) {
  const getUserMediaFn = navigator.mediaDevices.getUserMedia.bind(
    navigator.mediaDevices
  );

  navigator.mediaDevices.getUserMedia = function (constraints) {
    return new Promise((resolve, reject) => {
      if (shouldIntercept(constraints, virtualDeviceId)) {
        getSourceVideoId(devicePrefs, (soureVideoDeviceId) => {
          const processedConstraints =
            soureVideoDeviceId == null
              ? { ...constraints, video: "video" in constraints }
              : {
                  ...constraints,
                  video: {
                    ...constraints.video,
                    deviceId: { ideal: soureVideoDeviceId },
                  },
                };
          getUserMediaFn(processedConstraints)
            .then((stream) => {
              onVirtualCamSelected();
              callback(stream);
              if (soureVideoDeviceId == null) {
                resolve(stream);
                return stream;
              } else {
                const captureStream = canvas.captureStream(50);
                // FIXME This returns BGRA which breaks on Zoom calls

                // add original audio tracks to the canvas stream if any
                stream.getTracks().forEach((track) => {
                  if (track.kind !== "video") {
                    captureStream.addTrack(track);
                  }
                });

                resolve(captureStream);
                return captureStream;
              }
            })
            .catch((e) => {
              onVirtualCamSelected(e);
              reject(e);
            });
        });
      } else {
        getUserMediaFn(constraints).then(resolve).catch(reject);
      }
    });
  };
}

function shouldIntercept(constraints, virtualDeviceId) {
  if (!("video" in constraints) || typeof constraints.video !== "object") {
    return false;
  }

  try {
    const deviceID =
      constraints.video.deviceId.exact ?? constraints.video.deviceId.ideal;
    return deviceID === virtualDeviceId;
  } catch (e) {
    return false;
  }
}

function getSourceVideoId(devicePrefs, callback) {
  navigator.mediaDevices.enumerateDevices().then((devices) => {
    const intendedDevice = devicePrefs?.devices.find(
      (device) => device.deviceId === devicePrefs.video
    );
    for (const device of devices) {
      if (
        device.label === intendedDevice?.label &&
        device.kind === intendedDevice?.kind
      ) {
        callback(device.deviceId);
        return;
      }
    }
    callback(null);
  });
}
