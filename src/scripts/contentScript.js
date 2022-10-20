const script = document.createElement("script");

script.setAttribute("type", "module");
// eslint-disable-next-line no-undef
script.setAttribute("src", chrome.runtime.getURL("build/inject.js"));

const head =
  document.head ||
  document.getElementsByTagName("head")[0] ||
  document.documentElement;

head.insertBefore(script, head.lastChild);
