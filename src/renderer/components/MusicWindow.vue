<template>
    <div class="cm-main">
        <MusicClassify :style="{height:mainHeight}"></MusicClassify>
        <section class="cm-right" :style="{height:mainHeight}">
            <MusicHeader></MusicHeader>
            <section class="cm-right-main">
                <keep-alive>
                    <router-view @play="play"></router-view>
                </keep-alive>
            </section>
        </section>
        <PlayerControl ref="play" :PlayList="PlayList" @playing="playing" :style="{height:PlayList.length?'60px':0}"></PlayerControl>
        <section class="cm-main-background-container" :style="{'background-image':'url('+NowPlay.picture+')',height:PlayList.length?'60px':0}">
            <div class="cm-main-filter"></div>
            <div class="cm-main-background" :style="{'background-image':'url('+NowPlay.picture+')'}"></div>
        </section>
    </div>
</template>

<script>
    import MusicClassify from "./MusicWindow/MusicClassify"
    import MusicHeader from "./MusicWindow/MusicHeader"
    import PlayerControl from "./MusicWindow/PlayerControl"
    export default {
        name: "MusicWindow",
        components:{
            MusicClassify,MusicHeader,PlayerControl
        },
        data(){
            return{
                PlayList:[],
                NowPlay:{
                    picture:"http://p1.music.126.net/oCnACmhB6CM5oZyWmNfmTg==/109951163051142326.jpg"
                },
            }
        },
        computed:{
            mainHeight(){
                return this.PlayList.length?'calc(100% - 60px)':'100%'
            }
        },
        methods:{
            play(music,playList){
                this.PlayList=playList;
            },
            playing(data){
                this.NowPlay=data;
            }
        }
    }
</script>

<style scoped>
    .cm-main-background-container{
        width: 100%;
        height: 60px;
        left: 0;
        bottom: 0;
        position: absolute;
        z-index: 2;
        background-repeat: no-repeat!important;
        background-size: cover!important;
        background-image: url("http://p1.music.126.net/oCnACmhB6CM5oZyWmNfmTg==/109951163051142326.jpg");
        overflow:hidden;
        -webkit-transition: background 0.4s ease-in-out;
        -moz-transition: background 0.4s ease-in-out;
        -o-transition: background 0.4s ease-in-out;
        transition: background 0.4s ease-in-out;
    }
    .cm-main-filter{
        width: 100%;
        height: 100%;
        background: #828282;
        opacity: .5;
    }
    .cm-main-background{
        position:absolute;
        width: 200%;
        height: 120px;
        top:-30px;
        left:-50%;
        z-index:-1;
        background-repeat: no-repeat!important;
        background-size: cover!important;
        background-position: 50%!important;
        background-image: url("http://p1.music.126.net/oCnACmhB6CM5oZyWmNfmTg==/109951163051142326.jpg");
        -webkit-filter: blur(15px);
        filter: blur(15px);
        -webkit-transition: background 0.4s ease-in-out;
        -moz-transition: background 0.4s ease-in-out;
        -o-transition: background 0.4s ease-in-out;
        transition: background 0.4s ease-in-out;
    }
    .cm-right-main{
        float: left;
        width: 100%;
        height: calc(100% - 60px);
        -o-transition: all 350ms;
        -moz-transition: all 350ms;
        -webkit-transition: all 350ms;
    }
</style>
