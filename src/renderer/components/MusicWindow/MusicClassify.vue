<template>
    <section class="cm-left">
        <div class="cm-left-head">
            <img draggable="false" class="logo" :src="$static+'/img/bar/music.png'" alt="">
            <span><img class="logo-text" :src="$static+'/img/logo/c-music.png'" alt=""></span>
            <p>啦啦啦啦啦啦啦</p>
        </div>
        <ul class="cm-left-menu">
            <li v-for="(item,index) in ClassifyMenuData" ripple :class="item.active" @click="change(index)">
                <i :class="item.icon"></i>{{item.name}}<div v-show="item.count>0">{{item.count}}</div>
            </li>
        </ul>
        <div class="cm-left-bottom">
            <div class="tower" :style="{background:'url('+TowerSrc+')'}"></div>
            <section v-show="show">
                <div class="cm-select-tips"></div>
            </section>
        </div>
    </section>
</template>

<script>
    export default {
        name: "MusicClassify",
        props:{
            DiskData:{
                type:Object
            },
            show:{
                type:Boolean
            }
        },
        beforeMount(){
            setInterval(() => {
                this.background();
            }, 1000);
        },
        data(){
            return{
                MenuData:[
                    {
                        name:"探索",
                        children:[
                            {
                                name:"发现音乐",
                                icon:"sf-icon-music",
                                active:'active'
                            },
                            {
                                name:"私人FM",
                                icon:"sf-icon-music",
                                active:'active'
                            }
                        ],
                    },
                    {
                        name:"我的音乐",
                        children:[
                            {
                                name:"本地音乐",
                                icon:"sf-icon-music",
                                active:'active'
                            },
                            {
                                name:"下载管理",
                                icon:"sf-icon-music",
                                active:'active'
                            },
                            {
                                name:"播放历史",
                                icon:"sf-icon-music",
                                active:'active'
                            }
                        ],
                    },
                    {
                        name:"我的歌单",
                        children:[
                            {
                                name:"我喜欢的音乐",
                                icon:"sf-icon-music",
                                active:'active'
                            }
                        ],
                    },
                ],
                ClassifyMenuData:[
                    {
                        name:"发现音乐",
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
                    {
                        name:"本地音乐",
                        icon:"sf-icon-music",
                        data:"/local",
                        active:''
                    },
                    {
                        name:"下载管理",
                        icon:"sf-icon-download",
                        active:''
                    },
                    {
                        name:"播放历史",
                        icon:"sf-icon-redo",
                        active:''
                    },
                    {
                        name:"我喜欢的音乐",
                        icon:"sf-icon-heart-o",
                        active:''
                    }
                ],
                /*自动切换背景*/
                TowerSrc: require('../../../../static/img/bg/Autumn-bottom-1.png'),
            }
        },
        methods:{
            background(){
                let season = 'Spring';
                let tag = 0;
                let D = new Date();
                let month = D.getMonth();
                let hHour = D.getHours();
                if (month > 2 && month < 6) {
                    season = 'Spring'
                } else if (month > 5 && month < 9) {
                    season = 'Summer';
                } else if (month > 8 && month < 12) {
                    season = 'Autumn'
                } else if (month === 12 || month === 1 || month === 2) {
                    season = 'Winter'
                }
                if (hHour >= 1 && hHour <= 8) {
                    tag = 0;
                } else if (hHour > 8 && hHour <= 16) {
                    tag = 1
                } else if (hHour > 16 && hHour <= 18) {
                    tag = 2
                } else if (hHour > 18 && hHour <= 24) {
                    tag = 3
                }
                this.TowerSrc = require('../../../../static/img/bg/'+ season + '-bottom-' + tag +  '.png');
            },
            change(index) {
                this.ClassifyMenuData.forEach(function (item) {
                    item.active = false
                });
                this.ClassifyMenuData[index].active = 'active';
                this.$router.push({
                    path:this.ClassifyMenuData[index].data
                });
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
        background: #f4f5f7;
        position: relative;
        z-index: 3;
    }
    .cm-left-head{
        width: 100%;
        padding:10px 0 30px 20px;
        height: 60px;
        margin-bottom: 10px;
        background: #fff;
        border-bottom: 1px solid #eee;
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
    }
    /*左侧菜单*/
    .cm-left-menu{
        width: 100%;
        height: calc(100% - 80px);
        overflow: auto;
        position: relative;
        z-index: 2;
    }
    .cm-left-menu li{
        width: 100%;
        height: 35px;
        line-height: 35px;
        cursor: pointer;
        font-size: 14px;
        margin: 8px auto;
        color: #39585a;
        border-left: 4px solid rgba(0,0,0,0);
    }
    .cm-left-menu li:hover,.cm-left-menu .active{
        color: #009594!important;
        background-color: #EAECF0;
        border-left: 4px solid #009594;
    }
    .cm-left-menu i{
        float: left;
        width: 35px;
        height: 35px;
        display: block;
        text-align: center;
        line-height: 35px;
        font-size: 16px;
        margin-right: 12px;
    }
    .cm-left-menu li div{
        float: right;
        padding: 0 6px;
    }
    /*底部*/
    .cm-left-bottom{
        width: 200px;
        height: 134px;
        position: absolute;
        bottom: 0;
        font-weight: normal;
    }
    .cm-left-bottom .tower{
        width: 110px;
        height: 100%;
        background-size: cover!important;
        -webkit-transition: background 0.4s ease-in-out;
        -moz-transition: background 0.4s ease-in-out;
        -o-transition: background 0.4s ease-in-out;
        transition: background 0.4s ease-in-out;
    }
</style>
