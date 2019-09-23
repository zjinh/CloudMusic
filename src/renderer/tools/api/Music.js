import {Ajax} from "./request";
export default {
    Download:function (data,callback,error) {
        Ajax({
            url:"/service/disk/Download",
            data:data,
            success:callback,
            error:error
        })
    },
    mateMusic(data,callback,error) {
        Ajax({
            url:"/service/open/mateMusic",
            data:data,
            success:callback,
            error:error
        })
    },
};
