<template>
    <section class="cm-music-player">
        <img class="poster" draggable="false" src="http://p1.music.126.net/oCnACmhB6CM5oZyWmNfmTg==/109951163051142326.jpg" alt="">
        <section class="song-info">
            <p class="name">你曾是少年</p>
            <p class="singer">S.H.E</p>
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
        <ul class="cm-play-mode">
            <li class="sf-icon-random active"></li>
            <li class="sf-icon-repeat"></li>
            <li class=" sf-icon-list"></li>
        </ul>
        <canvas width="600" height="240" id="canvas"></canvas>
        <audio src="E:\音乐\林俊杰 - 醉赤壁.flac" ref="audio"
               @ended="PlayerCommend('next')"
               @timeupdate="MusicProcess"
               @error="PlayerCommend('next')"
               @durationchange="PlayButtonState='sf-icon-pause'"
               @seeking="PlayButtonState='sf-icon-circle-notch sf-spin'"
               @canplay="PlayerCommend('play')"
        ></audio>
    </section>
</template>

<script>
    import Media from '../../api/media';
    export default {
        name: "PlayerControl",
        props:{
            PlayList:{
                type:Array,
                default:function () {
                    return []
                }
            }
        },
        data(){
            return{
                ProcessWidth:'0%',
                TimeText:"00:00",
                PlayButtonState:'sf-icon-play',
            }
        },
        methods:{
            PlayerCommend(commend){
                if(!this.PlayList.length){
                    return
                }
                let NowCount=0;
                let AllCount=this.PlayList.length;
                switch (commend) {
                    case 'prev':
                        if(NowCount!==0){
                            this.PlayList.forEach((item)=>{
                                item.play=false;
                            });
                            this.PlayList[NowCount-1].play='active'
                        }
                        break;
                    case 'next':
                        if(NowCount!==AllCount-1){
                            this.PlayList.forEach((item)=>{
                                item.play=false;
                            });
                            this.PlayList[NowCount+1].play='active'
                        }else{
                            this.PlayerCommend('play');
                        }
                        break;
                    case 'play':
                        let media=this.$refs.audio;
                        console.log(media.paused)
                        if(media.paused){
                            media.play();
                            this.PlayButtonState='sf-icon-pause';
                            this.$ipc.send('player-control','pause')
                        }else{
                            media.pause();
                            this.PlayButtonState='sf-icon-play';
                            this.$ipc.send('player-control','play')
                        }
                        //this.header.title=this.NowPlay.disk_name;
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
                    capStyle = '#009493',
                    meterNum = 800 / (10 + 2), //count of the meters
                    capYPositionArray = []; ////store the vertical position of hte caps for the preivous frame
                ctx = canvas.getContext('2d');
                let gradient = ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(1, '#009493');
                gradient.addColorStop(0.5, '#506c6f');
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
        }
    }
</script>

<style scoped>
    .cm-music-player{
        width: 100%;
        height: 60px;
        border-top: 1px solid #eee;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 3;
        border-radius: 0 0 5px 5px;
    }
    .cm-music-player .poster{
        float: left;
        width: 60px;
        height: 57px;
        margin-top: 3px;
        border-radius: 0 0 0 5px;
        position: relative;
        z-index: 1;
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
        line-height: 16px;
        text-overflow: ellipsis;
    }
    .cm-music-player .song-info .name{
        font-weight: bold;
        font-size: 15px;
        color: #fff;
    }
    .cm-music-player .song-info .singer{
        font-size: 12px;
        color: #254341;
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
        color: #506c6f;
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
        background: #009493;
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
        background: #0095941f;
        border-right: 1px solid #00959452;
    }
    .slider-bar .container span{
        float: right;
        padding: 3px;
        color: #009594;
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
        color: #009594;
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
        background: #009493;
        color: #fff;
    }
</style>
