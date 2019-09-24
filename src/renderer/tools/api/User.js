import {Ajax,severAddress} from "./request";
import LocalFile from "./LocalFile";
export default {
    UserId:null,
    Login(data,callback,error) {
        Ajax({
            url:"/open/netase/login/"+(data.phone?'cellphone':''),
            method:"GET",
            data:data,
            success:(rs)=>{
                this.UserId=rs.profile.userId;
                LocalFile.init(rs.profile.userId, () => {
                    LocalFile.write('user', rs.profile);
                    LocalFile.write('login', data);
                    callback && callback(rs.profile);
                });
            },
            error:error
        })
    },
    refresh(data,callback,error) {
        Ajax({
            url:"/open/netase/login/refresh",
            data:data,
            success:callback,
            error:error
        })
    },
    Register(data,callback,error) {
        Ajax({
            url:"/open/netase/register/cellphone",
            method:"get",
            data:data,
            success:callback,
            error:error
        })
    },
    UserInfo(callback,error) {
        Ajax({
            url:"/service/user/detail",
            data:{
                uid:this.UserId
            },
            success:callback,
            error:error
        })
    },
    sendCode(phone,callback,error){
        Ajax({
            url:"/open/netase/captcha/sent",
            method:"get",
            data:{
                phone:phone
            },
            success:callback,
            error:error
        })
    },
    isRegister(phone,callback,error){
        Ajax({
            url:"/open/netase/cellphone/existence/check",
            method:"get",
            data:{
                phone:phone,
                time:Math.random(0,10)
            },
            success:callback,
            error:error
        })
    },
    verify(phone,captcha,callback,error){
        Ajax({
            url:"/open/netase/captcha/verify",
            method:"get",
            data:{
                captcha:captcha,
                phone:phone,
            },
            success:callback,
            error:error
        })
    },
    ReSend(data,callback,error) {
        Ajax({
            url:"/service/user/resend",
            data:data,
            success:callback,
            error:error
        })
    },
}
