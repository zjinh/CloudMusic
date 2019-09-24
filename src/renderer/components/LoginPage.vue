<template>
    <div>
        <div class="CloudIndexSection">
            <section>
                <button type="button" class="sf-icon-minus" @click="mini"></button>
                <button type="button" class="sf-icon-times" style="font-size:16px" @click="close"></button>
            </section>
        </div>
        <div class="CloudIndexMain">
            <div class="CloudIndexLeft">
                <div class="CloudIndexHead" style="-webkit-app-region: drag" >
                    <h1>{{HeadText.h1}}</h1>
                    <p>{{HeadText.tips}}</p>
                </div>
                <div class="CloudIndexForm" v-show="ShowState.login.state">
                    <Logininput :data="LoginUserInput"></Logininput>
                    <Logininput :data="LoginPassInput" @keyup.enter.native="login"></Logininput>
                    <div class="CloudIndex-LineContainer">
                        <label>下次将自动登录</label>
                    </div>
                    <div class="CloudIndex-OtherLogin">
                        <label>其他登录</label>
                        <ul>
                            <li class="sf-icon-wechat" ripple><span>&nbsp&nbsp微信</span></li>
                            <div></div>
                            <li class="sf-icon-qq" ripple><span>&nbsp&nbspQQ</span></li>
                        </ul>
                    </div>
                    <div class="CloudIndex-postBut">
                        <button @click="login" :class="PostState">登录</button>
                    </div>
                    <div class="CloudIndex-Tips">
                        <p>使用手机&nbsp<span @click="changeType('register')">创建一个新用户</span></p>
                    </div>
                </div>
                <div class="CloudIndexForm" v-show="ShowState.register.state">
                    <Logininput :data="RegisterUserInput"></Logininput>
                    <Logininput :data="RegisterMailInput" @on-change="PhoneRecord"></Logininput>
                    <Logininput :data="RegisterPassInput"></Logininput>
                    <Logininput :data="RegisterCodeInput" @keyup.enter.native="register"></Logininput>
                    <div class="CloudIndex-postBut">
                        <button @click="register" :class="PostState">创建</button>
                    </div>
                    <div class="CloudIndex-Tips">
                        <p>已经有账号&nbsp<span @click="changeType('login')">前往登录</span></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Logininput from './LoginPage/l-input';
    export default {
        name: "LoginPage",
        components:{Logininput},
        computed:{
            now(){
                return '?'+Date.now();
            }
        },
        data(){
            return{
                production:(process.env.NODE_ENV!=='production'),
                /*服务器值*/
                ServerAddress:localStorage.server||'https://api.zjinh.cn',
                LoadingText:'正在加载用户信息',//登陆中提示
                /*这里为组件传值*/
                PostState:false,
                LoginSuccess:false,
                /*登录组件数据*/
                LoginUserInput:{
                    icon:"sf-icon-user",
                    text:"手机号/邮箱",
                    value:localStorage.username||''
                },
                LoginPassInput:{
                    icon:"sf-icon-lock",
                    type:'password',
                    text:"输入您的密码",
                    value:localStorage.password||''
                },
                /*注册组件数据*/
                RegisterUserInput:{
                    icon:"sf-icon-user",
                    text:"用户名",
                    value:""
                },
                RegisterMailInput:{
                    icon:"sf-icon-mobile",
                    text:"输入您的手机号",
                    value:""
                },
                RegisterPassInput:{
                    icon:"sf-icon-lock",
                    type:'password',
                    text:"设置登录密码",
                    value:""
                },
                RegisterCodeInput:{
                    icon:"sf-icon-keyboard",
                    state:"verify",
                    phone:"",
                    text:"验证码",
                    value:""
                },
                /*登录页面显示切换参数*/
                HeadText:{
                    h1: "欢迎",
                    tips: "请登录后继续"
                },
                ShowState:{
                    login: {
                        h1: "欢迎",
                        tips: "请登录后继续",
                        state:true
                    },
                    register: {
                        h1:"开始",
                        tips:"创建一个新用户",
                        state:false
                    }
                },
                /*窗体对象*/
                WindowObject:false,
            }
        },
        created:function () {
            this.WindowObject=this.$electron.remote.getCurrentWindow();
            this.$ipc.on('win-data',(event,data)=>{
                this.LoginUserInput.value=data.phone||data.email||''
            })
        },
        methods:{
            login:function () {
                let username=this.LoginUserInput.value;
                let password=this.LoginPassInput.value;
                if (!username.length){
                    this.$Message.warning('请输入手机号/邮箱');
                    return false;
                }
                if(username.length>11&&!username.Exist('@')){
                    return this.$Message.warning('请输入正确的手机号')
                }
                if(username.Exist('@')&&!username.Exist('163')){
                    return this.$Message.warning('必须是网易163邮箱')
                }
                if (!password.length){
                    this.$Message.warning('请输入密码');
                    return false;
                }
                if(this.PostState){
                    this.$Message.warning('正在验证登录信息');
                    return false;
                }
                this.PostState='CloudIndex-posting';
                let data={};
                if(username.Exist('@')){
                     data={
                        email:username,
                        password:password,
                    }
                }else{
                    data={
                        phone:username,
                        password:password,
                    }
                }
                this.$Api.User.Login(data,()=> {
                    this.PostState='';
                    this.$ipc.send('system','login',data);
                },(rs)=>{
                    this.PostState='';
                    switch (rs.code) {
                        case 400:
                            this.$Message.error('无效用户');
                            break;
                        case 502:
                            this.$Message.error('密码错误');
                            break;
                    }
                });
            },
            register:function(){
                let username=this.RegisterUserInput.value;
                let phone=this.RegisterMailInput.value;
                let password=this.RegisterPassInput.value;
                let code=this.RegisterCodeInput.value;
                if (!username.length){
                    this.$Message.warning('用户名不能为空');
                    return false;
                }
                if (!phone.length){
                    this.$Message.warning('请输入手机号');
                    return false;
                }
                if(phone.length>11||phone.length<11) {
                    this.$Message.error('请输入正确的手机号');
                    return false;
                }
                if (!password.length){
                    this.$Message.warning('请输入密码');
                    return false;
                }
                if (!code.length){
                    this.$Message.warning('请输入验证码');
                    return false;
                }
                if(this.PostState){
                    this.$Message.warning('正在验证注册信息');
                    return false;
                }
                this.PostState='CloudIndex-posting';
                this.$Api.User.verify(phone,code,(rs)=>{
                    this.$Api.User.Register({
                        nickname: username,
                        phone: phone,
                        password: password,
                        captcha: code
                    }, (rs)=> {
                        this.PostState='';
                        this.changeType('login');
                    },(rs)=>{
                        this.$Message.error(rs.message);
                        this.PostState='';
                    })
                },()=>{
                    this.$Message.error('验证码错误');
                    this.PostState='';
                });
            },
            PhoneRecord(){
                this.$Api.User.isRegister(this.RegisterMailInput.value,(rs)=>{
                    if(rs.exist){
                        this.$Message.warning('该手机号已注册');
                        this.RegisterMailInput.value='';
                    }else{
                        this.RegisterCodeInput.phone=this.RegisterMailInput.value;
                    }
                })
            },
            changeType:function (type) {
                if(this.PostState.length>5){
                    return
                }
                for(let item in this.ShowState){
                    this.ShowState[item].state = false
                }
                this.ShowState[type].state = true;
                this.HeadText.h1=this.ShowState[type].h1;
                this.HeadText.tips=this.ShowState[type].tips
            },
            mini:function () {
                this.WindowObject.minimize();
            },
            close:function () {
                this.WindowObject.close();
            }
        }
    }
</script>

<style scoped>
    @import url("../assets/css/login.css");
</style>
