import { ElectronAPI } from '@electron-toolkit/preload'
import { googleApi, SystemApi } from "./index";

declare global {
  interface Window {
    electron: ElectronAPI
    systemApi: SystemApi
    google:googleApi
  }
}
