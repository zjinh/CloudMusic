<template>
    <span class="cm-count-tag">
        <slot></slot>
    </span>
</template>

<script>
    export default {
        name: "CountTag"
    }
</script>

<style scoped>
    .cm-count-tag{
        position: absolute;
        right: 1px;
        bottom: 55px;
        color: #fff;
        font-size: 12px;
        background: rgba(0,0,0,.5);
        padding: 0 5px;
        line-height: 20px;
    }
</style>
