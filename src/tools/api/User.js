import { Ajax, severAddress } from "./request";
import LocalFile from "./LocalFile";
export default {
  UserId: null,
  Login(data, callback, error) {
    Ajax({
      url: "/login/" + (data.phone ? "cellphone" : ""),
      method: "GET",
      data: data,
      success: rs => {
        this.UserId = rs.profile.userId;
        LocalFile.init(rs.profile.userId, () => {
          LocalFile.write("user", rs.profile);
          LocalFile.write("key", rs.account.id);
          LocalFile.write("login", JSON.parse(JSON.stringify(data)), true);
          callback && callback(rs.profile);
        });
      },
      error: error
    });
  },
  refresh(data, callback, error) {
    Ajax({
      url: "/login/refresh",
      data: data,
      success: callback,
      error: error
    });
  },
  Register(data, callback, error) {
    Ajax({
      url: "/register/cellphone",
      method: "get",
      data: data,
      success: callback,
      error: error
    });
  },
  UserInfo(callback, error) {
    Ajax({
      url: "/service/user/detail",
      data: {
        uid: this.UserId
      },
      success: callback,
      error: error
    });
  },
  sendCode(phone, callback, error) {
    Ajax({
      url: "/captcha/sent",
      method: "get",
      data: {
        phone: phone
      },
      success: callback,
      error: error
    });
  },
  isRegister(phone, callback, error) {
    Ajax({
      url: "/cellphone/existence/check",
      method: "get",
      data: {
        phone: phone,
        time: Math.random(0, 10)
      },
      success: callback,
      error: error
    });
  },
  verify(phone, captcha, callback, error) {
    Ajax({
      url: "/captcha/verify",
      method: "get",
      data: {
        captcha: captcha,
        phone: phone
      },
      success: callback,
      error: error
    });
  },
  ReSend(data, callback, error) {
    Ajax({
      url: "/service/user/resend",
      data: data,
      success: callback,
      error: error
    });
  },
  detail(id, callback, error) {
    Ajax({
      url: "/user/detail",
      data: {
        uid: id
      },
      success: callback,
      error: error
    });
  },
  playList(id, offset, callback, error) {
    Ajax({
      url: "/user/playlist",
      method: "get",
      data: {
        uid: id,
        limit: 100,
        offset: offset * 100
      },
      success: callback,
      error: error
    });
  },
  follow(data, callback, error) {
    Ajax({
      url: "/follow",
      method: "get",
      data: data,
      success: callback,
      error: error
    });
  },
  follows(id, offset, callback, error) {
    Ajax({
      url: "/user/follows",
      method: "get",
      data: {
        uid: id,
        limit: 100,
        offset: offset * 100
      },
      success: callback,
      error: error
    });
  },
  followeds(id, offset, callback, error) {
    Ajax({
      url: "/user/followeds",
      method: "get",
      data: {
        uid: id,
        limit: 100,
        offset: offset * 100,
        _t: new Date().getTime()
      },
      success: callback,
      error: error
    });
  },
  audio(id, offset, callback, error) {
    Ajax({
      url: "/user/audio",
      method: "get",
      data: {
        uid: id,
        limit: 100,
        offset: offset * 100
      },
      success: callback,
      error: error
    });
  },
  dj(id, offset, callback, error) {
    Ajax({
      url: "/user/dj",
      method: "get",
      data: {
        uid: id,
        limit: 100,
        offset: offset * 100
      },
      success: callback,
      error: error
    });
  }
};
