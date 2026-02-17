const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  // Window Controls
  minimizeWindow: () => ipcRenderer.send("window-minimize"),
  maximizeWindow: () => ipcRenderer.send("window-maximize"),
  closeWindow: () => ipcRenderer.send("window-close"),
  onWindowState: (callback) => {
    ipcRenderer.on("window-state-changed", (event, state) => callback(state));
  },
  fullscreen: () => ipcRenderer.send("window-fullscreen"),

  // Navigation
  goBack: () => ipcRenderer.send("navigate-back"),
  goForward: () => ipcRenderer.send("navigate-forward"),
  refresh: () => ipcRenderer.send("navigate-refresh"),

  // Navigation State Listeners
  onCanGoBack: (callback) => {
    ipcRenderer.on("can-go-back", (_, canGoBack) => callback(canGoBack));
  },
  onCanGoForward: (callback) => {
    ipcRenderer.on("can-go-forward", (_, canGoForward) =>
      callback(canGoForward),
    );
  },

  // Window State
  getWindowState: () => ipcRenderer.invoke("get-window-state"),
  getAppInfo: () => ipcRenderer.invoke("get-app-info"),

  // 🔄 Auto-Update
  checkForUpdates: () => ipcRenderer.send("check-for-updates"),
  onUpdateStatus: (callback) => {
    ipcRenderer.on("update-status", (_, status) => callback(status));
  },

  saveCredentials: (credentials) =>
    ipcRenderer.send("save-credentials", credentials),
  
  getCredentials: () =>
    ipcRenderer.invoke("get-credentials"),
  
  clearCredentials: () =>
    ipcRenderer.send("clear-credentials"),
});
