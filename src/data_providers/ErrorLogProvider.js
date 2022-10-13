import React, { useCallback, useMemo, useState } from "react";
import ErrorLogContext from "./ErrorLogContext";
import PropTypes from "prop-types";

export default function ErrorLogProvider({ children }) {
  const [errors, setErrors] = useState([]);
  const log = useCallback(
    (source, label, errorObject) => {
      const nextError = { source, label, errorObject };
      console.error(nextError);
      setErrors([...errors, nextError]);
    },
    [errors]
  );

  const value = useMemo(
    () => ({
      log,
      errors,
    }),
    [errors, log]
  );

  ErrorLogProvider.propTypes = {
    children: PropTypes.node,
  };

  return (
    <ErrorLogContext.Provider value={value}>
      {children}
    </ErrorLogContext.Provider>
  );
}
