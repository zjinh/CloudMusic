<template>
    <section class="cm-left">
        <div class="cm-left-head">
            <img draggable="false" class="logo" v-lazy="$static+'/img/bar/music.png'" alt="">
            <div class="logo-text"></div>
            <p>愿每个人都被时光温柔以待</p>
        </div>
        <div class="cm-left-menu">
            <div class="cm-left-menu-container" v-for="(item,index) in MenuData">
                <p>{{item.name}}</p>
                <ul>
                    <li v-for="(menu,m_index) in item.children" ripple :class="menu.active" @click="change(index,m_index)">
                        <span class="sf-icon-play-1" v-if="index>1&&menu.icon==='sf-icon-bars'"></span>
                        <i :class="menu.icon"></i>{{menu.name}}<div v-show="menu.count>0">{{menu.count}}</div>
                    </li>
                </ul>
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        name: "MusicClassify",
        inject:['fullControl'],
        props:{
            show:{
                type:Boolean
            }
        },
        watch:{
            $route:{
                handler(){
                    this.getNowRoute();
                    this.fullControl(false)
                }
            }
        },
        beforeMount(){
            let time=setInterval(()=>{
                if(this.$Api.User.UserId) {
                    clearInterval(time);
                    this.getUserPlayList();
                }
            },500)
        },
        data(){
            return{
                MenuData:[
                    {
                        name:"浏览音乐",
                        children:[
                            {
                                name:"发现音乐",
                                icon:"sf-icon-globe",
                                data:"/discover",
                                active:'active'
                            },
                            {
                                name:"私人FM",
                                icon:" sf-icon-scrubber",
                                data:"/fm",
                                active:''
                            },
                        ],
                    },
                    {
                        name:"我的音乐",
                        children:[
                            {
                                name:"本地音乐",
                                icon:"sf-icon-tv",
                                data:"/local",
                                active:''
                            },
                            {
                                name:"我的电台",
                                icon:"sf-icon-headphones",
                                data:"/my-radio",
                                active:''
                            },
                            {
                                name:"播放历史",
                                icon:"sf-icon-clock",
                                data:"/history",
                                active:''
                            },
                            {
                                name:"我的收藏",
                                icon:"sf-icon-star-o",
                                data:"/my-collect",
                                active:''
                            },
                            {
                                name:"下载管理",
                                icon:"sf-icon-arrow-to-bottom",
                                data:"/download",
                                active:''
                            }
                        ],
                    },
                    {
                        name:"我的歌单",
                        children:[
                            {
                                name:"我喜欢的音乐",
                                icon:"sf-icon-heart-o",
                                active:''
                            }
                        ],
                    },
                    {
                        name:"收藏的歌单",
                        children:[],
                    },
                ],
            }
        },
        methods:{
            change(index,m_index) {
                this.$router.push({
                    path:this.MenuData[index].children[m_index].data,
                    query:index>1?{
                        list:JSON.stringify(this.MenuData[index].children[m_index])
                    }:{}
                });
            },
            getNowRoute(){
                this.MenuData.forEach(function (item) {
                    item.children.forEach((menu)=>{
                        menu.active = false
                    })
                });
                for (let i = 0; i < this.MenuData.length; i++) {
                    for(let j=0;j<this.MenuData[i].children.length;j++){
                        if (this.$route.path === this.MenuData[i].children[j].data) {
                            this.$set(this.MenuData[i].children[j],'active','active');
                        }
                    }
                }
            },
            getUserPlayList(){
                this.$Api.User.playList(this.$Api.User.UserId,0,(rs)=>{
                    rs.playlist.forEach((item)=>{
                        item.data='/user-playlist/'+item.id;
                        item.active=false;
                        item.icon=item.privacy===10?'sf-icon-lock-alt':(item.specialType===5?'sf-icon-heart-o':'sf-icon-bars');
                        if(item.specialType===5){
                            let subStr=new RegExp(this.$parent.UserInfo.nickname);//创建正则表达式对象
                            item.name=item.name.replace(subStr,"我");
                        }
                    });
                    this.MenuData[2].children=rs.playlist.filter((item)=>{
                        return item.creator.userId===this.$Api.User.UserId;
                    });
                    this.MenuData[3].children=rs.playlist.filter((item)=>{
                        return item.creator.userId!==this.$Api.User.UserId;
                    });
                })
            }
        }
    }
</script>

<style scoped>
    /*左侧头部*/
    .cm-left{
        float: left;
        width:200px;
        height: calc(100% - 60px);
        color: #4d515a;
        background: #f5f6fa;
    }
    .full-page{
        background: #fff!important;
        position: relative!important;
        top: 0!important;
    }
    .cm-left-head{
        width: 100%;
        padding:10px 0 30px 20px;
        height: 60px;
        position: relative;
        z-index: 4;
    }
    .cm-left-head *{
        float: left;
    }
    .cm-left-head .logo{
        width: 40px;
        height: 40px;
        box-shadow: 0 0 15px 0 rgba(0,0,0,.1);
        border-radius: 100%;
        margin-right: 4px;
    }
    .cm-left-head p{
        position: absolute;
        left: 64px;
        top: 33px;
        font-size: 10px;
        text-indent: 4px;
    }
    .cm-left-head .logo-text{
        width: 110px;
        margin-top: -3px;
        height: 26px;
        background: url("../../../../static/img/logo/c-music.png");
        background-size: contain!important;
        background-repeat: no-repeat!important;
    }
    .full .logo-text{
        width: 120px;
        margin-top: -2px;
        margin-left: -3px;
        background: url("../../../../static/img/logo/c-music-white.png");
    }
    .full p{
        color: #fff;
    }
    /*左侧菜单*/
    .cm-left-menu{
        width: 100%;
        height: calc(100% - 60px);
        overflow: auto;
        position: relative;
    }
    .cm-left-menu::-webkit-scrollbar-thumb{
        display: none;
    }
    .cm-left-menu li{
        width: 100%;
        height: 35px;
        line-height: 35px;
        cursor: pointer;
        font-size: 12.5px;
        margin-top: 5px;
        color: #39585a;
        position: relative;
        border-left: 4px solid rgba(0,0,0,0);
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-left: 10px;
    }
    .cm-left-menu li:hover,.cm-left-menu .active{
        color: #e56464!important;
        border-left: 4px solid #e56464;
    }
    .cm-left-menu li span{
        position: absolute;
        width: 12px;
        font-size: 10px;
        left: 26px;
        top: 14px;
        background: #f5f6fa;
        padding: 2px;
    }
    .cm-left-menu i{
        float: left;
        width: 35px;
        height: 35px;
        display: block;
        text-align: center;
        line-height: 35px;
        font-size: 14px;
        margin-right: 2px;
    }
    .cm-left-menu .sf-icon-bars{
        font-size: 12px;
        text-indent: -5px;
    }
    .cm-left-menu li div{
        float: right;
        padding: 0 6px;
    }
    .cm-left-menu-container p{
        font-size: 13px;
        color: #b3b3b3;
        font-weight: normal;
        text-indent: 22px;
        line-height: 25px;
        padding-top: 5px;
    }
</style>
