import { useRef, useCallback } from "react";

export default function useDebounce(callback, delay) {
  const callbackRef = useRef();
  callbackRef.current = callback;
  return useCallback(
    debounce((...args) => callbackRef.current(...args), delay),
    [callback]
  );
}

function debounce(fn, delay) {
  let timeout;
  return function (...args) {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
