<template>
    <div class="cm-playlist-container">
        <div class="cm-playlist-head">
            <span class="num">序号</span>
            <span class="name">音乐标题</span>
            <span class="singer">歌手</span>
            <span class="album">专辑</span>
            <span class="time" v-if="type!=='local'">时长</span>
            <span class="size" v-else>大小</span>
            <span class="control">操作</span>
        </div>
        <ul class="cm-playlist">
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
        name: "PlayList",
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
                this.data.forEach((music)=>{
                    this.$set(music,'play','')
                });
                this.$set(item,'play','playing');
                this.$emit('callback',item,this.data);
            }
        },
    }
</script>

<style scoped>
    .cm-playlist-container{
        width: 100%;
        height: 100%;
        position: relative;
    }
    .cm-playlist{
        width: 100%;
        height: calc(100% - 40px);
        overflow-y: auto;
    }
    .cm-playlist li,.cm-playlist-head{
        width: 100%;
        height: 40px;
        overflow: hidden;
    }
    .cm-playlist li *,.cm-playlist-head *{
        height: 100%;
        line-height: 40px;
        display: inline-block;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .cm-playlist li *{
        color: #b9b9b9;
    }
    .cm-playlist li .num,.cm-playlist-head .num{
        width: 50px;
        text-align: center;
    }
    .cm-playlist li .name,.cm-playlist-head .name{
        width: calc(30% - 50px);
        color: #333;
    }
    .cm-playlist li .singer,.cm-playlist-head .singer{
        width: 15%;
    }
    .cm-playlist li .album,.cm-playlist-head .album{
        width: 15%;
    }
    .cm-playlist li .size,.cm-playlist-head .size{
        width: 10%;
    }
    .cm-playlist li .time,.cm-playlist-head .time{
        width: 10%;
    }
    .cm-playlist li .control,.cm-playlist-head .control{
        width: 20%;
    }
    .cm-playlist li .control button{
        background: none;
        color: #e56464;
        padding: 0 3px;
    }
    .cm-playlist li:nth-child(odd){
        background: #f9f9f9;
    }
    .cm-playlist li .sf-icon-volume-up{
        color: #e56464;
    }
    .cm-playlist li:hover,.playing{
        background: #efefef!important;
    }
</style>
