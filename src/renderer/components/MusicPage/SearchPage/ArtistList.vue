<template>
    <div class="cm-artist-container">
        <ul class="cm-artist-list" @scroll="scrollToLoad">
            <li v-for="(item,index) in data" :key="index" @click="clickToSelect(item)" ripple="">
                <img :src="item.picUrl" alt="" draggable="false">
                <span>{{item.name}}</span>
            </li>
        </ul>
        <NoData v-show="data.length===0&&!loading"></NoData>
        <loading v-show="loading"></loading>
    </div>
</template>

<script>
    export default {
        name: "ArtistList",
        props:{
            data:Array,
            type:String,
            loading:Boolean
        },
        methods:{
            clickToSelect(item){
                localStorage.tempData=JSON.stringify(item);
                this.$router.push({
                    path:'/artist-detail/'+item.id
                });
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
    .cm-artist-container{
        width: 100%;
        height: 100%;
        position: relative;
    }
    .cm-artist-list{
        width: 100%;
        height: 100%;
        overflow: auto;
    }
    .cm-artist-list li{
        width: 100%;
        height: 60px;
        display: flex;
        align-items: center;
        padding: 0 10px;
        cursor: pointer;
        font-size: 14px;
    }
    .cm-artist-list li:nth-child(odd){
        background: #f9f9f9;
    }
    .cm-artist-list li img{
        width: 40px;
        height: 40px;
    }
    .cm-artist-list li span{
        margin-left: 10px;
    }
</style>
