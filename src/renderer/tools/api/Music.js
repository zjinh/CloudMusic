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
    getPopSinger(callback,error){
        Ajax({
            url:"/open/netase/top/artists",
            data:{
                offset:0,
                limit:30
            },
            success:callback,
            error:error
        })
    },
    getRecommendSong(callback,error){
        Ajax({
            url:"/open/netase/recommend/songs",
            success:callback,
            error:error
        })
    },
    getLrc(id,callback,error){
        Ajax({
            url:"/open/netase/lyric",
            method:"get",
            data:{
                id:id,
            },
            success:callback,
            error:error
        })
    },
    detail(id,callback,error){
        Ajax({
            url:"/open/netase/song/detail",
            method:"get",
            data:{
                ids:id,
            },
            success:(rs)=>{
                rs=rs.songs[0].al.picUrl;
                callback(rs)
            },
            error:error
        })
    },
    search(data,callback,error){
        Ajax({
            url:"/open/netase/search",
            method:"get",
            data:data,
            success:callback,
            error:error
        })
    },
    searchSuggest(key,callback,error){
        Ajax({
            url:"/open/netase/search/suggest",
            method:"get",
            data:{
                keywords:key,
            },
            success:callback,
            error:error
        })
    },
    artist: {
        detail: function (id, callback, error) {
            Ajax({
                url: "/open/netase/artist/desc",
                method: "get",
                data: {
                    id: id,
                },
                success: callback,
                error: error
            })
        },
    }
};
