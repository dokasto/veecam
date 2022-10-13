import React, { useCallback, useContext } from "react";
import { createUseStyles } from "react-jss";
import MediaDevicesContext from "../data_providers/MediaDevicesContext";

const useStyles = createUseStyles({
  root: {
    "& label": {
      fontWeight: "bold",
    },
    "& select": {
      marginLeft: 8,
      padding: 4,
      cursor: "pointer",
      color: "#2c3e50",
      width: 300,
    },
  },
});

export default function VideoSource() {
  const classes = useStyles();
  const { devices, video, setVideo } = useContext(MediaDevicesContext);
  const onChange = useCallback(
    (e) => {
      setVideo(e.target.value);
    },
    [setVideo]
  );

  return (
    <div className={classes.root}>
      <label htmlFor="cameras">Choose Camera</label>
      <select
        defaultValue={video}
        name="cameras"
        onChange={onChange}
        id="cameras"
      >
        {devices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label}
          </option>
        ))}
      </select>
    </div>
  );
}
