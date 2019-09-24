<template>
    <div class="cm-loading cm-loading-wave">
        <div class="sk-rect1"></div>
        <div class="sk-rect2"></div>
        <div class="sk-rect3"></div>
        <div class="sk-rect4"></div>
        <div class="sk-rect5"></div>
    </div>
</template>

<script>
    export default {
        name: "loading"
    }
</script>

<style scoped>
    .cm-loading{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    }
    .cm-loading-wave.cm-loading {
        width: 50px;
        height: 30px;
        text-align: center;
        font-size: 10px;
        margin:auto;
    }

    .cm-loading-wave div {
        background: #e56464;
        height: 100%;
        width: 6px;
        display: inline-block;
        -webkit-animation: sk-waveStretchDelay 1.2s infinite ease-in-out;
        animation: sk-waveStretchDelay 1.2s infinite ease-in-out;
    }

    .cm-loading-wave .sk-rect2 {
        -webkit-animation-delay: -1.1s;
        animation-delay: -1.1s;
    }

    .cm-loading-wave .sk-rect3 {
        -webkit-animation-delay: -1s;
        animation-delay: -1s;
    }

    .cm-loading-wave .sk-rect4 {
        -webkit-animation-delay: -0.9s;
        animation-delay: -0.9s;
    }

    .cm-loading-wave .sk-rect5 {
        -webkit-animation-delay: -0.8s;
        animation-delay: -0.8s;
    }

    @-webkit-keyframes sk-waveStretchDelay {
        0%, 40%, 100% {
            -webkit-transform: scaleY(0.4);
            transform: scaleY(0.4);
        }

        20% {
            -webkit-transform: scaleY(1);
            transform: scaleY(1);
        }
    }

    @keyframes sk-waveStretchDelay {
        0%, 40%, 100% {
            -webkit-transform: scaleY(0.4);
            transform: scaleY(0.4);
        }

        20% {
            -webkit-transform: scaleY(1);
            transform: scaleY(1);
        }
    }
</style>
