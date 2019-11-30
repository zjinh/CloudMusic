<template>
  <div class="cm-radio-list-container">
    <div class="cm-radio-list-list" @scroll="scrollToLoad">
      <div
        v-for="(item, index) in data"
        :key="index"
        @click="clickToSelect(item)"
        class="radio-block"
        ripple=""
      >
        <img v-lazy="item.picUrl" alt="" draggable="false" />
        <p>{{ item.name }}</p>
        <span class="creator">by {{ item.dj.nickname }}</span>
        <CountTag>{{ $numberCount(item.subCount) }}订阅</CountTag>
      </div>
    </div>
    <NoData v-show="data.length === 0 && !loading"></NoData>
    <loading v-show="loading"></loading>
  </div>
</template>

<script>
export default {
  name: "RadioList",
  props: {
    data: Array,
    type: {
      type: String,
      default: "list"
    },
    loading: Boolean
  },
  methods: {
    clickToSelect(item) {
      this.$router.push({
        path: "/radio-detail/" + item.id,
        query: {
          data: JSON.stringify(item)
        }
      });
      this.$emit("callback", item);
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
.cm-radio-list-container {
  width: 100%;
  height: 100%;
  position: relative;
}
.cm-radio-list-list {
  width: 100%;
  height: 100%;
  min-height: 330px;
  overflow: auto;
}
.radio-block {
  float: left;
  width: 175px;
  height: 220px;
  cursor: pointer;
  margin: 5px 10px;
  position: relative;
}
.radio-block img {
  width: 100%;
  height: 175px;
  border: 1px solid #eee;
}
.radio-block p {
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-size: 12px;
  color: #333;
}
.radio-block .creator {
  font-size: 12px;
  color: #b9b9b9;
}
.radio-block .count {
  position: absolute;
  left: 5px;
  top: 5px;
  color: #fff;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.1);
}
</style>
