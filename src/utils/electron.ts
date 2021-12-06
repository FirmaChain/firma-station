import { isElectron } from "./common";

declare global {
  interface Window {
    require: NodeRequire;
    electron: any;
  }
}

type Electron = <T>(channel: string, arg?: any) => T;

const getElectron = () => {
  if (window.electron?.sendSync) {
    return window.electron.sendSync;
  }

  const { ipcRenderer } = window.require("electron");
  return ipcRenderer.sendSync;
};

const mock = (): Electron => {
  return (channel, arg) => arg;
};

const electron: Electron = isElectron ? getElectron() : mock();

export default electron;
