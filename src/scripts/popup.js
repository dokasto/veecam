import React from "react";
import { createRoot } from "react-dom/client";
import Popup from "../components/Popup";

function Root() {
  return <Popup />;
}

const root = createRoot(document.getElementById("root"));
root.render(<Root />);
