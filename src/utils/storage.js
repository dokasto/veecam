const COLOR_CORRECTION_PREF_KEY = "VEECAM:COLOR_CORRECTION_KEY";
const DEVICE_PREF_KEY = "VEECAM:DEVICE_PREF_KEY";

export async function getStoredColorCorrectionPrefs() {
  const pref = await fetchFromStore(COLOR_CORRECTION_PREF_KEY);
  return pref;
}

export function saveColorCorrectionPrefs(prefs) {
  saveToStore(COLOR_CORRECTION_PREF_KEY, prefs);
}

export async function getStoredDevicePrefs() {
  const pref = await fetchFromStore(DEVICE_PREF_KEY);
  return pref;
}

export function saveDevicePrefs(prefs) {
  saveToStore(DEVICE_PREF_KEY, prefs);
}

function fetchFromStore(key) {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
    chrome.storage.sync.get(key, function (data) {
      try {
        if (data != null && key in data && data[key] != null) {
          resolve(JSON.parse(data[key]));
        } else {
          resolve(null);
        }
      } catch (e) {
        reject(e);
      }
    });
  });
}

function saveToStore(key, data) {
  // eslint-disable-next-line no-undef
  chrome.storage.sync.set({
    [key]: JSON.stringify({
      ...data,
    }),
  });
}
