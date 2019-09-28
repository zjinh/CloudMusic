<template>
    <div class="cm-page-main">
        <div class="cm-video-detail-head">
            <div class="tag">MV</div>
        </div>
        <div class="cm-video-left75">
            <VideoPlayer v-if="url" :url="url"></VideoPlayer>
        </div>
    </div>
</template>

<script>
    import VideoPlayer from "../MusicCom/VideoPlayer";
    export default {
        name: "VideoDetail",
        inject:['menuControl'],
        components:{
            VideoPlayer
        },
        data(){
            return{
                url:""
            }
        },
        activated() {
            this.menuControl(true);
            this.getUrl();
        },
        deactivated(){
            this.menuControl(false);
        },
        methods:{
            getUrl(){
                if(typeof this.$route.params.id==='string') {
                    this.$Api.Music.video.getUrl(this.$route.params.id, (rs) => {
                        this.url = rs.urls[0].url;
                    })
                }else{
                    this.$Api.Music.mv.getUrl(this.$route.params.id, (rs) => {
                        this.url = rs.data.url;
                    })
                }
            }
        }
    }
</script>

<style scoped>
    .cm-page-main{
        overflow: auto;
    }
    .cm-video-detail-head{
        width: 100%;
        height: 50px;
        line-height: 50px;
    }
    .cm-video-left75{
        width: 75%;
        height: 500px;
    }
</style>
