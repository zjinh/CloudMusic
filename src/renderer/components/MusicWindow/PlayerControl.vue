<template>
    <section class="cm-music-player">
        <img class="poster slideInLeft" draggable="false" @click="fullEnter" :src="NowPlay.picture" alt="">
        <section class="song-info">
            <p class="name">{{NowPlay.title}}</p>
            <p class="singer">{{NowPlay.artist}}</p>
        </section>
        <div class="cm-control-button">
            <button @click="PlayerCommend('prev')">
                <i class="sf-icon-step-backward"></i>
            </button>
            <button @click="PlayerCommend('play')">
                <i :class="PlayButtonState"></i>
            </button>
            <button @click="PlayerCommend('next')">
                <i class="sf-icon-step-forward"></i>
            </button>
            <div class="cm-volume-container"  @mousedown="ChangeVolume" ref="volume">
                <div class="cm-volume-slider"></div>
            </div>
        </div>
        <div class="slider-bar-container" @mousedown="TimeChange" ref="slider">
            <div class="slider-bar" :style="{width:ProcessWidth}">
                <div class="container">
                    <span>{{TimeText}}</span>
                    <div class="lighter"></div>
                </div>
            </div>
        </div>
        <div id="cm-control-lrc"></div>
        <ul class="cm-play-mode">
            <li :class="'sf-icon-random '+(playMethod==='random'?'active':'')" @click="changePlayMethod('random')" ripple="" title="随机播放"></li>
            <li :class="'sf-icon-repeat '+(playMethod==='repeat'?'active':'')" @click="changePlayMethod('repeat')" ripple="" title="单曲循环"></li>
            <li :class="'sf-icon-list '+(playMethod==='list'?'active':'')" @click="changePlayMethod('list')" ripple="" title="顺序播放"></li>
        </ul>
        <canvas width="600" height="240" id="canvas"></canvas>
        <audio ref="audio"
               id="audio"
               crossOrigin="anonymous"
               @ended="PlayerCommend('end')"
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
    import lyric from "../../tools/lyric";
    lyric.prefixId='cm-full-music-lrc-list,cm-control-lrc';
    lyric.hoverClass='this_lrc,animated slideInLeft this_lrc';
    lyric.hoverPrefixId='cm-fully-music-line-lrc';
    export default {
        name: "PlayerControl",
        props:{
            PlayList:{
                type:Array,
                default:()=>{
                    return []
                }
            },
            analyser:[Object,AnalyserNode]
        },
        watch:{
            PlayList: {
                handler() {
                    this.PlayList.some((item, index) => {
                        item.count=index;
                        if (item.play) {
                            this.NowPlay=JSON.handle(item);
                            this.readyPlayer(item).then(()=>{
                                this.$emit('playing', this.NowPlay);
                                this.Visual();
                            });
                        }
                    });
                },
                deep: true
            },
            PlayButtonState:function () {
                this.$emit('playState',this.PlayButtonState)
            }
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
                    picture:this.$defaultAlbum
                },
                playMethod:'list',
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
            });
            this.playMethod=(localStorage.playMethod===undefined?'list':localStorage.playMethod);
        },
        methods:{
            PlayerCommend(commend){
                if(!this.PlayList.length){
                    return
                }
                let NowCount=this.NowPlay.count;
                let AllCount=this.PlayList.length;
                let media=this.$refs.audio;
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
                            let next_play=NowCount + 1;
                            switch (this.playMethod) {
                                case "list":
                                    next_play=NowCount + 1;
                                    break;
                                case "repeat":
                                    next_play=NowCount + 1;
                                    break;
                                case "random":
                                    next_play=this.randomCount(0,AllCount-1);
                                    break;
                            }
                            this.PlayList[next_play].play='playing'
                        }else{
                            this.PlayerCommend('stop');
                            this.$parent.PlayList.forEach((item)=>{
                                item.play=false;
                            });
                            this.$parent.PlayList=[];
                            this.$parent.showFull=false;
                        }
                        break;
                    case 'play':
                        if(media.paused){
                            media.play();
                            this.PlayButtonState='sf-icon-pause';
                            this.$ipc.send('player-control','pause')
                        }else{
                            media.pause();
                            this.PlayButtonState='sf-icon-play';
                            this.$ipc.send('player-control','play')
                        }
                        break;
                    case 'stop':
                        media.pause();
                        this.PlayButtonState='sf-icon-play';
                        this.$ipc.send('player-control','stop');
                        break;
                    case 'end':
                        if(this.playMethod==='repeat'){
                            this.$refs.audio.currentTime = 0;
                        }else{
                            this.PlayerCommend('next');
                        }
                        break;
                }
            },
            randomCount(x,y){
                return Math.ceil((Math.random()*(y-x+1))+x-1);
            },
            readyPlayer(item){
                return new Promise((callback,fail)=>{
                    this.$ipc.send('player-control', 'lrc', {
                        left:"",
                        now:"",
                        right:""
                    });
                    lyric.init();
                    switch (item.type||this.NowPlay.type) {
                        case 'online':
                            this.$Api.Music.song.detail(this.NowPlay.id,(rs)=>{
                                this.PlayList[this.NowPlay.count].picture=rs||this.$defaultAlbum;
                                this.NowPlay.picture = rs|| this.$defaultAlbum;
                                callback(this.NowPlay);
                            },()=>{
                                callback(this.NowPlay);
                            });
                            this.$Api.Music.song.lrc(this.NowPlay.id,(rs)=>{
                                this.startLyric(rs);
                            });
                            break;
                        case 'local':
                            let data=this.NowPlay;
                            this.$Api.Music.song.mate({
                                name: data.name
                            }, (rs) => {
                                let cover=rs.cover;
                                this.PlayList[data.count].picture=cover||this.$defaultAlbum;
                                this.NowPlay.picture = cover|| this.$defaultAlbum;
                                this.NowPlay.id=rs.song_id;
                                this.startLyric(rs);
                                callback(this.NowPlay);
                            },()=>{
                                callback(this.NowPlay);
                            });
                            break;
                        case 'radio':
                            lyric.init(this.NowPlay.data.description);
                            if(item.url){
                                return callback(this.NowPlay);
                            }
                            this.$Api.Music.radio.detail(item.id,(rs)=>{
                                item.mainTrackId=rs.program.mainTrackId;
                                item.url='https://music.163.com/song/media/outer/url?id='+item.mainTrackId+'.mp3';
                                callback(this.NowPlay);
                            },()=>{
                                callback(this.NowPlay);
                            });
                            break;
                    }
                });
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
            changePlayMethod(method){
                this.playMethod=method;
                localStorage.playMethod=method;
            },
            Visual(){
                let ctx=null;
                let analyser=this.analyser;
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
            },
            startLyric(rs){
                let lrc=rs.lrc?rs.lrc.lyric:'[00:00.000] 暂无歌词';
                lyric.start(lrc,()=>{
                    return this.$refs.audio.currentTime;
                },(data)=>{
                    if(data.pivot%2===1) {
                        this.$ipc.send('player-control', 'lrc', {
                            left:data.target[data.pivot].innerHTML,
                            now: 'left',
                            right: data.target[data.pivot + 1] ? data.target[data.pivot + 1].innerHTML : ""
                        })
                    }else{
                        this.$ipc.send('player-control', 'lrc', {
                            left: data.target[data.pivot+1] ? data.target[data.pivot+1].innerHTML : "",
                            now: 'right',
                            right: data.target[data.pivot].innerHTML
                        })
                    }
                });
            },
            fullEnter(){
                this.$emit('full')
            }
        }
    }
</script>

<style scoped>
    @import "../../assets/css/lrc.css";
    .cm-music-player{
        width: 100%;
        height: 60px;
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
        width: 230px;
        height: calc(100% - 3px);
        margin-top: 3px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        z-index: 1;
    }
    .cm-control-button button{
        width: 32px;
        height: 32px;
        color: #fff6;
        text-align: center;
        line-height: 37px;
        border-radius: 100%;
        cursor: pointer;
        background: none;
    }
    .cm-control-button button i{
        font-size: 16px;
    }
    .cm-control-button button:nth-child(2){
        width: 32px;
        height: 32px;
        background: rgba(255,255,255,.3);
        color: #d7ebec;
        margin: 0 15px;
        line-height: 34px;
    }
    .cm-control-button button:nth-child(2) i{
        font-size: 14px;
    }
    .cm-volume-container{
        width: 80px;
        height: 5px;
        background: #636363;
        border-radius: 10px;
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
        background: rgba(255,255,255,.1);
        overflow: unset;
    }
    .slider-bar{
        width: 50%;
        height: 100%;
        background: #ff3b00;
        overflow: unset;
        z-index: -1;
        -webkit-transition:all .5s;
        -moz-transition:all .5s;
        -o-transition:all .5s;
    }
    .slider-bar .container{
        width: 100%;
        height: 60px;
        background: #ed401421;
        border-right:1px solid #ed401470;
        -webkit-transition:all .5s;
        -moz-transition:all .5s;
        -o-transition:all .5s;
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
</style>
