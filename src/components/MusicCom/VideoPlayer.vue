<template>
	<div
		class="cd-video-player-main"
		ref="VideoPlayer"
		@mousedown="VolumnState = false"
		tabindex="-1"
		@keydown.esc="FullScreen(true)"
		@keydown.space="VideoPlayerCommend('play')"
		@keydown.left="ChangeTime('-')"
		@keydown.right="ChangeTime('+')"
	>
		<div class="cd-video-main">
			<video
				:style="{ height: VideoHeight }"
				crossorigin="*"
				@error="VideoError"
				@ended="VideoEnded"
				@dblclick="FullScreen"
				@click="VideoPlayerCommend('play')"
				@progress="VideoCache"
				@timeupdate="VideoProcess"
				ref="video"
				@durationchange="PlayButtonState = 'sf-icon-pause'"
				@seeking="PlayButtonState = 'sf-icon-circle-notch sf-spin'"
				@canplay="VideoPlayerCommend('play')"
				:src="url"
			/>
			<div :class="'cd-video-control ' + BarAnimation" @mouseover="ShowControl" @mouseout="HideControl">
				<div :class="'cd-video-play ' + PlayButtonState" @click="VideoPlayerCommend('play')"></div>
				<div class="cd-video-player-slider-container" @mousedown="TimeChange" ref="slider">
					<div class="cd-player-process-bar" :style="{ width: ProcessWidth }">
						<span />
					</div>
					<div class="VideoTempBar" :style="{ width: CacheWidth }"></div>
				</div>
				<div class="cd-video-player-time">
					{{ TimeText }}
				</div>
				<div
					:class="'sf-icon-volume-up ' + (VolumnState ? 'cd-video-player-volumn-active' : '')"
					@mousedown.stop="VolumnState ? (VolumnState = false) : (VolumnState = true)"
				></div>
				<div :class="FullButton" @click="FullScreen(FullButton)"></div>
				<div class="cd-video-player-volumn" v-show="VolumnState">
					<div class="cd-player-volumn-container" ref="volunm" @mousedown="ChangeVolumn">
						<div class="cd-player-volumn-slider">
							<span />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Media from '../../tools/music/media';
export default {
	name: 'DiskVideoPlayer',
	watch: {
		FullFlag: {
			handler() {
				if (this.FullFlag) {
					clearTimeout(this.TimeOutID);
					this.TimeOutID = setTimeout(() => {
						this.BarAnimation = 'animated fadeOut';
						this.VideoHeight = '100%';
						clearTimeout(this.TimeOutID);
					}, 5000);
					this.FullButton = 'sf-icon-compress';
				} else {
					this.BarAnimation = 'animated slideInUp';
					this.VideoHeight = 'calc(100% - 70px)';
					this.FullButton = 'sf-icon-expand';
				}
			}
		}
	},
	data() {
		return {
			PlayList: [],
			NowPlay: {
				disk_name: '准备播放',
				count: 0
			},
			TimeText: '00:00/00:00',
			ProcessWidth: 0,
			VideoHeight: 'calc(100% - 70px)',
			CacheWidth: 0,
			PlayButtonState: 'sf-icon-play',
			VolumnState: false,
			animation: '',
			BarAnimation: '',
			FullFlag: false,
			FullButton: 'sf-icon-expand',
			TimeOutID: 0
		};
	},
	props: {
		url: String
	},
	methods: {
		ChangeTime(state) {
			let media = this.$refs.video;
			if (state === '-') {
				media.currentTime = media.currentTime - 5;
			} else {
				media.currentTime = media.currentTime + 5;
			}
		},
		VideoPlayerCommend(commend) {
			/*if(!this.PlayList.length){
                    return
                }*/
			let NowCount = this.NowPlay.count;
			let AllCount = this.PlayList.length;
			switch (commend) {
				case 'prev':
					if (NowCount !== 0) {
						this.PlayList.forEach(item => {
							item.play = false;
						});
						this.PlayList[NowCount - 1].play = 'active';
					}
					break;
				case 'next':
					if (NowCount !== AllCount - 1) {
						this.PlayList.forEach(item => {
							item.play = false;
						});
						this.PlayList[NowCount + 1].play = 'active';
					} else {
						this.VideoPlayerCommend('play');
					}
					break;
				case 'play':
					let media = this.$refs.video;
					if (media.paused) {
						media.play();
						this.PlayButtonState = 'sf-icon-pause';
						this.animation = 'animated zoomOut';
					} else {
						media.pause();
						this.PlayButtonState = 'sf-icon-play';
						this.animation = 'animated zoomIn';
					}
					this.$refs.VideoPlayer.focus();
					break;
			}
		},
		ChangeVolumn() {
			let media = this.$refs.video;
			let volunm = this.$refs.volunm;
			Media.MediaControl(media, 'volunm', 'y', volunm, event);
		},
		VideoEnded() {
			let media = this.$refs.video;
			media.currentTime = 0;
			this.VideoPlayerCommend('play');
		},
		TimeChange() {
			let media = this.$refs.video;
			let slider = this.$refs.slider;
			Media.MediaControl(media, 'play', 'x', slider, event);
			this.VideoPlayerCommend('play');
		},
		VideoProcess() {
			let media = this.$refs.video;
			this.TimeText = Media.secondDeal(media.currentTime) + '/' + Media.secondDeal(media.duration);
			this.ProcessWidth = (Math.round(media.currentTime) / Math.round(media.duration)) * 100 + '%';
		},
		VideoCache() {
			let media = this.$refs.video;
			try {
				this.CacheWidth = (media.buffered.end(media.buffered.length - 1) / media.duration).toFixed(2) * 100 + '%';
			} catch (e) {}
		},
		ShowControl() {
			this.$refs.VideoPlayer.focus();
			if (this.FullFlag) {
				this.BarAnimation = 'animated slideInUp';
				this.VideoHeight = 'calc(100% - 70px)';
			}
		},
		HideControl() {
			this.$refs.VideoPlayer.focus();
			if (this.FullFlag) {
				clearTimeout(this.TimeOutID);
				this.TimeOutID = setTimeout(() => {
					this.BarAnimation = 'animated fadeOut';
					this.VideoHeight = '100%';
					clearTimeout(this.TimeOutID);
				}, 5000);
			}
		},
		FullScreen(flag) {
			let el = this.$refs.VideoPlayer;
			el.focus();
			if (flag) {
				document.exitFullscreen
					? document.exitFullscreen()
					: document.mozCancelFullScreen
					? document.mozCancelFullScreen()
					: document.webkitExitFullscreen
					? document.webkitExitFullscreen()
					: '';
				this.$nextTick(() => {
					this.FullFlag = false;
				});
				clearTimeout(this.TimeOutID);
			}
			if (this.FullFlag) {
				document.exitFullscreen
					? document.exitFullscreen()
					: document.mozCancelFullScreen
					? document.mozCancelFullScreen()
					: document.webkitExitFullscreen
					? document.webkitExitFullscreen()
					: '';
				this.$nextTick(() => {
					this.FullFlag = false;
				});
				clearTimeout(this.TimeOutID);
			} else {
				(el.requestFullscreen && el.requestFullscreen()) ||
					(el.mozRequestFullScreen && el.mozRequestFullScreen()) ||
					(el.webkitRequestFullscreen && el.webkitRequestFullscreen()) ||
					(el.msRequestFullscreen && el.msRequestFullscreen());
				this.$nextTick(() => {
					this.FullFlag = true;
				});
			}
		},
		VideoError(e) {
			this.$Message.error(e);
		}
	}
};
</script>

<style scoped>
/**进度条*/
.cd-player-process-bar span,
.cd-player-volumn-slider span,
.cd-player-slider span {
	position: relative;
	top: -2px;
	right: -2px;
	z-index: 1;
	float: right;
	display: block;
	width: 10px;
	height: 10px;
	border-radius: 10px;
	-webkit-border-radius: 10px;
	-moz-border-radius: 10px;
	background: #e56464;
}
.cd-player-volumn-container {
	overflow: initial;
	float: left;
	width: 6px;
	height: 100px;
	background: #bbbbbb;
	border-radius: 3px;
	-webkit-border-radius: 3px;
	-moz-border-radius: 3px;
	position: relative;
	bottom: 0;
	overflow: unset !important;
}
.cd-player-volumn-slider {
	position: relative;
	top: 0;
	width: 100%;
	height: 100%;
	background: #e56464;
	overflow: unset !important;
}
.cd-player-process-bar,
.cd-player-volumn-slider,
.cd-player-slider {
	position: relative;
	z-index: 2;
	overflow: initial;
	width: 0;
	height: 5px;
	background: #e56464;
	border-radius: 3px;
	-webkit-border-radius: 3px;
	-moz-border-radius: 3px;
}
.cd-player-volumn-container {
	overflow: initial;
	float: left;
	width: 6px;
	height: 100px;
	background: #bbbbbb;
	border-radius: 3px;
	-webkit-border-radius: 3px;
	-moz-border-radius: 3px;
	position: relative;
	bottom: 0;
}
.cd-player-volumn-slider {
	position: relative;
	top: 0;
	width: 100%;
	height: 100%;
}
/*视频播放器*/
.cd-video-player-main {
	width: 100%;
	background: #fff;
	height: 100%;
	position: relative;
}
.cd-video-main {
	background: #000;
	-moz-user-select: none;
	-webkit-user-select: none;
	-ms-user-select: none;
	-khtml-user-select: none;
	user-select: none;
	width: 100%;
	height: 100%;
	min-height: 450px;
}
.cd-video-main video {
	width: 100%;
	height: calc(100% - 70px);
	-webkit-transition: all 0.35s;
	-moz-transition: all 0.35s;
	-o-transition: all 0.35s;
	z-index: 9999999;
}
.cd-video-control {
	position: absolute;
	bottom: 0;
	padding: 5px;
	width: 100%;
	height: 40px;
	background: #000;
	overflow: unset;
	-webkit-transition: all 0.35s;
	-moz-transition: all 0.35s;
	-o-transition: all 0.35s;
}
.cd-video-player-slider-container {
	float: left;
	overflow: initial;
	width: calc(100% - 210px);
	height: 5px;
	background: #cecece;
	margin-top: 13px;
	margin-left: 10px;
	border-radius: 3px;
	-webkit-border-radius: 3px;
	-moz-border-radius: 3px;
}
.VideoTempBar {
	position: relative;
	top: -10px;
	z-index: 1;
	height: 100%;
	background: #bbbbbb;
}
.cd-video-control .sf-icon-volume-up,
.cd-video-control .sf-icon-expand,
.sf-icon-compress {
	width: 30px;
	float: left;
	height: 30px;
	line-height: 30px;
	color: #c3c3c3;
	font-size: 16px;
	text-align: center;
}
.cd-video-play {
	float: left;
	display: inline-block;
	width: 30px;
	height: 30px;
	color: #c3c3c3;
	text-align: center;
	font-size: 22px;
	line-height: 30px;
}
.cd-video-play:hover,
.cd-video-control .sf-icon-expand:hover,
.cd-video-control .sf-icon-volume-up:hover,
.cd-video-control .sf-icon-compress:hover {
	color: #e56464;
	cursor: pointer;
}
.cd-video-player-volumn {
	width: 30px;
	height: 129px;
	background: #fff;
	position: relative;
	float: right;
	right: 32px;
	bottom: 163px;
	padding: 12px;
	-webkit-animation-duration: 0.35s;
	animation-duration: 0.35s;
	-webkit-animation-fill-mode: both;
	animation-fill-mode: both;
	-webkit-animation-name: fadeIn;
	animation-name: fadeIn;
}
.cd-video-player-time {
	float: left;
	width: 110px;
	height: 30px;
	line-height: 30px;
	font-size: 13px;
	padding: 0 10px;
	text-align: center;
	white-space: nowrap;
	color: #c3c3c3;
}
/*音乐播放器*/
.cd-music-player-container canvas {
	position: absolute;
	top: 0;
	z-index: 1;
	opacity: 0.75;
}
.cd-music-player-container ul {
	width: 252px;
	height: 60px;
	margin: 0 auto;
	position: relative;
	z-index: 2;
}
.cd-music-player-container ul > li {
	float: left;
	-webkit-app-region: no-drag;
}
</style>
