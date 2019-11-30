<template>
  <div class="cm-artist-container">
    <ul class="cm-artist-list" @scroll="scrollToLoad">
      <li
        v-for="(item, index) in data"
        :key="index"
        @click="clickToSelect(item)"
        ripple=""
      >
        <img v-lazy="item.picUrl || item.img1v1Url" alt="" draggable="false" />
        <span>{{ item.name }}</span>
      </li>
    </ul>
    <NoData v-show="data.length === 0 && !loading"></NoData>
    <loading v-show="loading"></loading>
  </div>
</template>

<script>
export default {
  name: "ArtistList",
  props: {
    data: Array,
    type: String,
    loading: Boolean
  },
  methods: {
    clickToSelect(item) {
      this.$router.push({
        path: "/artist-detail/" + item.id,
        query: {
          data: JSON.stringify(item)
        }
      });
      this.$emit("callback");
    },
    scrollToLoad(e) {
      this.$scrollEnd(e, () => {
        this.$emit("scroll-end");
      });
    }
  }
};
</script>

<style scoped>
.cm-artist-container {
  width: 100%;
  height: 100%;
  position: relative;
}
.cm-artist-list {
  width: 100%;
  height: 100%;
  min-height: 330px;
  overflow: auto;
}
.cm-artist-list li {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  cursor: pointer;
  font-size: 14px;
}
.cm-artist-list li:nth-child(odd) {
  background: #f9f9f9;
}
.cm-artist-list li img {
  width: 40px;
  height: 40px;
}
.cm-artist-list li span {
  margin-left: 10px;
}
</style>
