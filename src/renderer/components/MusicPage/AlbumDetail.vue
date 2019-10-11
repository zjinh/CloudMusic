<template>
    <div class="cm-page-main" @scroll="loadMore">
        <DetailPageHead :data="albumData" type="album">
            <div class="cm-album-content">
                <p class="album-desp">时间: {{albumData.publishTime}}</p>
                <p class="album-desp">歌曲数: {{albumData.size}}首</p>
                <p class="album-desp">歌手: {{albumData.artist_text}}</p>
                <ButtonArea class="album-control">
                    <button @click="downloadList" class="sf-icon-arrow-to-bottom">下载</button>
                </ButtonArea>
            </div>
        </DetailPageHead>
        <TabBar :data="playlistDataType" align="left" @select="tabBarChange"></TabBar>
        <div class="cm-album-detail-main">
            <SongList v-show="nowType.type==='musicList'" :data="albumDetail.musicList" :loading="loading" @callback="playMusic"></SongList>
            <CommentList v-show="nowType.type==='comment'" :data="albumDetail.comment" type="album" :loading="loading"></CommentList>
            <div class="cm-album-description" v-show="nowType.type==='description'">{{albumData.description||'暂无数据'}}</div>
        </div>
        <BackToTop></BackToTop>
    </div>
</template>

<script>
    import CommentList from "../MusicCom/ListCom/CommentList";
    import UserList from "../MusicCom/ListCom/UserList";
    export default {
        name: "AlbumDetail",
        inject:['playMusic'],
        components:{
            CommentList,UserList
        },
        data(){
            return{
                albumData:{},
                playlistDataType:[
                    {
                        name:"歌曲列表",
                        type:"musicList",
                        value:'songs',
                        active:'active'
                    },
                    {
                        name:"评论",
                        type:"comment",
                        value:'comments',
                        active:''
                    },
                    {
                        name:"专辑详情",
                        type:"description",
                        value:'description',
                        active:''
                    },
                ],
                albumDetail:{
                    musicList:[],
                    comment:[],
                    subscribers:[]
                },
                albumDetailParams:{
                    musicList:{
                        page:0,
                        hasMore:0
                    }
                },
                nowType:{
                    type:"musicList",
                    value:'songs',
                },
                loading:false
            }
        },
        created(){
            this.playlistDataType.forEach((item)=>{
                this.albumDetail[item.type]=[];
                this.albumDetailParams[item.type]={page:0,hasMore:0}
            })
        },
        activated() {
            this.init();
        },
        methods:{
            init(){
                if(this.$route.query.data) {
                    this.albumData = JSON.parse(this.$route.query.data);
                    this.albumData.publishTime=new Date(this.albumData.publishTime).format('yyyy-MM-dd');
                    let artist_text=this.albumData.artist.name;
                    if(this.albumData.artists&&!artist_text) {
                        this.albumData.artists.forEach((item, index) => {
                            artist_text = artist_text + item.name + (index !== this.albumData.artists.length - 1 ? '/' : '')
                        });
                    }else{
                        this.albumData.blurPicUrl=this.albumData.artist.picUrl;
                    }
                    this.albumData.artist_text=artist_text;
                }
                for(let i in this.albumDetail){
                    this.albumDetail[i]=[];
                }
                if(this.$route.params.id) {
                    this.getPlaylistData(0);
                }
            },
            subscribe(){
                this.$Api.Music.album.subscribe({
                    id:this.$route.params.id,
                    t:this.albumData.subscribed?2:1
                },(rs)=>{
                    if(rs.code===200){
                        if(this.albumData.subscribed){
                            this.albumData.bookCount--
                        }else{
                            this.albumData.bookCount++
                        }
                        this.albumData.subscribed=!this.albumData.subscribed;
                    }
                },()=>{
                    this.$Message.error('出现错误，请稍后重试')
                })
            },
            downloadList(){
                this.$Message.info('敬请期待')
            },
            getPlaylistData(page){
                let type=this.nowType.type;
                if(type==='description'){
                    return
                }
                this.loading=(page===0);
                let key=this.nowType.value;
                this.$Api.Music.album[type](this.$route.params.id,page,(rs)=>{
                    this.loading=false;
                    this.albumDetailParams[type].page=page;//记录页数
                    this.albumDetailParams[type].hasMore=rs.hasMore||rs.more;//是否全部加载完
                    if(type==='musicList'){
                        this.albumData.description=rs.album.description;
                        this.albumData.alias=rs.album.alias[0];
                    }
                    let data=rs[key]||[];
                    if(page===0){
                        this.albumDetail[type]=data;
                    }else{
                        this.albumDetail[type] = [...this.albumDetail[type],...data];
                    }
                })
            },
            tabBarChange(item){
                this.nowType=item;
                if(this.albumDetail[item.type].length===0){
                    this.getPlaylistData(0)
                }
            },
            loadMore(e){
                let type=this.nowType.type;
                if(type==='description'){
                    return
                }
                this.$scrollEnd(e,()=>{
                    if(this.albumDetailParams[type].hasMore) {
                        this.albumDetailParams[type].page++;
                        this.getPlaylistData(this.albumDetailParams[type].page)
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .cm-album-detail-main{
        width: 100%;
    }
    .cm-album-content{
        float: left;
        width: 100%;
        height: 100%;
        position: relative;
    }
    .album-desp{
        width: 100%;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        color: #333;
    }
    .album-desp span{
        width: 100px;
    }
    .album-control{
        position: absolute;
        bottom: 0;
    }
    .cm-album-description{
        font-size: 14px;
        padding: 10px;
        line-height: 35px;
    }
</style>
