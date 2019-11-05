<template>
    <div class="cm-page-detail-head">
        <img :src="poster" alt="" class="poster" draggable="false">
        <div class="content">
            <div class="content-head">
                <div class="tag">{{tag}}</div>
                <span class="name">{{name}}<span class="alias">{{alias}}</span> </span>
            </div>
            <div class="content-body">
                <slot></slot>
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
                    },
                    playlist:{
                        poster:'coverImgUrl',
                        tag:"歌单",
                        name:"name"
                    },
                    album:{
                        poster:"picUrl",
                        alias:"alias",
                        tag:"专辑",
                        name:"name"
                    },
                    radio:{
                        poster:"picUrl",
                        tag:"电台",
                        name:"name"
                    },
                    user:{
                        poster:"avatarUrl",
                        tag:"用户",
                        name:"nickname"
                    }
                },
                nowMap:{},
            }
        },
        mounted(){
            this.nowMap=this.dataMap[this.type];
        },
        computed:{
            tag(){
                return this.nowMap.tag
            },
            name(){
                return this.data[this.nowMap.name]
            },
            alias(){
                return this.data[this.nowMap.alias]?'('+this.data[this.nowMap.alias]+')':"";
            },
            poster(){
                return this.data[this.nowMap.poster]
            },
            artistContent(){
                return this.nowMap.content;
            }
        },
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
    .content-head .alias{
        color: #807f7f;
        padding-left: 10px;
    }
    .content-body{
        width: 100%;
        height: calc(100% - 50px);
        padding-top: 10px;
        overflow: auto;
    }
    .content-body::-webkit-scrollbar,.content-body *::-webkit-scrollbar{
        display: none;
        width: 0;
    }
</style>
