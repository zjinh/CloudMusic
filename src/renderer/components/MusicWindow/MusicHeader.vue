<template>
    <div class="cm-right-head">
        <div :class="'cm-right-round '+(full?'full':'')">
            <button class="sf-icon-angle-left" @click="navBack"></button>
            <button class="sf-icon-angle-right" @click="$router.forward()"></button>
        </div>
        <div :class="'cm-right-search-main '+(full?'full':'')">
            <i class="sf-icon-search"></i>
            <input type="text" v-model="SearchKey" placeholder="搜索歌曲..." @input="SearchInput" @keydown.enter="SearchSuggest=false" @keyup.enter="startSearch" @blur="closeSuggest">
        </div>
        <div class="cm-right-search-bubble" tabindex="-1" @keydown.enter="SearchSuggest=false" :style="{height:SearchSuggest&&SearchKey.length?'370px':0}">
            <div class="cm-right-search-bubble-content">
                <div class="artist">
                    <p>歌手</p>
                    <span v-if="SearchSuggestResult.artists">
                        {{SearchSuggestResult.artists[0].name}}
                    </span>
                    <ul v-if="SearchSuggestResult.artists">
                        <li v-for="(item,index) in SearchSuggestResult.artists" class="animated slideInLeft" :style="{'z-index':SearchSuggestResult.artists.length-index,left:'-20'*index+20+'px'}" @click="searchSinger(item)">
                            <img :src="item.img1v1Url" alt="" draggable="false">
                        </li>
                    </ul>
                    <NoData v-else></NoData>
                    <span class="key">Artist</span>
                </div>
                <div class="songs">
                    <p>歌曲</p>
                    <ul v-if="SearchSuggestResult.songs" class="animated slideInLeft">
                        <li v-for="(item,index) in SearchSuggestResult.songs" @click="playSearch(item)">
                            {{item.name}}
                        </li>
                    </ul>
                    <NoData v-else></NoData>
                </div>
                <div class="album">
                    <p>专辑</p>
                    <ul v-if="SearchSuggestResult.albums">
                        <li v-for="(item,index) in SearchSuggestResult.albums" @click="searchAlbum(item)" class="animated slideInLeft">
                            <img :src="item.artist.picUrl" alt="">
                            <span>{{item.name}}</span>
                        </li>
                    </ul>
                    <NoData v-else></NoData>
                </div>
            </div>
            <div class="cm-right-search-blur">
                <BlurBackground :url="NowPlay.picture" style="height: 100%"></BlurBackground>
            </div>
        </div>
        <div class="user-actions">
            <Dropdown placement="bottom-start" @on-click="SystemDropDown">
                <p class="item">
                    <img draggable="false" :src="UserInfo.avatarUrl" alt="">
                    <span>{{UserInfo.nickname}}</span>
                </p>
                <DropdownMenu slot="list">
                    <!--<DropdownItem name="account">
                        <img draggable="false" :src="UserInfo.avatarUrl" alt="">
                        <span>我</span>
                    </DropdownItem>-->
                    <DropdownItem name="about">关于</DropdownItem>
                    <DropdownItem name="logoff">退出账号</DropdownItem>
                    <DropdownItem name="exit">退出</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
        <ul class="window-actions">
            <li class="sf-icon-cog"></li>
            <li class="sf-icon-minus" @click="mini"></li>
            <li class="sf-icon-times" style="font-size:14px" @click="close"></li>
        </ul>
    </div>
</template>

<script>
    let a=null;
    import BlurBackground from "../MusicWindow/BlurBackground"
    export default {
        name: "DiskHeader",
        inject:['playMusic','fullControl','isFull'],
        components:{
            BlurBackground
        },
        props:{
            NowPlay:{
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
            },
            full:Boolean
        },
        data(){
            return{
                QuitFlag:false,//是否允许退出
                MusicWindow:false,
                SearchKey:'',
                SearchSuggest:false,
                LastCommand:'',
                SearchSuggestResult:{}
            }
        },
        mounted(){
            this.MusicWindow=this.$electron.remote.getCurrentWindow();
            window.onbeforeunload=()=>{
                if(this.LastCommand==='logoff'){
                    this.QuitFlag=true;
                    this.MusicWindow.close();
                }
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
                this.LastCommand=command;
                if(command!=='logoff'&&command!=='exit') {
                    this.$ipc.send('system', command,command==='account'?this.UserInfo:"");
                }else{
                    let tips='',type='';
                    type=(command==='logoff'?'登出':'退出');
                    if(this.count>0){
                        tips=this.count+'个传输任务未完成，'+type+'将暂停传输<br>'
                    }
                    switch (command){
                        case 'logoff':
                            this.Confrim({
                                title:'退出账号',
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
            closeSuggest(){
                let b=setTimeout(() => {
                    this.SearchSuggest = false;
                    clearTimeout(b);
                }, 500);
            },
            SearchInput(){
                if(a){
                    clearTimeout(a)
                }
                a=setTimeout(()=>{
                    this.SearchKey=this.SearchKey.trim();
                    if(this.SearchSuggest !== 0 && this.SearchKey.length){
                        this.$Api.Music.searchSuggest(this.SearchKey,(rs)=>{
                            this.SearchSuggestResult=rs.result;
                            this.SearchSuggestResult.songs=this.$handleListData(this.SearchSuggestResult.songs,'searchSuggest');
                            this.SearchSuggest=true;
                        })
                    }else{
                        this.SearchSuggest=false;
                    }
                    clearTimeout(a)
                },500)
            },
            playSearch(item){
                this.playMusic(item,[item]);
                this.SearchSuggest=false;
            },
            startSearch(){
                this.SearchSuggest=0;
                this.closeSuggest();
                this.$router.push({
                    path:'/search/'+this.SearchKey
                });
            },
            searchSinger(item){
                this.$router.push({
                    path:'/artist-detail/'+item.id,
                    query:{
                        data:JSON.stringify(item)
                    }
                });
            },
            searchAlbum(item){
                this.$router.push({
                    path:'/album-detail/'+item.id,
                    query:{
                        data:JSON.stringify(item)
                    }
                });
            },
            navBack(){
                if(this.isFull()){
                    return this.fullControl(false)
                }
                this.$router.back()
            }
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
        z-index: 5;
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
        line-height: 24px;
        font-size: 16px;
        padding: 0 12px;
        color: #e56464;
    }
    .cm-right-round button:hover{
        color: #fff;
    }
    .cm-right-round button:first-child{
        border-radius:45% 0 0 45%;
    }
    .cm-right-round button:last-child{
        border-radius:0 45% 45% 0;
        margin-left: -2px;
    }
    .cm-right-search-main{
        width: 280px;
        margin-right: 320px;
        position: relative;
        -webkit-app-region: no-drag;
    }
    .cm-right-search-main input{
        width: 100%;
        height: 30px;
        border-radius: 20px;
        background: #c34343;
        color: #fff;
        line-height: 30px;
        padding-left: 10px;
        padding-right: 32px;
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
        width: 40px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background: none!important;
    }
    .full button,.full i,.full input{
        background: rgba(255,255,255,.1);
        color: #fff;
    }
    .full input::-webkit-input-placeholder{
        color: #e3e8ee;
    }
    .cm-right-search-bubble{
        width: 280px;
        height: 370px;
        border-radius: 0 0 5px 5px;
        position: absolute;
        left: 173px;
        top: 60px;
        overflow: unset;
        box-shadow: 0px 2px 9px -1px rgba(0,0,0,.5);
        background: rgba(255,255,255,.5);
        -o-transition: all 350ms;
        -moz-transition: all 350ms;
        -webkit-transition: all 350ms;
    }
    .cm-right-search-blur{
        position: absolute;
        z-index: 0;
        width: 100%;
        height: 100%;
        border-radius: 0 0 5px 5px;
        opacity: .5;
    }
    .cm-right-search-bubble-content{
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 1;
        border-radius: 0 0 5px 5px;
        color: #fff;
    }
    .cm-right-search-bubble-content .artist{
        width: 100%;
        background: #e564645c;
        height: 100px;
        position: relative;
    }
    .cm-right-search-bubble-content p{
        padding: 10px;
        font-size: 14px;
    }
    .cm-right-search-bubble-content .artist .key{
        color: rgba(255,255,255,.5);
        position: absolute;
        font-weight: bold;
        font-size: 50px;
        bottom: -5px;
        right: 10px;
    }
    .cm-right-search-bubble-content .artist span{
        line-height: 40px;
        float: left;
        font-size: 20px;
        padding-left: 10px;
        position: absolute;
        height: 40px;
        width: 56%;
        text-overflow: ellipsis;
        white-space: nowrap;
        z-index: 0;
    }
    .cm-right-search-bubble-content .artist ul{
        float: right;
        margin-top: -5px;
        width: 56%;
    }
    .cm-right-search-bubble-content .artist li{
        display: inline-block;
        position: relative;
        width: 50px;
        height: 50px;
        cursor: pointer;
    }
    .cm-right-search-bubble-content .artist img{
        width: 100%;
        height: 100%;
        border-radius: 100%;
        border: 2px solid #fff;
    }
    .cm-right-search-bubble-content .songs{
        width: 100%;
        background: #e56464bf;
        height: 140px;
        border-top: 1px solid rgba(255, 146, 146, 0.5);
    }
    .cm-right-search-bubble-content .songs ul{
        width: 100%;
        height: calc(100% - 40px);
        overflow: auto;
    }
    .cm-right-search-bubble-content .songs li{
        width: 100%;
        height: 30px;
        line-height: 30px;
        padding-left: 10px;
        cursor: pointer;
    }
    .cm-right-search-bubble-content .songs li:hover{
        background: #e56464;
    }
    .cm-right-search-bubble-content .album{
        width: 100%;
        height: 130px;
        background: #e56464;
        position: relative;
        border-top: 1px solid rgba(255, 146, 146, 0.5);
    }
    .cm-right-search-bubble-content .album ul{
        padding: 0 10px;
        overflow: auto;
        height: 89px;
    }
    .cm-right-search-bubble-content .album li{
        display: inline-block;
        width: 55px;
        height: 80px;
        text-align: center;
        margin-right: 5px;
        cursor: pointer;
    }
    .cm-right-search-bubble-content .album li img{
        width: 100%;
        height: 55px;
        border-radius: 5px;
    }
    .cm-right-search-bubble-content .album li span{
        overflow: hidden;
        height: 20px;
        text-overflow: ellipsis;
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
        border-radius: 0 0 5px 5px;
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
