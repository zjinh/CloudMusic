<template>
    <section class="cm-full-music-player animated slide-down-enter">
        <div class="cm-full-music-control-btn">
            <button tabindex="-1" class="sf-icon-ellipsis-h" @click="playerControl('')"></button>
            <button tabindex="-1" class="sf-icon-dot-circle" @click="switchMode"></button>
        </div>
        <div class="cm-full-music-song-info animated fadeIn" v-show="!mode">
            <div>
                <h1>{{NowPlay.title}}</h1>
                <p>{{NowPlay.artist}}</p>
            </div>
        </div>
        <div class="cm-full-music-container">
            <div class="cm-full-next-container" v-show="!mode">
                <div class="line"></div>
                <button tabindex="-1" class="sf-icon-angle-left" @click="playerControl('prev')"></button>
            </div>
            <div class="cm-full-poster-container" :style="{'margin-left':mode?'30px':'0'}">
                <canvas id="wrap" height="300" width="300"></canvas>
                <div class="cm-full-music-poster">
                    <img :src="NowPlay.picture" alt="" draggable="false">
                </div>
                <p id="cm-fully-music-line-lrc"></p>
            </div>
            <div class="cm-full-next-container">
                <div class="line"></div>
                <button tabindex="-1" class="sf-icon-angle-right" @click="playerControl('next')"></button>
            </div>
            <div class="cm-full-music-lrc" :style="{width:mode?'calc(100% - 430px)':'0'}">
                <h1>{{NowPlay.title}}</h1>
                <p class="artist">{{NowPlay.artist}}</p>
                <div id="cm-full-music-lrc-list"></div>
            </div>
        </div>
        <BlurBackground :url="NowPlay.picture" style="height: 100%"></BlurBackground>
    </section>
</template>

<script>
    import BlurBackground from "./BlurBackground"
    export default {
        name: "FullPlayer",
        props:{
            PlayList:Array,
            NowPlay:Object,
            analyser:[Object,AnalyserNode]
        },
        data(){
            return{
                mode:true
            }
        },
        components:{
            BlurBackground
        },
        methods:{
            visualRound(){
                let wrap = document.getElementById("wrap");
                let cxt = wrap.getContext("2d");
                //创建数据
                let output = new Uint8Array(180);
                let du = 2;//角度
                let potInt = { x: 150, y: 150 };//起始坐标
                let R = 120;//半径
                let W = 2;//宽
                let Rv=0;
                let analyser=this.analyser;
                let gradient = cxt.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(1, '#e56464');
                gradient.addColorStop(0.5, '#ed401470');
                gradient.addColorStop(0, '#fff');
                function drawSpectrum() {
                    analyser.getByteFrequencyData(output);//获取频域数据
                    cxt.clearRect(0, 0, wrap.width, wrap.height);
                    //画线条
                    for (let i = 0; i < 180; i++) {
                        let value = output[i] / 10;//<===获取数据
                        cxt.beginPath();
                        cxt.lineWidth = W;
                        cxt.moveTo(( Math.sin((i * du) / 180 * Math.PI) * R + potInt.y),-Math.cos((i * du) / 180 * Math.PI) * R + potInt.x);//从圆边开始
                        Rv = (R + value);
                        cxt.strokeStyle  = gradient;
                        cxt.lineTo( ( Math.sin((i * du) / 180 * Math.PI) * Rv + potInt.y),-Math.cos((i * du) / 180 * Math.PI) * Rv + potInt.x);
                        cxt.stroke();
                    }
                    cxt.fill();
                    requestAnimationFrame(drawSpectrum);
                }
                drawSpectrum();
            },
            playerControl(data){
                this.$emit('control',data)
            },
            switchMode(){
                this.mode=!this.mode;
            }
        }
    }
</script>

<style scoped>
    @import "../../assets/css/lrc.css";
    .cm-full-music-player{
        width: 100%;
        height:100%;
        -o-transition: all 350ms;
        -moz-transition: all 350ms;
        -webkit-transition: all 350ms;
        position: absolute;
        left: 0;
        top: 59px;
        z-index: 3;
        display: flex;
        justify-content: center;
    }
    .cm-full-music-control-btn,.cm-full-music-song-info{
        position: absolute;
        left: 0;
        top: 0;
        z-index: 5;
        width: 100%;
        padding: 0 20px;
    }
    .cm-full-music-control-btn button{
        width: 40px;
        height: 40px;
        margin-top: 57px;
        color: white;
        font-size: 20px;
        background: none;
        border-radius: 100%;
    }
    .cm-full-music-song-info{
        display: flex;
        align-items: center;
        top: 90px;
        justify-content: center;
    }
    .cm-full-music-song-info *{
        width: 100%;
        text-align: center;
    }
    .cm-full-music-song-info h1{
        font-weight: normal;
        font-size: 20px;
        color: #fff;
    }
    .cm-full-music-song-info p{
        font-size: 14px;
        color: #e56464;
    }
    .cm-full-music-container{
        width: 90%;
        height: calc(100% - 60px);
        position: absolute;
        z-index: 3;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .cm-full-poster-container{
        width: 300px;
        height: 300px;
        margin-left: 30px;
        position: relative;
        overflow: unset;
    }
    .cm-full-poster-container *{
        position: absolute;
    }
    .cm-full-poster-container p{
        top: 100%;
        text-align: center;
        width: 100%;
        font-size: 16px;
        color: #fff;
    }
    .cm-full-music-poster{
        width: 235px;
        height: 235px;
        border-radius: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        left: 32px;
        top: 32px;
    }
    .cm-full-music-poster img{
        width: 100%;
        height: 100%;
    }
    .cm-full-next-container{
        width: 100px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        overflow: unset;
    }
    .cm-full-next-container .line{
        width: 126%;
        height: 2px;
        position: absolute;
        background: #e5646478;
        left: -19px;
        border-radius: 0 50% 50% 0;
    }
    .cm-full-next-container button{
        width: 40px;
        height: 40px;
        border-radius: 100%;
        color: #464646;
        background: #e56464;
        font-size: 28px;
        text-align: center;
        line-height: 39px;
    }
    .cm-full-music-lrc{
        width: calc(100% - 430px);
        margin-left: 30px;
        height: 60%;
        -o-transition: all 350ms;
        -moz-transition: all 350ms;
        -webkit-transition: all 350ms;
    }
    .cm-full-music-lrc h1{
        color: #fff;
        font-size: 30px;
        font-weight: normal;
    }
    .cm-full-music-lrc .artist{
        color: #e56464;
        font-size: 16px;
    }
</style>
