<template>
    <div class="cm-page-main" @scroll="loadMore">
        <DetailPageHead :data="artistData" type="artist"></DetailPageHead>
        <TabBar :data="artistDataType" align="left" @select="tabBarChange"></TabBar>
        <div class="cm-artist-detail-main">
            <SongList v-show="nowType.type==='music'" :data="artistDetail.music" :loading="loading" @callback="playMusic"></SongList>
            <VideoList v-show="nowType.type==='mv'" :data="artistDetail.mv" :loading="loading"></VideoList>
            <ArtistList v-show="nowType.type==='simi'" :data="artistDetail.simi" :loading="loading"></ArtistList>
        </div>
        <BackToTop></BackToTop>
    </div>
</template>

<script>
    import VideoList from "../MusicCom/ListCom/VideoList";
    import ArtistList from "../MusicCom/ListCom/ArtistList";
    export default {
        name: "ArtistDetail",
        inject:['playMusic'],
        components:{
            VideoList,ArtistList
        },
        data(){
            return{
                artistData:{},
                artistDataType:[
                    {
                        name:"歌曲",
                        type:"music",
                        value:'hotSongs',
                        active:'active'
                    },
                    {
                        name:"MV",
                        type:"mv",
                        value:'mvs',
                        active:''
                    },
                    {
                        name:"相似歌手",
                        type:"simi",
                        value:"artists",
                        active:''
                    },
                ],
                artistDetail:{
                    music:[],
                    mv:[],
                    simi:[]
                },
                artistDetailParams:{
                    music:{
                        page:0,
                        hasMore:0
                    }
                },
                nowType:{
                    type:"music",
                    value:'hotSongs',
                },
                loading:false
            }
        },
        watch:{
            '$route.params.id':function () {
                this.init();
            }
        },
        created(){
            this.artistDataType.forEach((item)=>{
                this.artistDetail[item.type]=[];
                this.artistDetailParams[item.type]={page:0,hasMore:0}
            })
        },
        activated() {
            this.init();
        },
        methods:{
            init(){
                if(this.$route.query.data) {
                    this.artistData = JSON.parse(this.$route.query.data);
                }
                for(let i in this.artistDetail){
                    this.artistDetail[i]=[];
                }
                if(this.$route.params.id) {
                    this.getArtistData(0)
                }
            },
            getArtistData(page){
                this.loading=(page===0);
                let type=this.nowType.type;
                let key=this.nowType.value;
                this.$Api.Music.artist[this.nowType.type](this.$route.params.id,page,(rs)=>{
                    this.loading=false;
                    this.artistDetailParams[type].page=page;//记录页数
                    this.artistDetailParams[type].hasMore=rs.hasMore||rs.more;//是否全部加载完
                    let data=rs[key];
                    if(type==='music'){
                        data=this.$handleListData(data);
                    }
                    if(page===0){
                        this.artistDetail[type]=data;
                    }else{
                        data.forEach((item)=>{
                            this.artistDetail[type].push(item);
                        })
                    }
                })
            },
            tabBarChange(item){
                this.nowType=item;
                if(this.artistDetail[item.type].length===0){
                    this.getArtistData(0)
                }
            },
            loadMore(e){
                let type=this.nowType.type;
                this.$scrollEnd(e,()=>{
                    if(this.artistDetailParams[type].hasMore) {
                        this.artistDetailParams[type].page++;
                        this.getArtistData(this.artistDetailParams[type].page)
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .cm-page-main{
        overflow: auto;
    }
    .cm-artist-detail-main{
        width: 100%;
    }
</style>
