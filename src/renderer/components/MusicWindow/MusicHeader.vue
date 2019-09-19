<template>
    <div class="cm-right-head">
       <!-- <ul class="cm-right-menu">
            <li v-for="(item,index) in HeaderClassify" @click="HeaderType(item.flag)">
                <p> {{item.name}}</p>
                <div class="active" :style="{width:data.Type===item.flag?'100%':0}"></div>
            </li>
        </ul>-->
        <ul class="user-actions" >
            <Dropdown placement="bottom-start" @on-click="SystemDropDown">
                <li class="item">{{UserInfo.username}}</li>
                <DropdownMenu slot="list">
                    <DropdownItem name="account">
                        <img draggable="false" :src="UserInfo.userhead" alt="">
                        <span>我</span>
                    </DropdownItem>
                    <DropdownItem name="setting">系统设置</DropdownItem>
                    <DropdownItem name="about">关于</DropdownItem>
                    <DropdownItem name="feedback">反馈</DropdownItem>
                    <DropdownItem name="switch">切换账户</DropdownItem>
                    <DropdownItem name="exit">退出</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </ul>
        <ul class="window-actions">
            <li class="sf-icon-minus" @click="mini"></li>
            <li :class="ButtonState" style="display: none" @click="restore"></li>
            <li class="sf-icon-times" style="font-size:16px" @click="close"></li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "DiskHeader",
        props:{
            data:{
                type:Object
            },
            count:{
                type:Number
            }
        },
        data(){
            return{
                UserInfo:{
                    username:"未登录",
                    userhead:""
                },//用户信息
                QuitFlag:false,//是否允许退出
                ButtonState:"sf-icon-window-maximize",//右上角窗口按钮状态,
                HeaderClassify:[
                    {name:"网盘",flag:'disk'},
                    {name:"分享",flag:'share'},
                    {name:"传输",flag:'trans'},
                ],
                MusicWindow:false
            }
        },
        mounted(){
            this.MusicWindow=this.$electron.remote.getCurrentWindow();
            this.MusicWindow.on('maximize',()=>{
                this.ButtonState='sf-icon-window-restore';
            });
            this.MusicWindow.on('unmaximize',()=>{
                this.ButtonState='sf-icon-window-maximize';
            });
            window.onbeforeunload=()=>{
                if(!this.QuitFlag&&process.env.NODE_ENV !== 'development') {
                    this.MusicWindow.hide();
                    return false
                }
            };
            this.$ipc.on('exit',()=>{
                this.SystemDropDown('exit');
            });
            this.$ipc.on('user-update',()=>{
                this.GetUserInfo();
            });
            this.GetUserInfo();
        },
        methods:{
            mini () {
                this.MusicWindow.minimize();
            },
            close () {
                this.MusicWindow.hide();
            },
            restore () {
                if (this.MusicWindow.isMaximized()) {
                    this.MusicWindow.restore();
                } else {
                    this.MusicWindow.maximize();
                }
            },
            SystemDropDown (command) {
                if(command!=='switch'&&command!=='exit') {
                    this.$ipc.send('system', command,command==='account'?this.UserInfo:"");
                }else{
                    let tips='',type='';
                    type=(command==='switch'?'切换':'退出');
                    if(this.count>0){
                        tips=this.count+'个传输任务未完成，'+type+'将暂停传输<br>'
                    }
                    switch (command){
                        case 'switch':
                            this.Confrim({
                                title:'切换账号',
                                tips:tips+'确认退出当前账号吗',
                                callback:()=> {
                                    this.QuitFlag=true;
                                    this.$ipc.send('system','logoff');
                                }
                            });
                            break;
                        case 'exit':
                            this.Confrim({
                                title:'退出',
                                tips:tips+'确认退出CloudMusic吗?',
                                type:'info',
                                callback:()=> {
                                    this.QuitFlag=true;
                                    this.MusicWindow.close();
                                }
                            });
                            break;
                    }
                }
            },
            GetUserInfo () {
                /*this.$Api.User.UserInfo((rs)=>{
                    this.$nextTick(()=>{
                        this.UserInfo=rs[0];
                    });
                    this.$Api.LocalFile.Exist(rs[0].userid);
                    this.$Api.LocalFile.Write('user',rs[0]);
                    localStorage.LoginTime=rs[0].login_time;
                },()=>{
                    this.$Message.error({
                        content: '账号状态异常，请重新登录！',
                        onClose:()=> {
                            /////弹出登录页
                            this.QuitFlag=true;
                            this.$ipc.send('system','logoff');
                        }
                    });
                });*/
            },//获取用户信息,
            HeaderType(commend){
                this.$emit('callback',commend);
            },
        }
    }
</script>

<style scoped>
    .cm-right-head{
        float: left;
        width: 100%;
        height: 60px;
        color: #4d515a;
        padding: 20px 0 10px;
        -webkit-app-region: drag;
        position: relative;
        z-index: 4;
    }
    /*顶部导航*/
    .cm-right-menu{
        float: left;
        height: 35px;
        -webkit-app-region: no-drag;
    }
    .cm-right-menu img{
        float: left;
        width: 35px;
        margin: 0 15px;
        -webkit-app-region: drag;
    }
    .cm-right-menu span{
        float: left;
        font-weight: bold;
        color: #fff;
        line-height: 40px;
        padding: 0 10px 0 0;
        -webkit-app-region: drag;
        font-size: 14px;
    }
    .cm-right-menu li {
        float: left;
        margin-left: 15px;
        cursor: pointer;
    }
    .cm-right-menu li p {
        font-weight: bold;
        padding: 0 15px;
        text-align: center;
        font-size: 14px;
        line-height: 32px;
    }
    .cm-right-menu li>.sf-icon-* {
        display: block
    }
    .active {
        width: 100%;
        height: 3px;
        background: #009594;
    }
    .active,.cm-right-menu li:hover .active {
        -webkit-transition: all .35s;
        -moz-transition: all .35s;
        -o-transition: all .35s
    }
    .cm-right-menu li:hover .active {
        width: 100%!important
    }
    /*用户*/
    .user-actions{
        position: absolute;
        right: 150px;
        top: 0;
        -webkit-app-region: no-drag;
        overflow: unset;
    }
    .user-actions *{
        -webkit-app-region: no-drag;
    }
    .user-actions .item{
        background: #f5f5f5;
        padding:0 5px;
        max-width: 100px;
        text-overflow: ellipsis;
        cursor: pointer;
    }
    .user-actions .item:hover{
        background: #eee;
    }
    .ivu-dropdown-item img{
        float: left;
        width: 30px;
        height: 30px;
        border-radius: 100%;
    }
    .ivu-dropdown-item span{
        margin-left: 10px;
        font-size: 14px;
        width: unset!important;
        background: none;
        line-height: 30px;
    }
    /*窗体操作*/
    .window-actions{
        float: right!important;
        text-align: center;
        padding: 0 5px;
        position: absolute;
        top: 0;
        right: 0;
        color: #fff;
        -webkit-transition: all .35s;
        -moz-transition: all .35s;
        -o-transition: all .35s
    }
    .window-actions li{
        float: left;
        width: 32px;
        height: 28px;
        margin-left: 5px;
        line-height: 28px;
        font-size: 12px;
        -webkit-app-region: no-drag;
        cursor: pointer;
    }
    .window-actions li:hover{
        background: rgba(0,0,0,.1);
    }
    .window-actions:hover{
        -webkit-transition: all .35s;
        -moz-transition: all .35s;
        -o-transition: all .35s
    }
</style>
