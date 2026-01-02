const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const isDev = require('electron-is-dev');

let mainWindow;
let backendProcess;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        title: "Auto-École Manager",
        autoHideMenuBar: true
    });

    const startURL = isDev
        ? 'http://localhost:3000'
        : `file://${path.join(__dirname, '../out/index.html')}`;

    mainWindow.loadURL(startURL);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function startBackend() {
    // En production, le JAR est dans le dossier extraResources ou asarUnpack
    const jarPath = isDev
        ? path.join(__dirname, '../carly-backend.jar') // À placer manuellement pour le dev
        : path.join(process.resourcesPath, 'backend', 'carly-backend.jar');

    console.log(`Démarrage du backend: ${jarPath}`);

    backendProcess = spawn('java', ['-jar', jarPath], {
        stdio: 'inherit'
    });

    backendProcess.on('error', (err) => {
        console.error('Erreur au lancement du backend Java:', err);
    });
}

app.on('ready', () => {
    startBackend();
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        if (backendProcess) backendProcess.kill();
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

// Arrêter le backend quand Electron s'arrête
app.on('will-quit', () => {
    if (backendProcess) {
        backendProcess.kill();
    }
});
