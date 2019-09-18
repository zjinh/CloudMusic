<template>
    <div class="cm-page-head">
        <span class="title">{{title}}</span>
        <span class="dots">·</span>
        <span class="number">{{count}}</span>
        <span class="prefix">{{prefix}}</span>
        <div class="slot">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PageHeader",
        props:{
            title:String,
            count:Number,
            prefix:String
        }
    }
</script>

<style scoped>
    .cm-page-head{
        width: 100%;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        border-bottom: 1px solid #ccc;
    }
    .cm-page-head *{
        display: inline-block;
    }
    .cm-page-head .title{
        font-size: 15px;
        color: #e56464;
        font-weight: bold;
    }
    .cm-page-head .dots{
        color: #e56464;
        font-size: 40px
    }
    .cm-page-head .number{
        color: #255557;
        line-height: 25px;
    }
    .cm-page-head .prefix{
        color: #3d4f4f;
        line-height: 25px;
    }
    .cm-page-head .slot{
        float: right;
    }
</style>
