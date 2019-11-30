<template>
  <div class="cm-page-main">
    <PageHeader
      title="七天播放历史"
      left="一周内播放了"
      :count="historySongs.length"
      :prefix="prefix"
    ></PageHeader>
    <div class="cm-history-list">
      <SongList :data="historySongs" :loading="loading"></SongList>
    </div>
  </div>
</template>

<script>
export default {
  name: "PlayHistory",
  data() {
    return {
      historySongs: [],
      prefix: "",
      loading: false
    };
  },
  activated() {
    this.getPlayHistory();
  },
  methods: {
    getPlayHistory() {
      this.$Api.Music.song.history(undefined, (rs, data) => {
        if (data.max) {
          this.prefix =
            "首歌曲，共" +
            data.count +
            "次，其中“" +
            rs[0].name +
            "”播放了" +
            data.max +
            "次";
        }
        this.historySongs = rs;
        this.loading = false;
      });
    }
  }
};
</script>

<style scoped>
.cm-history-list {
  width: 100%;
}
</style>
