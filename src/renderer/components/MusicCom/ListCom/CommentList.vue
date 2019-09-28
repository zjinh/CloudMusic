<template>
    <div class="cm-comment-container" id="comment">
        <div class="cm-comment-send-container">
            <div class="container">
                <textarea v-model="commentContent"></textarea>
                <div class="control">
                    <div class="tips" v-if="commentType.user">
                        回复：{{commentType.user.nickname}}
                        <span class="sf-icon-times" @click="commentType=false"></span>
                    </div>
                    <button @click="sendComment">评论</button>
                </div>
            </div>
        </div>
        <p class="cm-comment-title">精彩评论</p>
        <ul class="cm-comment-list" @scroll="scrollToLoad">
            <li v-for="(item,index) in data" :key="index" class="cm-comment-line">
                <img :src="item.user.avatarUrl" alt="" draggable="false">
                <div class="main">
                    <div class="content">
                        <span class="user" @click="clickToUser(item)">{{item.user.nickname}}:</span>
                        <span>{{item.content}}</span>
                        <p class="content reply" v-if="item.parent">
                            <span class="user" @click="clickToUser(item)">@{{item.parent.user.nickname}}:</span>
                            <span>{{item.parent.content}}</span>
                        </p>
                    </div>
                    <div class="control">
                        <span class="time">{{item.time}}</span>
                        <div class="comment-control">
                            <button v-if="userId!==item.user.userId" @click="thumbsUp(item,index)" class="sf-icon-thumbs-up" :style="{color:item.liked?'#e56464':''}"> ({{item.likedCount}})</button>
                            <button v-if="userId===item.user.userId" @click="deleteComment(item,index)">删除</button>
                            <button v-else @click="replyComment(item,index)">回复</button>
                        </div>
                    </div>
                </div>
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
            loading:Boolean,
        },
        data(){
            return{
                userId:this.$Api.User.UserId,
                resourceType:{
                    song:0,
                    mv:1,
                    playlist:2,
                    album:3,
                    radio:4,
                    video:5
                },
                commentType:false,
                commentContent:""
            }
        },
        methods:{
            clickToUser(item){
                this.$router.push({
                    path:'/user-detail/'+item.user.userId,
                    query:{
                        data:JSON.stringify(item.user)
                    }
                });
            },
            scrollToLoad(e){
                this.$scrollEnd(e,()=>{
                    this.$emit('scroll-end')
                })
            },
            thumbsUp(item,index){
                this.$Api.Music.comment.like({
                    id:this.$route.params.id,
                    cid:item.commentId,
                    t:item.liked?0:1,
                    type:this.resourceType[this.type]
                },(rs)=>{
                    if(rs.code===200){
                        if(item.liked){
                            item.likedCount--
                        }else{
                            item.likedCount++
                        }
                        item.liked=!item.liked;
                        this.$set(this.data,index,item)
                    }
                },()=>{
                    this.$Message.error('出现错误，请稍后重试')
                })
            },
            replyComment(item,index){
                let ele=document.getElementById('comment');
                ele.parentNode.parentNode.scrollTo({
                    top:ele.getBoundingClientRect().x,
                    behavior: "smooth"
                });
                this.commentType=item;
            },
            sendComment(){
                if(this.commentContent.length===0){
                    return this.$Message.warning('评论内容不能为空')
                }
                this.$Api.Music.comment.control({
                    id:this.$route.params.id,
                    t:this.commentType?2:1,//回复还是发送
                    content:this.commentContent,
                    commentId:this.commentType.commentId,
                    type:this.resourceType[this.type]
                },(rs)=>{
                    if(rs.code===200){
                        this.commentContent='';
                        this.$Message.success('评论发布成功');
                        this.data.push(rs.comment)
                    }
                },()=>{
                    this.$Message.error('评论发布失败');
                })
            },
            deleteComment(item,index){
                this.$Api.Music.comment.control({
                    id:this.$route.params.id,
                    t:0,//删除
                    commentId:item.commentId,
                    type:this.resourceType[this.type]
                },(rs)=>{
                    if(rs.code===200){
                        this.$Message.success('评论删除成功');
                        this.data.splice(index,1)
                    }
                },()=>{
                    this.$Message.error('评论删除失败');
                })
            }
        }
    }
</script>

<style scoped>
    .cm-comment-container{
        width: 100%;
        height: 100%;
        position: relative;
    }
    .cm-comment-send-container{
        width: 96%;
        height: 185px;
        margin-top: 20px;
        padding: 15px 20px;
        background: #f3f3f3;
        margin: 20px auto;
    }

    .cm-comment-send-container .container textarea{
        width: 100%;
        height: 120px;
        border: 1px solid #eee;
        padding: 10px;
        color: #8a8a8a;
        resize: none;
    }
    .cm-comment-send-container .control .tips{
        float: left;
        line-height: 28px;
        font-size: 12px;
    }
    .cm-comment-send-container .control .tips span{
        color: #e56464;
        line-height: 9px;
        margin-left: 10px;
        cursor: pointer;
    }
    .cm-comment-send-container .control button{
        float: right;
        padding: 5px 10px;
        background: #fff;
        border: 1px solid #eee;
        border-radius: 3px;
        font-size: 12px;
    }
    .cm-comment-title{
        width: 100%;
        line-height: 35px;
        font-size: 14px;
        border-bottom: 1px solid #eee;
        text-indent: 10px;
    }
    .cm-comment-list{
        width: 100%;
        height: 100%;
        min-height: 330px;
        margin-top: 10px;
        overflow: auto;
    }
    .cm-comment-list li{
        width: 100%;
        padding:10px;
        font-size: 14px;
        border-bottom: 1px solid #eee;
    }
    .cm-comment-line img{
        float: left;
        width: 40px;
        height: 40px;
        border-radius: 100%;
    }
    .cm-comment-line .main{
        float: left;
        width: calc(100% - 40px);
        padding-left: 10px;
        font-size: 12px;
    }
    .cm-comment-line .main .content{
        min-height: 35px;
        padding-top: 5px;
        padding-right: 100px;
    }
    .cm-comment-line .main .content .reply{
        background: #eee;
        padding: 3px;
        min-height: 20px;
        margin: 5px 0;
    }
    .cm-comment-line .main .control{
        display: flex;
        justify-content: space-between;
    }
    .cm-comment-line .main .time{
        color: #b9b9b9;
    }
    .cm-comment-line .main .user{
        color: #e56464;
        cursor: pointer;
    }
    .cm-comment-line .main button{
        background: none;
        margin-left: 10px;
        color: #b9b9b9;
    }
    .cm-comment-line .main button:hover{
        color: #333;
    }
</style>
