<template>
    <div class="cm-songlist-container">
        <div class="cm-songlist-head">
            <span class="num">序号</span>
            <span class="name">音乐标题</span>
            <span class="singer">歌手</span>
            <span class="album">专辑</span>
            <span class="time" v-if="type!=='local'">时长</span>
            <span class="size" v-else>大小</span>
            <span class="control">操作</span>
        </div>
        <ul class="cm-songlist" @scroll="scrollToLoad">
            <li v-for="(item,index) in data" @click="clickToPlay(item,index)" :class="item.play" ripple="">
                <span class="num" v-if="!item.play">
                    {{needZero(index+1)}}
                </span>
                <span class="num sf-icon-volume-up" v-else></span>
                <span class="name">
                    {{item.title}}
                </span>
                <span class="singer">
                    {{item.artist}}
                </span>
                <span class="album">
                    {{item.album}}
                </span>
                <span class="time" v-if="type!=='local'">
                    {{timeDeal(item.time)}}
                </span>
                <span class="size" v-else>
                    {{FileSize(item.size)}}
                </span>
                <span class="control">
                    <button class="sf-icon-youtube-play" v-if="item.mvid"></button>
                </span>
            </li>
        </ul>
        <NoData v-show="data.length===0&&!loading"></NoData>
        <loading v-show="loading"></loading>
    </div>
</template>

<script>
    import media from "../../tools/media";
    export default {
        name: "SongList",
        props:{
            data:Array,
            type:String,
            loading:Boolean
        },
        methods:{
            FileSize (bytes) {
                bytes=parseFloat(bytes);
                if (bytes === 0) return '0B';
                let k = 1024,
                    sizes = ['B', 'KB', 'MB', 'GB', 'TB'],
                    i = Math.floor(Math.log(bytes) / Math.log(k));
                return (bytes / Math.pow(k, i)).toPrecision(3) + sizes[i];
            },
            needZero(count){
                count=parseInt(count);
                return count < 10 ? "0" + count:count
            },
            timeDeal(s){
                return media.secondDeal(s/1000)
            },
            clickToPlay(item,index){
                this.$emit('callback',item,this.data);
            },
            scrollToLoad(e){
                let element=e.target;
                if(element.scrollHeight - element.scrollTop === element.clientHeight){
                    this.$emit('scroll-end')
                }
            }
        },
    }
</script>

<style scoped>
    .cm-songlist-container{
        width: 100%;
        height: 100%;
        position: relative;
    }
    .cm-songlist{
        width: 100%;
        height: calc(100% - 40px);
        overflow-y: auto;
    }
    .cm-songlist li,.cm-songlist-head{
        width: 100%;
        height: 40px;
        overflow: hidden;
    }
    .cm-songlist li *,.cm-songlist-head *{
        height: 100%;
        line-height: 40px;
        display: inline-block;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .cm-songlist li *{
        color: #b9b9b9;
    }
    .cm-songlist li .num,.cm-songlist-head .num{
        width: 50px;
        text-align: center;
    }
    .cm-songlist li .name,.cm-songlist-head .name{
        width: calc(30% - 50px);
        color: #333;
    }
    .cm-songlist li .singer,.cm-songlist-head .singer{
        width: 15%;
    }
    .cm-songlist li .album,.cm-songlist-head .album{
        width: 15%;
    }
    .cm-songlist li .size,.cm-songlist-head .size{
        width: 10%;
    }
    .cm-songlist li .time,.cm-songlist-head .time{
        width: 10%;
    }
    .cm-songlist li .control,.cm-songlist-head .control{
        width: 20%;
    }
    .cm-songlist li .control button{
        background: none;
        color: #e56464;
        padding: 0 3px;
    }
    .cm-songlist li:nth-child(odd){
        background: #f9f9f9;
    }
    .cm-songlist li .sf-icon-volume-up{
        color: #e56464;
    }
    .cm-songlist li:hover,.playing{
        background: #efefef!important;
    }
</style>
