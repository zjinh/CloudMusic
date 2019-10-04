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
    getRecommendPlayList(callback,error){
        Ajax({
            url:"/open/netase/recommend/resource",
            success:callback,
            error:error
        })
    },
    getRecommendNEWSong(callback,error){
        Ajax({
            url:"/open/netase/personalized/newsong",
            success:(rs)=>{
                rs.result.forEach((item,index)=>{
                    rs.result[index]=item.song
                });
                callback(rs)
            },
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
    getUrl(id,callback,error){
        Ajax({
            url: "/open/netase/song/url",
            method: "get",
            data: {
                id:id
            },
            success: callback,
            error: error
        })
    },
    simiMusic(id,callback,error){
        Ajax({
            url: "/open/netase/simi/song",
            method: "get",
            data: {
                id:id
            },
            success: callback,
            error: error
        })
    },
    simiPlayList(id,callback,error){
        Ajax({
            url: "/open/netase/simi/playlist",
            method: "get",
            data: {
                id:id
            },
            success: callback,
            error: error
        })
    },
    simiUser(id,callback,error){
        Ajax({
            url: "/open/netase/simi/user",
            method: "get",
            data: {
                id:id
            },
            success: callback,
            error: error
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
                    limit:50,
                    offset:offset*50
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
                    limit:50,
                    offset:offset*50,
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
                    limit:50,
                    offset:offset*50,
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
                    id:id,
                    limit:50,
                    offset:offset*50,
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
                    id:id,
                    limit:50,
                    offset:offset*50,
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
                    id:id,
                    limit:200,
                    offset:page*200,
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
                    id:id,
                    limit:50,
                    offset:offset*50,
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
                    offset:offset*200,
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
        sublist(callback,error){
            Ajax({
                url: "/open/netase/album/sublist",
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
                    offset:offset*200,
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
                    offset:offset*200,
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
    radio:{
        subscribe(data,callback,error){
            Ajax({
                url: "/open/netase/dj/sub",
                method: "get",
                data: data,
                success: callback,
                error: error
            })
        },
        sublist(callback,error){
            Ajax({
                url: "/open/netase/dj/sublist",
                success: callback,
                error: error
            })
        },
        programs(id,offset,callback,error){
            Ajax({
                url: "/open/netase/dj/program",
                method: "get",
                data: {
                    limit:50,
                    offset:(offset-1)*50,
                    rid:id
                },
                success: callback,
                error: error
            })
        },
        detail(id,callback,error){
            Ajax({
                url: "/open/netase/dj/program/detail",
                method: "get",
                data: {
                    id:id
                },
                success: callback,
                error: error
            })
        },
        comment(id,offset,callback,error){
            Ajax({
                url: "/open/netase/comment/dj",
                method: "get",
                data: {
                    limit:200,
                    offset:offset*200,
                    id:id
                },
                success: callback,
                error: error
            })
        }
    },
    song:{
        comment(id,offset,callback,error){
            Ajax({
                url: "/open/netase/comment/music",
                method: "get",
                data: {
                    limit:200,
                    offset:offset*200,
                    id:id
                },
                success: callback,
                error: error
            })
        }
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
