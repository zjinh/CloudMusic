<template>
    <div class="cm-page-main">
        <div class="cm-search-head">
            搜索<span>{{$route.params.keywords}}</span>{{nowSearchType[2]}},找到{{searchParams[nowSearchType[0]].count}}条记录
        </div>
        <TabBar :data="searchType" @select="tabBarSelect"></TabBar>
        <div class="cm-search-main">
            <SongList v-show="nowSearchType[0]==='songs'" :data="searchResult.songs" :loading="loading" @callback="playMusic" @scroll-end="loadMore"></SongList>
            <ArtistList v-show="nowSearchType[0]==='artists'" :data="searchResult.artists" :loading="loading" @scroll-end="loadMore"></ArtistList>
            <PlayList v-show="nowSearchType[0]==='playlists'" :data="searchResult.playlists" :loading="loading" @scroll-end="loadMore"></PlayList>
            <AlbumList v-show="nowSearchType[0]==='albums'" :data="searchResult.albums" :loading="loading" @scroll-end="loadMore"></AlbumList>
            <VideoList v-show="nowSearchType[0]==='videos'" :data="searchResult.videos" :loading="loading" @scroll-end="loadMore"></VideoList>
            <RadioList v-show="nowSearchType[0]==='djRadios'" :data="searchResult.djRadios" :loading="loading" @scroll-end="loadMore"></RadioList>
        </div>
    </div>
</template>

<script>
    import ArtistList from "./SearchPage/ArtistList";
    import PlayList from "./SearchPage/PlayList";
    import AlbumList from "./SearchPage/AlbumList";
    import VideoList from "./SearchPage/VideoList";
    import RadioList from "./SearchPage/RadioList";
    export default {
        name: "SearchPage",
        inject:['playMusic'],
        components:{
            ArtistList,PlayList,AlbumList,VideoList,RadioList
        },
        data(){
            return{
                searchType:[
                    {
                        name:"单曲",
                        type:"songs",
                        value:1,
                        active:'active'
                    },
                    {
                        name:"歌手",
                        type:"artists",
                        value:100,
                        active:''
                    },
                    {
                        name:"歌单",
                        type:"playlists",
                        value:1000,
                        active:''
                    },
                    {
                        name:"专辑",
                        type:"albums",
                        value:10,
                        active:''
                    },
                    {
                        name:"视频",
                        type:"videos",
                        value:1014,
                        active:''
                    },
                    {
                        name:"电台",
                        type:"djRadios",
                        value:1009,
                        active:''
                    },
                ],
                loading:true,
                nowSearchType:['songs',1],
                searchResult:{
                    songs:[],
                    artists:[],
                    playlists:[],
                    albums:[],
                    videos:[],
                    djRadios:[]
                },
                searchParams:{
                    songs:{
                        page:0,
                        count:0
                    }
                },
            }
        },
        watch:{
            '$route.params.keywords':function () {
                for(let i in this.searchResult){
                    this.searchResult[i]=[];
                }
                this.searchPost(0);
            }
        },
        created(){
            this.searchType.forEach((item)=>{
                this.searchResult[item.type]=[];
                this.searchParams[item.type]={page:0,count:0}
            })
        },
        mounted(){
            if(this.$route.params.keywords){
                this.changeType(this.searchType[0],0);
                this.searchPost(0);
            }
        },
        methods:{
            tabBarSelect(item,index){
                this.changeType(item,index,true)
            },
            changeType(type,index,flag){
                this.nowSearchType=[type.type,type.value,type.name];
                this.$route.params.type=type.value;
                if(flag){
                    if(this.searchResult[type.type].length===0) {
                        this.searchPost(this.searchParams[type.type].page);
                    }
                }
            },
            searchPost(page){
                let type=this.nowSearchType[0];
                this.loading=(page===0);
                this.$Api.Music.search({
                    keywords:this.$route.params.keywords,
                    type:this.nowSearchType[1],
                    offset:page
                },(rs)=>{
                    let data=rs.result[type];
                    let countType=type.substring(0,type.length-1)+'Count';//拼接记录总数的key
                    this.searchParams[type].count=rs.result[countType]||rs.result[type+'Count'];//获取有搜索结果长度
                    this.searchParams[type].page=page;//记录页数
                    this.loading=false;
                    if(type==='songs'){
                        data=this.$handleListData(data);
                    }
                    if(page===0){
                        this.searchResult[type]=data;
                    }else{
                        data.forEach((item)=>{
                            this.searchResult[type].push(item);
                        })
                    }
                    console.log(data)
                })
            },
            loadMore(){
                let type=this.nowSearchType[0];
                if(this.searchParams[type].count>this.searchResult[type].length) {
                    this.searchParams[type].page++;
                    this.searchPost(this.searchParams[type].page)
                }
            }
        }
    }
</script>

<style scoped>
    .cm-search-head{
        width: 100%;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
    }
    .cm-search-head span{
        color: #e56464;
        padding: 0 5px;
    }
    .cm-search-main{
        width: 100%;
        height: calc(100% - 65px);
    }
</style>
