<template>
    <div class="cm-radiolist-container">
        <div class="cm-radiolist-list" @scroll="scrollToLoad">
            <div v-for="(item,index) in data" :key="index" @click="clickToSelect(item)" class="video-block" ripple="">
                <img :src="item.picUrl" alt="" draggable="false">
                <p>{{item.name}}</p>
<!--                <span class="creator">by {{item.creator[0].userName}}</span>-->
                <span class="sub">{{item.subCount}}订阅</span>
            </div>
        </div>
        <NoData v-show="data.length===0&&!loading"></NoData>
        <loading v-show="loading"></loading>
    </div>
</template>

<script>
    export default {
        name: "RadioList",
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
                let element=e.target;
                if(element.scrollHeight - element.scrollTop === element.clientHeight){
                    this.$emit('scroll-end')
                }
            },
        }
    }
</script>

<style scoped>
    .cm-radiolist-container{
        width: 100%;
        height: 100%;
        position: relative;
    }
    .cm-radiolist-list{
        width: 100%;
        height: 100%;
        overflow: auto;
    }
    .video-block{
        float: left;
        width: 175px;
        height: 220px;
        cursor: pointer;
        margin: 5px 10px;
        position: relative;
    }
    .video-block img{
        width: 100%;
        height: 175px;
        border: 1px solid #eee;
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
    .video-block .sub{
        position: absolute;
        right: 5px;
        bottom: 55px;
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
