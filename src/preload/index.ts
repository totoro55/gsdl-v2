import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import { IsValidStatus } from "../types/IsValidStatus";
import { TCredentials } from "../types/TCredentials";
import { TProjectItem } from "../types/TProjectItem";
import { TResponse } from "../types/TResponse";

// Custom APIs for renderer
export interface SystemApi {
  checkPathIsValid: (folderPath: string) => Promise<IsValidStatus>;
  uploadCredentials: (filePath: string) => Promise<{ client_email: string, private_key: string } | string>;
  send: (message: string) => void;
  openExternalLink: (url: string) => void;
}

export interface googleApi {
  getTitles: (args: { sheetId: string, credentials: TCredentials }) => Promise<{ status: number, data: string | string[] }>;
  getSpreadsheetInfo: (args: { sheetId: string, credentials: TCredentials }) => Promise<{ status: number, data: string | { spreadsheetTitle: string, titles: string[] } }>;
  uploadData: (args: {item:TProjectItem, credentials: TCredentials})=>Promise<TResponse>
}

const systemApi: SystemApi = {

  uploadCredentials: async (filePath: string): Promise<{ client_email: string, private_key: string } | string> => await ipcRenderer.invoke("upload-credentials", filePath),

  checkPathIsValid: async (folderPath: string): Promise<IsValidStatus> => await ipcRenderer.invoke("check-path-is-valid", folderPath),

  send: (message: string): void => ipcRenderer.send("test", message),

  openExternalLink: (url: string): void => ipcRenderer.send('open-external-link', url)
};

const google: googleApi = {
  getTitles: async (args: { sheetId: string, credentials: TCredentials }): Promise<{ status: number, data: string | string[] }> => await ipcRenderer.invoke("google-get-titles", args),

  getSpreadsheetInfo: async (args: { sheetId: string, credentials: TCredentials }): Promise<{ status: number, data: string | { spreadsheetTitle: string, titles: string[] } }> => await ipcRenderer.invoke("google-get-spreadsheet-info", args),

  uploadData: async (args: {item:TProjectItem, credentials: TCredentials}):Promise<TResponse>=>await ipcRenderer.invoke("google-upload-data", args),
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("systemApi", systemApi);
    contextBridge.exposeInMainWorld("google", google);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.systemApi = systemApi;
  // @ts-ignore (define in dts)
  window.google = google;
}
