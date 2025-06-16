const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getEnv: () => ipcRenderer.invoke('get-env'),
  saveConfig: (config) => ipcRenderer.invoke('save-config', config),
  searchAccounts: () => ipcRenderer.invoke('search-accounts'),
  runTests: () => ipcRenderer.invoke('run-tests'),
});
