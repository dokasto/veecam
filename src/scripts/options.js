import React from "react";
import { createRoot } from "react-dom/client";
import { createUseStyles } from "react-jss";
import OptionsApp from "../components/OptionsApp";
import MediaStreamProvider from "../data_providers/MediaStreamProvider";
import MediaDevicesProvider from "../data_providers/MediaDevicesProvider";
import ErrorLogProvider from "../data_providers/ErrorLogProvider";

const useStyles = createUseStyles({
  "@global": {
    body: {
      backgroundColor: "#ecf0f1",
      fontSize: 16,
      fontFamily: "'Source Sans Pro', sans-serif",
      fontWeight: 400,
      color: "#2c3e50",
    },
    "*": {
      boxSizing: "border-box",
    },
    "input[type=range]": {
      appearance: "none",
      background: "transparent",
    },
    "input[type=range]::-webkit-slider-runnable-track": {
      backgroundColor: "#ecf0f1",
      borderRadius: 8,
      width: 4,
      cursor: "pointer",
    },
    "input[type=range]::-webkit-slider-thumb": {
      background: "#2c3e50",
      appearance: "none",
      cursor: "pointer",
      borderRadius: 8,
      width: 20,
      height: 20,
    },
  },
  title: {
    display: "inline-block",
    verticalAlign: "center",
    marginTop: 24,
    fontWeight: "bolder",
    fontSize: 28,
  },
  app: {
    width: 1200,
    margin: "0 auto",
    display: "flex",
  },
  optionsApp: {
    marginLeft: 24,
    flexGrow: 1,
    marginTop: 20,
  },
});

function Root() {
  const classes = useStyles();
  return (
    <div className={classes.app}>
      <h2 className={classes.title}>VeeCam</h2>
      <div className={classes.optionsApp}>
        <ErrorLogProvider>
          <MediaDevicesProvider>
            <MediaStreamProvider>
              <OptionsApp />
            </MediaStreamProvider>
          </MediaDevicesProvider>
        </ErrorLogProvider>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<Root />);
