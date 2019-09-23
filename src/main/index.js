import {app, BrowserWindow, ipcMain, Menu, Tray, nativeImage, screen,session } from 'electron'
import { autoUpdater } from 'electron-updater'
import fa from "element-ui/src/locale/lang/fa";
const path = require('path');
let TransDownFolder=process.env.USERPROFILE;
let DownloadList={};
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
let version=require("../../package.json").version;
let LoginWindow,MainWindow,PopupWindow,AboutWindow,AccountWindow,FeedBackWindow;
/*播放按钮*/
let PlayerIcon = path.join(__static, '/img/player');
let NextBtn = nativeImage.createFromPath(path.join(PlayerIcon, 'next.png'));
let PlayBtn = nativeImage.createFromPath(path.join(PlayerIcon, 'play.png'));
let PauseBtn = nativeImage.createFromPath(path.join(PlayerIcon, 'pause.png'));
let PrevBtn = nativeImage.createFromPath(path.join(PlayerIcon, 'prev.png'));
let MusicButtons = [
  {
    tooltip: '上一首',
    icon: PrevBtn,
    click: () => {
      MainWindow.webContents.send('Prev');
    }
  },
  {
    tooltip: '播放',
    icon: PlayBtn,
    click: () => {
      MainWindow.webContents.send('Play');
    }
  },
  {
    tooltip: '下一首',
    icon:NextBtn,
    click: () => {
      MainWindow.webContents.send('Next');
    }
  }
];
let appTray = null;//托盘变量
/*窗口控制函数*/
let WindowControl={
  New:(options)=>{
    Menu.setApplicationMenu(null);
    let win = new BrowserWindow({
      width: options.width||800,
      height: options.height||600,
      minWidth: options.minWidth,
      minHeight: options.minHeight,
      title:options.title||'CloudMusic',
      frame:false,
      useContentSize:options.useContentSize||false,
      transparent:options.transparent||false,
      x:options.x,
      y:options.y,
      minimizable:options.minimizable === undefined ? true : options.minimizable,
      maximizable:options.maximizable === undefined ? true : options.maximizable,
      resizable:options.resizable === undefined ? true : options.resizable,
      alwaysOnTop:options.alwaysOnTop === undefined ? false : options.alwaysOnTop,
      show:false,
      webPreferences:{
        nodeIntegration:true,
        webSecurity:!(process.env.NODE_ENV === 'development')
      }
    });
    options.backgroundColor&&(win.backgroundColor=options.backgroundColor);
    win.name=options.url;
    win.loadURL(WindowControl.CheckRouter(options.url));
    win.callback=(data)=>{
      win.webContents.send('win-data',data);
      (typeof options.callback==='function')?options.callback():"";
    };
    win.on('closed', (event)=> {
      win=null;
      (typeof options.onclose==='function')?options.onclose(event):"";
    });
    win.on('ready-to-show',(event)=>{
      win.show();
      win.focus();
      (typeof options.ready==='function')?options.ready(event):"";
    });
    win.webContents.on('did-finish-load',()=>{
      win.setTitle(options.title || 'CloudMusic');
      win.callback(options.data||'无数据');
    });
    return win;
  },
  CheckRouter:(router)=>{
    return process.env.NODE_ENV === 'development'
        ? `http://localhost:9080/#/`+router
        : `file://${__dirname}/index.html#/`+router;
  },
  Active:(win,data)=>{
    if(win) {
      win.show();
      win.focus();
      data&&win.callback(data);
    }
  }
};
/*网盘函数*/
function FileObject(item,state){
  return {
    id:Math.round(item.getStartTime()),
    url:item.getURLChain(),
    time:item.getStartTime(),
    name:item.fileName,
    path:item.path,
    chunk:item.getReceivedBytes(),
    size:item.getTotalBytes(),
    trans_type: 'download',
    state:state||item.getState(),
    disk_main:item.getURL(),
    canResume:item.canResume(),
    shows:true,
  }
}
let MusicSystem= {
  LoginWindow:()=>{
    if(LoginWindow){
      return WindowControl.Active(LoginWindow);
    }
    LoginWindow=WindowControl.New({
      url:'login',
      title:'CloudMusic-欢迎',
      width: 300,
      height: 550,
      alwaysOnTop:true,
      maximizable:false,
      resizable:false,
      onclose:()=>{
        LoginWindow=null;
      },
    });
  },
  MainWindow:(data)=>{
    if(MainWindow){
      return WindowControl.Active(MainWindow,data);
    }
    let trayIcon = path.join(__static, '/icons');
    appTray = new Tray(path.join(trayIcon, 'icon.ico'));
    //图标的上下文菜单
    let trayMenuTemplate = [//托盘菜单
      {
        label: 'C-Music',//菜单显示文本项
        click: function () {
          MainWindow.show();//显示
          MainWindow.restore();//窗口欢迎
          MainWindow.focus();//窗口聚焦
        }
      },
      {
        label: '系统设置',//菜单显示文本项
        click: function () {}
      },
      {
        label: '反馈',//菜单显示文本项
        click: function () {
          MusicSystem.FeedBackWindow();
        }
      },
      {
        label: '关于',//菜单显示文本项
        click: function () {
          MusicSystem.AboutWindow();
        }
      },
      {
        label: '退出',
        click: function () {
          MainWindow.show();
          MainWindow.focus();
          MainWindow.webContents.send('exit');
        }
      }
    ];
    const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
    //设置此托盘图标的悬停提示内容
    appTray.setToolTip('CloudMusic');
    //设置此图标的上下文菜单
    appTray.setContextMenu(contextMenu);
    appTray.on("click", function(){
      MainWindow.isVisible() ? MainWindow.hide() : MainWindow.show();
    });
    MainWindow=WindowControl.New({
      url:'main',
      data:data,
      title:'CloudMusic',
      width: 1000,
      minWidth:1000,
      minHeight:650,
      height: 650,
      maximizable:false,
      resizable:false,
      onclose:()=>{
        MainWindow=null;
        let wins=BrowserWindow.getAllWindows();
        for(let i=0;i<wins.length;i++){
          if(wins[i].name!=='/') {
            wins[i] ? wins[i].close() : '';
          }
        }
        appTray.destroy();
        if(!MainWindow) {
          app.quit();
        }
        session.defaultSession.removeAllListeners('will-download');
      },
      callback:()=>{
          MainWindow.setThumbarButtons(MusicButtons);
          BindIpc();
      }
    });
  },
  AboutWindow:()=>{
    if(AboutWindow){
      return WindowControl.Active(AboutWindow);
    }
    AboutWindow=WindowControl.New({
      url:'music-about/'+version,
      title:'关于CloudMusic',
      width: 600,
      height: 330,
      maximizable:false,
      minimizable:false,
      resizable:false,
      onclose:()=>{
        AboutWindow=null;
      }
    });
  },
  AccountWindow:(data)=>{
    if(AccountWindow){
      return WindowControl.Active(AccountWindow,data);
    }
    AccountWindow=WindowControl.New({
      url:'music-account',
      data:data,
      title:'个人信息',
      width: 670,
      height: 420,
      maximizable:false,
      resizable:false,
      onclose:()=>{
        AccountWindow=null;
      }
    });
  },
  FeedBackWindow:()=>{
    if(FeedBackWindow){
      return WindowControl.Active(FeedBackWindow);
    }
    FeedBackWindow=WindowControl.New({
      url:'music-feedback/'+version,
      title:'问题反馈',
      width: 450,
      height: 320,
      maximizable:false,
      minimizable:false,
      resizable:false,
      onclose:()=>{
        FeedBackWindow=null;
      },
    });
  },
  PopupWindow:(msg)=>{
    if(PopupWindow){
      return WindowControl.Active(PopupWindow,msg);
    }
    PopupWindow=WindowControl.New({
      url:"music-msg",
      data:msg,
      width: 300,
      height: 150,
      useContentSize: true,
      resizable:false,
      maximizable:false,
      transparent:true,
      alwaysOnTop:true,
      x:screen.getPrimaryDisplay().workAreaSize.width-305,
      y:screen.getPrimaryDisplay().workAreaSize.height-155,
      onclose:()=>{
        PopupWindow=null;
      }
    });
  },
  CheckUpdate:(event)=>{
    let message={
      appName:'CloudMusic',
      error:'检查更新出错, 请联系开发人员',
      checking:'正在检查更新……',
      updateAva:'检测到新版本，正在下载……',
      updateNotAva:'现在使用的就是最新版本，不用更新',
      downloaded: '最新版本已下载，点击安装进行更新'
    };
    //当开始检查更新的时候触发
    autoUpdater.on('checking-for-update', function() {
      event.sender.send('check-for-update',message.checking);//返回一条信息
    });
    //当发现一个可用更新的时候触发，更新包下载会自动开始
    autoUpdater.on('update-available', function(info) {
      event.sender.send('update-down-success', info);
      event.sender.send('check-for-update',message.updateAva);//返回一条信息
    });
    //当没有可用更新的时候触发
    autoUpdater.on('update-not-available', function() {
      event.sender.send('check-for-update',message.updateNotAva);//返回一条信息
    });
    autoUpdater.on('error', function(){
      event.sender.send('check-for-update',message.error);//返回一条信息
    });
    // 更新下载进度事件
    autoUpdater.on('download-progress', (progressObj)=>{
      event.sender.send('download-progress',progressObj)
    });
    autoUpdater.on('update-downloaded',  function () {
      event.sender.send('check-for-update',message.downloaded);//返回一条信息
      //通过main进程发送事件给renderer进程，提示更新信息
    });
  },
  logoff:()=>{
    MainWindow.webContents.send('exit');
    MainWindow.close();
  },
  exit:()=>{

  },
};
function BindIpc() {
  /*系统操作事件*/
  ipcMain.on('system',(event,type,data)=>{
    switch (type) {
      case'to-login':
        MusicSystem.LoginWindow();
        break;
      case 'login':
        TransDownFolder=data.TransDownFolder;
        MusicSystem.MainWindow(data);
        break;
      case 'popup':
        MusicSystem.PopupWindow(data);
        break;
      case 'account':
        MusicSystem.AccountWindow(data);
        break;
      case 'about':
        MusicSystem.AboutWindow();
        break;
      case 'feedback':
        MusicSystem.FeedBackWindow();
        break;
      case 'setting':
        MusicSystem.SettingWindow(data);
        break;
      case 'check-for-update':/*检查更新*/
        autoUpdater.setFeedURL(data+'/update');
        MusicSystem.CheckUpdate(event);
        autoUpdater.checkForUpdates();
        break;
      case 'update':/*安装更新*/
        autoUpdater.quitAndInstall();
        break;
      case 'user-update':
        MainWindow.webContents.send('user-update',data);
        break;
      case 'logoff':
        MusicSystem.logoff();
        break;
      case 'exit':

        break;
    }
  });
  /*播放器操作事件*/
  ipcMain.on('player-control',(event,data)=>{
    if(data==='pause') {
      MusicButtons[1].icon = PauseBtn;
      MusicButtons[1].tooltip='暂停'
    }else{
      MusicButtons[1].icon =PlayBtn;
      MusicButtons[1].tooltip='播放'
    }
    MainWindow.setThumbarButtons(MusicButtons);
  });
  /*下载事件控制*/
  ipcMain.on('download',(event,type,data)=>{
    let downloadItem=DownloadList[data];
    if(downloadItem===undefined){
      return
    }
    switch (type) {
      case 'pause':
        downloadItem.pause();
        break;
      case 'cancel':
        downloadItem.cancel();
        break;
      case 'resume':
        if(downloadItem.canResume()){
          downloadItem.resume();
        }
        break;
    }
  });
  session.defaultSession.removeAllListeners('will-download');
  session.defaultSession.on('will-download', (event, item, webContents) => {
    let name=decodeURI(item.getURLChain().toString().split('?disk_name=')[1])||item.getFilename();
    item.fileName=name;
    item.path=TransDownFolder+'/'+name;
    item.setSavePath(TransDownFolder+'/'+name); // 设置保存路径,使Electron不提示保存对话框。
    item.on('updated', () => {
      DownloadList[Math.round(item.getStartTime())]=item;
      let file=FileObject(item,item.isPaused()?'interrupted':false);
      webContents&&webContents.send('download',file);
    });
    item.once('done', (event, state) => {
      let file=FileObject(item,item.isPaused()?'interrupted':false);
      webContents&&webContents.send('download',file);
      if (state === 'completed') {
        delete DownloadList[Math.round(item.getStartTime())];
      } else {
        console.log(`Download failed: ${state}`)
      }
    })
  })
}

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (MainWindow) {
      MainWindow.show();
      MainWindow.restore();
      MainWindow.focus()
    }
  });
  app.on('ready', function (){
    app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
    MusicSystem.MainWindow(true);
  });
}
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});
app.on('activate', () => {
  if (MainWindow === null) {
    MusicSystem.MainWindow(true)
  }
});
