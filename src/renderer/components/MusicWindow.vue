<template>
    <div class="cm-main">
        <MusicClassify :style="{height:mainHeight}"></MusicClassify>
        <section class="cm-right" :style="{height:mainHeight}">
            <MusicHeader :UserInfo="UserInfo" :NowPlay="NowPlay" :full="showFull"></MusicHeader>
            <section class="cm-right-main">
                <loading v-show="!login"></loading>
                <keep-alive v-if="login">
                    <router-view></router-view>
                </keep-alive>
            </section>
        </section>
        <FullPlayer ref="fully" :analyser="analyser" :PlayList="PlayList" :NowPlay="NowPlay" :playState="playState" @control="playerControl" :style="{top:showFull?'0':'100%'}" ></FullPlayer>
        <PlayerControl ref="player" :analyser="analyser" :PlayList="PlayList" @playing="playing" @full="playerControl" @playState="playStateUpdate" :style="{height:PlayList.length?'60px':0}"></PlayerControl>
        <BlurBackground :url="NowPlay.picture" :style="{height:PlayList.length?'60px':0}"></BlurBackground>
    </div>
</template>

<script>
    import MusicClassify from "./MusicWindow/MusicClassify"
    import MusicHeader from "./MusicWindow/MusicHeader"
    import PlayerControl from "./MusicWindow/PlayerControl"
    import BlurBackground from "./MusicWindow/BlurBackground"
    import FullPlayer from "./MusicWindow/FullPlayer"
    export default {
        name: "MusicWindow",
        components:{
            MusicClassify,MusicHeader,PlayerControl,BlurBackground,FullPlayer
        },
        provide (){
            return {
                playMusic:(music,playlist)=>{
                    console.log(music)
                    playlist.forEach((item)=>{
                        this.$set(item,'play','')
                    });
                    this.$set(music,'play','playing');
                    if(this.PlayList.length) {
                        if (this.PlayList[0].name !== playlist[0].name) {
                            this.PlayList.forEach((item) => {
                                item.play = '';
                            })
                        }
                    }
                    this.PlayList=playlist;
                },
                fullControl:(flag)=>{
                    this.showFull=flag!==undefined?flag:!this.showFull;
                }
            }
        },
        data(){
            return{
                UserInfo:{},
                PlayList:[],
                NowPlay:{
                    picture:this.$defaultAlbum
                },
                playState:"sf-icon-play",
                showFull:false,
                analyser:{},
                login:false
            }
        },
        computed:{
            mainHeight(){
                return this.PlayList.length?'calc(100% - 60px)':'100%'
            }
        },
        mounted(){
            this.audioCont();
        },
        created(){
            this.$ipc.on('win-data',(event,data)=>{
                this.$Api.User.Login(data,()=>{
                    this.login=true;
                    this.$Api.LocalFile.read('user',(data)=>{
                        if(data.userId){
                            this.$nextTick(()=>{
                                this.UserInfo = data;
                            });
                        }
                    });
                })
            });
        },
        methods:{
            playing(data){
                this.NowPlay=data;
                this.$refs.fully.visualRound();
            },
            playerControl(data){
                if(data) {
                    this.$refs.player.PlayerCommend(data)
                }else{
                    this.showFull=!this.showFull;
                }
            },
            playStateUpdate(data){
                this.playState=data;
            },
            audioCont(){
                window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
                let ctx = new AudioContext();
                let audio =document.getElementById('audio');
                this.analyser = ctx.createAnalyser();
                let audioSrc = ctx.createMediaElementSource(audio);
                audioSrc.connect(this.analyser);
                this.analyser.connect(ctx.destination);
            }
        }
    }
</script>

<style scoped>
    .cm-main{
        background: #e56464;
    }
    .cm-right-main{
        float: left;
        width: 100%;
        height: calc(100% - 60px);
        border-top: 1px solid #eee;
        background: #Fff;
        -o-transition: all 350ms;
        -moz-transition: all 350ms;
        -webkit-transition: all 350ms;
    }
</style>
