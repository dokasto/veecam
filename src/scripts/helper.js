import { VIDEO_MEDIA_CONSTRAINT } from "../constants";

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
      // console.log("devices", devices);
      return [...devices, virtualDevice];
    });
  };
}

export function monkeyPatchGetUserMedia(
  virtualDeviceId,
  devicePrefs,
  callback,
  canvas
) {
  const getUserMediaFn = navigator.mediaDevices.getUserMedia.bind(
    navigator.mediaDevices
  );

  navigator.mediaDevices.getUserMedia = function (constraints, ...args) {
    return new Promise((resolve, reject) => {
      if (shouldIntercept(constraints, virtualDeviceId)) {
        getSourceVideoId(devicePrefs, (soureVideoDeviceId) => {
          const processedConstraints =
            soureVideoDeviceId == null
              ? { ...constraints }
              : {
                  audio: { ...constraints.audio },
                  video: {
                    ...constraints.video,
                    deviceId: { exact: soureVideoDeviceId },
                  },
                };

          getUserMediaFn(processedConstraints)
            .then((stream) => {
              const captureStream = canvas.captureStream(50);
              callback(stream);
              resolve(captureStream);
              return captureStream;
            })
            .catch(reject);
        });
      } else {
        getUserMediaFn(constraints, ...args)
          .then(resolve)
          .catch(reject);
      }
    });
  };
}

function shouldIntercept(constraints, virtualDeviceId) {
  if (typeof constraints !== "object") {
    return false;
  }

  if (Array.isArray(constraints)) {
    return false;
  }

  for (const prop of Object.keys(constraints)) {
    if (
      (prop === "deviceId" || prop === "exact") &&
      constraints[prop] === virtualDeviceId
    ) {
      return true;
    } else if (shouldIntercept(constraints[prop], virtualDeviceId)) {
      return true;
    }
  }

  return false;
}

function getSourceVideoId(devicePrefs, callback) {
  navigator.mediaDevices.enumerateDevices().then((devices) => {
    const intendedDevice = devicePrefs.devices.find(
      (device) => device.deviceId === devicePrefs.video
    );
    for (const device of devices) {
      if (
        device.label === intendedDevice.label &&
        device.kind === intendedDevice.kind
      ) {
        callback(device.deviceId);
        return;
      }
    }
    callback(null);
  });
}

function applyFilter(stream) {
  /**
   * - Record meeting with full transcription
   * - Raise hands in meetings
   * - Playback a presentation
   */
  return stream;
}
