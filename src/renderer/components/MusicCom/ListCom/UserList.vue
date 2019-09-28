<template>
    <div class="cm-user-list-container">
        <div class="cm-user-list-list" @scroll="scrollToLoad">
            <div v-for="(item,index) in data" :key="index" @click="clickToSelect(item)" class="user-block" ripple="">
                <img :src="item.avatarUrl" alt="" draggable="false">
                <p>{{item.nickname}}</p>
            </div>
        </div>
        <NoData v-show="data.length===0&&!loading"></NoData>
        <loading v-show="loading"></loading>
    </div>
</template>

<script>
    export default {
        name: "UserList",
        props:{
            data:Array,
            type:String,
            loading:Boolean
        },
        methods:{
            clickToSelect(item){
                this.$router.push({
                    path:'/user-detail/'+item.userId,
                    query:{
                        data:JSON.stringify(item)
                    }
                });
            },
            scrollToLoad(e){
                this.$scrollEnd(e,()=>{
                    this.$emit('scroll-end')
                })
            },
        }
    }
</script>

<style scoped>
    .cm-user-list-container{
        width: 100%;
        height: 100%;
        position: relative;
    }
    .cm-user-list-list{
        width: 100%;
        height: 100%;
        min-height: 330px;
        overflow: auto;
    }
    .user-block{
        float: left;
        width: 137px;
        height: 140px;
        cursor: pointer;
        margin: 5px 10px;
        position: relative;
        text-align: center;
    }
    .user-block img{
        margin-top: 10px;
        width: 80px;
        height: 80px;
        border: 1px solid #eee;
        border-radius: 100%;
    }
    .user-block p{
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        font-size: 12px;
        color: #333;
        word-break: break-all;
    }
    .user-block:hover img{
        box-shadow: 0 0 12px 0 #e56464;
    }
</style>
