<template>
	<div class="cm-videolist-container">
		<div class="cm-videolist-list" @scroll="scrollToLoad">
			<div v-for="(item, index) in data" :key="index" @click="clickToSelect(item)" :class="type ? 'video-self-block' : 'video-block'" ripple="">
				<img v-lazy="item.coverUrl || item.imgurl" src="" alt="" draggable="false" />
				<p>{{ item.title || item.name }}</p>
				<span class="creator" v-if="item.creator">by {{ item.creator[0].userName }}</span>
				<CountTag class="count sf-icon-video"> {{ $numberCount(item.playTime || item.playCount || 0) }}</CountTag>
				<CountTag class="time"> {{ timeDeal(item.durationms || item.duration || 0) }}</CountTag>
			</div>
		</div>
		<NoData v-show="data.length === 0 && !loading" />
		<loading v-show="loading" />
	</div>
</template>

<script>
import media from '../../../tools/music/media';
export default {
	name: 'VideoList',
	props: {
		data: Array,
		type: String,
		loading: Boolean
	},
	methods: {
		clickToSelect(item) {
			this.$router.push({
				path: '/video-detail/' + (item.vid || item.id),
				query: {
					data: JSON.stringify(item)
				}
			});
			this.$emit('callback');
		},
		scrollToLoad(e) {
			this.$scrollEnd(e, () => {
				this.$emit('scroll-end');
			});
		},
		timeDeal(s) {
			return media.secondDeal(s / 1000);
		}
	}
};
</script>

<style scoped>
.cm-videolist-container {
	width: 100%;
	height: 100%;
	position: relative;
}
.cm-videolist-list {
	width: 100%;
	height: 100%;
	min-height: 330px;
	overflow: auto;
}
.video-block {
	float: left;
	width: 170px;
	height: 160px;
	cursor: pointer;
	margin: 10px 13px;
	position: relative;
}
.video-block img {
	width: 100%;
	height: 100px;
}
.video-block p,
.video-self-block p {
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	font-size: 12px;
	color: #333;
}
.video-block .creator .video-self-block .creator {
	font-size: 12px;
	color: #b9b9b9;
}
.video-block .time,
.video-self-block .time {
	right: 0;
	top: 79px;
	bottom: unset;
}
.video-block .count,
.video-self-block .count {
	bottom: unset;
	right: unset;
	left: 0;
	top: 0;
}
.video-self-block {
	width: 100%;
	height: 80px;
	position: relative;
	margin-top: 10px;
}
.video-self-block img {
	float: left;
	width: 150px;
	height: 85px;
}
.video-self-block p {
	-webkit-line-clamp: 3;
	padding-left: 5px;
	width: calc(100% - 150px);
}
.video-self-block .creator {
	position: absolute;
	bottom: 0;
	left: 155px;
}
.video-self-block .time {
	right: calc(100% - 150px);
	top: 60px;
}
</style>
