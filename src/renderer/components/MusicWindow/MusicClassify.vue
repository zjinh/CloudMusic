<template>
    <section class="cm-left">
        <div class="cm-left-head">
            <img draggable="false" class="logo" v-lazy="$static+'/img/bar/music.png'" alt="">
            <span><img class="logo-text" v-lazy="$static+'/img/logo/c-music-white.png'" alt=""></span>
            <p>愿每个人都被时光温柔以待</p>
        </div>
        <div class="cm-left-menu">
            <div class="cm-left-menu-container" v-for="(item,index) in MenuData">
                <p>{{item.name}}</p>
                <ul>
                    <li v-for="(menu,m_index) in item.children" ripple :class="menu.active" @click="change(index,m_index)">
                        <span class="sf-icon-music" v-if="index>1&&menu.icon==='sf-icon-bars'"></span>
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
            DiskData:{
                type:Object
            },
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
                        name:"发现音乐",
                        children:[
                            {
                                name:"今日推荐",
                                icon:"sf-icon-music",
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
                                icon:"sf-icon-hdd",
                                data:"/local",
                                active:''
                            },
                            {
                                name:"下载管理",
                                icon:"sf-icon-arrow-to-bottom",
                                data:"/download",
                                active:''
                            },
                            {
                                name:"播放历史",
                                icon:"sf-icon-clock",
                                data:"/history",
                                active:''
                            },
                            {
                                name:"我的电台",
                                icon:"sf-icon-bullseye",
                                data:"",
                                active:''
                            },
                            {
                                name:"我的收藏",
                                icon:"sf-icon-star-o",
                                data:"",
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
                this.$Api.Music.getUserPlayList(this.$Api.User.UserId,(rs)=>{
                    rs.playlist.forEach((item)=>{
                        item.data='/user-playlist/'+item.id;
                        item.active=false;
                        item.icon=item.privacy===10?'sf-icon-lock-alt':(item.specialType===5?'sf-icon-heart-o':'sf-icon-bars');
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
        font-weight: 600;
        color: #4d515a;
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
    }
    .cm-left-head span{
        line-height: 40px;
        padding: 0 10px 0 0;
        -webkit-app-region: drag;
        font-size: 16px;
        margin-left: 5px;
    }
    .cm-left-head .logo-text{
        width: 110px;
    }
    .cm-left-head p{
        margin-left: 11px;
        font-size: 10px;
        font-weight: normal;
        color: #efefef;
    }
    /*左侧菜单*/
    .cm-left-menu{
        width: 100%;
        height: calc(100% - 60px);
        overflow: auto;
        background: #f4f5f7;
        border-top: 1px solid #eee;
        position: relative;
    }
    .cm-left-menu li{
        width: 100%;
        height: 32px;
        line-height: 32px;
        cursor: pointer;
        font-size: 12.5px;
        margin-top: 5px;
        color: #39585a;
        position: relative;
        border-left: 4px solid rgba(0,0,0,0);
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .cm-left-menu li:hover,.cm-left-menu .active{
        color: #e56464!important;
        background-color: #EAECF0;
        border-left: 4px solid #e56464;
    }
    .cm-left-menu li span{
        position: absolute;
        width: 12px;
        font-size: 20px;
        left: 16px;
        top: 7px;
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
        font-size: 12px;
        color: #484848;
        font-weight: normal;
        text-indent: 10px;
        line-height: 25px;
        padding-top: 5px;
    }
</style>
