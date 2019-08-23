<template>
    <div class="cm-main">
        <MusicClassify></MusicClassify>
        <section class="cm-right">
            <MusicHeader></MusicHeader>
            <section class="cm-right-main">
                <router-view></router-view>
            </section>
        </section>
        <PlayerControl></PlayerControl>
        <section class="cm-main-background-container" style="">
            <div class="cm-main-background"></div>
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
        border-radius: 5px 0 5px 5px;
        background-repeat: no-repeat;
        background-size: cover;
        background-image: url("http://p1.music.126.net/oCnACmhB6CM5oZyWmNfmTg==/109951163051142326.jpg");
        overflow:hidden;
    }
    .cm-main-background-container::before{
        content:'';
        position:absolute;
        width: 200%;
        height: 120px;
        top:-30px;
        left:-50%;
        z-index:-1;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: 50%;
        background-image: url("http://p1.music.126.net/oCnACmhB6CM5oZyWmNfmTg==/109951163051142326.jpg");
        -webkit-filter: blur(15px);
        filter: blur(15px);
    }
    /*.cm-main-background{
        width: 200%;
        height: 120px;

        opacity: .6;
        background-color: rgba(0,0,0,.35);
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
        z-index: 1;

    }*/
    .cm-right-main{
        float: left;
        width: 100%;
        height: calc(100% - 120px);
    }
</style>
