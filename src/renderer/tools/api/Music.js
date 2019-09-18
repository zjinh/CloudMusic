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
    GetLyr(data,callback,error) {
        Ajax({
            url:"/service/api/disk/lrc",
            data:data,
            success:callback,
            error:error
        })
    },
    GetAlbumPic(data,callback,error) {
        Ajax({
            url:"/service/music/GetAlbumPic",
            data:data,
            success:callback,
            error:error
        })
    },
};
