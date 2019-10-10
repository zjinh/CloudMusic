export default {
    /* 定时执行句柄 */
    list: [],
    /* lrc歌词及时间轴数组 */
    regex: /^[^\[]*((?:\s*\[\d+\:\d+(?:\.\d+)?\])+)([\s\S]*)$/,
    /* 提取歌词内容行 */
    regex_time: /\[(\d+)\:((?:\d+)(?:\.\d+)?)\]/g,
    /* 提取歌词时间轴 */
    regex_trim: /^\s+|\s+$/,
    /* 过滤两边空格 */
    callback: null,
    /* 定时获取歌曲执行时间回调函数 */
    interval: 0.3,
    /* 定时刷新时间，单位：秒 */
    format: '<p>{html}</p>',
    /* 模板 */
    prefixId: '',
    /* 容器ID */
    prefixIdHandle:[],
    /*处理好的容器*/
    hoverClass: 'animated slideInLeft  this_lrc,',
    /* 选中节点的className */
    hoverTop: 100,
    /*只显示当前歌词的容器id*/
    hoverPrefixId:'',
    /* 当前歌词距离父节点的高度 */
    duration: 0,
    /* 歌曲回调函数设置的进度时间 */
    __duration: -1,
    autoScroll:true,
    init(data){
        for(let k=0;k<this.prefixIdHandle.length;k++){
            this.prefixIdHandle[k].innerHTML = data||'';
        }
    },
    start(txt, callback,cb) {
        this.prefixIdHandle=[];
        let ids=this.prefixId.split(',');
        for (let i=0;i<ids.length;i++){
            this.prefixIdHandle.push(document.getElementById(ids[i]));
        }
        if (typeof(txt) !== 'string' || txt.length < 1 || typeof(callback) !== 'function') return; /* 停止前面执行的歌曲 */
        this.stop();
        this.callback = callback;
        let item = null,
            item_time = null,
            html = ''; /* 分析歌词的时间轴和内容 */
        txt = txt.split("\n");
        for (let i = 0; i < txt.length; i++) {
            item = txt[i].replace(this.regex_trim, '');
            if (item.length < 1 || !(item = this.regex.exec(item))) continue;
            while (item_time = this.regex_time.exec(item[1])) {
                this.list.push([parseFloat(item_time[1]) * 60 + parseFloat(item_time[2]), item[2]]);
            }
            this.regex_time.lastIndex = 0;
        } /* 有效歌词 */
        if (this.list.length > 0) { /* 对时间轴排序 */
            this.list.sort(function(a, b) {
                return a[0] - b[0];
            });
            if (this.list[0][0] >= 0.1) this.list.unshift([this.list[0][0] - 0.1, '']);
            this.list.push([this.list[this.list.length - 1][0] + 1, '']);
            for (let i = 0; i < this.list.length; i++) {
                html += this.format.replace(/\{html\}/gi, this.list[i][1]);
            }/* 赋值到指定容器 */
            this.init(html);
            /* 定时调用回调函数，监听歌曲进度 */
            if(typeof (callback())==='number') {
                this.handle = setInterval(()=>{
                    this.jump(callback(),cb)
                }, this.interval * 1000);
            }
        } else { /* 没有歌词 */
        }
    },
    /* 跳到指定时间的歌词 */
    jump(duration,cb) {
        if (typeof(this.handle) !== 'number' || typeof(duration) !== 'number' ||  this.list.length < 1) return false;
        if (duration < 0) duration = 0;
        if (this.__duration === duration) return;
        duration += 0.2;
        this.__duration = duration;
        duration += this.interval;
        let left = 0,
            right = this.list.length - 1,
            last = right,
            pivot = Math.floor(right / 2),
            tmpobj = null,
            tmp = 0;
        /* 二分查找 */
        while (left <= pivot && pivot <= right) {
            if (this.list[pivot][0] <= duration && (pivot === right || duration < this.list[pivot + 1][0])) {
                //if(pivot === right) this.stop();
                break;
            } else if (this.list[pivot][0] > duration) { /* left */
                right = pivot;
            } else { /* right */
                left = pivot;
            }
            tmp = left + Math.floor((right - left) / 2);
            if (tmp === pivot) break;
            pivot = tmp;
        }
        if (pivot === this.pivot) return;
        this.pivot = pivot;
        for(let i=0;i<this.prefixIdHandle.length;i++){
            for(let k=0;k<this.prefixIdHandle[i].childNodes.length;k++){
                this.prefixIdHandle[i].childNodes[k].className='';
            }
        }
        let scrollList=this.prefixIdHandle[0].childNodes;//滚动条计算拿第一个
        if(scrollList[pivot]) {
            document.getElementById(this.hoverPrefixId).innerHTML=scrollList[pivot].innerHTML;
            for(let i=0;i<this.prefixIdHandle.length;i++){
                this.prefixIdHandle[i].childNodes[pivot].className=this.hoverClass.split(',')[i];
            }
            tmp = scrollList[pivot].offsetTop - scrollList[pivot].parentNode.offsetTop - this.hoverTop-30;
            tmp = tmp > 0 ? tmp : 0;//如果不设置滚动条使用margin设置为-1
            if(this.autoScroll) {
                scrollList[pivot].parentNode.scrollTo({
                    top: tmp,
                    behavior: "smooth"
                });
            }
            cb&&cb({
                scroll:tmp,
                target:scrollList,
                pivot:pivot,
            });
        }
    },
    /* 停止执行歌曲 */
    stop() {
        if (typeof(this.handle) === 'number') clearInterval(this.handle);
        this.handle = this.callback = null;
        this.__duration = -1;
        this.regex_time.lastIndex = 0;
        this.list = [];
    },
}
