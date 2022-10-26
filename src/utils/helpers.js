export function createScript(src, id = "") {
  const script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("id", id);
  // eslint-disable-next-line no-undef
  script.setAttribute("src", src);

  return script;
}
