const {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
  shell,
  dialog,
} = require("electron");
const { autoUpdater } = require("electron-updater");
const { startServer, stopServer } = require("./server");
const { safeStorage } = require("electron");
const fs = require("fs");
const path = require("path");

let mainWindow;
let isQuitting = false;

// 🔄 Auto-Update Configuration
autoUpdater.autoDownload = false; // Don't auto-download, ask user first
autoUpdater.autoInstallOnAppQuit = true; // Install on quit

// 🎨 Window Configuration
const WINDOW_CONFIG = {
  width: 900,
  height: 600,
  minWidth: 800,
  minHeight: 500,
  frame: false,
  transparent: false,
  backgroundColor: "#0a0a0a",
  hasShadow: true,
  // DELETE these two lines:
  // titleBarStyle: "hidden",
  // titleBarOverlay: { ... },
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false,
    preload: path.join(__dirname, "preload.js"),
    backgroundThrottling: false,
    spellcheck: false,
  },
  show: false,
};

// 🚀 Create Main Window
async function createWindow() {
  try {
    console.log("🚀 Starting Next.js server...");
    await startServer();

    mainWindow = new BrowserWindow(WINDOW_CONFIG);

    // Clear session cache to prevent redirect loops
    await mainWindow.webContents.session.clearCache();
    await mainWindow.webContents.session.clearStorageData({
      storages: ["cookies", "localstorage", "sessionstorage"],
    });

    if (process.env.NODE_ENV === "development") {
      const {
        default: installExtension,
        REACT_DEVELOPER_TOOLS,
      } = require("electron-devtools-installer");

      installExtension(REACT_DEVELOPER_TOOLS).catch((err) =>
        console.log("Error loading React DevTools:", err),
      );

      require("electron-reload")(__dirname, {
        electron: path.join(__dirname, "node_modules", ".bin", "electron"),
        hardResetMethod: "exit",
      });
    }

    mainWindow.once("ready-to-show", () => {
      mainWindow.show();
      mainWindow.focus();
    });

    mainWindow.center();
    mainWindow.loadURL("http://localhost:3000");

    mainWindow.on("page-title-updated", (event) => {
      event.preventDefault();
    });

    Menu.setApplicationMenu(null);

    setupWindowEffects();

    if (process.env.NODE_ENV === "development") {
      mainWindow.webContents.openDevTools({ mode: "detach" });
    }

    setupWindowListeners();
    setupGlobalShortcuts();
    setupIPC();

    setTimeout(() => {
      checkForUpdates();
    }, 3000);
  } catch (error) {
    console.error("❌ Failed to create window:", error);
    showErrorDialog("Failed to start application", error.message);
  }
}

// 🔄 Auto-Update Functions
function checkForUpdates() {
  // Don't check in development
  if (process.env.NODE_ENV === "development") {
    console.log("Skipping update check in development mode");
    return;
  }

  console.log("🔍 Checking for updates...");
  autoUpdater.checkForUpdates();
}

// 🔄 Auto-Update Event Handlers
autoUpdater.on("checking-for-update", () => {
  console.log("🔍 Checking for updates...");
  if (mainWindow) {
    mainWindow.webContents.send("update-status", {
      status: "checking",
      message: "Checking for updates...",
    });
  }
});

autoUpdater.on("update-available", (info) => {
  console.log("✅ Update available:", info.version);

  const dialogOpts = {
    type: "info",
    buttons: ["Download Update", "Later"],
    title: "Update Available",
    message: `Version ${info.version} is available!`,
    detail: "A new version is available. Would you like to download it now?",
  };

  dialog.showMessageBox(mainWindow, dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) {
      // User clicked "Download Update"
      autoUpdater.downloadUpdate();

      if (mainWindow) {
        mainWindow.webContents.send("update-status", {
          status: "downloading",
          message: "Downloading update...",
        });
      }
    }
  });
});

autoUpdater.on("update-not-available", (info) => {
  console.log("✅ App is up to date:", info.version);
  if (mainWindow) {
    mainWindow.webContents.send("update-status", {
      status: "up-to-date",
      message: "You are running the latest version",
    });
  }
});

autoUpdater.on("error", (err) => {
  console.error("❌ Update error:", err);
  if (mainWindow) {
    mainWindow.webContents.send("update-status", {
      status: "error",
      message: "Update check failed",
    });
  }
});

autoUpdater.on("download-progress", (progressObj) => {
  const message = `Downloaded ${Math.round(progressObj.percent)}%`;
  console.log(message);

  if (mainWindow) {
    mainWindow.webContents.send("update-status", {
      status: "downloading",
      message: message,
      progress: progressObj.percent,
    });
  }
});

autoUpdater.on("update-downloaded", (info) => {
  console.log("✅ Update downloaded:", info.version);

  const dialogOpts = {
    type: "info",
    buttons: ["Restart Now", "Later"],
    title: "Update Ready",
    message: "Update downloaded successfully!",
    detail:
      "The update has been downloaded. Restart the application to apply the update.",
  };

  dialog.showMessageBox(mainWindow, dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) {
      // User clicked "Restart Now"
      isQuitting = true;
      autoUpdater.quitAndInstall();
    }
  });
});

const CREDS_PATH = path.join(app.getPath("userData"), "credentials.enc");

function saveCredentials(credentials) {
  try {
    if (safeStorage.isEncryptionAvailable()) {
      const encrypted = safeStorage.encryptString(JSON.stringify(credentials));
      fs.writeFileSync(CREDS_PATH, encrypted);
    }
  } catch (err) {
    console.error("Failed to save credentials:", err);
  }
}

function getCredentials() {
  try {
    if (safeStorage.isEncryptionAvailable() && fs.existsSync(CREDS_PATH)) {
      const encrypted = fs.readFileSync(CREDS_PATH);
      const decrypted = safeStorage.decryptString(encrypted);
      return JSON.parse(decrypted);
    }
  } catch (err) {
    console.error("Failed to get credentials:", err);
  }
  return null;
}

function clearCredentials() {
  try {
    if (fs.existsSync(CREDS_PATH)) {
      fs.unlinkSync(CREDS_PATH);
    }
  } catch (err) {
    console.error("Failed to clear credentials:", err);
  }
}

// 🎨 Window Visual Effects
function setupWindowEffects() {
  if (process.platform === "win32") {
    try {
      mainWindow.setBackgroundMaterial("mica");
    } catch (err) {
      console.log("Background material not supported");
    }
  }
}

// 🎯 Window Event Listeners
function setupWindowListeners() {
  mainWindow.on("close", (event) => {
    if (!isQuitting) {
      event.preventDefault();

      const choice = dialog.showMessageBoxSync(mainWindow, {
        type: "question",
        buttons: ["Quit", "Cancel"],
        title: "Confirm",
        message: "Are you sure you want to quit?",
        defaultId: 1,
        cancelId: 1,
      });

      if (choice === 0) {
        isQuitting = true;
        stopServer();
        app.quit();
      }
    }
  });

  mainWindow.webContents.on("did-navigate", () => {
    mainWindow.webContents.send(
      "can-go-back",
      mainWindow.webContents.canGoBack(),
    );
    mainWindow.webContents.send(
      "can-go-forward",
      mainWindow.webContents.canGoForward(),
    );
  });

  mainWindow.webContents.on("did-navigate-in-page", () => {
    mainWindow.webContents.send(
      "can-go-back",
      mainWindow.webContents.canGoBack(),
    );
    mainWindow.webContents.send(
      "can-go-forward",
      mainWindow.webContents.canGoForward(),
    );
  });

  mainWindow.on("maximize", () => {
    mainWindow.webContents.send("window-state-changed", { isMaximized: true });
  });

  mainWindow.on("unmaximize", () => {
    mainWindow.webContents.send("window-state-changed", { isMaximized: false });
  });
}

// ⌨️ Global Keyboard Shortcuts
function setupGlobalShortcuts() {
  const { globalShortcut } = require("electron");

  globalShortcut.register("CommandOrControl+Shift+D", () => {
    if (mainWindow) mainWindow.webContents.toggleDevTools();
  });

  globalShortcut.register("CommandOrControl+R", () => {
    if (mainWindow) mainWindow.reload();
  });

  globalShortcut.register("Alt+Left", () => {
    if (mainWindow && mainWindow.webContents.canGoBack()) {
      mainWindow.webContents.goBack();
    }
  });

  // Manual update check shortcut
  globalShortcut.register("CommandOrControl+U", () => {
    checkForUpdates();
  });
}

// ⚠️ Error Dialog
function showErrorDialog(title, message) {
  dialog.showErrorBox(title, message);
}

// 🎯 IPC Handlers
function setupIPC() {
  ipcMain.on("window-minimize", () => mainWindow.minimize());
  ipcMain.on("window-maximize", () => {
    mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
  });
  ipcMain.on("window-close", () => mainWindow.close());
  ipcMain.on("window-fullscreen", () => {
    mainWindow.setFullScreen(!mainWindow.isFullScreen());
  });

  ipcMain.on("navigate-back", () => {
    if (mainWindow.webContents.canGoBack()) mainWindow.webContents.goBack();
  });
  ipcMain.on("navigate-forward", () => {
    if (mainWindow.webContents.canGoForward())
      mainWindow.webContents.goForward();
  });
  ipcMain.on("navigate-refresh", () => mainWindow.webContents.reload());

  // Manual update check from renderer
  ipcMain.on("check-for-updates", () => {
    checkForUpdates();
  });

  ipcMain.handle("get-window-state", () => ({
    isMaximized: mainWindow.isMaximized(),
    isFullScreen: mainWindow.isFullScreen(),
    isMinimized: mainWindow.isMinimized(),
  }));

  ipcMain.handle("get-app-info", () => ({
    version: app.getVersion(),
    name: app.getName(),
    platform: process.platform,
    arch: process.arch,
  }));

  ipcMain.on("save-credentials", (_, credentials) => {
    saveCredentials(credentials);
  });

  ipcMain.handle("get-credentials", () => {
    return getCredentials();
  });

  ipcMain.on("clear-credentials", () => {
    clearCredentials();
  });
}

// 🚀 App Lifecycle
app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  stopServer();
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => {
  isQuitting = true;
  stopServer();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  } else if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
  }
});

app.on("will-quit", () => {
  const { globalShortcut } = require("electron");
  globalShortcut.unregisterAll();
});
