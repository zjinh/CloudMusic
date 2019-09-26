<template>
    <div class="cm-playlist-container">
        <ul class="cm-playlist-list" @scroll="scrollToLoad">
            <li v-for="(item,index) in data" :key="index" @click="clickToSelect(item)" ripple="">
                <img :src="item.coverImgUrl" alt="" draggable="false">
                <span>{{item.name}}</span>
                <div class="count">{{item.trackCount}}首</div>
                <div class="creator">by {{item.creator.nickname}}</div>
            </li>
        </ul>
        <NoData v-show="data.length===0&&!loading"></NoData>
        <loading v-show="loading"></loading>
    </div>
</template>

<script>
    export default {
        name: "PlayList",
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
            }
        }
    }
</script>

<style scoped>
    .cm-playlist-container{
        width: 100%;
        height: 100%;
        position: relative;
    }
    .cm-playlist-list{
        width: 100%;
        height: 100%;
        overflow: auto;
    }
    .cm-playlist-list li{
        width: 100%;
        height: 60px;
        display: flex;
        align-items: center;
        padding: 0 10px;
        cursor: pointer;
        font-size: 14px;
    }
    .cm-playlist-list li:nth-child(odd){
        background: #f9f9f9;
    }
    .cm-playlist-list li img{
        width: 40px;
        height: 40px;
        border: 1px solid #eee;
    }
    .cm-playlist-list li span{
        width: 50%;
        margin-left: 10px;
    }
    .cm-playlist-list li .count{
        width: 50px;
        color: #b9b9b9;
        font-size: 12px;
    }
    .cm-playlist-list li .creator{
        margin-left: 70px;
        font-size: 12px;
    }
</style>
