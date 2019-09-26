<template>
    <ul :class="'cm-tab-bar '+align">
        <li v-for="(item,index) in data" @click="select(item,index,true)">
            <span :class="item.active">{{item.name}}</span>
        </li>
        <slot></slot>
    </ul>
</template>

<script>
    export default {
        name: "TabBar",
        props:{
            data:Array,
            align:{
                type:String,
                default:function () {
                    return 'center'
                }
            }
        },
        methods:{
            select(click,index){
                this.data.forEach((item)=>{
                    item.active='';
                });
                click.active='active';
                this.$set(this.data,index,click);
                this.$emit('select',click,index)
            }
        }
    }
</script>

<style scoped>
    .cm-tab-bar{
        width: 100%;
        border-bottom: 2px solid #eee;
        overflow: unset;
    }
    .center{
        display: flex;
        justify-content: center;
    }
    .left{
        display: flex;
    }
    .cm-tab-bar li{
        width: 80px;
        font-size: 14px;
        height: 35px;
        line-height: 35px;
        text-align: center;
        cursor: pointer;
        position: relative;
        overflow: unset;
    }
    .cm-tab-bar li span{
        padding-bottom: 6px;
        border-bottom:4px solid rgba(0,0,0,0)
    }
    .cm-tab-bar li .active{
        color: #e56464;
        border-bottom: 4px solid #e56464;
    }
    .cm-tab-bar li:hover{
        color: #e56464;
    }
</style>
