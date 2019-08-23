<template>
    <div class="cm-page-main">
        <PageHeader title="本地音乐" :count="10" prefix="歌曲"></PageHeader>
    </div>
</template>

<script>
    const fs = require('fs');
    const async = require('async');
    export default {
        name: "LocalMusic",
        mounted(){
            this.scanLocalMusic()
        },
        methods:{
            scanLocalMusic(){
                // 使用 fs.readdir 来获取文件列表
                const folderPath = "E:\\音乐";
                fs.readdir(folderPath, (err, files) => {
                    if (err) {
                        console.log('对不起，您没有加载您的home folder');
                    }
                    /*
                    files.forEach((file) => {
                      console.log(`${folderPath}/${file}`);
                    });
                    */
                    this.inspectAndDescribeFiles(folderPath, files, this.displayFiles);
                });
            },
            displayFiles(err, files) {
                // 该函数的作用是显示文件列表信息
                if (err) {
                    return alert('sorry, we could not display your files');
                }
                files.forEach((file) => {
                    console.log(file);
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
                    file: this.$path.basename(filePath),
                    path: filePath,
                    size:0,
                    type: ''
                };
                fs.stat(filePath, (err, stat) => {
                    if (err) {
                        cb(err);
                    } else {
                        result.size=stat.size;
                        result.type = stat.isDirectory()?'directory':stat.isFile()?'file':'unknow';
                        cb(err, result);
                    }
                });
            }
        },
    }
</script>

<style scoped>

</style>
