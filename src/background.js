"use strict";
import {
  app,
  protocol,
  ipcMain,
  Tray,
  nativeImage,
  screen,
  session,
  BrowserWindow,
  Menu
} from "electron";
import { autoUpdater } from "electron-updater";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import windowControl from "./tools/main/windowControl";
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
]);
import LocalFile from "./tools/api/LocalFile";
import User from "./tools/api/User";
const path = require("path");
let TransDownFolder = process.env.USERPROFILE;
let DownloadList = {};
let LoginWindow, MainWindow, PopupWindow, AboutWindow, AccountWindow, LrcWindow;
/*播放按钮*/
let PlayerIcon = path.join(__static, "img/player");
let NextBtn = nativeImage.createFromPath(path.join(PlayerIcon, "next.png"));
let PlayBtn = nativeImage.createFromPath(path.join(PlayerIcon, "play.png"));
let PauseBtn = nativeImage.createFromPath(path.join(PlayerIcon, "pause.png"));
let PrevBtn = nativeImage.createFromPath(path.join(PlayerIcon, "prev.png"));
let MusicButtons = [
  {
    tooltip: "上一首",
    icon: PrevBtn,
    click: () => {
      MainWindow.webContents.send("Prev");
    }
  },
  {
    tooltip: "播放",
    icon: PlayBtn,
    click: () => {
      MainWindow.webContents.send("Play");
    }
  },
  {
    tooltip: "下一首",
    icon: NextBtn,
    click: () => {
      MainWindow.webContents.send("Next");
    }
  }
];
let appTray = null; //托盘变量
/*初始化ipc*/
function bindIpc() {
  /*系统操作事件*/
  ipcMain.on("system", (event, type, data) => {
    switch (type) {
      case "to-login":
        MusicSystem.LoginWindow();
        break;
      case "login":
        MusicSystem.MainWindow(data);
        break;
      case "popup":
        MusicSystem.PopupWindow(data);
        break;
      case "account":
        MusicSystem.AccountWindow(data);
        break;
      case "about":
        MusicSystem.AboutWindow();
        break;
      case "check-for-update" /*检查更新*/:
        autoUpdater.setFeedURL(data);
        MusicSystem.CheckUpdate(event);
        autoUpdater.checkForUpdates();
        break;
      case "update" /*安装更新*/:
        autoUpdater.quitAndInstall();
        break;
      case "user-update":
        MainWindow.webContents.send("user-update", data);
        break;
      case "logoff":
        MusicSystem.logoff();
        break;
      case "exit":
        break;
    }
  });
  /*播放器操作事件*/
  ipcMain.on("player-control", (event, type, data) => {
    switch (type) {
      case "pause":
        MusicButtons[1].icon = PauseBtn;
        MusicButtons[1].tooltip = "暂停";
        MainWindow.setThumbarButtons(MusicButtons);
        break;
      case "play":
        MusicButtons[1].icon = PlayBtn;
        MusicButtons[1].tooltip = "播放";
        MainWindow.setThumbarButtons(MusicButtons);
        break;
      case "stop":
        MainWindow.setThumbarButtons([]);
        break;
      case "lrc":
        LrcWindow.webContents.send("data", data);
        break;
    }
  });
  /*下载事件控制*/
  ipcMain.on("download", (event, type, data) => {
    let downloadItem = DownloadList[data];
    if (downloadItem === undefined) {
      return;
    }
    switch (type) {
      case "pause":
        downloadItem.pause();
        break;
      case "cancel":
        downloadItem.cancel();
        break;
      case "resume":
        if (downloadItem.canResume()) {
          downloadItem.resume();
        }
        break;
    }
  });
  session.defaultSession.removeAllListeners("will-download");
  session.defaultSession.on("will-download", (event, item, webContents) => {
    let name =
      decodeURI(
        item
          .getURLChain()
          .toString()
          .split("?disk_name=")[1]
      ) || item.getFilename();
    item.fileName = name;
    item.path = TransDownFolder + "/" + name;
    item.setSavePath(TransDownFolder + "/" + name); // 设置保存路径,使Electron不提示保存对话框。
    item.on("updated", () => {
      DownloadList[Math.round(item.getStartTime())] = item;
      let file = FileObject(item, item.isPaused() ? "interrupted" : false);
      webContents && webContents.send("download", file);
    });
    item.once("done", (event, state) => {
      let file = FileObject(item, item.isPaused() ? "interrupted" : false);
      webContents && webContents.send("download", file);
      if (state === "completed") {
        delete DownloadList[Math.round(item.getStartTime())];
      } else {
        console.log(`Download failed: ${state}`);
      }
    });
  });
}
/*创建窗口*/
let MusicSystem = {
  LoginWindow: (data, callback) => {
    if (LoginWindow) {
      return windowControl.active(LoginWindow, data);
    }
    LoginWindow = windowControl.create({
      url: "login",
      data: data,
      title: "CloudMusic-欢迎",
      width: 850,
      height: 550,
      maximizable: false,
      resizable: false,
      onclose: () => {
        LoginWindow = null;
      },
      callback: () => {
        callback && callback();
      }
    });
  },
  MainWindow: data => {
    if (MainWindow) {
      return windowControl.active(MainWindow, data);
    }
    appTray = new Tray(path.join(__static, "icon/tray@2x.png")); //加@2x可解决mac显示异常问题
    //图标的上下文菜单
    let trayMenuTemplate = [
      //托盘菜单
      {
        label: "C-Music", //菜单显示文本项
        click: function() {
          MainWindow.show(); //显示
          MainWindow.restore(); //窗口欢迎
          MainWindow.focus(); //窗口聚焦
        }
      },
      {
        label: "关于", //菜单显示文本项
        click: function() {
          MusicSystem.AboutWindow();
        }
      },
      {
        label: "退出",
        click: function() {
          MainWindow.show();
          MainWindow.focus();
          MainWindow.webContents.send("exit");
        }
      }
    ];
    const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
    //设置此托盘图标的悬停提示内容
    appTray.setToolTip("CloudMusic");
    //设置此图标的上下文菜单
    appTray.setContextMenu(contextMenu);
    appTray.on("click", function() {
      MainWindow.isVisible() ? MainWindow.hide() : MainWindow.show();
    });
    MainWindow = windowControl.create({
      url: "main",
      data: data,
      title: "CloudMusic",
      width: 1022,
      height: 670,
      minWidth: 1022,
      minHeight: 670,
      maximizable: false,
      resizable: false,
      onclose: () => {
        MainWindow = null;
        let wins = BrowserWindow.getAllWindows();
        for (let i = 0; i < wins.length; i++) {
          if (wins[i].name !== "login" && wins[i].name !== "/") {
            wins[i] ? wins[i].close() : "";
          }
        }
        appTray.destroy();
        session.defaultSession.removeAllListeners("will-download");
      },
      callback: () => {
        if (LoginWindow) {
          LoginWindow.close();
        }
        MusicSystem.LrcWindow();
      }
    });
  },
  AboutWindow: () => {
    if (AboutWindow) {
      return windowControl.active(AboutWindow);
    }
    AboutWindow = windowControl.create({
      url: "about",
      title: "关于CloudMusic",
      width: 600,
      height: 330,
      maximizable: false,
      minimizable: false,
      resizable: false,
      onclose: () => {
        AboutWindow = null;
      }
    });
  },
  AccountWindow: data => {
    if (AccountWindow) {
      return windowControl.active(AccountWindow, data);
    }
    AccountWindow = windowControl.create({
      url: "music-account",
      data: data,
      title: "个人信息",
      width: 670,
      height: 420,
      maximizable: false,
      resizable: false,
      onclose: () => {
        AccountWindow = null;
      }
    });
  },
  LrcWindow: () => {
    if (LrcWindow) {
      return windowControl.active(LrcWindow);
    }
    LrcWindow = windowControl.create({
      url: "lrc/",
      title: "桌面歌词",
      width: 666,
      height: 80,
      maximizable: false,
      minimizable: false,
      resizable: false,
      skipTaskbar: true,
      alwaysOnTop: true,
      transparent: true,
      x: screen.getPrimaryDisplay().workAreaSize.width / 2 - 333,
      y: screen.getPrimaryDisplay().workAreaSize.height - 100,
      onclose: () => {
        LrcWindow = null;
      },
      callback: () => {
        LrcWindow.setIgnoreMouseEvents(true);
      }
    });
  },
  PopupWindow: msg => {
    if (PopupWindow) {
      return windowControl.active(PopupWindow, msg);
    }
    PopupWindow = windowControl.create({
      url: "music-msg",
      data: msg,
      width: 300,
      height: 150,
      useContentSize: true,
      resizable: false,
      maximizable: false,
      transparent: true,
      alwaysOnTop: true,
      x: screen.getPrimaryDisplay().workAreaSize.width - 305,
      y: screen.getPrimaryDisplay().workAreaSize.height - 155,
      onclose: () => {
        PopupWindow = null;
      }
    });
  },
  CheckUpdate: event => {
    let message = {
      appName: "CloudMusic",
      error: "检查更新出错, 请联系开发人员",
      checking: "正在检查更新……",
      updateAva: "检测到新版本，正在下载……",
      updateNotAva: "现在使用的就是最新版本，不用更新",
      downloaded: "最新版本已下载，点击安装进行更新"
    };
    //当开始检查更新的时候触发
    autoUpdater.on("checking-for-update", function() {
      event.sender.send("check-for-update", message.checking); //返回一条信息
    });
    //当发现一个可用更新的时候触发，更新包下载会自动开始
    autoUpdater.on("update-available", function(info) {
      event.sender.send("update-down-success", info);
      event.sender.send("check-for-update", message.updateAva); //返回一条信息
    });
    //当没有可用更新的时候触发
    autoUpdater.on("update-not-available", function() {
      event.sender.send("check-for-update", message.updateNotAva); //返回一条信息
    });
    autoUpdater.on("error", function() {
      event.sender.send("check-for-update", message.error); //返回一条信息
    });
    // 更新下载进度事件
    autoUpdater.on("download-progress", progressObj => {
      event.sender.send("download-progress", progressObj);
    });
    autoUpdater.on("update-downloaded", function() {
      event.sender.send("check-for-update", message.downloaded); //返回一条信息
      //通过main进程发送事件给renderer进程，提示更新信息
    });
  },
  logoff: () => {
    MusicSystem.LoginWindow({}, () => {
      MainWindow.close();
    });
  },
  exit: () => {}
};
/*文件对象*/
function FileObject(item, state) {
  return {
    id: Math.round(item.getStartTime()),
    url: item.getURLChain(),
    time: item.getStartTime(),
    name: item.fileName,
    path: item.path,
    chunk: item.getReceivedBytes(),
    size: item.getTotalBytes(),
    trans_type: "download",
    state: state || item.getState(),
    disk_main: item.getURL(),
    canResume: item.canResume(),
    shows: true
  };
}
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (LoginWindow) {
      LoginWindow.show();
      LoginWindow.restore();
      LoginWindow.focus();
    }
    if (MainWindow) {
      MainWindow.show();
      MainWindow.restore();
      MainWindow.focus();
    }
  });
  app.on("ready", function() {
    bindIpc();
    createProtocol("app");
    app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");
    LocalFile.read(
      "login",
      (data, err) => {
        if (err) {
          MusicSystem.LoginWindow();
        } else {
          User.Login(
            data,
            () => {
              MusicSystem.MainWindow(data);
            },
            () => {
              MusicSystem.LoginWindow(data);
            }
          );
        }
      },
      true
    );
  });
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (MainWindow === null) {
    MusicSystem.MainWindow(true);
  }
});
