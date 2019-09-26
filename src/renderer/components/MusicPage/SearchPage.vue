<template>
    <div class="cm-page-main">
        <div class="cm-search-head">
            搜索<span>{{$route.params.keywords}}</span>{{nowSearchType[2]}},找到{{searchParams[nowSearchType[0]].count}}条记录
        </div>
        <ul class="cm-search-type">
            <li v-for="(item,index) in searchType" @click="changeType(item,index,true)">
                <span>{{item.name}}</span>
                <div :class="item.active"></div>
            </li>
        </ul>
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
                        load:false,
                        active:'active'
                    },
                    {
                        name:"歌手",
                        type:"artists",
                        value:100,
                        load:false,
                        active:''
                    },
                    {
                        name:"歌单",
                        type:"playlists",
                        value:1000,
                        load:false,
                        active:''
                    },
                    {
                        name:"专辑",
                        type:"albums",
                        value:10,
                        load:false,
                        active:''
                    },
                    {
                        name:"视频",
                        type:"videos",
                        value:1014,
                        load:false,
                        active:''
                    },
                    {
                        name:"电台",
                        type:"djRadios",
                        value:1009,
                        load:false,
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
            changeType(type,index,flag){
                this.searchType.forEach((item)=>{
                    item.active='';
                });
                type.active='active';
                this.nowSearchType=[type.type,type.value,type.name];
                this.$route.params.type=type.value;
                this.$set(this.searchType,index,type);
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
    .cm-search-type{
        width: 100%;
        border-bottom: 2px solid #eee;
        display: flex;
        justify-content: center;
        overflow: unset;
    }
    .cm-search-type li{
        width: 80px;
        font-size: 14px;
        height: 35px;
        line-height: 35px;
        text-align: center;
        cursor: pointer;
        position: relative;
        overflow: unset;
    }
    .cm-search-type li .active{
        width: 35px;
        height: 4px;
        background: #e56464;
        position: relative;
        top: -2px;
        margin: 0 auto;
    }
    .cm-search-type li:hover{
        color: #e56464;
    }
    .cm-search-main{
        width: 100%;
        height: calc(100% - 65px);
    }
</style>
