import React from "react";
import { createRoot } from "react-dom/client";
import Popup from "../components/Popup";

// TODO Beta test
// TODO Make demo video and instructions
// TODO Ship extension
// TODO: Add option to toggle extension on/off

function Root() {
  return <Popup />;
}

const root = createRoot(document.getElementById("root"));
root.render(<Root />);
