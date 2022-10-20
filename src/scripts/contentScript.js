import {
  getStoredColorCorrectionPrefs,
  getStoredDevicePrefs,
} from "../utils/storage";
import { EXTENSION_SCRIPT_TAG_ID } from "../constants";

const script = document.createElement("script");

script.setAttribute("type", "module");
script.setAttribute("id", EXTENSION_SCRIPT_TAG_ID);
// eslint-disable-next-line no-undef
script.setAttribute("src", chrome.runtime.getURL("build/inject.js"));

const head =
  document.head ||
  document.getElementsByTagName("head")[0] ||
  document.documentElement;

Promise.all([getStoredColorCorrectionPrefs(), getStoredDevicePrefs()]).then(
  (prefs) => {
    script.setAttribute(
      "prefs",
      JSON.stringify({ colorCorrectionPrefs: prefs[0], devicePrefs: prefs[1] })
    );
    head.insertBefore(script, head.lastChild);
  }
);
