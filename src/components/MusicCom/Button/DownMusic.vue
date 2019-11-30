<template>
  <button
    class="sf-icon-arrow-to-bottom"
    @click="AddMusic"
    v-if="music.type !== 'local'"
  ></button>
</template>

<script>
export default {
  name: "DownMusic",
  props: {
    music: Object
  },
  methods: {
    AddMusic() {
      this.$Message.info("正在开发,下载");
    }
  }
};
</script>

<style scoped></style>
