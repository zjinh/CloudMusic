<template>
	<div class="cm-desktop-lrc">
		<p class="left" :class="lrcData.now === 'left' ? ' now' : ''">
			{{ lrcData.left }}
		</p>
		<p class="right" :class="lrcData.now === 'right' ? ' now' : ''">
			{{ lrcData.right }}
		</p>
	</div>
</template>

<script>
export default {
	name: 'LrcWindow',
	created() {
		this.$ipc.on('data', (e, msg) => {
			this.lrcData = Object.assign(this.lrcData, msg);
		});
	},
	data() {
		return {
			lrcData: {
				left: '',
				right: '',
				now: ''
			}
		};
	}
};
</script>

<style scoped>
.cm-desktop-lrc {
	width: 100%;
	height: 100%;
	font-size: 20px;
	padding: 5px;
}
.cm-desktop-lrc .left,
.cm-desktop-lrc .right {
	color: #fff;
	-webkit-text-stroke: 1px rgba(0, 0, 0, 0.5);
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
	height: 35px;
	font-weight: bold;
}
.cm-desktop-lrc .left {
	text-align: left;
}
.cm-desktop-lrc .right {
	text-align: right;
}
.cm-desktop-lrc .now {
	color: #e56464;
	-webkit-text-stroke: 0 rgba(0, 0, 0, 0);
}
</style>
