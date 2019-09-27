<template>
    <div class="cm-videolist-container">
        <div class="cm-videolist-list" @scroll="scrollToLoad">
            <div v-for="(item,index) in data" :key="index" @click="clickToSelect(item)" class="video-block" ripple="">
                <img :src="item.coverUrl||item.imgurl" alt="" draggable="false">
                <p>{{item.title||item.name}}</p>
                <span class="creator" v-if="item.creator">by {{item.creator[0].userName}}</span>
                <span class="count sf-icon-video"> {{item.playTime||item.playCount}}</span>
                <span class="time">{{timeDeal(item.durationms||item.duration)}}</span>
            </div>
        </div>
        <NoData v-show="data.length===0&&!loading"></NoData>
        <loading v-show="loading"></loading>
    </div>
</template>

<script>
    import media from "../../../tools/media";
    export default {
        name: "VideoList",
        props:{
            data:Array,
            type:String,
            loading:Boolean
        },
        methods:{
            clickToSelect(item){
                this.$emit('callback',item);
            },
            scrollToLoad(e){
                this.$scrollEnd(e,()=>{
                    this.$emit('scroll-end')
                })
            },
            timeDeal(s){
                return media.secondDeal(s/1000)
            },
        }
    }
</script>

<style scoped>
    .cm-videolist-container{
        width: 100%;
        height: 100%;
        position: relative;
    }
    .cm-videolist-list{
        width: 100%;
        height: 100%;
        min-height: 330px;
        overflow: auto;
    }
    .video-block{
        float: left;
        width: 185px;
        height: 160px;
        cursor: pointer;
        margin: 5px;
        position: relative;
    }
    .video-block img{
        width: 100%;
        height: 100px;
    }
    .video-block p{
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        font-size: 12px;
        color: #333;
    }
    .video-block .creator{
        font-size: 12px;
        color: #b9b9b9;
    }
    .video-block .time{
        position: absolute;
        right: 5px;
        top: 79px;
        color: #fff;
        font-size: 12px;
        background: rgba(0,0,0,.1);
    }
    .video-block .count{
        position: absolute;
        left: 5px;
        top: 5px;
        color: #fff;
        font-size: 12px;
        background: rgba(0,0,0,.1);
    }
</style>
