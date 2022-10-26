import React from "react";
import { createRoot } from "react-dom/client";
import Popup from "../components/Popup";

// TODO Make demo video and instructions
// TODO Beta test
// TODO Ship extension

initGA();

function Root() {
  return <Popup />;
}

const root = createRoot(document.getElementById("root"));
root.render(<Root />);
