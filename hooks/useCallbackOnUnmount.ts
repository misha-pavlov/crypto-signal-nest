import { useRef, useEffect } from "react";

const useCallbackOnUnmount = (cb: VoidFunction) => {
  const cbRef = useRef(cb);

  useEffect(() => {
    cbRef.current = cb;
  }, [cb]);

  useEffect(() => () => cbRef.current && cbRef.current(), []);
};

export default useCallbackOnUnmount;
