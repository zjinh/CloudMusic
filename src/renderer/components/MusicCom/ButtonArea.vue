<template>
    <div class="cm-button-area">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "ButtonArea"
    }
</script>

<style scoped>
    .cm-button-area button{
        padding:10px;
        background: #fff;
        border: 1px solid #eee;
        color: #999999;
        font-size: 14px;
        margin-right: 5px;
        border-radius: 3px;
    }
    .cm-button-area button:hover{
        background: #e56464;
        color: #fff;
    }
</style>
