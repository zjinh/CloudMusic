<template>
    <div class="cm-playlist-container">
        <ul :class="'cm-playlist-'+(type)" @scroll="scrollToLoad">
            <li v-for="(item,index) in data" :key="index" @click="clickToSelect(item)" ripple="">
                <img v-lazy="item.coverImgUrl||item.picUrl" alt="" draggable="false">
                <span>{{item.name}}</span>
                <div class="play_count">{{$numberCount(item.playCount)}}</div>
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
            type:{
                type:String,
                default(){
                    return 'list'
                }
            },
            loading:Boolean
        },
        methods:{
            clickToSelect(item){
                this.$router.push({
                    path:'/playlist-detail/'+item.id,
                    query:{
                        data:JSON.stringify(item)
                    }
                });
            },
            scrollToLoad(e){
                this.$scrollEnd(e,()=>{
                    this.$emit('scroll-end')
                })
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
    .cm-playlist-list,.cm-playlist-block,.cm-playlist-recommend{
        width: 100%;
        height: 100%;
        min-height: 330px;
        overflow: auto;
    }
    .cm-playlist-block{
        padding: 20px 0;
        min-height: unset;
    }
    .cm-playlist-list li,.cm-playlist-block li{
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
    .cm-playlist-list li img,.cm-playlist-block li img{
        width: 40px;
        height: 40px;
        border: 1px solid #eee;
    }
    .cm-playlist-list li span,.cm-playlist-block li span{
        width: 50%;
        margin-left: 10px;
    }
    .cm-playlist-block li span{
        font-size: 12px;
        color: #fff;
        width: calc(100% - 50px);
        height: 20px;
        margin-top: -20px;
    }
    .cm-playlist-list li .play_count{
        display: none;
    }
    .cm-playlist-block li .play_count{
        position: absolute;
        left: 60px;
        bottom: 9px;
        font-size: 12px;
        color: #dadada;
    }
    .cm-playlist-list li .count{
        width: 50px;
        color: #b9b9b9;
        font-size: 12px;
    }
    .cm-playlist-block li .count,.cm-playlist-block li .creator{
        display: none;
    }
    .cm-playlist-list li .creator{
        margin-left: 70px;
        font-size: 12px;
    }
    .cm-playlist-list li:hover,.cm-playlist-block li:hover,.cm-playlist-recommend li:hover{
        background: rgba(255,255,255,.1);
    }
    .cm-playlist-recommend li{
        float: left;
        width: 145px;
        height: 190px;
        margin: 6px;
        cursor: pointer;
    }
    .cm-playlist-recommend li img{
        width: 100%;
        height: 145px;
    }
    .cm-playlist-recommend li span{
        width: 100%;
    }
    .cm-playlist-recommend .play_count,.cm-playlist-recommend .count,.cm-playlist-recommend .creator{
        display: none;
    }
</style>
