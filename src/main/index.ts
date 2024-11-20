import { app } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { initializeIpcHandlers } from './ipcHandlers'
import { createMainWindow } from './windows'

function initializeApp() {
  // Set app user model id for Windows
  electronApp.setAppUserModelId('com.electron')

  // Watch for shortcut keys
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Initialize IPC handlers
  initializeIpcHandlers()

  // Create the main window
  const mainWindow = createMainWindow()

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.insertCSS(`
      body {
        background-color: #202127 !important;
      }
    `)
  })

  // Handle macOS activate event
  // app.on('activate', function () {
  //   if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  // })
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  initializeApp()
})

// Adjust window opacity on focus/blur
app.on('browser-window-blur', function (event, browserWindow) {
  // browserWindow.setOpacity(0.5)
})

app.on('browser-window-focus', function (event, browserWindow) {
  browserWindow.setOpacity(1.0)
})

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
