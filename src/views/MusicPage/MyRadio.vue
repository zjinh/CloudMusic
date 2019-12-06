<template>
	<div class="cm-page-main">
		<PageHeader title="我订阅的电台" :count="radioCount" prefix="个电台" />
		<div class="cm-radio-list">
			<RadioList :data="radioListData" :loading="loading" @scroll-end="loadMore" />
		</div>
	</div>
</template>

<script>
import RadioList from '../../components/MusicCom/ListCom/RadioList';
export default {
	name: 'MyRadio',
	components: {
		RadioList
	},
	data() {
		return {
			radioCount: 0,
			radioListData: [],
			hasMore: false,
			loading: true,
			page: 0
		};
	},
	activated() {
		this.getSubRadio(0);
	},
	methods: {
		getSubRadio(page) {
			this.$Api.Music.sublist.radio(page, rs => {
				this.page = page;
				this.radioListData = rs.djRadios;
				this.radioCount = rs.count;
				this.hasMore = rs.hasMore;
				this.loading = false;
			});
		},
		loadMore() {
			if (this.hasMore) {
				this.page++;
				this.getSubRadio(this.page);
			}
		}
	}
};
</script>

<style scoped>
.cm-radio-list {
	width: 100%;
}
</style>
