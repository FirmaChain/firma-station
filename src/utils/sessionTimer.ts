import { useIdleTimer } from 'react-idle-timer';
import { SESSION_TIMOUT } from '../config';

export const SessionTimer = (onTimeout: any) => {
  useIdleTimer({
    timeout: SESSION_TIMOUT,
    onIdle: onTimeout,
    debounce: 500,
  });

  return {};
};
