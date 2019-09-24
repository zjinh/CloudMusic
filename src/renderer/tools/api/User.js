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
    ReSend(data,callback,error) {
        Ajax({
            url:"/service/user/resend",
            data:data,
            success:callback,
            error:error
        })
    },
    Update(data,callback,error) {
        Ajax({
            url:"/service/user/UpdateUserInfo",
            data:data,
            upload:true,
            success:callback,
            error:error
        })
    },
    FeedBack(data,callback,error) {
        Ajax({
            url:"/service/user/SendCouple",
            data:data,
            success:callback,
            error:error
        })
    },
    ChangePass(data,callback,error) {
        Ajax({
            url:"/service/user/ChangePass",
            data:data,
            success:callback,
            error:error
        })
    },
    ChangeSafeEmail(data,callback,error) {
        Ajax({
            url:"/service/user/ChangeSafeEmail",
            data:data,
            success:callback,
            error:error
        })
    },
    age(birth){
        birth = Date.parse(birth?birth:"".replace('/-/g', "/"));
        return parseInt((new Date() - new Date(birth)) / (1000 * 60 * 60 * 24 * 365));
    }
}
