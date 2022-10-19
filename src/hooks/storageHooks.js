import { useCallback } from "react";
import useErrorLogger from "../hooks/useErrorLogger";

const COLOR_CORRECTION_PREF_KEY = "VEECAM:COLOR_CORRECTION_KEY";

export function useGetStoredColorCorrectionPrefs() {
  const logError = useErrorLogger();
  return useCallback(async () => {
    try {
      const pref = await getData(COLOR_CORRECTION_PREF_KEY);
      console.log("pref", pref);
      return pref;
    } catch (e) {
      logError(
        "ColorCorrectionProvider",
        "failed to load color correction data from store",
        e
      );
      throw e;
    }
  }, [logError]);
}

export function useSaveColorCorrectionPrefs(prefs) {
  saveDataToStore(COLOR_CORRECTION_PREF_KEY, prefs);
}

export function getData(key) {
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

function saveDataToStore(key, data) {
  // eslint-disable-next-line no-undef
  chrome.storage.sync.set({
    [key]: JSON.stringify({
      ...data,
    }),
  });
}
