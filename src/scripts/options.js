import React from "react";
import { createRoot } from "react-dom/client";
import { createUseStyles } from "react-jss";
import OptionsApp from "../components/OptionsApp";

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
    display: "inline-block",
    verticalAlign: "center",
    marginTop: 24,
    fontWeight: "bolder",
    fontSize: 28,
  },
  app: {
    maxWidth: 1200,
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
        <OptionsApp />
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<Root />);
