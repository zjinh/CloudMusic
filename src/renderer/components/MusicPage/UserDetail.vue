<template>
    <div class="cm-page-main" @scroll="loadMore">
        <DetailPageHead :data="radioData" type="user">
            <div class="cm-user-content">
                <ul class="cm-user-detail">
                    <li>
                        <span>动态</span>
                        <p>{{radioData.eventCount}}</p>
                    </li>
                    <li>
                        <span>关注数</span>
                        <p>{{radioData.follows}}</p>
                    </li>
                    <li>
                        <span>粉丝</span>
                        <p>{{radioData.followeds}}</p>
                    </li>

                </ul>
            </div>
            <div class="cm-user-content">

            </div>
        </DetailPageHead>
        <TabBar :data="playlistDataType" align="left" @select="tabBarChange"></TabBar>
        <div class="cm-user-detail-main">
            <RadioItem v-show="nowType.type==='programs'" :data="radioDetail.programs" :loading="loading" @callback="playMusic"></RadioItem>
        </div>
        <BackToTop></BackToTop>
    </div>
</template>

<script>
    import UserList from "../MusicCom/ListCom/UserList";
    import RadioItem from "../MusicCom/ListCom/RadioItem";
    export default {
        name: "UserDetail",
        inject:['playMusic'],
        components:{
            RadioItem,UserList
        },
        data(){
            return{
                userId:'',
                radioData:{
                    dj:{}
                },
                playlistDataType:[
                    {
                        name:"节目",
                        type:"programs",
                        value:'programs',
                        active:'active'
                    },
                ],
                radioDetail:{
                    programs:[],
                    subscribers:[]
                },
                radioDetailParams:{
                    programs:{
                        page:0,
                        hasMore:0
                    }
                },
                nowType:{
                    type:"programs",
                    value:'programs',
                },
                subscribed:false,
                loading:false
            }
        },
        created(){
            /*this.playlistDataType.forEach((item)=>{
                this.radioDetail[item.type]=[];
                this.radioDetailParams[item.type]={page:0,hasMore:0}
            })*/
        },
        activated() {
            this.init();
        },
        methods:{
            init(){
                this.userId=this.$route.params.id;
                if(this.$route.query.data) {
                    this.radioData = JSON.parse(this.$route.query.data);
                    console.log(this.radioData)
                }
                for(let i in this.radioDetail){
                    this.radioDetail[i]=[];
                }
                if(this.$route.params.id) {
                    // this.getPlaylistData(1);
                    this.getUserDetail();
                }
            },
            subscribe(){
                this.$Api.Music.user.subscribe({
                    rid:this.$route.params.id,
                    t:this.subscribed?2:1
                },(rs)=>{
                    if(rs.code===200){
                        if(this.subscribed){
                            this.radioData.subCount--
                        }else{
                            this.radioData.subCount++
                        }
                        this.subscribed=!this.subscribed;
                    }
                },()=>{
                    this.$Message.error('出现错误，请稍后重试')
                })
            },
            getUserDetail(){
                this.$Api.User.detail(this.userId,(rs)=>{
                    this.radioData=rs.profile;
                })
            },
            getPlaylistData(page){
                let type=this.nowType.type;
                this.loading=(page===0);
                let key=this.nowType.value;
                this.$Api.Music.user[type](this.$route.params.id,page,(rs)=>{
                    this.loading=false;
                    this.radioDetailParams[type].page=page;//记录页数
                    this.radioDetailParams[type].hasMore=rs.hasMore||rs.more;//是否全部加载完
                    let data=rs[key]||[];
                    if(page===0){
                        this.radioDetail[type]=data;
                    }else{
                        this.radioDetail[type] = [...this.radioDetail[type],...data];
                    }
                })
            },
            tabBarChange(item){
                this.nowType=item;
                if(this.radioDetail[item.type].length===0){
                    this.getPlaylistData(0)
                }
            },
            loadMore(e){
                let type=this.nowType.type;
                this.$scrollEnd(e,()=>{
                    if(this.radioDetailParams[type].hasMore) {
                        this.radioDetailParams[type].page++;
                        this.getPlaylistData(this.radioDetailParams[type].page)
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
