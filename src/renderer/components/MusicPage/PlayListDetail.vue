<template>
    <div class="cm-page-main" @scroll="loadMore">
        <DetailPageHead :data="playlistData" type="playlist">
            <div class="cm-playlist-content-50">
                <p class="playlist-desp">歌曲数:{{playlistData.trackCount}}首</p>
                <p class="playlist-desp">播放数:{{playlistData.playCount}}次</p>
                <div class="playlist-author">
                    by:<span>{{playlistData.creator.nickname}}</span>
                </div>
                <div class="playlist-control">
                    <button @click="subscribe" class="sf-icon-heart-o">{{playlistData.subscribed?' 已':" "}}收藏({{playlistData.bookCount}})</button>
                    <button @click="downloadList" class="sf-icon-download">下载</button>
                </div>
            </div>
            <div class="cm-playlist-content-50 playlist-desp2">
                简介：{{playlistData.description}}
            </div>
        </DetailPageHead>
        <TabBar :data="playlistDataType" align="left" @select="tabBarChange"></TabBar>
        <div class="cm-playlist-detail-main">
            <SongList v-show="nowType.type==='musicList'" :data="playListDetail.musicList" :loading="loading" @callback="playMusic"></SongList>
            <CommentList v-show="nowType.type==='comment'" :data="playListDetail.comment" type="playlist" :loading="loading"></CommentList>
            <UserList v-show="nowType.type==='subscribers'" :data="playListDetail.subscribers"></UserList>
        </div>
        <BackToTop></BackToTop>
    </div>
</template>

<script>
    import CommentList from "../MusicCom/ListCom/CommentList";
    import UserList from "../MusicCom/ListCom/UserList";
    export default {
        name: "PlayListDetail",
        inject:['playMusic'],
        components:{
            CommentList,UserList
        },
        data(){
            return{
                playlistData:{
                    creator:{
                        nickname:""
                    }
                },
                playlistDataType:[
                    {
                        name:"歌曲列表",
                        type:"musicList",
                        value:'playlist.tracks',
                        active:'active'
                    },
                    {
                        name:"评论",
                        type:"comment",
                        value:'comments',
                        active:''
                    },
                    {
                        name:"收藏者",
                        type:"subscribers",
                        value:'subscribers',
                        active:''
                    },
                ],
                playListDetail:{
                    musicList:[],
                    comment:[],
                    subscribers:[]
                },
                playListDetailParams:{
                    musicList:{
                        page:0,
                        hasMore:0
                    }
                },
                nowType:{
                    type:"musicList",
                    value:'playlist.tracks',
                },
                loading:false
            }
        },
        created(){
            this.playlistDataType.forEach((item)=>{
                this.playListDetail[item.type]=[];
                this.playListDetailParams[item.type]={page:0,hasMore:0}
            })
        },
        activated() {
            this.init();
        },
        methods:{
            init(){
                if(this.$route.query.data) {
                    this.playlistData = JSON.parse(this.$route.query.data);
                }
                for(let i in this.playListDetail){
                    this.playListDetail[i]=[];
                }
                if(this.$route.params.id) {
                    this.getPlaylistData(0)
                }
            },
            subscribe(){
                this.$Api.Music.playlist.subscribe({
                    id:this.$route.params.id,
                    t:this.playlistData.subscribed?2:1
                },(rs)=>{
                    if(rs.code===200){
                        if(this.playlistData.subscribed){
                            this.playlistData.bookCount--
                        }else{
                            this.playlistData.bookCount++
                        }
                        this.playlistData.subscribed=!this.playlistData.subscribed;
                    }
                },()=>{
                    this.$Message.error('出现错误，请稍后重试')
                })
            },
            downloadList(){
                this.$Message.info('敬请期待')
            },
            getPlaylistData(page){
                this.loading=(page===0);
                let type=this.nowType.type;
                let key=this.nowType.value;
                this.$Api.Music.playlist[type](this.$route.params.id,page,(rs)=>{
                    this.loading=false;
                    this.playListDetailParams[type].page=page;//记录页数
                    this.playListDetailParams[type].hasMore=rs.hasMore||rs.more;//是否全部加载完
                    let data=rs[key]||[];
                    if(type==='musicList'){
                        data=rs.playlist.tracks
                        data=this.$handleListData(data);
                    }
                    if(page===0){
                        this.playListDetail[type]=data;
                    }else{
                        data.forEach((item)=>{
                            this.playListDetail[type].push(item);
                        })
                    }
                    if(type==='comment'){/*因为评论的层级关系，所以需要每次加载完重新比对整个数据*/
                        this.playListDetail[type]=this.$handleCommentData(this.playListDetail[type]);
                    }
                })
            },
            tabBarChange(item){
                this.nowType=item;
                if(this.playListDetail[item.type].length===0){
                    this.getPlaylistData(0)
                }
            },
            loadMore(e){
                let type=this.nowType.type;
                this.$scrollEnd(e,()=>{
                    if(this.playListDetailParams[type].hasMore) {
                        this.playListDetailParams[type].page++;
                        this.getPlaylistData(this.playListDetailParams[type].page)
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
    .cm-playlist-detail-main{
        width: 100%;
    }
    .cm-playlist-content-50{
        float: left;
        width: 50%;
        height: 100%;
        position: relative;
    }
    .playlist-desp{
        width: 100%;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        color: #808080;
    }
    .playlist-desp span{
        width: 100px;
    }
    .playlist-author{
        color: #929292;
    }
    .playlist-author span{
        color: #808080;
    }
    .playlist-desp2{
        text-indent: -42px;
        padding-left: 44px;
        font-size: 14px;
        color: #808080;
        overflow: auto;
    }
    .playlist-control{
        position: absolute;
        bottom: 0;
    }
    .playlist-control button{
        padding:10px;
        background: #fff;
        border: 1px solid #eee;
        color: #999999;
        font-size: 14px;
        margin-right: 5px;
        border-radius: 3px;
    }
    .playlist-control button:hover{
        background: #e56464;
        color: #fff;
    }
</style>