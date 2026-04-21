import { app, BrowserWindow, ipcMain, Menu, dialog } from "electron";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;
const watchFiles = new Map<string, ReturnType<typeof fs.watchFile>>();

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
          label: "Toggle Developer Tools",
          accelerator: "F12",
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.toggleDevTools();
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
    {
      label: "Schedule",
      submenu: [
        {
          label: "Speaker Schedule",
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send("nav:speaker-schedule");
            }
          },
        },
        {
          label: "Unit Schedule",
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send("nav:unit-schedule");
            }
          },
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

  // FS: read file by directory + filename (uses path.join for cross-platform paths)
  ipcMain.handle(
    "fs:read-file-by-dir",
    async (_event, dir: string, filename: string) => {
      const filePath = path.join(dir, filename);
      return fs.promises.readFile(filePath, "utf-8");
    },
  );

  // FSWatch: start watching (polling-based, reliable on Linux)
  ipcMain.handle(
    "fswatch:watch",
    async (_event, dir: string, callbackId: string) => {
      // Stop existing watches
      for (const filePath of watchFiles.keys()) {
        fs.unwatchFile(filePath);
      }
      watchFiles.clear();

      const dataFiles = [
        "units.csv",
        "speakers.csv",
        "speaking-assignments.csv",
        "speaker-ministering.csv",
        "stake_presidency_speaking_assignments.csv",
        "unit_provide_speakers.csv",
        "unit-ministering.csv",
      ];
      const filePaths = dataFiles.map((f) => path.join(dir, f));

      for (const filePath of filePaths) {
        const watcher = fs.watchFile(filePath, { interval: 1000 }, () => {
          const win = mainWindow;
          if (win && !win.isDestroyed()) {
            win.webContents.send("fswatch:change", callbackId, "change", path.basename(filePath));
          }
        });
        watchFiles.set(filePath, watcher);
      }

      updateMenuStatus(dir, true);
    },
  );

  // FSWatch: stop watching
  ipcMain.handle("fswatch:unwatch", async () => {
    for (const filePath of watchFiles.keys()) {
      fs.unwatchFile(filePath);
    }
    watchFiles.clear();
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
      sandbox: false,
    },
  });

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:8015");
  } else {
    mainWindow.loadFile(path.join(__dirname, "../electron/dist/index.html"));
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
