<template>
    <div class="cm-page-main" @scroll="loadMore">
        <div class="cm-video-left">
            <div class="cm-video-detail-head">
                {{videoData.title}}
                <span v-if="videoData.creator">by:{{videoData.creator[0].userName}}</span>
            </div>
            <VideoPlayer v-if="url" :url="url"></VideoPlayer>
            <ButtonArea class="video-button-area">
<!--                <button @click="subscribe" class="sf-icon-heart-o">{{playlistData.subscribed?' 已':" "}}收藏({{playlistData.subscribeCount}})</button>-->
                <button @click="downloadVideo" class="sf-icon-download">下载</button>
            </ButtonArea>
            <div class="video-title">
                视频评论
            </div>
            <CommentList :data="commentData" :loading="loading" :type="videoType"></CommentList>
        </div>
        <div class="cm-video-right">
            <div class="video-title">
                视频简介
            </div>
            <div class="content">{{description||'暂无简介'}}</div>
            <div class="video-title">
                相关推荐
            </div>
            <VideoList :data="relatedVideo" type="self" @callback="init"></VideoList>
        </div>
        <BackToTop></BackToTop>
    </div>
</template>

<script>
    import CommentList from "../MusicCom/ListCom/CommentList";
    import VideoPlayer from "../MusicCom/VideoPlayer";
    import VideoList from "../MusicCom/ListCom/VideoList";
    export default {
        name: "VideoDetail",
        inject:['menuControl','playerControl'],
        components:{
            VideoPlayer,CommentList,VideoList
        },
        data(){
            return{
                videoId:false,
                videoType:'',
                videoData:{},
                description:"",
                url:"",
                commentData:[],
                commentParams:{
                    moreData:false,
                    page:0
                },
                relatedVideo:[],
                loading:true,
            }
        },
        activated() {
            this.menuControl(true);
            this.init();
        },
        deactivated(){
            this.menuControl(false);
        },
        methods:{
            init(){
                this.videoId=this.$route.params.id;
                if(isNaN(this.videoId-0)){
                    this.videoType='video';
                }else{
                    this.videoType='mv';
                }
                this.videoData=JSON.parse(this.$route.query.data);
                let media=document.getElementById('audio');
                if(!media.paused) {
                    this.playerControl('play');
                }
                this.getUrl();
                this.getDetail();
                this.getRelatedVideo();
                this.getComment(0);
            },
            subscribe(){

            },
            downloadVideo(){
                this.$Message.info('敬请期待')
            },
            getUrl(){
                this.$Api.Music[this.videoType].getUrl(this.videoId, (rs) => {
                    if(this.videoType==='mv') {
                        this.url = rs.data.url;
                    }else{
                        this.url = rs.urls[0].url;
                    }
                })

            },
            getDetail(){
                this.$Api.Music[this.videoType].detail(this.videoId,(rs)=>{
                    console.log(rs)
                    this.description=rs.data.description||rs.data.desc;
                })
            },
            getRelatedVideo(){
                this.$Api.Music.video.related(this.videoId,(rs)=>{
                    this.relatedVideo=rs.data;
                })
            },
            getComment(page){
                this.loading=(page===0);
                this.$Api.Music[this.videoType].comment(this.videoId,page,(rs)=>{
                    let data=rs.comments;
                    this.loading=false;
                    this.commentParams.moreData=rs.hasMore||rs.more;
                    this.commentParams.page=page;
                    if(page===0){
                        this.commentData=data;
                    }else{
                        this.commentData = [...this.commentData,...data];
                    }
                })
            },
            loadMore(e){
                this.$scrollEnd(e,()=>{
                    if(this.commentParams.moreData) {
                        this.commentParams.page++;
                        this.getComment(this.commentParams.page)
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .cm-page-main{
        max-width: 1050px;
        background: #fff;
        z-index: 4;
        margin: 0 auto;
    }
    .cm-video-detail-head{
        width: 100%;
        line-height: 30px;
        font-size: 18px;
        padding-bottom: 10px;
        color: #333;
    }
    .cm-video-detail-head span{
        float: right;
        font-size: 12px;
        line-height: 31px;
    }
    .cm-video-left{
        float: left;
        width: 70%;
        padding-right: 25px;
    }
    .cm-video-right{
        float: left;
        width: 30%;
    }
    .video-title{
        width: 100%;
        font-size: 18px;
        line-height: 30px;
        padding-bottom: 5px;
        border-bottom: 1px solid #eee;
        color: #333;
    }
    .cm-video-right .content{
        font-size: 14px;
        line-height: 25px;
        padding: 5px 0;
    }
    .video-button-area{
        margin:10px 0;
    }
</style>
