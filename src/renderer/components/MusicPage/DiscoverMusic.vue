<template>
    <div class="cm-page-main">
        <div class="cm-discover-head">
            <span class="date">{{day}}</span>
            <div class="container">
                <button :class="'sf-icon-angle-'+(showType?'right':'left')" @click="switchType"></button>
                <p class="tips" v-if="showType">推荐歌曲</p>
                <p class="tips" v-else>推荐歌单</p>
                <p class="right-tips">
                    <i class="sf-icon-lightbulb"></i>
                    <span>根据听过的音乐，每天自动生成</span>
                </p>
            </div>
        </div>
        <SongList v-show="showType" :data="RecommendSong" :loading="loading"></SongList>
        <PlayList v-show="!showType" :data="RecommendPlayList" :loading="loading2" type="recommend"></PlayList>
    </div>
</template>

<script>
    import PlayList from "../MusicCom/ListCom/PlayList";
    export default {
        name: "DiscoverMusic",
        components:{PlayList},
        created() {
            this.getDay();
            this.getRecommendSong();
            this.getRecommendPlayList();
        },
        data(){
            return{
                day:1,
                loading:true,
                loading2:true,
                RecommendSong:[],
                RecommendPlayList:[],
                showType:true,
            }
        },
        methods:{
            getDay(){
                this.day=new Date().format('dd')
            },
            switchType(){
                this.showType=!this.showType;
            },
            getRecommendSong(){
                this.$Api.Music.getRecommendSong((rs)=>{
                    this.RecommendSong=rs.recommend||[];
                    this.loading=false;
                })
            },
            getRecommendPlayList(){
                this.$Api.Music.getRecommendPlayList((rs)=>{
                    this.RecommendPlayList=rs.recommend||[];
                    this.loading2=false;
                })
            },
        }
    }
</script>

<style scoped>
    .cm-music-head{
        width: 100%;
        height: 30px;
        line-height: 30px;
        color: #464c5b;
        font-size: 14px;
        font-weight: 400;
    }
    .cm-music-head span{
        font-size: 10px;
        color: #bbb;
    }
    .cm-discover-head{
        width: 100%;
        height: 70px;
    }
    .cm-discover-head .date{
        float: left;
        width: 80px;
        height: 60px;
        line-height: 60px;
        text-align: center;
        display: block;
        font-size: 60px;
        color: #999999;
        font-weight: bold;
        color: #ff5c33;
    }
    .cm-discover-head .container{
        float: left;
        height: 100%;
        width: calc(100% - 80px);
        position: relative;
    }
    .cm-discover-head .container button{
        height: 50%;
        width: 43px;
        background: none;
        font-size: 31px;
        margin-left: -12px;
        color: #999999;
        border-radius: 100%;
    }
    .cm-discover-head .container button:hover{
        color: #ff5c33;
    }
    .cm-discover-head .container .tips{
        width: 100%;
        height: 50%;
        font-size: 14px;
    }
    .cm-discover-head .container .right-tips{
        position: absolute;
        right: 0;
        top: 15px;
        color: #737373;
        font-size: 12px;
    }
    .cm-discover-head .container .right-tips *{
        float: left;
    }
    .cm-discover-head .container .right-tips i{
        margin: 2px;
        color: #ff5c33;
    }
    .cm-playlist-container,.cm-songlist-container{
        height: unset!important;
    }
</style>
