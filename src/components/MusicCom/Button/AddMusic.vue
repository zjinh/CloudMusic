<template>
  <button
    :class="icon"
    @click="AddMusic"
    v-if="music.type !== 'local'"
  ></button>
</template>

<script>
export default {
  name: "AddMusic",
  props: {
    music: Object,
    icon: {
      type: String,
      default: "sf-icon-plus"
    }
  },
  methods: {
    AddMusic() {
      this.$Message.info("正在开发");
    }
  }
};
</script>

<style scoped></style>
