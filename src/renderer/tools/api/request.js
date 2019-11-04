import axios from 'axios/index'
axios.defaults.withCredentials=true;
axios.interceptors.response.use(function (response) {
// 对响应数据做点什么
    return response;
}, function (err) {
    return Promise.reject(err.response.data);
});
function severAddress() {
    return ''
}
function updateServer() {
    return 'https://update.zjinh.cn/c-music'
}
let paramHandel = {
    removeKey: ['_index', '_rowKey', '_disabled', '_checked'],
    param(obj) {
        let s = [];
        for (let key in obj) {
            s.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
        }
        return s.join('&');
    },
    Get(url, params) {
        return url + (url.indexOf('?') > -1 ? '&' : '?') + this.param(params);
    },
};
function Ajax(options) {
    let params = new URLSearchParams();
    let method= options.method?options.method:'POST';
    method = method.toUpperCase();
    switch (method) {
        case'POST':
            for (let item in options.data) {
                params.append(item, options.data[item]);
            }
            break;
        case'GET':
            let url = paramHandel.Get(options.url, options.data);
            let urls = url.split("?");
            options.url = urls[1].length ? url : urls[0];
            break;
    }
    axios({
        method: method,
        data: params,
        emulateJSON:true,
        withCredentials:true,
        url: options.url.indexOf('http')>-1?options.url:severAddress()+options.url,
        headers:options.upload?{"Content-Type": "application/x-www-form-urlencoded"}:{},
    }).then((response) => {
        options.success&&typeof options.success==='function'?options.success(response.data):'';
    },function (error) {
        options.error&&typeof options.error==='function'?options.error(error):'';
    });
}
export {
    Ajax,severAddress,updateServer
}
