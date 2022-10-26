import {
  getStoredColorCorrectionPrefs,
  getStoredDevicePrefs,
} from "../utils/storage";
import { EXTENSION_SCRIPT_TAG_ID } from "../constants";
import { createScript } from "../utils/helpers";

const extensionScript = createScript(
  // eslint-disable-next-line no-undef
  chrome.runtime.getURL("build/inject.js"),
  EXTENSION_SCRIPT_TAG_ID
);

const head =
  document.head ||
  document.getElementsByTagName("head")[0] ||
  document.documentElement;

Promise.all([getStoredColorCorrectionPrefs(), getStoredDevicePrefs()]).then(
  (prefs) => {
    extensionScript.setAttribute(
      "prefs",
      JSON.stringify({
        colorCorrectionPrefs: prefs[0],
        devicePrefs: prefs[1],
        // eslint-disable-next-line no-undef
        chromeExtensionBase: chrome.runtime.getURL("/"),
      })
    );

    try {
      head.insertBefore(extensionScript, head.lastChild);
    } catch (e) {
      console.info(e);
    }
  }
);
