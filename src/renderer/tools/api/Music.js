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
            url:"/open/netase/toplist/artist",
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
        detail(id, callback, error) {
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
        music(id,offset,callback,error){
            Ajax({
                url: "/open/netase/artists",
                method: "get",
                data: {
                    id: id,
                    offset:offset
                },
                success: callback,
                error: error
            })
        },
        mv(id,offset,callback,error){
            Ajax({
                url: "/open/netase/artist/mv",
                method: "get",
                data: {
                    id: id,
                    offset:offset,
                    limit:50,
                },
                success: callback,
                error: error
            })
        },
        simi(id,offset,callback,error){
            Ajax({
                url: "/open/netase/simi/artist",
                method: "get",
                data: {
                    id: id,
                    offset:offset,
                    limit:50,
                },
                success: callback,
                error: error
            })
        }
    },
    playlist: {
        subscribe(data,callback,error){
            Ajax({
                url: "/open/netase/playlist/subscribe",
                method: "get",
                data: data,
                success: callback,
                error: error
            })
        },
        subscribers(id,offset,callback,error){
            Ajax({
                url: "/open/netase/playlist/subscribers",
                method: "get",
                data: {
                    limit:30,
                    offset:offset,
                    id:id
                },
                success: callback,
                error: error
            })
        },
        musicList(id,offset,callback,error){
            Ajax({
                url: "/open/netase/playlist/detail",
                method: "get",
                data: {
                    limit:50,
                    offset:offset,
                    id:id
                },
                success: callback,
                error: error
            })
        },
        comment(id,offset,callback,error){
            Ajax({
                url: "/open/netase/comment/playlist",
                method: "get",
                data: {
                    limit:200,
                    offset:offset,
                    id:id
                },
                success: callback,
                error: error
            })
        }
    },
    album:{
        musicList(id,offset,callback,error){
            Ajax({
                url: "/open/netase/album",
                method: "get",
                data: {
                    limit:50,
                    offset:offset,
                    id:id
                },
                success: callback,
                error: error
            })
        },
        comment(id,offset,callback,error){
            Ajax({
                url: "/open/netase/comment/album",
                method: "get",
                data: {
                    limit:200,
                    offset:offset,
                    id:id
                },
                success: callback,
                error: error
            })
        },
        subscribe(data,callback,error){
            Ajax({
                url: "/open/netase/album/sub",
                method: "get",
                data: data,
                success: callback,
                error: error
            })
        },
        dynamic(id,callback,error){
            Ajax({
                url: "/open/netase/album/dynamic",
                method: "get",
                data: {
                    id:id
                },
                success: callback,
                error: error
            })
        },
    },
    mv:{
        getUrl(id,callback,error){
            Ajax({
                url: "/open/netase/mv/url",
                method: "get",
                data: {
                    id: id,
                },
                success: callback,
                error: error
            })
        },
        comment(id,offset,callback,error){
            Ajax({
                url: "/open/netase/comment/mv",
                method: "get",
                data: {
                    limit:200,
                    offset:offset,
                    id:id
                },
                success: callback,
                error: error
            })
        },
        detail(id,callback,error){
            Ajax({
                url: "/open/netase/mv/detail",
                method: "get",
                data: {
                    mvid: id,
                },
                success: callback,
                error: error
            })
        },
    },
    video:{
        getUrl(id,callback,error){
            Ajax({
                url: "/open/netase/video/url",
                method: "get",
                data: {
                    id: id,
                },
                success: callback,
                error: error
            })
        },
        detail(id,callback,error){
            Ajax({
                url: "/open/netase/video/detail",
                method: "get",
                data: {
                    id: id,
                },
                success: callback,
                error: error
            })
        },
        comment(id,offset,callback,error){
            Ajax({
                url: "/open/netase/comment/video",
                method: "get",
                data: {
                    limit:200,
                    offset:offset,
                    id:id
                },
                success: callback,
                error: error
            })
        },
        related(id,callback,error){
            Ajax({
                url: "/open/netase/related/allvideo",
                method: "get",
                data: {
                    id: id,
                },
                success: callback,
                error: error
            })
        },
    },
    comment:{
        like(data,callback,error){
            Ajax({
                url: "/open/netase/comment/like",
                method: "get",
                data: data,
                success: callback,
                error: error
            })
        },
        control(data,callback,error){
            Ajax({
                url: "/open/netase/comment",
                method: "get",
                data: data,
                success: callback,
                error: error
            })
        }
    }
};
