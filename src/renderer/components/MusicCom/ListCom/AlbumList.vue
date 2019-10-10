<template>
    <div class="cm-albumlist-container">
        <ul class="cm-albumlist-list" @scroll="scrollToLoad">
            <li v-for="(item,index) in data" :key="index" @click="clickToSelect(item)" ripple="">
                <img v-lazy="item.picUrl" alt="" draggable="false">
                <i class="sf-icon-dot-circle"></i>
                <span>{{item.name}}</span>
                <div class="name">{{item.artists[0].name}}</div>
            </li>
        </ul>
        <NoData v-show="data.length===0&&!loading"></NoData>
        <loading v-show="loading"></loading>
    </div>
</template>

<script>
    export default {
        name: "AlbumList",
        props:{
            data:Array,
            type:String,
            loading:Boolean
        },
        methods:{
            clickToSelect(item){
                this.$router.push({
                    path:'/album-detail/'+item.id,
                    query:{
                        data:JSON.stringify(item)
                    }
                });
                this.$emit('callback')
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
    .cm-albumlist-container{
        width: 100%;
        height: 100%;
        position: relative;
    }
    .cm-albumlist-list{
        width: 100%;
        height: 100%;
        overflow: auto;
    }
    .cm-albumlist-list li{
        width: 100%;
        height: 60px;
        display: flex;
        align-items: center;
        padding: 0 10px;
        cursor: pointer;
        font-size: 14px;
    }
    .cm-albumlist-list li:nth-child(odd){
        background: #f9f9f9;
    }
    .cm-albumlist-list li img{
        width: 40px;
        height: 40px;
    }
    .cm-albumlist-list li span{
        width: 50%;
        margin-left: 10px;
    }
    .cm-albumlist-list li i{
        font-size: 40px;
        margin-left: -31px;
        position: relative;
        z-index: -1;
        border-radius: 100%;
        color: #3c3b3bee;
        background: #3c3b3bee;
    }
    .cm-albumlist-list li .name{
        width: 50px;
        color: #b9b9b9;
        font-size: 12px;
    }
</style>
