<template>
  <div id="Cloud-Music">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'Cloud-Music',
    created() {
      window.addEventListener( "dragenter", function (e) {
        e.preventDefault();
      }, false);
      window.addEventListener( "dragover", function (e) {
        e.preventDefault();
      }, false );
      window.addEventListener( "dragleave", function (e) {
        e.preventDefault();
      }, false );
      window.addEventListener( "drop", function (e) {
        e.preventDefault();
      }, false );
    }
  }
</script>

<style>
  @import url("assets/font/icon.css");
  @import url("assets/css/public.css");
</style>
