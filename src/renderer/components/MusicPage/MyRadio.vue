<template>
    <div class="cm-page-main">
        <PageHeader title="我订阅的电台" :count="radioCount" prefix="个电台"></PageHeader>
        <div class="cm-radio-list">
            <RadioList :data="radioListData" :loading="loading" @scroll-end="loadMore"></RadioList>
        </div>
    </div>
</template>

<script>
    import RadioList from "../MusicCom/ListCom/RadioList";
    export default {
        name: "MyRadio",
        components:{
            RadioList
        },
        data(){
            return{
                radioCount:0,
                radioListData:[],
                hasMore:false,
                loading:true,
            }
        },
        activated(){
            this.getSubRadio()
        },
        methods:{
            getSubRadio(){
                this.$Api.Music.radio.sublist((rs)=>{
                    this.radioListData=rs.djRadios;
                    this.radioCount=rs.count;
                    this.hasMore=rs.hasMore;
                    this.loading=false;
                })
            },
            loadMore(){

            }
        }
    }
</script>

<style scoped>
    .cm-radio-list{
        width: 100%;
    }
</style>
