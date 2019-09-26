<template>
    <div class="cm-page-detail-head">
        <img :src="poster" alt="" class="poster">
        <div class="content">
            <div class="content-head">
                <div class="tag">{{tag}}</div>
                <span class="name">{{name}}</span>
            </div>
            <div class="content-body" v-if="type==='artist'">
                <p class="artist-desp">{{artistContent}}</p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DetailPageHead",
        props:{
            data:Object,
            type:String,
        },
        data(){
            return{
                dataMap:{
                    artist:{
                        poster:'img1v1Url',
                        tag:"歌手",
                        name:"name",
                        content:""
                    }
                },
                nowMap:{},
            }
        },
        watch:{
            data:function () {
                this.nowMap=this.dataMap[this.type];
                console.log(this.nowMap)
                if(this.type==='artist'){
                    this.getArtistDetail()
                }
            }
        },
        computed:{
            tag(){
                return this.nowMap.tag
            },
            name(){
                return this.data[this.nowMap.name]
            },
            poster(){
                return this.data[this.nowMap.poster]
            },
            artistContent(){
                return this.nowMap.content;
            }
        },
        methods:{
            getArtistDetail(){
                this.$Api.Music.artist.detail(this.$route.params.id,(rs)=>{
                    this.nowMap.content=rs.briefDesc;
                })
            }
        }
    }
</script>

<style scoped>
    .cm-page-detail-head{
        width: 100%;
        height: 200px;
        display: flex;
    }
    .cm-page-detail-head .poster{
        width: 180px;
        height: 180px;
    }
    .cm-page-detail-head .content{
        width: calc(100% - 180px);
        height: 100%;
        padding:0 20px;
    }
    .content-head{
        width: 100%;
        height: 30px;
        line-height: 30px;
    }
    .content-head .tag{
        float: left;
        height: 30px;
        background: #e56464;
        color: #fff;
        padding: 0 10px;
        font-size: 14px;
        border-radius: 3px;
    }
    .content-head .name{
        font-size: 16px;
        padding-left: 10px;
        color: #333333;
    }
    .content-body{
        width: 100%;
        height: calc(100% - 60px);
        padding-top: 10px;
        margin-top: 10px;
        overflow: auto;
    }
    .content-body::-webkit-scrollbar{
        display: none;
        width: 0;
    }
    /*歌手简介*/
    .artist-desp{
        font-size: 13px;
        line-height: 1.5;
    }
</style>
