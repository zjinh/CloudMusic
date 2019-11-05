<template>
    <div class="cm-page-main" id="cm-user-detail" @scroll="loadMore">
        <DetailPageHead :data="userData" type="user">
            <div class="cm-user-content">
                <ul class="cm-user-detail">
                    <li>
                        <span>动态</span>
                        <p>{{userData.eventCount||0}}</p>
                    </li>
                    <li>
                        <span>关注数</span>
                        <p>{{userData.follows||0}}</p>
                    </li>
                    <li>
                        <span>粉丝</span>
                        <p>{{userData.followeds||0}}</p>
                    </li>
                    <li>
                        <span>歌单</span>
                        <p>{{userData.playlistCount||0}}</p>
                    </li>
                </ul>
                <ButtonArea>
                    <button @click="subscribe" :class="userData.followed?'sf-icon-heart':'sf-icon-heart-o'">{{userData.followed?' 已':" "}}关注</button>
                </ButtonArea>
            </div>
            <div class="cm-user-content">
                <p class="signature">个人介绍：{{userData.signature||'暂无介绍'}}</p>
            </div>
        </DetailPageHead>
        <TabBar :data="userDataType" align="left" @select="tabBarChange"></TabBar>
        <div class="cm-user-detail-main">
            <PlayList v-show="nowType.type==='playList'" :data="userDetail.playList" :loading="loading"></PlayList>
            <UserList v-show="nowType.type==='follows'" :data="userDetail.follows" :loading="loading" @callback="init"></UserList>
            <UserList v-show="nowType.type==='followeds'" :data="userDetail.followeds" :loading="loading" @callback="init"></UserList>
            <RadioList v-show="nowType.type==='audio'" :data="userDetail.audio" :loading="loading"></RadioList>
        </div>
        <BackToTop></BackToTop>
    </div>
</template>

<script>
    import PlayList from "../MusicCom/ListCom/PlayList";
    import UserList from "../MusicCom/ListCom/UserList";
    import RadioItem from "../MusicCom/ListCom/RadioItem";
    import RadioList from "../MusicCom/ListCom/RadioList";
    export default {
        name: "UserDetail",
        components:{
            RadioList,
            RadioItem,UserList,PlayList
        },
        data(){
            return{
                userId:'',
                userData:{},
                userDataType:[
                    {
                        name:"歌单",
                        type:"playList",
                        value:'playlist',
                        active:'active'
                    },
                    {
                        name:"关注",
                        type:"follows",
                        value:'follow',
                        active:''
                    },
                    {
                        name:"粉丝",
                        type:"followeds",
                        value:'followeds',
                        active:''
                    },
                    {
                        name:"创建的电台",
                        type:"audio",
                        value:'djRadios',
                        active:''
                    },
                ],
                userDetail:{
                    playList:[],
                    follows:[],
                    audio:[],
                },
                userDetailParams:{
                    playList:{
                        page:0,
                        hasMore:0
                    }
                },
                nowType:{
                    type:"playList",
                    value:'playlist',
                },
                subscribed:false,
                loading:false
            }
        },
        created(){
            this.userDataType.forEach((item)=>{
                this.userDetail[item.type]=[];
                this.userDetailParams[item.type]={page:0,hasMore:0}
            })
        },
        activated() {
            this.init();
        },
        methods:{
            init(){
                this.loading=true;
                this.userId=this.$route.params.id;
                if(this.$route.query.data) {
                    this.userData = JSON.parse(this.$route.query.data);
                }
                document.getElementById('cm-user-detail').scrollTo({
                    top:0,
                    behavior: "smooth"
                });
                for(let i in this.userDetail){
                    this.userDetail[i]=[];
                }
                if(this.$route.params.id) {
                    this.getUserData(0);
                    if(this.userData.eventCount===undefined){
                        this.getUserDetail();
                    }
                }
                if(!this.userData.djStatus){
                    this.userDataType.splice(this.userDataType.length-1,1)
                }
            },
            subscribe(){
                this.$Api.User.follow({
                    id:this.$route.params.id,
                    t:this.userData.followed?2:1
                },(rs)=>{
                    if(rs.code===200){
                        if(this.userData.followed){
                            this.userData.followeds--
                        }else{
                            this.userData.followeds++
                        }
                        this.userData.followed=!this.userData.followed;
                    }else{
                        this.$Message.info(rs.message)
                    }
                },()=>{
                    this.$Message.error('出现错误，请稍后重试')
                })
            },
            getUserDetail(){
                this.$Api.User.detail(this.userData.userId,(rs)=>{
                    for(let i in rs.profile){
                        this.$nextTick(()=>{
                            this.userData[i]=rs.profile[i]
                        });
                        this.$set(this.userData,i,rs.profile[i])
                    }
                })
            },
            getUserData(page){
                let type=this.nowType.type;
                this.loading=(page===0);
                let key=this.nowType.value;
                this.$Api.User[type](this.$route.params.id,page,(rs)=>{
                    this.loading=false;
                    this.userDetailParams[type].page=page;//记录页数
                    this.userDetailParams[type].hasMore=rs.hasMore||rs.more;//是否全部加载完
                    let data=rs[key]||[];
                    if(page===0){
                        this.userDetail[type]=data;
                    }else{
                        this.userDetail[type] = [...this.userDetail[type],...data];
                    }
                })
            },
            tabBarChange(item){
                this.nowType=item;
                if(this.userDetail[item.type].length===0){
                    this.getUserData(0)
                }
            },
            loadMore(e){
                let type=this.nowType.type;
                this.$scrollEnd(e,()=>{
                    if(this.userDetailParams[type].hasMore) {
                        this.userDetailParams[type].page++;
                        this.getUserData(this.userDetailParams[type].page)
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .cm-user-detail-main{
        width: 100%;
    }
    .cm-user-content{
        float: left;
        width: 50%;
        height: 100%;
        position: relative;
        overflow: auto;
    }
    .cm-user-content .cm-button-area{
        position: absolute;
        bottom: 0;
    }
    .cm-user-content .signature{
        font-size: 13px;
        line-height: 1.5;
        text-indent: -66px;
        padding-left: 69px;
    }
    .cm-user-detail{
        width: 100%;
    }
    .cm-user-detail li{
        float: left;
        width: 33.333%;
        font-size: 14px;
    }
    .cm-user-detail li p{
        color: #333333;
        font-size: 20px;
    }
    .user-desp{
        width: 100%;
        min-height: 30px;
        line-height: 30px;
        font-size: 14px;
        color: #333;
    }
    .user-desp span{
        width: 100px;
        border: 1px solid #f30;
        color: #f30;
        padding: 3px;
        font-size: 12px;
        margin-right: 10px;
    }
    .user-control{
        position: absolute;
        bottom: 0;
    }
    .cm-user-description{
        font-size: 14px;
        padding: 10px;
        line-height: 35px;
    }
</style>
