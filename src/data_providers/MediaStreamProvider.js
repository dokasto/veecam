import React, { useCallback, useMemo, useState } from "react";
import MediaStreamContext from "./MediaStreamContext";
import PropTypes from "prop-types";

export default function MediaStreamProvider({ children }) {
  const [stream, _setStream] = useState(null);

  const setStream = useCallback((newStream) => {
    _setStream(newStream);
  }, []);

  const value = useMemo(
    () => ({
      stream,
      setStream,
    }),
    [setStream, stream]
  );

  MediaStreamProvider.propTypes = {
    children: PropTypes.node,
  };

  return (
    <MediaStreamContext.Provider value={value}>
      {children}
    </MediaStreamContext.Provider>
  );
}
