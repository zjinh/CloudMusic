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
    MathLocal(data,callback,error) {
        Ajax({
            url:"/service/api/MathLocal",
            data:data,
            success:(rs)=>{
                console.log(rs)
            },
            error:error
        })
    },
};
