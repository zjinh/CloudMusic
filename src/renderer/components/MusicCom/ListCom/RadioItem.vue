<template>
    <div class="cm-radio-item-container">
        <ul class="cm-radio-item-list" @scroll="scrollToLoad">
            <li v-for="(item,index) in listData" :key="index" :class="item.play" @click="clickToPlay(item,index)" ripple="">
                <span class="number" v-if="!item.play">{{item.serialNum}}</span>
                <span class="number sf-icon-volume-up" v-else></span>
                <img :src="item.picture" alt="" draggable="false">
                <p>{{item.name}}</p>
                <span class="play-count">播放:{{$numberCount(item.listenerCount)}}</span>
                <span class="likes">赞:{{$numberCount(item.likedCount)}}</span>
                <span class="create-time">{{item.create_time}}</span>
                <span class="time">{{timeDeal(item.time)}}</span>
            </li>
        </ul>
        <NoData v-show="data.length===0&&!loading"></NoData>
        <loading v-show="loading"></loading>
    </div>
</template>

<script>
    import media from "../../../tools/media";
    export default {
        name: "RadioItem",
        props:{
            data:Array,
            type:String,
            loading:Boolean
        },
        data(){
            return{
                listData:[]
            }
        },
        watch:{
            data:function () {
                this.listData=this.handleData(this.data)
            }
        },
        methods:{
            handleData(data){
                let _return=[];
                let list={};
                data.forEach((item)=>{
                    list={
                        id:item.id,
                        serialNum:item.serialNum,
                        picture:item.blurCoverUrl,
                        type:'radio',
                        name:item.name,
                        title:item.name,
                        artist:item.dj.nickname,
                        album:item.channels[0],
                        time:item.duration,
                        create_time:new Date(item.createTime).format('yyyy-MM-dd'),
                        url:'https://music.163.com/song/media/outer/url?id='+item.mainTrackId+'.mp3',
                        likedCount:item.likedCount,
                        listenerCount:item.listenerCount,
                        data:item
                    };
                    _return.push(list);
                });
                return _return;
            },
            clickToPlay(item,index){
                this.$emit('callback',item,this.listData);
            },
            scrollToLoad(e){
                this.$scrollEnd(e,()=>{
                    this.$emit('scroll-end')
                })
            },
            timeDeal(s){
                return media.secondDeal(s)
            },
        }
    }
</script>

<style scoped>
    .cm-radio-item-container{
        width: 100%;
        height: 100%;
        position: relative;
    }
    .cm-radio-item-list{
        width: 100%;
        height: 100%;
        min-height: 330px;
        overflow: auto;
        padding-top: 10px;
    }
    .cm-radio-item-list li{
        width: 100%;
        height: 60px;
        cursor: pointer;
        display: flex;
        align-items: center;
        position: relative;
        border-bottom: 1px solid #eee;
    }
    .cm-radio-item-list li:nth-child(odd){
        background: #f9f9f9;
    }
    .cm-radio-item-list li .number{
        width: 50px;
        text-align: center;
        font-size: 12px;
        color: #b9b9b9;
    }
    .cm-radio-item-list li img{
        width: 45px;
        height: 45px;
        border: 1px solid #eee;
    }
    .cm-radio-item-list li p{
        width: 47%;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        font-size: 12px;
        color: #333;
        margin-left: 10px;
    }
    .cm-radio-item-list li span{
        font-size: 12px;
        color: #6f6e6e;
        padding: 0 10px;
    }
    .cm-radio-item-list li .sub{
        position: absolute;
        right: 5px;
        bottom: 55px;
        color: #fff;
        font-size: 12px;
        background: rgba(0,0,0,.1);
    }
    .cm-radio-item-list li .count{
        position: absolute;
        left: 5px;
        top: 5px;
        color: #fff;
        font-size: 12px;
        background: rgba(0,0,0,.1);
    }
    .cm-radio-item-list li .sf-icon-volume-up{
        color: #e56464;
    }
    .cm-radio-item-list li:hover,.playing{
        background: #efefef!important;
    }
</style>
