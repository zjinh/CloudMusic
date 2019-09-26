<template>
    <div class="cm-page-main">
        <PageHeader title="本地音乐" :count="localMusic.length" prefix="歌曲">
            <button @click="changeDir" class="cm-dir-button">选择目录</button>
        </PageHeader>
        <div class="cm-local-list">
            <SongList :data="localMusic" type="local" :loading="loading" @callback="playMusic"></SongList>
        </div>
    </div>
</template>

<script>
    const fs = require('fs');
    const async = require('async');
    export default {
        name: "LocalMusic",
        inject:['playMusic'],
        data(){
            return{
                localDir:"",
                loading:true,
                localMusic:[]
            }
        },
        created(){
            this.$Api.LocalFile.read('local-music',(data)=>{
                if(data.length){
                    this.localMusic=data;
                    this.loading=false;
                }else{
                    if(localStorage.localDir!==undefined){
                        this.localDir=localStorage.localDir;
                        this.scanLocalMusic();
                    }else{
                        this.$Message.info('请选择本地音乐目录');
                        this.changeDir();
                    }
                }
            });
        },
        methods:{
            scanLocalMusic(){
                // 使用 fs.readdir 来获取文件列表
                const folderPath = this.localDir;
                fs.readdir(folderPath, (err, files) => {
                    if (err) {
                        console.log('对不起，您没有加载您的home folder');
                    }
                    files.forEach((item,index)=>{
                        const resolveFilePath = this.$path.resolve(folderPath, item);
                        if(fs.lstatSync(resolveFilePath).isDirectory()||item.Before('.').Exist('ape')){
                            files.splice(index,1)
                        }
                    });
                     async.map(files, (file, asyncCB) => {
                         const resolveFilePath = this.$path.resolve(folderPath, file);
                        this.inspectAndDescribeFile(resolveFilePath, asyncCB);
                    },this.displayFiles);
                    localStorage.localDir=this.localDir;
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
                            this.$Api.LocalFile.write('local-music',files);
                            this.loading=false;
                        }
                    });
                });
            },
            inspectAndDescribeFile(filePath, cb) {
                fs.stat(filePath, (err, stat) => {
                    if (err) {
                        cb(err);
                    } else {
                        cb(err, {
                            url: filePath,
                            size:stat.size,
                        });
                    }
                });
            },
            changeDir(){
                this.$electron.remote.dialog.showOpenDialog({
                    //默认路径
                    defaultPath :'../Desktop',
                    //选择操作，此处是打开文件夹
                    properties: [
                        'openDirectory',
                    ],
                    filters: [
                        { name: 'All', extensions: ['*'] },
                    ]
                },(res)=>{
                    res=res[0]||process.env.USERPROFILE;
                    //回调函数内容，此处是将路径内容显示在input框内
                    this.localDir=res;
                    this.scanLocalMusic()
                })
            }
        },
    }
</script>

<style scoped>
    .cm-dir-button{
        color: #e56464;
        background: none ;
    }
    .cm-local-list{
        width: 100%;
        height: calc(100% - 30px);
    }
</style>
