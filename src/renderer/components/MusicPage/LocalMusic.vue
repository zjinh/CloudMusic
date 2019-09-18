<template>
    <div class="cm-page-main">
        <PageHeader title="本地音乐" :count="localMusic.length" prefix="歌曲"></PageHeader>
        <PlayList :data="localMusic" type="local" @callback="playMusic"></PlayList>
    </div>
</template>

<script>
    const fs = require('fs');
    const async = require('async');
    export default {
        name: "LocalMusic",
        data(){
            return{
                localMusic:[]
            }
        },
        mounted(){
            this.scanLocalMusic()
        },
        methods:{
            playMusic(music,playlist){
                this.$emit('play',music,playlist)
            },
            scanLocalMusic(){
                // 使用 fs.readdir 来获取文件列表
                const folderPath = "E:\\音乐";
                fs.readdir(folderPath, (err, files) => {
                    if (err) {
                        console.log('对不起，您没有加载您的home folder');
                    }
                    this.inspectAndDescribeFiles(folderPath, files, this.displayFiles);
                });
            },
            displayFiles(err, files) {
                // 该函数的作用是显示文件列表信息
                if (err) {
                    return alert('sorry, we could not display your files');
                }
                let count=0;
                files.forEach((file) => {
                    this.$getMusicInfo(file.url,(data)=>{
                        count++;
                        for(let i in data){
                            file[i]=data[i]
                        }
                        if(count===files.length) {
                            this.localMusic = files;
                        }
                    });
                });
            },
            inspectAndDescribeFiles(folderPath, files, cb) {
                // 使用 async 模块调用异步函数并收集结果
                async.map(files, (file, asyncCB) => {
                    const resolveFilePath = this.$path.resolve(folderPath, file);
                    this.inspectAndDescribeFile(resolveFilePath, asyncCB);
                }, cb);
            },
            inspectAndDescribeFile(filePath, cb) {
                let result = {
                    url: filePath,
                    size:0,
                };
                fs.stat(filePath, (err, stat) => {
                    if (err) {
                        cb(err);
                    } else {
                        result.size=stat.size;
                        cb(err, result);
                    }
                });
            }
        },
    }
</script>

<style scoped>

</style>
