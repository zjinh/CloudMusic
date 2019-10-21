<template>
    <div class="cm-page-main" @scroll="loadMore">
        <DetailPageHead :data="radioData" type="radio">
            <div class="cm-radio-content">
                <p class="radio-desp">电台主播: {{radioData.dj.nickname}}</p>
                <p class="radio-desp">节&nbsp&nbsp目&nbsp数: {{radioData.programCount}}</p>
                <ButtonArea class="radio-control">
                    <button @click="subscribe" :class="subscribed?'sf-icon-star':'sf-icon-star-o'">{{subscribed?' 已':" "}}订阅({{$numberCount(radioData.subCount)}})</button>
                </ButtonArea>
            </div>
            <div class="cm-radio-content">
                <p class="radio-desp"><span>{{radioData.category}}</span>{{radioData.desc}}</p>
            </div>
        </DetailPageHead>
        <TabBar :data="playlistDataType" align="left" @select="tabBarChange"></TabBar>
        <div class="cm-radio-detail-main">
            <RadioItem v-show="nowType.type==='programs'" :data="radioDetail.programs" :loading="loading"></RadioItem>
        </div>
        <BackToTop></BackToTop>
    </div>
</template>

<script>
    import UserList from "../MusicCom/ListCom/UserList";
    import RadioItem from "../MusicCom/ListCom/RadioItem";
    export default {
        name: "RadioDetail",
        components:{
            RadioItem,UserList
        },
        data(){
            return{
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
            this.playlistDataType.forEach((item)=>{
                this.radioDetail[item.type]=[];
                this.radioDetailParams[item.type]={page:0,hasMore:0}
            })
        },
        activated() {
            this.init();
        },
        methods:{
            init(){
                this.loading=true;
                if(this.$route.query.data) {
                    this.radioData = JSON.parse(this.$route.query.data);
                }
                for(let i in this.radioDetail){
                    this.radioDetail[i]=[];
                }
                if(this.$route.params.id) {
                    this.getPlaylistData(1);
                    this.getSubRadio();
                }
            },
            subscribe(){
                this.$Api.Music.subscribe.radio({
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
            getSubRadio(){
                this.$Api.Music.sublist.radio(0,(rs)=>{
                    this.subscribed=rs.djRadios.filter((item)=>{
                        return item.id===parseInt(this.$route.params.id);
                    })[0];
                })
            },
            getPlaylistData(page){
                let type=this.nowType.type;
                this.loading=(page===0);
                let key=this.nowType.value;
                this.$Api.Music.radio[type](this.$route.params.id,page,(rs)=>{
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
    .cm-radio-detail-main{
        width: 100%;
    }
    .cm-radio-content{
        float: left;
        width: 50%;
        height: 100%;
        position: relative;
    }
    .radio-desp{
        width: 100%;
        min-height: 30px;
        line-height: 30px;
        font-size: 14px;
        color: #333;
    }
    .radio-desp span{
        width: 100px;
        border: 1px solid #f30;
        color: #f30;
        padding: 3px;
        font-size: 12px;
        margin-right: 10px;
    }
    .radio-control{
        position: absolute;
        bottom: 0;
    }
    .cm-radio-description{
        font-size: 14px;
        padding: 10px;
        line-height: 35px;
    }
</style>
