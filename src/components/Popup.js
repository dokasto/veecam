import React, { useCallback, useEffect } from "react";
import { createUseStyles } from "react-jss";
import useGALogger from "../hooks/useGALogger";

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
  },
  title: {
    display: "block",
    fontWeight: "bolder",
    fontSize: 20,
  },
  popup: {
    padding: 12,
    width: 120,
    height: 100,
    borderRadius: 8,
  },
  button: {
    padding: "4px 8px",
    cursor: "pointer",
    marginTop: 20,
  },
});

export default function Popup() {
  const classes = useStyles();
  const { logPopupImpression } = useGALogger();

  useEffect(() => {
    logPopupImpression();
  }, [logPopupImpression]);

  const onClick = useCallback(() => {
    // eslint-disable-next-line no-undef
    chrome.runtime.openOptionsPage();
  }, []);

  return (
    <div className={classes.popup}>
      <h2 className={classes.title}>VeeCam</h2>
      <button onClick={onClick} className={classes.button}>
        Preferences
      </button>
    </div>
  );
}
