<template>
    <section class="cm-music-player">
        <img class="poster slideInLeft" draggable="false" :src="NowPlay.picture" alt="">
        <section class="song-info">
            <p class="name">{{NowPlay.title}}</p>
            <p class="singer">{{NowPlay.artist}}</p>
        </section>
        <ul class="cm-control-button">
            <li ripple="" @click="PlayerCommend('prev')">
                <i class="sf-icon-step-backward"></i>
            </li>
            <li ripple="" @click="PlayerCommend('play')">
                <i :class="PlayButtonState"></i>
            </li>
            <li ripple="" @click="PlayerCommend('next')">
                <i class="sf-icon-step-forward"></i>
            </li>
        </ul>
        <div class="cm-volume-container"  @mousedown="ChangeVolume" ref="volume">
            <div class="cm-volume-slider"></div>
        </div>
        <div class="slider-bar-container" @mousedown="TimeChange" ref="slider">
            <div class="slider-bar" :style="{width:ProcessWidth}">
                <div class="container">
                    <span>{{TimeText}}</span>
                    <div class="lighter"></div>
                </div>
            </div>
        </div>
        <div id="AudioLrcList"></div>
        <ul class="cm-play-mode">
            <li :class="'sf-icon-random '+(playMethod==='random'?'active':'')" @click="playMethod='random'"></li>
            <li :class="'sf-icon-repeat '+(playMethod==='repeat'?'active':'')" @click="playMethod='repeat'"></li>
            <li :class="'sf-icon-list '+(playMethod==='list'?'active':'')" @click="playMethod='list'"></li>
        </ul>
        <canvas width="600" height="240" id="canvas"></canvas>
        <audio ref="audio"
               @ended="PlayerCommend('next')"
               @timeupdate="MusicProcess"
               @error="PlayerCommend('next')"
               @durationchange="PlayButtonState='sf-icon-pause'"
               @seeking="PlayButtonState='sf-icon-circle-notch sf-spin'"
               @canplay="PlayerCommend('play')"
               :src="NowPlay.url"
        ></audio>
    </section>
</template>

<script>
    import Media from '../../tools/media';
    export default {
        name: "PlayerControl",
        props:{
            PlayList:{
                type:Array,
                default:()=>{
                    return []
                }
            }
        },
        watch:{
            PlayList: {
                handler() {
                    this.PlayList.forEach((item, index) => {
                        if (item.play) {
                            item.play = 'playing';
                            this.NowPlay=item;
                            this.NowPlay.count=index;
                            this.GetLyr();
                            this.GetAlbumPic();
                        }
                    });
                },
                deep: true
            },
        },
        data(){
            return{
                ProcessWidth:'0%',
                TimeText:"00:00",
                PlayButtonState:'sf-icon-play',
                NowPlay:{
                    artist:"",
                    title:"",
                    album:"",
                    picture:"http://p1.music.126.net/oCnACmhB6CM5oZyWmNfmTg==/109951163051142326.jpg"
                },
                playMethod:'list',
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
                prefixid: 'AudioLrcList',
                /* 容器ID */
                hoverClass: 'this_lrc',
                /* 选中节点的className */
                hoverTop: 100,
                /* 当前歌词距离父节点的高度 */
                duration: 0,
                /* 歌曲回调函数设置的进度时间 */
                __duration: -1,
            }
        },
        created(){
            this.$ipc.on('Next',()=>{
                this.PlayerCommend('next')
            });
            this.$ipc.on('Prev',()=>{
                this.PlayerCommend('prev')
            });
            this.$ipc.on('Play',()=>{
                this.PlayerCommend('play')
            })
        },
        mounted(){
            this.Visual();
        },
        methods:{
            PlayerCommend(commend){
                if(!this.PlayList.length){
                    return
                }
                let NowCount=this.NowPlay.count;
                let AllCount=this.PlayList.length;
                switch (commend) {
                    case 'prev':
                        if(NowCount!==0){
                            this.PlayList.forEach((item)=>{
                                item.play=false;
                            });
                            this.PlayList[NowCount-1].play='playing'
                        }
                        break;
                    case 'next':
                        if(NowCount!==AllCount-1){
                            this.PlayList.forEach((item)=>{
                                item.play=false;
                            });
                            this.PlayList[NowCount+1].play='playing'
                        }else{
                            this.PlayerCommend('play');
                        }
                        break;
                    case 'play':
                        let media=this.$refs.audio;
                        if(media.paused){
                            media.play();
                            this.PlayButtonState='sf-icon-pause';
                            this.$ipc.send('player-control','pause')
                        }else{
                            media.pause();
                            this.PlayButtonState='sf-icon-play';
                            this.$ipc.send('player-control','play')
                        }
                        if(this.VisualState) {
                            this.Visual();
                        }
                        break;
                }
            },
            ChangeVolume(){
                let media=this.$refs.audio;
                let volume=this.$refs.volume;
                Media.MediaControl(media,'volume','x',volume,event)
            },
            TimeChange(){
                let media=this.$refs.audio;
                let slider=this.$refs.slider;
                Media.MediaControl(media,'play','x',slider,event);
                this.PlayerCommend('play')
            },
            MusicProcess(){
                let media=this.$refs.audio;
                this.TimeText=Media.secondDeal(media.currentTime);
                this.ProcessWidth=Math.round(media.currentTime) / Math.round(media.duration) * 100 + "%";
            },
            Visual(){
                window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
                let audio =this.$refs.audio;
                let ctx = new AudioContext();
                let analyser = ctx.createAnalyser();
                let audioSrc = ctx.createMediaElementSource(audio);
                audioSrc.connect(analyser);
                analyser.connect(ctx.destination);
                let frequencyData = new Uint8Array(analyser.frequencyBinCount);
                let canvas = document.getElementById('canvas'),
                    cwidth = canvas.width,
                    cheight = canvas.height,
                    meterWidth = 10, //width of the meters in the spectrum
                    capHeight = 2,
                    capStyle = '#e56464',
                    meterNum = 800 / (10 + 2), //count of the meters
                    capYPositionArray = []; ////store the vertical position of hte caps for the preivous frame
                ctx = canvas.getContext('2d');
                let gradient = ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(1, '#e56464');
                gradient.addColorStop(0.5, '#ed401470');
                gradient.addColorStop(0, '#fff');
                function renderFrame() {
                    let array = new Uint8Array(analyser.frequencyBinCount);
                    analyser.getByteFrequencyData(array);
                    let step = Math.round(array.length / meterNum);
                    ctx.clearRect(0, 0, cwidth, cheight);
                    for (let i = 0; i < meterNum; i++) {
                        let value = array[i * step];
                        if (capYPositionArray.length < Math.round(meterNum)) {
                            capYPositionArray.push(value);
                        };
                        ctx.fillStyle = capStyle;
                        if (value < capYPositionArray[i]) {
                            ctx.fillRect(i * 12, cheight - (--capYPositionArray[i]), meterWidth, capHeight);
                        } else {
                            ctx.fillRect(i * 12, cheight - value, meterWidth, capHeight);
                            capYPositionArray[i] = value;
                        };
                        ctx.fillStyle = gradient;
                        ctx.fillRect(i * 12 , cheight - value + capHeight, meterWidth, cheight);
                    }
                    requestAnimationFrame(renderFrame);
                }
                renderFrame();
                this.VisualState=false;
            },
            GetLyr(){
                this.$Api.Music.GetLyr({
                    name:this.NowPlay.name
                },(rs)=>{
                    rs=JSON.parse(rs);
                    if (rs.lrc.lyric !== '' || rs.lrc.lyric !== null) {
                        let data=rs.lrc.lyric;
                        this.start(data,()=>{
                            return this.$refs.audio.currentTime;
                        })
                    }
                })
            },
            GetAlbumPic(){
                this.$Api.Music.GetAlbumPic({
                    name:this.NowPlay.name
                },(rs)=>{
                    this.NowPlay.picture=rs||"http://p1.music.126.net/oCnACmhB6CM5oZyWmNfmTg==/109951163051142326.jpg";
                    this.$emit('playing',this.NowPlay)
                })
            },
            start(txt, callback) {
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
                    for (let i = 0; i < this.list.length; i++)
                        html += this.format.replace(/\{html\}/gi, this.list[i][1]); /* 赋值到指定容器 */
                    document.getElementById(this.prefixid).innerHTML = html;
                    /* 定时调用回调函数，监听歌曲进度 */
                    if(typeof (callback())==='number') {
                        this.handle = setInterval(()=>{
                            this.jump(callback())
                        }, this.interval * 1000);
                    }
                } else { /* 没有歌词 */
                }
            },
            /* 跳到指定时间的歌词 */
            jump(duration) {
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
                    tmp = 0,
                    thisobj = this;
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
                tmpobj =document.getElementById(this.prefixid).childNodes;
                for(let i=0;i<tmpobj.length;i++){
                    tmpobj[i].className=this.prefixid;
                }
                if(tmpobj[pivot]) {
                    tmpobj[pivot].className += ' ' + thisobj.hoverClass;
                    /*tmp = tmpobj[pivot + 1].offsetTop - tmpobj[pivot].parentNode.offsetTop - this.hoverTop;
                    tmp = tmp > 0 ? tmp * 1 : 0;//如果不设置滚动条使用margin设置为-1
                    tmpobj[pivot].parentNode.scrollTop = tmp;//这里可以用margintop*/
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
    }
</script>

<style >
    .cm-music-player{
        width: 100%;
        height: 60px;
        border-top: 1px solid #eee;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 3;
        -o-transition: all 350ms;
        -moz-transition: all 350ms;
        -webkit-transition: all 350ms;
    }
    .cm-music-player .poster{
        float: left;
        width: 60px;
        height: 57px;
        margin-top: 3px;
        border-radius: 0 0 0 5px;
        position: relative;
        z-index: 1;
        cursor: pointer;
    }
    .cm-music-player .song-info{
        float: left;
        width: 150px;
        height: calc(100% - 3px);
        margin-top: 3px;
        padding-left: 20px;
        padding-top: 15px;
        position: relative;
        z-index: 1;
    }
    .cm-music-player .song-info p{
        line-height: 14px;
        text-overflow: ellipsis;
    }
    .cm-music-player .song-info .name{
        font-weight: bold;
        font-size: 14px;
        color: #fff;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .cm-music-player .song-info .singer{
        font-size: 12px;
        color: #e3e8ee;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .cm-music-player canvas{
        float: right;
        zoom: 25%;
        margin-right: 120px;
    }
    .cm-control-button{
        float: left;
        width: 150px;
        height: calc(100% - 3px);
        margin-top: 3px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        z-index: 1;
    }
    .cm-control-button li{
        width: 30px;
        height: 30px;
        color: #f306;
        text-align: center;
        line-height: 36px;
        border-radius: 100%;
        cursor: pointer;
        margin-top: -3px;
    }
    .cm-control-button li i{
        font-size: 16px;
    }
    .cm-control-button li:nth-child(2){
        width: 32px;
        height: 32px;
        background: rgba(255,255,255,.3);
        color: #d7ebec;
        margin: 0 15px;
        line-height: 34px;
    }
    .cm-control-button li:nth-child(2) i{
        font-size: 14px;
    }
    .cm-volume-container{
        width: 80px;
        height: 5px;
        background: #636363;
        border-radius: 10px;
        float: left;
        margin-top: 26px;
        cursor: pointer;
        position: relative;
        z-index: 1;
    }
    .cm-volume-slider{
        width: 100%;
        border-radius: 10px;
        height: 100%;
        -webkit-transition:all .35s;
        -moz-transition:all .35s;
        -o-transition:all .35s;
        background: #e56464;
    }
    .slider-bar-container{
        width: 100%;
        height: 3px;
        cursor: pointer;
        position: absolute;
        top: 0;
        overflow: unset;
    }
    .slider-bar{
        width: 50%;
        height: 100%;
        background: #ff3b00;
        overflow: unset;
        z-index: -1;
        -webkit-transition:all .35s;
        -moz-transition:all .35s;
        -o-transition:all .35s;
    }
    .slider-bar .container{
        width: 100%;
        height: 60px;
        background: #ed401421;
        border-right:1px solid #ed401470;
    }
    .slider-bar .container span{
        float: right;
        padding: 3px;
        color: #fff;
    }
    .cm-play-mode{
        float: right;
        width: 150px;
        height: calc(100% - 3px);
        margin-top: 3px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        z-index: 1;
    }
    .cm-play-mode li{
        font-size: 14px;
        color: #fff;
        width: 30px;
        height: 30px;
        border-radius: 100%;
        line-height: 30px;
        text-align: center;
        margin: 0 5px;
        cursor: pointer;
        margin-top: -3px;
    }
    .cm-play-mode li:hover ,.cm-play-mode .active{
        background: #e56464;
        color: #fff;
    }
    #AudioLrcList{
        float: left;
        padding-left: 28px;
        width: calc(100% - 595px);
        height: 25px;
        font-size: 14px;
        color: #fff;
        -o-transition: all 350ms;
        -moz-transition: all 350ms;
        -webkit-transition: all 350ms;
        position: absolute;
        right: 146px;
        top: 18px;
    }
    #AudioLrcList *{
        display: none;
    }
    .this_lrc{
        text-align: left;
        display: block!important;
        -o-transition: all 350ms;
        -moz-transition: all 350ms;
        -webkit-transition: all 350ms;
        -webkit-animation-duration:.35s;animation-duration:.35s;-webkit-animation-fill-mode:both;animation-fill-mode:both;
        -webkit-animation-name:slideInUp;animation-name:slideInUp
    }
</style>
