<template>
    <section class="cm-left">
        <div class="cm-left-head">
            <img draggable="false" class="logo" :src="static+'/img/bar/music.png'" alt="">
            <span><img class="logo-text" :src="static+'/img/logo/c-music.png'" alt=""></span>
            <p></p>
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
            type:{
                type:String
            },
            DiskData:{
                type:Object
            },
            show:{
                type:Boolean
            }
        },
        beforeMount(){
            this.ClassifyMenuData=this.TypeData;
            setInterval(() => {
                this.background();
            }, 1000);
        },
        watch:{
            type: {
                handler() {
                    this.UpdateData();
                },
                deep: true
            },
        },
        computed:{
            static(){
                return this.$path.join(__static)
            },
        },
        data(){
            return{
                TypeData:[
                    {"name":"本地音乐","icon":"sf-icon-music","data":"normal","active":"active"},
                    {"name":"下载管理","icon":"sf-icon-download","data":"picture","active":""},
                    {"name":"视频","icon":"sf-icon-video","data":"video","active":""},
                    {"name":"文档","icon":"sf-icon-file-alt","data":"document","active":""},
                    {"name":"音乐","icon":"sf-icon-music","data":"music","active":""},
                    {"name":"种子","icon":"sf-icon-magnet","data":"torrent","active":""},
                    {"name":"其他","icon":"sf-icon-puzzle-piece","data":"other","active":""},
                    {"name":"回收站","icon":"sf-icon-trash","data":"trash","active":""},
                ],
                ClassifyMenuData:[],
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
            UpdateData(){
                switch (this.type) {
                    case 'disk':
                        this.ClassifyMenuData=this.TypeData;
                        break;
                    case 'share':
                        this.ClassifyMenuData=this.ShareData;
                        break;
                    case 'trans':
                        this.ClassifyMenuData=this.TransData;
                        break;
                }
                this.ClassifyMenuData.forEach((item)=>{
                    if(item.active){
                        this.$emit("change", this.type,item)
                    }
                });
            },
            change(index) {
                this.ClassifyMenuData.forEach(function (item) {
                    item.active = false
                });
                this.ClassifyMenuData[index].active = 'active';
                this.$emit("callback", this.type,this.ClassifyMenuData[index])
            }
        }
    }
</script>

<style scoped>
    /*左侧头部*/
    .cm-left{
        float: left;
        width:200px;
        height: 100%;
        font-weight: 600;
        color: #4d515a;
        background: #f4f5f7;
        position: relative;
        z-index: 3;
    }
    .cm-left-head{
        width: 100%;
        padding:20px 0 30px 20px;
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
        color: #4f4f4f;
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
        width: 168px;
        height: 35px;
        line-height: 35px;
        cursor: pointer;
        font-size: 14px;
        margin: 8px auto;
        border-radius: 3px;
        margin-top: 0;
    }
    .cm-left-menu li:hover,.cm-left-menu .active{
        color: #d42626!important;
        background-color: #EAECF0;
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
    /*文件选择提示*/
    .cm-select-tips{
        width: 100%;
        height: 25px;
        line-height: 25px;
        font-size: 12px;
        padding: 0 5px;
        color: #505050;
        position: absolute;
        bottom:1px;
        text-align: right;
    }
</style>
