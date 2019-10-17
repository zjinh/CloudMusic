<template>
    <div class="cm-page-main">
        <TabBar :data="searchType" @select="tabBarSelect"></TabBar>
    </div>
</template>

<script>
    export default {
        name: "MyRadio",
        data(){
            return{
                searchType:[
                    {
                        name:"专辑",
                        type:"albums",
                        value:10,
                        active:'active'
                    },
                    {
                        name:"歌手",
                        type:"artists",
                        value:100,
                        active:''
                    },
                    {
                        name:"歌单",
                        type:"playlists",
                        value:1000,
                        active:''
                    },
                    {
                        name:"视频",
                        type:"videos",
                        value:1014,
                        active:''
                    },
                ],
            }
        },
        methods:{
            tabBarSelect(){

            }
        }
    }
</script>

<style scoped>

</style>
