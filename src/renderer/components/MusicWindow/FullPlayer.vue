<template>
    <section class="cm-full-music-player animated slide-down-enter">
        <div class="cm-full-music-container" id="cm-full-player" @scroll="loadMore">
            <div class="cm-full-music-control-btn">
                <button tabindex="-1" class="sf-icon-ellipsis-h" @click="playerControl('')"></button>
                <button tabindex="-1" class="sf-icon-dot-circle" @click="switchMode"></button>
                <h1 v-show="!mode">{{NowPlay.title}}</h1>
                <p v-show="!mode">{{NowPlay.artist}}</p>
            </div>
            <div class="cm-full-music-player-container">
                <div class="cm-full-prev-container" v-show="!mode">
                    <div class="line"></div>
                    <button tabindex="-1" class="sf-icon-angle-left" @click="playerControl('prev')"></button>
                </div>
                <div class="cm-full-poster-container">
                    <canvas id="wrap" height="300" width="300"></canvas>
                    <div class="cm-full-music-poster">
                        <img v-lazy="NowPlay.picture" alt="" draggable="false">
                        <button :class="playState+' animated fadeIn'" v-show="!mode" @click="playerControl('play')"></button>
                    </div>
                    <div class="cm-full-music-button" v-show="mode">
                        <LikeMusic :music="NowPlay"></LikeMusic>
                        <button class="sf-icon-star-o"></button>
                        <button class="sf-icon-arrow-to-bottom" :disabled="NowPlay.type==='local'"></button>
                    </div>
                    <p id="cm-fully-music-line-lrc" class="animated slideInDown" v-show="!mode"></p>
                </div>
                <div class="cm-full-next-container">
                    <div class="line"></div>
                    <button tabindex="-1" class="sf-icon-angle-right" @click="playerControl('next')"></button>
                </div>
                <div class="cm-full-music-lrc" :style="{width:mode?'calc(100% - 430px)':'0'}">
                    <h1>{{NowPlay.title}}</h1>
                    <p class="artist">{{NowPlay.artist}}</p>
                    <div id="cm-full-music-lrc-list"></div>
                </div>
            </div>
            <CommentList class="cm-full-player-comment" :_id="NowPlay.id" :data="commentData" :type="commentType" :style="{width:NowPlay.type!=='radio'?'70%':'100%'}" v-show="mode">
                <div class="cm-full-music-more-head">
                    听友评论
                </div>
            </CommentList>
            <div class="cm-full-right-container" v-show="mode&&NowPlay.type!=='radio'">
                <div class="cm-full-music-more-head">
                    相似歌曲
                </div>
                <ul class="cm-full-simi-music">
                   <li v-for="(item,index) in simiMusicList" @click="playMusic(item,simiMusicList)">
                       <img v-lazy="item.picture" alt="">
                       <span>{{item.title}}</span>
                   </li>
                </ul>
                <div class="cm-full-music-more-head">
                    相关歌单
                </div>
                <PlayList :data=simiPlayList type="block"></PlayList>
                <div class="cm-full-music-more-head">
                    最近听过的用户
                </div>
                <ul class="cm-full-simi-user">
                    <li v-for="(item,index) in simiUser" @click="goUserDetail(item)">
                        <img v-lazy="item.avatarUrl" alt="">
                        <span class="name">{{item.nickname}}</span>
                        <span class="reason">{{item.recommendReason}}</span>
                    </li>
                </ul>
            </div>
            <BackToTop></BackToTop>
        </div>
        <BlurBackground :url="NowPlay.picture" style="height: 100%"></BlurBackground>
    </section>
</template>

<script>
    import BlurBackground from "./BlurBackground"
    import CommentList from "../MusicCom/ListCom/CommentList";
    import PlayList from "../MusicCom/ListCom/PlayList";
    import LikeMusic from "../MusicCom/Button/LikeMusic";
    export default {
        name: "FullPlayer",
        inject:['playerControl','playMusic'],
        props:{
            PlayList:Array,
            NowPlay:Object,
            analyser:[Object,AnalyserNode],
            playState:String
        },
        data(){
            return{
                mode:true,
                commentData:[],
                moreData:false,
                pageCount:0,
                simiMusicList:[],
                simiPlayList:[],
                simiUser:[],
            }
        },
        watch:{
            NowPlay(){
                document.getElementById('cm-full-player').scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
                this.getComment(0);
                if(this.NowPlay.type!=='radio') {
                    this.getSimiMusic();
                    this.getSimiPlayList();
                    this.getSimiUser();
                }
            }
        },
        components:{
            BlurBackground,CommentList,PlayList,LikeMusic
        },
        computed:{
            commentType:function () {
                return this.NowPlay.type!=='radio'?'song':'radio'
            }
        },
        methods:{
            visualRound(){
                let wrap = document.getElementById("wrap");
                let cxt = wrap.getContext("2d");
                //创建数据
                let output = new Uint8Array(180);
                let du = 2;//角度
                let potInt = { x: 150, y: 150 };//起始坐标
                let R = 120;//半径
                let W = 2;//宽
                let Rv=0;
                let analyser=this.analyser;
                let gradient = cxt.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(1, '#e56464');
                gradient.addColorStop(0.5, '#ed401470');
                gradient.addColorStop(0, '#fff');
                function drawSpectrum() {
                    analyser.getByteFrequencyData(output);//获取频域数据
                    cxt.clearRect(0, 0, wrap.width, wrap.height);
                    //画线条
                    for (let i = 0; i < 180; i++) {
                        let value = output[i] / 10;//<===获取数据
                        cxt.beginPath();
                        cxt.lineWidth = W;
                        cxt.moveTo(( Math.sin((i * du) / 180 * Math.PI) * R + potInt.y),-Math.cos((i * du) / 180 * Math.PI) * R + potInt.x);//从圆边开始
                        Rv = (R + value);
                        cxt.strokeStyle  = gradient;
                        cxt.lineTo( ( Math.sin((i * du) / 180 * Math.PI) * Rv + potInt.y),-Math.cos((i * du) / 180 * Math.PI) * Rv + potInt.x);
                        cxt.stroke();
                    }
                    cxt.fill();
                    requestAnimationFrame(drawSpectrum);
                }
                drawSpectrum();
            },
            switchMode(){
                this.mode=!this.mode;
            },
            getComment(page){
                this.$Api.Music[this.commentType].comment(this.NowPlay.id,page,(rs)=>{
                    this.moreData=rs.more;
                    this.pageCount=page;
                    if(page===0){
                        this.commentData=rs.comments;
                    }else{
                        this.commentData=[...this.commentData,...rs.comments]
                    }
                })
            },
            loadMore(e){
                this.$scrollEnd(e,()=>{
                    if(this.moreData) {
                        this.pageCount++;
                        this.getComment(this.pageCount)
                    }
                })
            },
            getSimiMusic(){
                this.$Api.Music.simiMusic(this.NowPlay.id,(rs)=>{
                    rs.songs=this.$handleListData(rs.songs,'simiMusic');
                    this.simiMusicList=rs.songs;
                })
            },
            getSimiPlayList(){
                this.$Api.Music.simiPlayList(this.NowPlay.id,(rs)=>{
                    this.simiPlayList=rs.playlists;
                })
            },
            getSimiUser(){
                this.$Api.Music.simiUser(this.NowPlay.id,(rs)=>{
                    this.simiUser=rs.userprofiles;
                })
            },
            goUserDetail(item){
                this.$router.push({
                    path:'/user-detail/'+item.userId,
                    query:{
                        data:JSON.stringify(item)
                    }
                });
            }
        }
    }
</script>

<style scoped>
    @import "../../assets/css/lrc.css";
    .cm-full-music-player{
        width: 100%;
        height:100%;
        -o-transition: all 350ms;
        -moz-transition: all 350ms;
        -webkit-transition: all 350ms;
        position: absolute;
        left: 0;
        top: 59px;
        z-index: 3;
    }
    .cm-full-music-container{
        width: 90%;
        max-width: 1050px;
        height: calc(100% - 120px);
        position: relative;
        z-index: 1;
        margin: 60px auto;
        overflow: auto;
    }
    .cm-full-music-container::-webkit-scrollbar{
        background: rgba(255,255,255,.1);
    }
    .cm-full-music-container::-webkit-scrollbar-thumb{
        background: rgba(255,255,255,.2);
    }
    .cm-full-music-control-btn {
        left: 60px;
        width: calc(100% - 120px);
        position: fixed;
        z-index: 1;
    }
    .cm-full-music-control-btn h1,.cm-full-music-control-btn p{
        text-align: center;
        width: calc(100% - 160px)
    }
    .cm-full-music-control-btn button{
        float: left;
        width: 40px;
        height: 40px;
        color: white;
        font-size: 20px;
        background: none;
        border-radius: 100%;
    }
    .cm-full-music-control-btn h1{
        font-weight: normal;
        font-size: 20px;
        color: #fff;
        overflow:hidden;
        text-overflow:ellipsis;
        display:-webkit-box;
        -webkit-box-orient:vertical;
        -webkit-line-clamp:2;
    }
    .cm-full-music-control-btn p{
        font-size: 14px;
        color: #e56464;
    }
    .cm-full-music-player-container{
        width: 100%;
        height: calc(100% - 40px);
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        top: -50px;
        z-index:-1;
        margin-top: 40px;
    }
    .cm-full-poster-container{
        width: 300px;
        height: 300px;
        margin-left: 30px;
        position: relative;
        overflow: unset;
    }
    .cm-full-poster-container *{
        position: absolute;
    }
    .cm-full-poster-container p{
        top: 100%;
        text-align: center;
        width: 100%;
        font-size: 16px;
        color: #fff;
    }
    .cm-full-music-button{
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: center;
        top: 100%;
    }
    .cm-full-music-button button{
        width: 40px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        color: #fff;
        font-size: 18px;
        background: none;
        margin: 0 10px;
        position: relative;
        border-radius: 100%;
    }
    .cm-full-music-poster{
        width: 235px;
        height: 235px;
        border-radius: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        left: 32px;
        top: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .cm-full-music-poster img{
        width: 100%;
        height: 100%;
    }
    .cm-full-music-poster button{
        width: 55px;
        height: 55px;
        text-align: center;
        line-height: 55px;
        color: #fff;
        text-shadow: 1px 1px 1px rgba(0,0,0,.5);
        background: #e56464a8;
        border-radius: 100%;
        font-size: 16px;
    }
    .cm-full-prev-container,.cm-full-next-container{
        width: 100px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        overflow: unset;
        z-index: -1;
    }
    .cm-full-prev-container .line,.cm-full-next-container .line{
        width: 126%;
        height: 2px;
        position: absolute;
        background: #e5646478;
        left: -19px;
        border-radius: 0 50% 50% 0;
    }
    .cm-full-prev-container .line{
        left: 19px;
        border-radius:  50% 0 0 50%;
    }
    .cm-full-prev-container button,.cm-full-next-container button{
        width: 40px;
        height: 40px;
        border-radius: 100%;
        color: #fff;
        background: #e56464;
        font-size: 28px;
        text-align: center;
        line-height: 39px;
    }
    .cm-full-prev-container button{
        margin-left: 60px;
    }
    .cm-full-music-lrc{
        width: calc(100% - 430px);
        margin-left: 30px;
        height: calc(100% - 50px);
        -o-transition: all 350ms;
        -moz-transition: all 350ms;
        -webkit-transition: all 350ms;
        margin-top: 40px;
    }
    .cm-full-music-lrc h1{
        color: #fff;
        font-size: 30px;
        font-weight: normal;
        overflow:hidden;
        text-overflow:ellipsis;
        display:-webkit-box;
        -webkit-box-orient:vertical;
        -webkit-line-clamp:2;
    }
    .cm-full-music-lrc .artist{
        color: #e56464;
        font-size: 16px;
    }
    .cm-full-music-more-head{
        width: 100%;
        font-size: 20px;
        color: #fff;
        border-bottom: 2px solid rgba(255,255,255,.1);
    }
    .cm-full-player-comment{
        float: left;
        width: 70%;
        height: unset;
        color: #fff;
        padding-right: 40px;
    }
    .cm-full-right-container{
        float: left;
        width:30%;
    }
    .cm-full-simi-music,.cm-full-simi-user{
        width: 100%;
        padding: 17px 0;
    }
    .cm-full-simi-music li,.cm-full-simi-user li{
        width: 100%;
        display: flex;
        align-items: center;
        height: 50px;
        font-size: 14px;
        cursor: pointer;
        margin-bottom: 5px;
        padding: 5px;
        -o-transition: all 350ms;
        -moz-transition: all 350ms;
        -webkit-transition: all 350ms;
        position: relative;
    }
    .cm-full-simi-music li span,.cm-full-simi-user li span{
        padding-left: 10px;
        color: #fff;
        font-size: 14px;
    }
    .cm-full-simi-user li .name{
        height: 20px;
        margin-top: -20px;
    }
    .cm-full-simi-user li .reason{
        position: absolute;
        left: 45px;
        bottom: 10px;
        color: #dedede;
        font-size: 12px;
    }
    .cm-full-simi-music li:hover,.cm-full-simi-user li:hover{
        background: rgba(255,255,255,.1);
    }
    .cm-full-simi-music li img,.cm-full-simi-user li img{
        width: 40px;
        height: 40px;
    }
    .cm-full-simi-user li img{
        border-radius: 100%;
    }
</style>
