<template>
    <button :class="music.like?'sf-icon-heart':'sf-icon-heart-o'" @click.stop="likeMusic(music,index)" v-if="music.type!=='local'"></button>
</template>

<script>
    export default {
        name: "LikeMusic",
        props:{
            music:Object,
            index:Number,
        },
        methods:{
            likeMusic(item){
                this.$Api.Music.song.like({
                    id:item.id,
                    like:!item.like
                },(rs)=>{
                    if(rs.code===200){
                        this.$Message.success(item.like?'已取消喜欢歌曲':'已添加至喜欢');
                        item.like=!item.like;
                        this.$emit('like',this.music,this.index);
                    }
                })
            },
        }
    }
</script>

<style scoped>

</style>
