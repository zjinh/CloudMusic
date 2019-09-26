<template>
    <div class="cm-page-main">
        <DetailPageHead :data="artistData" type="artist"></DetailPageHead>
        <TabBar :data="artistDataType" align="left"></TabBar>
    </div>
</template>

<script>
    export default {
        name: "ArtistDetail",
        data(){
            return{
                artistData:{},
                artistDataType:[
                    {
                        name:"专辑",
                        type:"songs",
                        value:1,
                        active:'active'
                    },
                    {
                        name:"MV",
                        type:"artists",
                        value:100,
                        active:''
                    },
                    {
                        name:"相似歌手",
                        type:"albums",
                        value:10,
                        active:''
                    },
                ]
            }
        },
        activated() {
            this.artistData=JSON.parse(localStorage.tempData);
            console.log(this.artistData)
            console.log(this.$route.params.id)
        }
    }
</script>

<style scoped>
    .cm-page-main{
        overflow: auto;
    }
    .cm-artist-detail-head{
        width: 100%;
    }
    .cm-artist-content{
        width: 100%;
    }
</style>
