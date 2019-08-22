<template>
    <section class="cm-music-player">
        <img class="poster" draggable="false" src="http://p1.music.126.net/oCnACmhB6CM5oZyWmNfmTg==/109951163051142326.jpg" alt="">
        <section class="song-info">
            <p class="name">你曾是少年</p>
            <p class="singer">S.H.E</p>
        </section>
        <ul class="cm-control-button">
            <li ripple="">
                <i class="sf-icon-step-backward"></i>
            </li>
            <li ripple="">
                <i class="sf-icon-pause"></i>
            </li>
            <li ripple="">
                <i class="sf-icon-step-forward"></i>
            </li>
        </ul>
        <div class="slider-bar-container">
            <div class="slider-bar">
                <div class="container">
                    <span>00:52</span>
                    <div class="lighter"></div>
                </div>
            </div>
        </div>
        <canvas width="350" height="60" id="canvas" style="zoom: 40%"></canvas>
        <ul class="cm-play-mode">
            <li class="sf-icon-random active"></li>
            <li class="sf-icon-repeat"></li>
            <li class=" sf-icon-list"></li>
        </ul>
        <audio autoplay src="http://m10.music.126.net/20190822175838/e17be00438798490eb79c281a396c689/ymusic/7649/385a/3e35/4a4539ebfbb7b9f8d95ab9fb111471ed.mp3" ref="audio"></audio>
    </section>
</template>

<script>
    export default {
        name: "PlayerControl",
        mounted(){

            this.Visual()
        },
        methods:{
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
                    capStyle = '#5b5bea',
                    meterNum = 800 / (10 + 2), //count of the meters
                    capYPositionArray = []; ////store the vertical position of hte caps for the preivous frame
                ctx = canvas.getContext('2d');
                let gradient = ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(1, '#8140ff');
                gradient.addColorStop(0.5, '#5b5bea');
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
        height: 60px;
        border-radius: 0 0 0 5px;
        position: relative;
        z-index: 1;
    }
    .cm-music-player .song-info{
        float: left;
        width: 150px;
        height: 100%;
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
    .cm-control-button{
        float: left;
        width: 150px;
        height: 100%;
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
    .slider-bar-container{
        width: 100%;
        height: 3px;
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
        height: 100%;
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
    }
    .cm-play-mode li:hover ,.cm-play-mode .active{
        background: #009493;
        color: #fff;
    }
</style>
