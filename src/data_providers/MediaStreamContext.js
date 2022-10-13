import React from "react";

const MediaStreamContext = React.createContext({
  stream: null,
  setStream: () => {},
});

export default MediaStreamContext;
