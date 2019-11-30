<template>
  <div class="cm-button-area">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "ButtonArea"
};
</script>

<style scoped>
.cm-button-area button {
  padding: 9px 6px;
  background: #fff;
  border: 1px solid #eee;
  color: #999999;
  font-size: 13px;
  margin-right: 5px;
  border-radius: 3px;
}
.cm-button-area button:hover {
  background: #f7f7f7;
}
</style>
