<template>
    <section class="cm-main-background-container" :style="{'background-image':'url('+url+')'}">
        <div class="cm-main-filter"></div>
        <div class="cm-main-background" :style="{'background-image':'url('+url+')'}"></div>
    </section>
</template>

<script>
    export default {
        name: "BlurBackground",
        props:{
            url:{
                type:String,
                default:()=>{
                    return this.$defaultAlbum
                }
            }
        }
    }
</script>

<style scoped>
    .cm-main-background-container{
        width: 100%;
        height: 60px;
        left: 0;
        bottom: 0;
        position: absolute;
        z-index: 0;
        background-repeat: no-repeat!important;
        background-size: cover!important;
        overflow:hidden;
        -webkit-transition: background 0.4s ease-in-out;
        -moz-transition: background 0.4s ease-in-out;
        -o-transition: background 0.4s ease-in-out;
        transition: background 0.4s ease-in-out;
    }
    .cm-main-filter{
        width: 100%;
        height: 100%;
        background: #828282;
        opacity: .5;
    }
    .cm-main-background{
        position:absolute;
        width: 200%;
        height: 200%;
        top:-50%;
        left:-50%;
        z-index:-1;
        background-repeat: no-repeat!important;
        background-size: cover!important;
        background-position: 50%!important;
        -webkit-filter: blur(15px);
        filter: blur(15px);
        -webkit-transition: background 0.4s ease-in-out;
        -moz-transition: background 0.4s ease-in-out;
        -o-transition: background 0.4s ease-in-out;
        transition: background 0.4s ease-in-out;
    }
</style>
