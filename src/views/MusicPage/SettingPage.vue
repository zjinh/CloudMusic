<template>
  <div class="cm-page-main">
    <div class="cm-setting-head">
      <i :class="'sf-icon-cog ' + (saving ? 'sf-spin' : '')"></i>
      <span>设置</span>
    </div>
    <div class="cm-setting-main">
      <ul class="cm-setting-left-nav">
        <li
          v-for="(item, index) in settingNav"
          :key="index"
          :class="item.active"
          ripple=""
          @click="switchNav(item, index)"
        >
          {{ item.name }}
        </li>
      </ul>
      <div class="cm-setting-content">
        <p class="title">{{ nowActiveName }}</p>
        <div class="cm-setting-card">
          <div class="cm-setting-item">
            <p class="name">启动：</p>
            <checkbox>开机自动运行</checkbox>
          </div>
        </div>
      </div>
      <div class="cm-setting-bottom">
        <button>返回</button>
        <button>确定</button>
        <button>应用</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SettingPage",
  inject: ["menuControl"],
  activated() {
    this.menuControl(true);
  },
  deactivated() {
    this.menuControl(false);
  },
  computed: {
    nowActiveName: function() {
      return (
        this.settingNav.filter(item => {
          return item.active === "active";
        })[0].name + "设置"
      );
    }
  },
  data() {
    return {
      saving: false,
      settingNav: [
        {
          name: "常规",
          active: "active"
        },
        {
          name: "歌词",
          active: ""
        },
        {
          name: "下载",
          active: ""
        },
        {
          name: "快捷键",
          active: ""
        }
      ]
    };
  },
  methods: {
    switchNav(item, index) {
      this.settingNav.forEach(menu => {
        menu.active = "";
      });
      item.active = "active";
      this.$set(this.settingNav, index, item);
    }
  }
};
</script>

<style scoped>
.cm-page-main {
  max-width: 1050px;
  padding: 0 20px;
  margin: 0 auto;
  z-index: 4;
  background: #fff;
}

.cm-setting-head {
  height: 50px;
  line-height: 50px;
  display: flex;
  align-items: center;
}

.cm-setting-head i {
  width: 50px;
  text-align: center;
  height: 50px;
  line-height: 52px;
  font-size: 25px;
}

.cm-setting-head span {
  font-size: 18px;
}

.cm-setting-main {
  width: 100%;
  height: calc(100% - 60px);
  padding-bottom: 20px;
  margin-top: 10px;
}

.cm-setting-left-nav {
  float: left;
  width: 200px;
  height: 100%;
  font-size: 14px;
  overflow: unset;
}

.cm-setting-left-nav li {
  width: 200px;
  height: 45px;
  line-height: 45px;
  padding-left: 20px;
  background: #fff;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0);
  cursor: pointer;
}

.cm-setting-left-nav li:hover {
  color: #e56464;
}

.cm-setting-left-nav .active {
  width: 201px;
  border: 1px solid #eee;
  border-right: none;
  color: #e56464;
  z-index: 1;
  border-radius: 5px 0 0 5px;
}

.cm-setting-content {
  float: left;
  width: calc(100% - 200px);
  height: calc(100% - 50px);
  border: 1px solid #eee;
  border-radius: 0 5px 5px 5px;
  padding: 0 15px;
}

.cm-setting-card {
  width: 100%;
  height: 100%;
}

.cm-setting-content .title {
  height: 45px;
  line-height: 45px;
  font-size: 16px;
}

.cm-setting-item {
  width: 100%;
}

.cm-setting-item .name {
  font-size: 14px;
  color: #333;
  line-height: 30px;
}

.cm-setting-item .ivu-checkbox-wrapper {
  font-size: 14px;
}

.cm-setting-bottom {
  width: calc(100% - 200px);
  height: 70px;
  float: left;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.cm-setting-bottom button {
  border-radius: 3px;
  border: 1px solid #eee;
  padding: 5px 10px;
  font-size: 14px;
  margin-left: 10px;
  background: none;
}
</style>
