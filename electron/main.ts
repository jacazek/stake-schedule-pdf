import { app, BrowserWindow, ipcMain, Menu, dialog } from "electron";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;
let watchWatcher: fs.FSWatcher | null = null;
let watchCallbackId = 0;
const changeCallbacks = new Map<string, string>(); // callbackId -> renderer window reference

function createMenu() {
  const template: any = [
    {
      label: "&Data",
      submenu: [
        {
          label: "Open Data Folder...",
          click: async () => {
            if (mainWindow) {
              const result = await dialog.showOpenDialog(mainWindow, {
                properties: ["openDirectory"],
              });
              if (!result.canceled && result.filePaths.length > 0) {
                dialog.showMessageBox(mainWindow, {
                  message: result.filePaths.join("; "),
                });
                updateMenuStatus(result.filePaths[0], true);
                mainWindow.webContents.send(
                  "data:directory-selected",
                  result.filePaths[0],
                );
              }
            }
          },
        },
        {
          label: "Refresh Data",
          accelerator: "CmdOrCtrl+R",
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send("menu:refresh");
            }
          },
        },
        { type: "separator" },
        {
          label: "Auto-reload on file changes",
          type: "checkbox",
          checked: true,
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send("menu:toggle-autoreload");
            }
          },
        },
        { type: "separator" },
        {
          label: "Status: No data directory set",
          enabled: false,
          id: "menu-status",
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  return menu;
}

function updateMenuStatus(dir: string | null, watching: boolean) {
  const menu = Menu.getApplicationMenu();
  if (!menu) return;
  const statusItem = menu.getMenuItemById("menu-status");
  if (statusItem) {
    if (dir && watching) {
      statusItem.label = `Status: Watching ${dir}`;
    } else if (dir) {
      statusItem.label = `Status: ${dir} (watching paused)`;
    } else {
      statusItem.label = "Status: No data directory set";
    }
  }
}

function setupIPC() {
  // Dialog: open directory
  ipcMain.handle("dialog:open-directory", async () => {
    const result = await dialog.showOpenDialog(mainWindow!, {
      properties: ["openDirectory"],
    });
    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths[0];
    }
    return null;
  });

  // FS: read file
  ipcMain.handle("fs:read-file", async (_event, filePath: string) => {
    return fs.promises.readFile(filePath, "utf-8");
  });

  // FSWatch: start watching
  ipcMain.handle(
    "fswatch:watch",
    async (event, dir: string, callbackId: string) => {
      // Stop any existing watch
      if (watchWatcher) {
        watchWatcher.close();
        watchWatcher = null;
      }

      watchCallbackId++;
      const currentId = watchCallbackId;

      // Register callback info for this IPC call
      changeCallbacks.set(
        callbackId,
        (event.sender as any).getURL?.() ?? "renderer",
      );

      watchWatcher = fs.watch(dir, (eventType, filename) => {
        if (!filename) return;
        // Notify all registered callbacks
        for (const [cbId, _url] of changeCallbacks) {
          const win = mainWindow;
          if (win && !win.isDestroyed()) {
            win.webContents.send(
              "fswatch:change",
              cbId,
              eventType,
              filename.toString(),
            );
          }
        }
      });

      updateMenuStatus(dir, true);
      return currentId;
    },
  );

  // FSWatch: stop watching
  ipcMain.handle("fswatch:unwatch", async () => {
    if (watchWatcher) {
      watchWatcher.close();
      watchWatcher = null;
    }
    changeCallbacks.clear();
    updateMenuStatus(null, false);
  });

  // Renderer requests directory selection (from menu)
  ipcMain.on("menu:open-directory", () => {
    if (mainWindow) {
      dialog
        .showOpenDialog(mainWindow, { properties: ["openDirectory"] })
        .then((result) => {
          if (!result.canceled && result.filePaths.length > 0) {
            updateMenuStatus(result.filePaths[0], true);
            mainWindow!.webContents.send(
              "data:directory-selected",
              result.filePaths[0],
            );
          }
        });
    }
  });

  // Renderer requests data refresh (from menu)
  ipcMain.on("menu:refresh", () => {
    if (mainWindow) {
      mainWindow.webContents.send("data:refresh");
    }
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: true,
    },
  });

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:8015");
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

app.whenReady().then(() => {
  createMenu();
  setupIPC();
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
