import Vue from 'vue';
import axios from 'axios/index';
import electron from 'electron';
const ipcRenderer = electron.ipcRenderer;
const packageInfo = require('../../package.json');
const path = require('path');

axios.interceptors.response.use(
	function(response) {
		// 对响应数据做点什么
		return response;
	},
	function(err) {
		if (err && err.response) {
			switch (err.response.status) {
				case 400:
					err.message = '请求错误(400)';
					break;
				case 401:
					err.message = '未授权，请重新登录(401)';
					break;
				case 403:
					err.message = '拒绝访问(403)';
					break;
				case 404:
					err.message = '请求出错(404)';
					break;
				case 408:
					err.message = '请求超时(408)';
					break;
				case 500:
					err.message = '服务器错误(500)';
					break;
				case 501:
					err.message = '服务未实现(501)';
					break;
				case 502:
					err.message = '网络错误(502)';
					break;
				case 503:
					err.message = '服务不可用(503)';
					break;
				case 504:
					err.message = '网络超时(504)';
					break;
				case 505:
					err.message = 'HTTP版本不受支持(505)';
					break;
				default:
					err.message = `连接出错(${err.response.status})!`;
			}
		} else {
			err.message = '连接服务器失败，请检查网络连接或联系管理员';
		}
		return Promise.reject(err);
	}
);
String.prototype.Before = function(substr) {
	return this.substring(this.lastIndexOf(substr) + 1, this.length);
};
String.prototype.Exist = function(substr) {
	if (typeof this !== 'string') {
		return;
	}
	if (substr === '|*|') {
		return true;
	}
	for (let i = 0; i < substr.split(',').length; i++) {
		if (this.indexOf(substr.split(',')[i]) >= 0) {
			return true;
		}
	}
	return false;
};
Date.prototype.format = function(fmt) {
	const o = {
		'y+': this.getFullYear(),
		'M+': this.getMonth() + 1,
		'd+': this.getDate(),
		'H+': this.getHours(),
		'm+': this.getMinutes(),
		's+': this.getSeconds(),
		'S+': this.getMilliseconds(),
		'q+': Math.floor(this.getMonth() / 3) + 1,
		'h+': (() => {
			const hour = this.getHours() % 12;
			return hour === 0 ? 12 : hour;
		})(),
		'E+': (() => {
			const week = {
				'0': 'Sunday',
				'1': 'Monday',
				'2': 'Tuesday',
				'3': 'Wednesday',
				'4': 'Thursday',
				'5': 'Friday',
				'6': 'Saturday'
			};
			return week[this.getDay() + ''];
		})(),
		/*
    "e+": (()=>{
        const week = {"0":"Sun","1":"Mon","2":"Tue","3":"Wed","4":"Thu","5":"Fri","6":"Sat"};
        return week[this.getDay()+""];
    })(),
    */
		x1: (() => {
			const week = {
				'0': '周日',
				'1': '周一',
				'2': '周二',
				'3': '周三',
				'4': '周四',
				'5': '周五',
				'6': '周六'
			};
			return week[this.getDay() + ''];
		})(),
		x2: (() => {
			const hour = ['凌晨', '早上', '下午', '晚上'];
			const h = this.getHours();
			if (h === 12) return '中午';
			return hour[parseInt(h / 6)];
		})()
	};
	for (let k in o) {
		if (new RegExp('(' + k + ')', 'g').test(fmt)) {
			const len = RegExp.$1.length;
			fmt = fmt.replace(RegExp.$1, len === 1 ? o[k] : ('00' + o[k]).substr(-len));
		}
	}
	return fmt;
};
JSON.handle = function(data) {
	return JSON.parse(JSON.stringify(data));
};

//引入electron接口
Vue.path = Vue.prototype.$path = path; //path接口
Vue.electron = Vue.prototype.$electron = electron; //electron
Vue.ipc = Vue.prototype.$ipc = ipcRenderer; //ipc接口
Vue.Notify = Vue.prototype.$notify = (msg, name) => {
	new Notification(packageInfo.name || name, {
		body: msg
	});
}; //通知接口
/**************************************************************自定义从这开始**************************************************************/
/*通用组件*/
import { Checkbox, Tooltip, Dropdown, DropdownMenu, DropdownItem, Time, Message, Progress } from 'iview';
import 'iview/dist/styles/iview.css';
import '../assets/css/iview.css'; //定制样式
Vue.component('Checkbox', Checkbox);
Vue.component('Tooltip', Tooltip);
Vue.component('Dropdown', Dropdown);
Vue.component('DropdownMenu', DropdownMenu);
Vue.component('DropdownItem', DropdownItem);
Vue.component('Time', Time);
Vue.component('Message', Message);
Vue.prototype.$Message = Message;
Vue.component('Progress', Progress);
Vue.prototype.$IVIEW = {};
import VueLazyload from 'vue-lazyload';
Vue.use(VueLazyload);
import VueVirtualScroller from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
Vue.use(VueVirtualScroller);
//引入element的部分组件
import { MessageBox, Dialog } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.use(Dialog);
Vue.prototype.Confirm = options => {
	MessageBox.confirm(options.tips, options.title, {
		confirmButtonText: options.confirmButtonText || '确定',
		cancelButtonText: '取消',
		dangerouslyUseHTMLString: true,
		type: options.type || 'warning'
	})
		.then(() => {
			options.callback();
		})
		.catch(() => {});
};
Vue.prototype.InputConfirm = options => {
	MessageBox.prompt(options.tips, options.title, {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		inputValue: options.value || '',
		inputPattern: options.inputPattern || '',
		inputErrorMessage: options.inputErrorMessage || ''
	})
		.then(({ value }) => {
			options.callback(value);
		})
		.catch(() => {});
};
/*公用组件*/
import PageHeader from '../components/MusicCom/PageHeader.vue';
import SongList from '../components/MusicCom/ListCom/SongList.vue';
import loading from '../components/MusicCom/loading.vue';
import NoData from '../components/MusicCom/NoData.vue';
import TabBar from '../components/MusicCom/TabBar.vue';
import DetailPageHead from '../components/MusicCom/DetailPageHead.vue';
import BackToTop from '../components/MusicCom/Button/BackToTop.vue';
import ButtonArea from '../components/MusicCom/ButtonArea.vue';
import CountTag from '../components/MusicCom/CountTag';
Vue.component('PageHeader', PageHeader);
Vue.component('SongList', SongList);
Vue.component('loading', loading);
Vue.component('NoData', NoData);
Vue.component('TabBar', TabBar);
Vue.component('DetailPageHead', DetailPageHead);
Vue.component('BackToTop', BackToTop);
Vue.component('ButtonArea', ButtonArea);
Vue.component('CountTag', CountTag);
/*音乐*/
const jsmediatags = require('jsmediatags');
import Api from './api/index';
Vue.api = Vue.prototype.$Api = Api; //请求接口
Vue.defaultAlbum = Vue.prototype.$defaultAlbum = 'http://p1.music.126.net/oCnACmhB6CM5oZyWmNfmTg==/109951163051142326.jpg';
function getMusicInfoCallback(file, tag) {
	let name = path.basename(file);
	let extname = new RegExp(path.extname(file)); //创建正则表达式对象
	name = name.replace(extname, '');
	return {
		name: name.split('-')[1],
		artist: tag.tags.artist || name.split('-')[0],
		title: tag.tags.title || name.split('-')[1],
		album: tag.tags.album || '暂无'
	};
}
Vue.getMusicInfo = Vue.prototype.$getMusicInfo = (file, cb) => {
	let name = path.basename(file);
	if (path.extname(name).Exist('flac')) {
		return cb(getMusicInfoCallback(file, { tags: {} }));
	}
	jsmediatags.read('file://' + file, {
		onSuccess: function(tag) {
			cb(getMusicInfoCallback(file, tag));
		},
		onError: function() {
			cb(getMusicInfoCallback(file, { tags: {} }));
		}
	});
}; //音乐解析
Vue.handleListData = Vue.prototype.$handleListData = (data, parent, flag) => {
	if (flag) {
		if (new Date().getTime() - Vue.likeList.time >= 2 * 60 * 1000) {
			Vue.getLikeList();
		}
	}
	let _return = [];
	let list = {};
	data.forEach(item => {
		let artist = item.artists ? item.artists : item.ar;
		let album = item.album ? item.album : item.al;
		let time = item.duration || (item.mMusic ? item.mMusic.playTime : 0) || item.dt;
		let artist_text = '';
		artist.forEach((item, index) => {
			artist_text = artist_text + item.name + (index !== artist.length - 1 ? '/' : '');
		});
		list = {
			id: item.id,
			playList: parent,
			like: !!Vue.likeList.data.filter(like => {
				return like === item.id;
			})[0],
			artistId: artist[0].id,
			picture: album.picUrl || '',
			type: 'online',
			title: item.name,
			name: item.name,
			artist: artist_text,
			album: album.name,
			time: time,
			mvid: item.mvid || item.mv,
			url: 'https://music.163.com/song/media/outer/url?id=' + item.id + '.mp3'
		};
		_return.push(list);
	});
	return _return;
}; //音乐列表处理
Vue.scrollEnd = Vue.prototype.$scrollEnd = (e, callback) => {
	let element = e.target;
	if (element.scrollHeight - element.scrollTop === element.clientHeight) {
		callback();
	}
};
Vue.randomRange = Vue.prototype.$randomRange = (min, max) => {
	return Math.floor(Math.random() * (max - min)) + min;
};
Vue.numberCount = Vue.prototype.$numberCount = count => {
	count = parseInt(count);
	if (count > 100000) {
		return Math.round(count / 10000).toFixed(0) + '万';
	}
	return count;
};
Vue.likeList = Vue.prototype.$likeList = {
	data: [],
	time: []
};
Vue.getLikeList = Vue.prototype.$getLikeList = callback => {
	Api.Music.song.likeList(rs => {
		Vue.likeList.data = rs.ids;
		Vue.likeList.time = rs.checkPoint;
		callback && callback();
	});
};
