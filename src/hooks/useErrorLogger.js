import { useCallback, useContext } from "react";
import ErrorLogContext from "../data_providers/ErrorLogContext";

export default function useErrorLogger() {
  const { log } = useContext(ErrorLogContext);
  return useCallback(
    (source, label, errorObject) => {
      log(source, label, errorObject);
    },
    [log]
  );
}
