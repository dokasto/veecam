import React from "react";

const ErrorLogContext = React.createContext({
  errors: [],
  log: () => {},
});

export default ErrorLogContext;
