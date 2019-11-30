/*用户登录界面input*/
<template>
  <div
    :class="
      data.disabled || data.value ? 'CloudIndex-Input Input-Focus' : focusState
    "
  >
    <span :class="data.icon"></span>
    <input
      :id="id"
      :type="data.type ? data.type : 'text'"
      v-model="data.value"
      autocomplete="off"
      spellcheck="false"
      @change="change"
      @focus="focusState = 'CloudIndex-Input Input-Focus'"
      @blur="blur"
      :disabled="data.disabled ? data.disabled : false"
    />
    <label :for="id">{{ data.text }}</label>
    <Tooltip
      v-if="data.state === 'verify'"
      content="点击获取"
      placement="bottom-end"
      :transfer="true"
    >
      <button @click="getVerifyCode" :disabled="lock">
        {{ verifyState }}
      </button>
    </Tooltip>
  </div>
</template>

<script>
let time = null;
export default {
  name: "l-input",
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
      id: "Input-" + Math.random(),
      focusState: "CloudIndex-Input",
      url: this.$Api.Public.VerifyCode(),
      verifyState: "获取验证码",
      lock: false
    };
  },
  methods: {
    blur() {
      if (this.data.value) {
        this.focusState = "CloudIndex-Input Input-Focus";
      } else {
        this.focusState = "CloudIndex-Input";
      }
    },
    change() {
      this.$emit("on-change", this.data.value);
    },
    refresh() {
      this.url = this.$Api.Public.VerifyCode();
    },
    getVerifyCode() {
      this.$Api.User.sendCode(
        this.data.phone,
        rs => {
          if (rs.code === 200) {
            let count = 60;
            time = setInterval(() => {
              if (count !== 0) {
                count--;
                this.verifyState = count + "秒后重发";
                this.lock = true;
              } else {
                this.verifyState = "获取验证码";
                this.lock = false;
                clearInterval(time);
              }
            }, 1000);
          }
        },
        rs => {
          this.$Message.error(rs.message);
        }
      );
    }
  }
};
</script>

<style scoped></style>
