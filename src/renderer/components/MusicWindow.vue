<template>
    <div class="cm-main">
        <MusicClassify></MusicClassify>
        <section class="cm-right">
            <MusicHeader></MusicHeader>
        </section>
    </div>
</template>

<script>
    import MusicClassify from "./MusicWindow/MusicClassify"
    import MusicHeader from "./MusicWindow/MusicHeader"
    export default {
        name: "MusicWindow",
        components:{
            MusicClassify,MusicHeader
        },
        data(){
            return{

            }
        }
    }
</script>

<style scoped>
    .cm-main-background{
        position: absolute;
        left: -50%;
        top: -50%;
        width: 200%;
        height: 200%;
        -webkit-filter: blur(65px);
        filter: blur(65px);
        opacity: .6;
        background-color: rgba(0,0,0,.35);
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
        z-index: 1;
        background-image: url("../../../static/img/bg2.jpg");
        background-repeat: no-repeat;
        background-size: cover;
        background-position: 50%;
    }
    .cm-main-poster{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: 50%;
        z-index: 0;
    }
</style>
