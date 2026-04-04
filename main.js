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
const { setupDialogBridge, showCustomDialog } = require("./dialogBridge");
const fs = require("fs");
const path = require("path");
const crypto = require('crypto');


// ── NEW: child_process for Ollama PowerShell commands ────────
const { exec, spawn } = require("child_process");

let mainWindow;
let isQuitting = false;

// 🔐 Read baked-in read-only download token from package.json
const pkg = require("./package.json");

// 🔄 Auto-Update Configuration
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

autoUpdater.setFeedURL({
  provider: "github",
  owner: "Simpson-Funsaki",
  repo: "Admin",
  private: false
});

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
    setupOllamaIPC(); // ← NEW
    setupDialogBridge(mainWindow);

    setTimeout(() => {
      checkForUpdates();
    }, 3000);
  } catch (error) {
    console.error("❌ Failed to create window:", error);
    showErrorDialog("Failed to start application", error.message);
  }
}

// 🔄 Check For Updates
function checkForUpdates() {
  if (process.env.NODE_ENV === "development") return;
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

autoUpdater.on("update-available", async (info) => {
  const { response } = await showCustomDialog({
    type: "info",
    title: "Update Available",
    message: `Version ${info.version} is ready`,
    detail: "A new version is available. Download it now?",
    buttons: ["Download Update", "Later"],
    defaultId: 0,
    cancelId: 1,
  });

  if (response === 0) {
    if (mainWindow) {
      mainWindow.webContents.send("update-status", {
        status: "downloading",
        message: "Starting download...",
      });
    }
    autoUpdater.downloadUpdate();
  }
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
      message: `Update failed: ${err.message}`,
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

autoUpdater.on("update-downloaded", async (info) => {
  const { response } = await showCustomDialog({
    type: "info",
    title: "Update Ready",
    message: "Update downloaded successfully!",
    detail: "Restart the application to apply the update.",
    buttons: ["Restart Now", "Later"],
    defaultId: 0,
    cancelId: 1,
  });

  if (response === 0) {
    isQuitting = true;
    autoUpdater.quitAndInstall();
  }
});

// 🔐 Credentials
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

  globalShortcut.register("CommandOrControl+U", () => {
    checkForUpdates();
  });
}

// ⚠️ Error Dialog
function showErrorDialog(title, message) {
  dialog.showErrorBox(title, message);
}

const si = require('systeminformation');
const { createHash } = require('crypto');

async function getHardwareFingerprint() {
  const [cpu, disk, uuid, net] = await Promise.all([
    si.cpu(),
    si.diskLayout(),
    si.uuid(),
    si.networkInterfaces(),
  ]);

  const raw = JSON.stringify({
    cpu: cpu.brand + cpu.stepping,
    disk: disk[0]?.serialNum ?? 'nodisk',
    uuid: uuid.hardware ?? uuid.os,
    mac: Array.isArray(net) ? net[0]?.mac : net?.mac ?? 'nomac',
  });

  return createHash('sha256').update(raw).digest('hex');
}

ipcMain.handle("biometric-auth", async () => {
  if (process.platform === "win32") {
    return new Promise((resolve) => {
      const os = require("os");
      const fs = require("fs");
      const scriptPath = path.join(os.tmpdir(), "bio.ps1");

      const script = `
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.Security.Credentials.UI.UserConsentVerifier,Windows.Security.Credentials.UI,ContentType=WindowsRuntime]

# Must pick the overload where the single parameter is a generic IAsyncOperation<T>, not IAsyncAction
$asTaskMethod = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
    $_.Name -eq 'AsTask' -and
    $_.IsGenericMethodDefinition -eq $true -and
    $_.GetParameters().Count -eq 1
} | Select-Object -First 1

$resultType = [Windows.Security.Credentials.UI.UserConsentVerificationResult,Windows.Security.Credentials.UI,ContentType=WindowsRuntime]
$genericMethod = $asTaskMethod.MakeGenericMethod($resultType)

$op = [Windows.Security.Credentials.UI.UserConsentVerifier]::RequestVerificationAsync("Sign in to Appsy")
$task = $genericMethod.Invoke($null, @($op))
$task.Wait()
Write-Output $task.Result.ToString()
`;
      fs.writeFileSync(scriptPath, script, "utf8");

      const child = exec(
        `powershell -NoProfile -NonInteractive -ExecutionPolicy Bypass -File "${scriptPath}"`,
        { timeout: 60000 },
        (error, stdout, stderr) => {
          try {
            fs.unlinkSync(scriptPath);
          } catch {}

          if (error) {
            resolve({ success: false, reason: stderr || error.message });
            return;
          }

          const result = stdout.trim();
          if (result === "Verified") resolve({ success: true });
          else if (result === "Canceled")
            resolve({ success: false, reason: "Cancelled." });
          else if (result === "NotConfiguredForUser")
            resolve({ success: false, reason: "Windows Hello not set up." });
          else if (result === "DeviceNotPresent")
            resolve({ success: false, reason: "No biometric device found." });
          else
            resolve({
              success: false,
              reason: `Result: ${result || "no output"}`,
            });
        },
      );
    });
  } else if (process.platform === "darwin") {
    const { systemPreferences } = require("electron");
    try {
      if (!systemPreferences.canPromptTouchID()) {
        return { success: false, reason: "Touch ID not available." };
      }
      await systemPreferences.promptTouchID("Sign in to Appsy");
      return { success: true };
    } catch (err) {
      return { success: false, reason: err.message };
    }
  } else {
    return { success: false, reason: "Biometric auth not supported on Linux" };
  }
});


async function getEncryptionKey() {
  const fp = await getHardwareFingerprint();
  return crypto.createHash('sha256').update(fp).digest(); // 32 bytes for AES-256
}

// Encrypt credentials to file
ipcMain.handle('save-biometric-credentials', async (_, { email, password, filePath }) => {
  try {
    const key = await getEncryptionKey();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    const payload = JSON.stringify({ email, password });
    const encrypted = Buffer.concat([cipher.update(payload, 'utf8'), cipher.final()]);
    const fileContent = Buffer.concat([iv, encrypted]);

    // ← this line is critical — creates AppData\Roaming\Appsy\ if it doesn't exist
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(filePath, fileContent);
    return { success: true };
  } catch (err) {
    return { success: false, reason: err.message };
  }
});

// Read and decrypt credentials file
ipcMain.handle('read-biometric-credentials', async (_, { filePath }) => {
  try {
    if (!fs.existsSync(filePath)) {
      return { success: false, reason: 'Credentials file not found' };
    }

    const key = await getEncryptionKey();
    const fileContent = fs.readFileSync(filePath);
    
    const iv = fileContent.slice(0, 16);
    const encrypted = fileContent.slice(16);
    
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    
    const { email, password } = JSON.parse(decrypted.toString('utf8'));
    return { success: true, email, password };
  } catch (err) {
    // Wrong machine or corrupted file — decryption fails
    return { success: false, reason: 'Could not decrypt credentials file' };
  }
});

ipcMain.handle('check-file-exists', (_, { filePath }) => {
  return { exists: fs.existsSync(filePath) };
});

// Delete credentials file
ipcMain.handle('delete-biometric-credentials', (_, { filePath }) => {
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return { success: true };
  } catch (err) {
    return { success: false, reason: err.message };
  }
});



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

// 🤖 Ollama IPC Handlers  ─────────────────────────────────────
function setupOllamaIPC() {
  // ── helper: one-shot powershell command ──────────────────────
  function runPS(command) {
    return new Promise((resolve, reject) => {
      exec(
        `powershell -NoProfile -NonInteractive -Command "${command}"`,
        { timeout: 30000 },
        (error, stdout, stderr) => {
          if (error) reject(stderr || error.message);
          else resolve(stdout.trim());
        },
      );
    });
  }

  // ── ollama ps ────────────────────────────────────────────────
  ipcMain.handle("ollama-ps", async () => {
    try {
      const output = await runPS("ollama ps");
      return { success: true, output };
    } catch (e) {
      return { success: false, output: String(e) };
    }
  });

  // ── ollama list ──────────────────────────────────────────────
  ipcMain.handle("ollama-list", async () => {
    try {
      const output = await runPS("ollama list");
      return { success: true, output };
    } catch (e) {
      return { success: false, output: String(e) };
    }
  });

  // ── ollama run <model>  (warm-up only — loads model into VRAM) ─
  // IMPORTANT: `ollama run` is an interactive REPL — you cannot
  // pass a chat prompt through it reliably via spawn/exec.
  // For actual chat, the renderer uses the Ollama REST API directly
  // at http://localhost:11434/api/chat (no IPC needed for chat).
  // This IPC handler is only used to pre-load a model into memory.
  ipcMain.handle("ollama-run", async (event, { model }) => {
    return new Promise((resolve) => {
      // Use `ollama run <model> ""` — sends an empty prompt which
      // loads the model and exits cleanly without waiting for stdin.
      const ps = spawn("powershell", [
        "-NoProfile",
        "-NonInteractive",
        "-Command",
        // Echo empty string into ollama run so it loads then exits
        `echo "" | ollama run ${model}`,
      ]);

      let output = "";

      ps.stdout.on("data", (chunk) => {
        output += chunk.toString();
      });
      ps.stderr.on("data", (chunk) => {
        output += chunk.toString();
      });

      ps.on("close", (code) => {
        resolve({ success: code === 0, output: output.trim() });
      });

      ps.on("error", (err) => {
        resolve({ success: false, output: err.message });
      });
    });
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
