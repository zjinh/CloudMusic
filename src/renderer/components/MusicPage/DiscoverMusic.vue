<template>
    <div class="cm-page-main">
        <div class="cm-discover-75">
            <div class="cm-music-head">
                推荐歌曲
                <span>Recommend songs</span>
            </div>
            <div class="cm-discover-list">
                <SongList :data="RecommendSong" :loading="loading" @callback="playMusic"></SongList>
            </div>
        </div>
        <div class="cm-discover-25">
            <div class="cm-music-head">
                热门歌手
                <span>Pop singer</span>
            </div>
            <ul>
                <li v-for="(item,index) in RecommendSinger" ripple="" @click="goArtist(item)">
                    <img :src="item.picUrl" alt="" draggable="false">
                    <span class="name">{{item.name}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    const fs =require('fs');
    export default {
        name: "DiscoverMusic",
        inject:['playMusic'],
        created() {
            this.getRecommendSinger();
            this.getRecommendSong();
        },
        data(){
            return{
                loading:true,
                RecommendSong:[],
                RecommendSinger:[],
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
            getRecommendSong(){
                this.$Api.Music.getRecommendSong((rs)=>{
                    this.$nextTick(()=>{
                        rs.recommend=this.$handleListData(rs.recommend);
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
