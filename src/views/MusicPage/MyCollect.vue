<template>
	<div class="cm-page-main">
		<TabBar :data="collectType" @select="tabBarSelect" />
		<div class="cm-collect-main">
			<AlbumList v-show="nowCollectType[0] === 'album'" :data="collectResult.album" :loading="loading" @scroll-end="loadMore" />
			<ArtistList v-show="nowCollectType[0] === 'artist'" :data="collectResult.artist" :loading="loading" @scroll-end="loadMore" />
			<PlayList v-show="nowCollectType[0] === 'playlist'" :data="collectResult.playlist" :loading="loading" @scroll-end="loadMore" />
			<VideoList v-show="nowCollectType[0] === 'mv'" :data="collectResult.mv" :loading="loading" @scroll-end="loadMore" />
		</div>
	</div>
</template>

<script>
import AlbumList from '../../components/MusicCom/ListCom/AlbumList';
import ArtistList from '../../components/MusicCom/ListCom/ArtistList';
import PlayList from '../../components/MusicCom/ListCom/PlayList';
import VideoList from '../../components/MusicCom/ListCom/VideoList';
export default {
	name: 'MyRadio',
	components: {
		AlbumList,
		ArtistList,
		PlayList,
		VideoList
	},
	data() {
		return {
			collectType: [
				{
					name: '专辑',
					type: 'album',
					value: 10,
					active: 'active'
				},
				{
					name: '歌手',
					type: 'artist',
					value: 100,
					active: ''
				},
				{
					name: '视频',
					type: 'mv',
					value: 1014,
					active: ''
				}
			],
			loading: false,
			nowCollectType: ['album', 1],
			collectResult: {
				album: [],
				artist: [],
				playlist: [],
				mv: []
			},
			collectParams: {
				album: {
					page: 0,
					more: true
				}
			}
		};
	},
	created() {
		this.collectType.forEach(item => {
			this.collectResult[item.type] = [];
			this.collectParams[item.type] = { page: 0, more: true };
		});
	},
	activated() {
		this.loadData(0);
	},
	methods: {
		tabBarSelect(type) {
			this.nowCollectType = [type.type, type.value];
			if (this.collectResult[type.type].length === 0) {
				this.loadData(0);
			}
		},
		loadData(page) {
			let type = this.nowCollectType[0];
			this.loading = page === 0;
			this.$Api.Music.sublist[type](page, rs => {
				this.loading = false;
				this.collectParams[type].page = page; //记录页数
				this.collectParams[type].more = rs.hasMore || rs.more;
				if (page === 0) {
					this.collectResult[type].count = rs.count; //获取有搜索结果长度
					this.collectResult[type] = rs.data;
				} else {
					this.collectResult[type] = [...this.collectResult[type], ...rs.data];
				}
			});
		},
		loadMore() {
			let type = this.collectParams[0];
			if (this.collectParams[type].more) {
				this.collectParams[type].page++;
				this.loadData(this.collectParams[type].page);
			}
		}
	}
};
</script>

<style scoped />
