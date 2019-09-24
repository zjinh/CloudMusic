<template>
    <div class="cm-right-head">
        <div class="cm-right-round">
            <button class="sf-icon-angle-left"></button>
            <button class="sf-icon-angle-right"></button>
        </div>
        <div class="cm-right-search-main">
            <i class="sf-icon-search"></i>
            <input type="text" placeholder="搜索歌曲...">
        </div>
        <div class="user-actions">
            <Dropdown placement="bottom-start" @on-click="SystemDropDown">
                <p class="item">
                    <img draggable="false" :src="UserInfo.avatarUrl" alt="">
                    <span>{{UserInfo.nickname}}</span>
                </p>
                <DropdownMenu slot="list">
                    <DropdownItem name="account">
                        <img draggable="false" :src="UserInfo.avatarUrl" alt="">
                        <span>我</span>
                    </DropdownItem>
                    <DropdownItem name="about">关于</DropdownItem>
                    <DropdownItem name="feedback">反馈</DropdownItem>
                    <DropdownItem name="exit">退出</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
        <ul class="window-actions">
            <li class="sf-icon-minus" @click="mini"></li>
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
            },
            UserInfo:{
                type:Object,
                default:function () {
                    return{
                        nickname:"未登录",
                        avatarUrl:""
                    }
                }
            }
        },
        data(){
            return{
                QuitFlag:false,//是否允许退出
                MusicWindow:false
            }
        },
        mounted(){
            this.MusicWindow=this.$electron.remote.getCurrentWindow();
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
        },
        methods:{
            mini () {
                this.MusicWindow.minimize();
            },
            close () {
                this.MusicWindow.hide();
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
                this.$Api.User.UserInfo((rs)=>{
                    this.$nextTick(()=>{
                        this.UserInfo=rs.profile;
                    });
                });
            },//获取用户信息,
        }
    }
</script>

<style scoped>
    .cm-right-head{
        float: left;
        width: 100%;
        height: 60px;
        color: #4d515a;
        -webkit-app-region: drag;
        position: relative;
        z-index: 4;
        overflow: unset;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    /*搜索*/

    .cm-right-round{
        width: 120px;
        -webkit-app-region: no-drag;
    }
    .cm-right-round button{
        background: #c34343;
        height: 23px;
        line-height: 23px;
        font-size: 16px;
        padding: 0 12px;
        color: #e56464;
    }
    .cm-right-round button:first-child{
        border-radius:45% 0 0 45%;
    }
    .cm-right-round button:last-child{
        border-radius:0 45% 45% 0;
    }
    .cm-right-search-main{
        width: 320px;
        margin-right: 320px;
        position: relative;
        -webkit-app-region: no-drag;
    }
    .cm-right-search-main input{
        width: 100%;
        height: 32px;
        border-radius: 20px;
        background: #c34343;
        color: #fff;
        line-height: 32px;
        padding-left: 10px;
        padding-right: 40px;
    }
    .cm-right-search-main input::-webkit-input-placeholder {
        color: #e56464;
    }
    .cm-right-search-main i{
        position: absolute;
        right: 0;
        color: #e56464;
        font-size: 16px;
        top: 0;
        width: 48px;
        height: 32px;
        line-height: 32px;
        text-align: center;
    }
    /*用户*/
    .user-actions{
        position: absolute;
        right: 150px;
        top: 15px;
        height: 30px;
        line-height: 30px;
        -webkit-app-region: no-drag;
        overflow: unset;
        color: #fff;
    }
    .user-actions *{
        -webkit-app-region: no-drag;
    }
    .user-actions .item{
        max-width: 100px;
        text-overflow: ellipsis;
        cursor: pointer;
    }
    .user-actions .item *{
        display: inline-block;
        height: 100%;
    }
    .user-actions .item img{
        border-radius: 100%;
        width: 30px;
        height: 30px;
    }
    .user-actions .item span{
        padding-left: 5px;
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
        top: 15px;
        right: 0;
        color: #fff
    }
    .window-actions li{
        float: left;
        width: 30px;
        height: 30px;
        margin-left: 5px;
        line-height: 30px;
        font-size: 12px;
        -webkit-app-region: no-drag;
        cursor: pointer;
        border-radius: 5px;
        -webkit-transition: all .35s;
        -moz-transition: all .35s;
        -o-transition: all .35s
    }
    .window-actions li:hover,.window-actions li:active{
        background: rgba(0,0,0,.1);
        -webkit-transition: all .35s;
        -moz-transition: all .35s;
        -o-transition: all .35s
    }
    .window-actions li:active{
        border-radius: 100%;
    }
</style>
