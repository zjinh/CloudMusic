const fs= require('fs');
export default {
    address:process.env.HOMEDRIVE+process.env.HOMEPATH+'/CloudMusic\/',
    User:null,
    AccountFile:{},//用户本地文件对象
    init(user,callback){
        fs.access(this.address,fs.constants.F_OK | fs.constants.W_OK,(err)=>{
            if(err){
                fs.mkdir(this.address,(err)=>{
                    console.log('已创建系统文件夹，准备创建主配置文件');
                    this.userVerify(user,()=>{
                        this.create(user,callback);
                    });
                })
            }else{
                console.log('系统文件夹已存在，准备创建主配置文件');
                this.userVerify(user,()=>{
                    this.create(user,callback);
                });
            }
        });
    },
    userVerify(user,callback){
        fs.access(this.address+user,fs.constants.F_OK | fs.constants.W_OK,(err)=>{
            err?fs.mkdir(this.address+user,(err)=>{
                callback&&callback()
            }):callback&&callback()
        })
    },
    map(user,callback){
        let map={
            'local-music':this.address,
            login:this.address,
            user:this.address+user+'/',
            setting:this.address+user+'/',
        };
        this.User=user;
        for(let i in map){
            map[i]=map[i]+i+'.json';
        }
        this.AccountFile=map;
        callback&&callback()
    },
    create(user,callback){
        console.log('开始创建主配置文件');
        this.map(user,()=>{
            for(let i in this.AccountFile){
                fs.appendFileSync(this.AccountFile[i],'');
                console.log('创建'+this.AccountFile[i]);
            }
        });
        callback&&callback();
    },
    read(type,callback){
        this.map(this.User);
        console.log('读取'+this.AccountFile[type]);
        fs.readFile(this.AccountFile[type],{flag:'r+',encoding:'utf8'},(err,data)=>{
            try{
                data=JSON.parse(data)
            }catch (e) {
                data={}
            }
            callback&&callback(data,err);
        })
    },
    write(type,data){
        this.map(this.User);
        console.log('写入'+this.AccountFile[type]);
        fs.writeFile(this.AccountFile[type],JSON.stringify(data), (err)=>{});
    }
}
