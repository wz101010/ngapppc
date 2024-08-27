const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const express = require('express');

// 日志记录（可选）
// autoUpdater.logger = log;
// autoUpdater.logger.transports.file.level = 'info';
console.info('App starting...');

// 创建 Express 服务器
const server = express();
const PORT = 3000;

// 设置静态文件夹，指向 dist 文件夹
server.use(express.static(path.join(__dirname, 'dist')));

// 处理 404 错误并重定向到 /zh
server.use((req, res) => {
  res.redirect(`http://localhost:${PORT}/zh`);
});

// 启动服务器
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.on('ready', createWindow);

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // 在 Electron 中加载 Express 服务器提供的 URL
  mainWindow.loadURL(`http://localhost:${PORT}`);

  // 打开开发者工具（可选）
  mainWindow.webContents.openDevTools();

  // 检查更新
  autoUpdater.checkForUpdatesAndNotify();
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 自动更新事件
autoUpdater.on('update-available', () => {
  console.log('有新版本')
  dialog.showMessageBox({
    type: 'warning',
    title: '更新提示',
    message: '有新版本发布了',
    buttons: ['更新', '取消'],
    cancelId: 1
  }).then(res => {
    if (res.response == 0) {
      //开始下载更新
      autoUpdater.downloadUpdate()
    }
  })

});

//没有新版本时
autoUpdater.on('update-not-available', (_info) => {
  console.log('没有更新')
})

//更新下载完毕
autoUpdater.on('update-downloaded', (_info) => {
  //退出并安装更新
  autoUpdater.quitAndInstall()
})

//更新发生错误
autoUpdater.on('error', (_info) => {
  console.log('更新时发生错误');
})

// 监听下载进度
autoUpdater.on('download-progress', (progress) => {
  console.log(`更新进度，${JSON.stringify(progress)}`)
});