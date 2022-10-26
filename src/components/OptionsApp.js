import React from "react";
import { createUseStyles } from "react-jss";
import VideoSource from "./VideoSource";
import SelfView from "./SelfView";
import ColorControls from "../components/ColorControls";
import { useFetchMediaStream } from "../hooks/mediaStreamHooks";
import useFetchMediaDeviceList from "../hooks/useFetchMediaDeviceList";

const useStyles = createUseStyles({
  root: {
    backgroundColor: "#FFF",
    border: "2px solid #7f8c8d",
    padding: 8,
    borderRadius: 8,
  },
  preferences: {
    fontSize: 24,
    fontWeight: "light",
  },
  middle: {
    display: "flex",
    marginTop: 24,
  },
  camera: {
    width: 640,
  },
  controls: {
    flex: 1,
  },
  contact: {
    marginTop: 12,
    fontWeight: "bold",
    fontSize: 17,
  },
});

export default function OptionsApp() {
  const classes = useStyles();
  useFetchMediaStream();
  useFetchMediaDeviceList();
  return (
    <div className={classes.root}>
      <h3 className={classes.preferences}>Preferences</h3>
      <div className={classes.middle}>
        <div className={classes.camera}>
          <VideoSource />
          <SelfView />
        </div>
        <div className={classes.controls}>
          <ColorControls />
        </div>
      </div>
      <div className={classes.contact}>contact: dokasto.labs@gmail.com</div>
    </div>
  );
}
