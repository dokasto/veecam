import {
  getStoredColorCorrectionPrefs,
  getStoredDevicePrefs,
} from "../utils/storage";
import { EXTENSION_SCRIPT_TAG_ID } from "../constants";

const extensionScript = createScript(
  // eslint-disable-next-line no-undef
  chrome.runtime.getURL("build/inject.js"),
  EXTENSION_SCRIPT_TAG_ID
);
const googleAnalyticsScript = createScript(
  "https://www.googletagmanager.com/gtag/js?id=G-YSB1Z3YLZH"
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
    head.insertBefore(googleAnalyticsScript, head.lastChild);
    head.insertBefore(extensionScript, head.lastChild);
  }
);

function createScript(src, id = "") {
  const script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("id", id);
  // eslint-disable-next-line no-undef
  script.setAttribute("src", src);

  return script;
}
