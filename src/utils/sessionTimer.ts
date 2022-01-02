import { useIdleTimer } from "react-idle-timer";

export const SessionTimer = (onTimeout: any) => {
  useIdleTimer({
    timeout: 1000 * 60 * 10,
    onIdle: onTimeout,
    debounce: 500,
  });

  return {};
};
