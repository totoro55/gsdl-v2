import { ElectronAPI } from '@electron-toolkit/preload'
import { googleApi, SystemApi, telegramApi } from './index'

declare global {
  interface Window {
    electron: ElectronAPI
    systemApi: SystemApi
    google:googleApi
    telegram:telegramApi
  }
}
