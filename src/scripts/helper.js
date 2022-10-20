/**
 * Utility functions
 */

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
    return enumerateDevicesFn().then((devices) => [...devices, virtualDevice]);
  };
}

export function monkeyPatchGetUserMedia(virtualDeviceId, callback, canvas) {
  const getUserMediaFn = navigator.mediaDevices.getUserMedia.bind(
    navigator.mediaDevices
  );

  navigator.mediaDevices.getUserMedia = function (constraints, ...args) {
    return shouldIntercept(constraints, virtualDeviceId)
      ? getUserMediaFn(
          removeDeviceIDFromConstraint(constraints, virtualDeviceId),
          ...args
        ).then((stream) => {
          callback(stream);
          return canvas.captureStream(50);
        })
      : getUserMediaFn(constraints, ...args);
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

function removeDeviceIDFromConstraint(valueOfAnyType, virtualDeviceId) {
  if (valueOfAnyType == null) {
    return valueOfAnyType;
  }

  if (typeof valueOfAnyType !== "object") {
    return valueOfAnyType;
  }

  if (Array.isArray(valueOfAnyType)) {
    return valueOfAnyType;
  }

  const newObj = {};

  for (const prop of Object.keys(valueOfAnyType)) {
    if (prop === "deviceId") {
      if (valueOfAnyType[prop] === virtualDeviceId) {
        continue;
      } else if (
        valueOfAnyType[prop] != null &&
        "exact" in valueOfAnyType[prop] &&
        valueOfAnyType[prop].exact === virtualDeviceId
      ) {
        continue;
      } else {
        newObj[prop] = removeDeviceIDFromConstraint(
          valueOfAnyType[prop],
          virtualDeviceId
        );
      }
    } else {
      newObj[prop] = removeDeviceIDFromConstraint(
        valueOfAnyType[prop],
        virtualDeviceId
      );
    }
  }

  return newObj;
}

function applyFilter(stream) {
  /**
   * - Record meeting with full transcription
   * - Raise hands in meetings
   * - Playback a presentation
   */
  return stream;
}
