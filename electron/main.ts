import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'url'
import path from 'path'
import axios from 'axios'

// __dirname polyfill for ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const rootDir = path.join(__dirname, '..')
app.commandLine.appendSwitch('no-sandbox')

function createMainWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  })

  const isDev = !app.isPackaged
  const devUrl = 'http://localhost:5173'

  if (isDev) {
    win.loadURL(devUrl)
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(rootDir, 'dist', 'index.html'))
  }
}

ipcMain.handle('save-creds', async (_, creds) => {
  try {
    const res = await axios.post('http://127.0.0.1:5000/api/save-creds', creds)
    return res.data
  } catch (error: any) {
    return { status: 'error', error: error.message }
  }
})

ipcMain.handle('get-accounts', async () => {
  try {
    const res = await axios.get('http://127.0.0.1:5999/api/accounts')
    return res.data
  } catch {
    return []
  }
})

app.whenReady().then(() => {
  createMainWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
