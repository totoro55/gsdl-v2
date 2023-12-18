import { app, shell, BrowserWindow } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";
import { ipcMain } from "electron";
import { IsValidStatus } from "../types/IsValidStatus";
import { constants } from "fs";
import * as fs from "fs";
import { TCredentials } from "../types/TCredentials";
import { UploadDataService } from "./services/UploadDataService";
import getJWT from "./utils/getJWT";
import { TProjectItem } from "../types/TProjectItem";
import { TResponse } from "../types/TResponse";
import { getDataFromFiles } from "./utils/getDataFromFiles";
import getArraysOfData from "./utils/getArraysOfData";

const fsPromises = fs.promises;

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 920,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      devTools:true,
      nodeIntegration: true,
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on("activate", function() {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

//Проверяет файл путь на валидность
ipcMain.handle(
  "check-path-is-valid",
  async (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    event,
    folderPath: string
  ): Promise<IsValidStatus> => {

    return await fsPromises.access(folderPath, constants.R_OK)
      .then(() => {
        return { isValid: true, message: `Папка по пути: ${folderPath} доступна` };
      })
      .catch(() => {
        return { isValid: false, message: `Папка по пути: ${folderPath} не доступна или указан неправильный путь к папке` };
      });

  });

ipcMain.on("open-external-link",
  (event, url: string) => {
    event.preventDefault();
    shell.openExternal(url);
  });

//Проверяет файл Credentials и достаёт из него private_key и client_email
ipcMain.handle(
  "upload-credentials",
  async (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    event,
    filePath: string
  ): Promise<{
    client_email: string,
    private_key: string
  } | string> => {

    return await fsPromises.readFile(filePath, "utf-8")
      .then(res => {
        const data = JSON.parse(res);
        if ("client_email" in data && "private_key" in data) {
          return ({ client_email: data["client_email"], private_key: data["private_key"] });
        } else {
          return "Загружен неккоректный файл json. Загрузите файл credentials.json для доступа к сервис-аккаунту";
        }
      }).catch(err => {
        return err.message;
      });
  });

//Хэндлеры для гугл таблиц

ipcMain.handle("google-get-titles",
  async (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event,
    args: {
      sheetId: string,
      credentials: TCredentials
    }
  ): Promise<{ status: number, data: string | string[] }> => {
    const jwt = getJWT(args.credentials);
    const service = new UploadDataService(args.sheetId, jwt);
    return await service.getTitles()
      .then(res => {
        if (res) {
          return { status: 200, data: res };
        } else {
          return { status: 500, data: "Запрос не вернул результатов" };
        }

      })
      .catch(err => {
        return { status: 500, data: err instanceof Error ? err.message : "Произошла непредвиденная ошибка" };
      });
  });


ipcMain.handle("google-get-spreadsheet-info",
  async (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event,
    args: {
      sheetId: string,
      credentials: TCredentials
    }
  ): Promise<{ status: number, data: string | { spreadsheetTitle: string, titles: string[] } }> => {
    const jwt = getJWT(args.credentials);
    const service = new UploadDataService(args.sheetId, jwt);
    return await service.getSpreadsheetInfo()
      .then(res => {
        return { status: 200, data: res };
      }).catch(err => {
        return { status: 500, data: err.message };
      });
  });


ipcMain.handle("google-upload-data",
  async (
    event,
    args: {
      item: TProjectItem,
      credentials: TCredentials
    }
  ): Promise<TResponse> => {
    event.preventDefault();
    const limit = 20000;

    try {
      const jwt = getJWT(args.credentials);
      const service = new UploadDataService(args.item.spreadsheet_id, jwt);
      const data = getDataFromFiles(args.item.path, args.item.files);

      if (!data) return { status: 503, message: `Не удалось получить данные из файлов: ${args.item.files.join(", ")} расположенных по пути:${args.item.path}` };
      const dataArrays = getArraysOfData(data, limit);

      if (args.item.pre_cleaning) {
        return await service.removeDataFromSheet(args.item.sheet_title)
          .then(async () => {
            for (const dataArray of dataArrays) {
              await service.setDataToSheet(dataArray, args.item.sheet_title);
            }
            return { status: 200, message: "Данные успешно загружены" };
          })
          .catch(err => {
            return { status: 500, message: err.message};
          });
      } else {
        for (const dataArray of dataArrays) {
          await service.setDataToSheet(dataArray, args.item.sheet_title);
        }
        return { status: 200, message: "Данные успешно загружены" };
      }

    } catch (err) {
      if (err instanceof Error) {
        return { status: 400, message: err.message};
      } else {
        return { status: 400, message: "Произошла неизвестная ошибка" };
      }
    }

  });
