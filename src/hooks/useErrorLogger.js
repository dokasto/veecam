import { useCallback, useContext } from "react";
import ErrorLogContext from "../data_providers/ErrorLogContext";
import useGALogger from "./useGALogger";

export default function useErrorLogger() {
  const { log } = useContext(ErrorLogContext);
  const { logError } = useGALogger();
  return useCallback(
    (source, label, errorObject) => {
      logError({ error: errorObject.toString(), source, label });
      log(source, label, errorObject);
    },
    [log, logError]
  );
}
