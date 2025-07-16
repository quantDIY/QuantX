import { contextBridge, ipcRenderer } from 'electron'
import { fileURLToPath } from 'url';
import path from 'path';

// __filename and __dirname polyfill for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

contextBridge.exposeInMainWorld('electron', {
  saveCreds: (creds: any) => ipcRenderer.invoke('save-creds', creds),
  getAccounts: () => ipcRenderer.invoke('get-accounts'),
})
