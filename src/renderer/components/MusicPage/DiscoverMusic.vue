<template>
    <div class="cm-page-main">
        <!--<div class="cm-discover-head">
            <span class="date">20</span>
            <span class="">Recommend songs</span>
        </div>-->
        <div class="cm-discover-75">
            <div class="cm-music-head">
                新歌推荐
                <span>Recommend New songs</span>
            </div>
            <div class="cm-discover-main">

            </div>
           <!-- <div class="cm-discover-list">
                <SongList :data="RecommendSong" :loading="loading" @callback="playMusic"></SongList>
            </div>-->
        </div>
        <div class="cm-discover-25">
            <div class="cm-music-head">
                新歌推荐
                <span>Recommend New songs</span>
            </div>
            <ul>
                <li v-for="(item,index) in RecommendNewSong" ripple="" @click="playMusic(item,RecommendNewSong)">
                    <img :src="item.picture" alt="" draggable="false">
                    <span class="name">{{item.name}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DiscoverMusic",
        inject:['playMusic'],
        created() {
            this.getRecommendSinger();
            this.getRecommendSong();
            this.getRecommendPlayList();
            this.getRecommendNewSong();
        },
        data(){
            return{
                loading:true,
                RecommendSong:[],
                RecommendSinger:[],
                RecommendPlayList:[],
                RecommendNewSong:[]
            }
        },
        methods:{
            getRecommendSinger(){
                this.$Api.Music.getPopSinger((rs)=>{
                    this.$nextTick(()=>{
                        this.loading=false;
                        this.RecommendSinger=rs.list.artists||[];
                    });
                })
            },
            getRecommendPlayList(){
                this.$Api.Music.getRecommendPlayList((rs)=>{
                    console.log(rs)
                })
            },
            getRecommendNewSong(){
                this.$Api.Music.getRecommendNEWSong((rs)=>{
                    rs.result=this.$handleListData(rs.result,'recommend');
                    this.RecommendNewSong=rs.result;
                    console.log(rs.result)
                })
            },
            getRecommendSong(){
                this.$Api.Music.getRecommendSong((rs)=>{
                    this.$nextTick(()=>{
                        this.RecommendSong=rs.recommend||[];
                    });
                })
            },
            goArtist(item){
                this.$router.push({
                    path:'/artist-detail/'+item.id,
                    query:{
                        data:JSON.stringify(item)
                    }
                });
            }
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
        height: 80px;
    }
    .cm-discover-head *{
        float: left;
    }
    .cm-discover-head .date{
        width: 80px;
        height: 60px;
        line-height: 60px;
        text-align: center;
        display: block;
        font-size: 60px;
        color: #999999;
        font-weight: bold;
    }
    .cm-discover-75{
        float: left;
        width: 75%;
        height: 100%;
        padding-right: 10px;
    }
    .cm-discover-list{
        width: 100%;
        height: calc(100% - 30px);
        border: 1px solid #eee;
    }
    .cm-discover-25{
        float: left;
        width: 25%;
        height: 100%;
    }
    .cm-discover-25 ul{
        width: 100%;
        height: calc(100% - 30px);
        overflow: auto;
    }
    .cm-discover-25 ul li{
        background: #f4f5f7;
        border-radius: 5px;
        margin-bottom: 5px;
        padding: 5px;
        display: flex;
        justify-content: center;
        cursor: pointer;
    }
    .cm-discover-25 ul li img{
        width: 40px;
        height: 40px;
        border-radius: 5px;
    }
    .cm-discover-25 ul li span{
        width: calc(100% - 40px);
        height: 40px;
        line-height: 40px;
        margin-left: 10px;
        font-size: 13px;
    }
</style>
