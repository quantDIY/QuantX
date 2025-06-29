const dotenv = require('dotenv');
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const rootDir = path.join(__dirname, '..');
app.commandLine.appendSwitch('no-sandbox');

ipcMain.handle('save-config', async (_, config) => {
  try {
    await axios.post('http://127.0.0.1:5000/api/save-creds', config);
    return { status: 'ok' };
  } catch (error) {
    console.error("Failed to save config via backend:", error);
    return { status: 'error', message: error.message };
  }
});

ipcMain.handle('search-accounts', async () => {
  const resp = await axios.post('http://127.0.0.1:5000/api/accounts');
  return resp.data.accounts;
});

ipcMain.handle('run-tests', async () => {
  const { exec } = require('child_process');
  const env = { ...process.env, PYTHONPATH: path.join(rootDir, 'backend') };
  return new Promise(resolve => {
    exec('pytest tests/python', {
      cwd: rootDir,
      env,
    }, (err, stdout) => {
      resolve({ success: !err, output: stdout });
    });
  });
});

ipcMain.handle('get-env', () => {
  const envPath = path.join(rootDir, '.env');
  if (!fs.existsSync(envPath)) return {};
  const env = dotenv.parse(fs.readFileSync(envPath));
  return env;
});

function createMainWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const isDev = !app.isPackaged;
  const devUrl = 'http://localhost:5173';

  if (isDev) {
    win.loadURL(devUrl);
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(rootDir, 'dist', 'index.html'));
  }
}

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
