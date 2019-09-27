<template>
    <button :id="id" :class="'cm-back-to-top animated sf-icon-arrow-alt-to-top '+(animate)" @click="goTop"></button>
</template>

<script>
    export default {
        name: "BackToTop",
        data(){
            return{
                id:'back-to-top'+this.$randomRange(1,1000),
                animate:'slideOutRight'
            }
        },
        mounted(){
            document.getElementById(this.id).parentNode.onscroll=(e)=>{
                this.animate=(e.target.scrollTop>300)?'slideInRight':'slideOutRight';
            }
        },
        methods:{
            goTop(){
                document.getElementById(this.id).parentNode.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        }
    }
</script>

<style scoped>
    .cm-back-to-top{
        width: 45px;
        height: 45px;
        position: fixed;
        right: 30px;
        bottom: 80px;
        background: #e56464;
        color: #fff;
        text-align: center;
        font-size: 20px;
        line-height: 45px;
        border-radius: 100px;
        cursor: pointer;
    }
</style>
