<template>
    <div class="cm-page-main" @scroll="loadMore">
        <DetailPageHead :data="playlistData" type="playlist">
            <div class="cm-playlist-content-50">
                <p class="playlist-desp">歌曲数:{{playlistData.trackCount}}首</p>
                <p class="playlist-desp">播放数:{{$numberCount(playlistData.playCount)}}次</p>
                <div class="playlist-author">
                    <img v-lazy="playlistData.creator.avatarUrl" alt="">
                    <span>{{playlistData.creator.nickname}}</span>
                </div>
                <ButtonArea class="playlist-control">
                    <button class="sf-icon-play-circle" @click="playAll"> 播放全部</button>
                    <button @click="subscribe" :disabled="this.$Api.User.UserId===playlistData.creator.userId" :class="playlistData.subscribed?'sf-icon-heart':'sf-icon-heart-o'">{{playlistData.subscribed?' 已':" "}}收藏({{$numberCount(playlistData.bookCount||playlistData.subscribedCount)}})</button>
                    <button @click="downloadList" class="sf-icon-arrow-to-bottom">下载</button>
                </ButtonArea>
            </div>
            <div class="cm-playlist-content-50 playlist-desp2">
                简介：{{playlistData.description||'暂无简介'}}
            </div>
        </DetailPageHead>
        <TabBar :data="playlistDataType" align="left" @select="tabBarChange"></TabBar>
        <div class="cm-playlist-detail-main">
            <SongList ref="songList" v-show="nowType.type==='musicList'" :data="playListDetail.musicList" :loading="loading" @remove="removeCallback"></SongList>
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
                this.loading=true;
                if(this.$route.query.data||this.$route.query.list) {
                    this.playlistData = JSON.parse(this.$route.query.data||this.$route.query.list);
                }
                for(let i in this.playListDetail){
                    this.playListDetail[i]=[];
                }
                if(this.$route.params.id) {
                    this.getPlaylistData(0)
                }
            },
            subscribe(){
                this.$Api.Music.subscribe.playlist({
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
            playAll(){
                this.$refs.songList.clickToPlay(this.$refs.songList.listData[0],this.$refs.songList.listData)
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
                        data=rs.playlist.tracks;
                        this.playlistData=rs.playlist;
                    }
                    if(page===0){
                        this.playListDetail[type]=data;
                    }else{
                        this.playListDetail[type] = [...this.playListDetail[type],...data];
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
            },
            removeCallback(count){
                this.playlistData.trackCount=count;
            }
        }
    }
</script>

<style scoped>
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
        display: flex;
        justify-items: center;
        align-items: center;
    }
    .playlist-author img{
        width: 30px;
        height: 30px;
        border-radius: 100%;
    }
    .playlist-author span{
        margin-left: 10px;
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
</style>
