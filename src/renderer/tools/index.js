import Vue from 'vue'
String.prototype.Before=function(substr){
    return this.substring(this.lastIndexOf(substr) + 1, this.length);
};
String.prototype.Exist=function(substr){
    if(typeof this !== "string"){ return; }
    if(substr==='|*|'){return true}
    for(let i=0;i<substr.split(',').length;i++){
        if(this.indexOf(substr.split(',')[i]) >= 0 === true ){ return true; }
    }
    return false;
};
import Api from "./api/index"
//引入iview组件
import {Checkbox,Tooltip,Dropdown,DropdownMenu,DropdownItem,Input,InputNumber,RadioGroup,Radio,Time,Select,Option,DatePicker,Message,Icon,Spin,Progress} from 'iview';
import 'iview/dist/styles/iview.css';
import '../../../src/renderer/assets/css/iview.css';//定制样式
Vue.component('Checkbox', Checkbox);
Vue.component('Tooltip', Tooltip);
Vue.component('Dropdown', Dropdown);
Vue.component('DropdownMenu', DropdownMenu);
Vue.component('DropdownItem', DropdownItem);
Vue.component('Input', Input);
Vue.component('InputNumber', InputNumber);
Vue.component('RadioGroup', RadioGroup);
Vue.component('Radio', Radio);
Vue.component('Time', Time);
Vue.component('Select', Select);
Vue.component('Option', Option);
Vue.component('DatePicker', DatePicker);
Vue.component('Message',Message);
Vue.prototype.$Message=Message;
Vue.component('Icon',Icon);
Vue.component('Spin',Spin);
Vue.component('Progress',Progress);
Vue.prototype.$IVIEW = {};
//引入element的部分组件
import { MessageBox,Dialog} from 'element-ui';
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.use(Dialog);
Vue.prototype.Confrim=(options)=>{
    MessageBox.confirm(options.tips, options.title, {
        confirmButtonText:options.confirmButtonText||'确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString:true,
        type: options.type||'warning',
    }).then(() => {
        options.callback()
    }).catch(() => {
    });
};
Vue.prototype.InputConfrim=(options)=>{
    MessageBox.prompt(options.tips, options.title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue:options.value||'',
        inputPattern:options.inputPattern||'',
        inputErrorMessage: options.inputErrorMessage||'',
    }).then(({ value }) => {
        options.callback(value)
    }).catch(() => {
    });
};
/*公用组件*/
import PageHeader from "../components/MusicCom/PageHeader.vue"
import PlayList from "../components/MusicCom/PlayList.vue"
import loading from "../components/MusicCom/loading.vue"
import NoData from "../components/MusicCom/NoData.vue"
Vue.component('PageHeader',PageHeader);
Vue.component('PlayList',PlayList);
Vue.component('loading',loading);
Vue.component('NoData',NoData);
//引入electron接口
const path = require('path');
const ipc=require('electron').ipcRenderer;
const jsmediatags = require("jsmediatags");
Vue.path = Vue.prototype.$path = path;//path接口
Vue.ipc = Vue.prototype.$ipc = ipc;//ipc接口
Vue.api = Vue.prototype.$Api = Api;//请求接口
Vue.static = Vue.prototype.$static = path.join(__static);//static
Vue.Notify = Vue.prototype.$Notify =(msg)=>{
    new Notification('CloudMusic',{
        body: msg
    })
};//
Vue.defaultAlbum = Vue.prototype.$defaultAlbum="http://p1.music.126.net/oCnACmhB6CM5oZyWmNfmTg==/109951163051142326.jpg";
Vue.getMusicInfo = Vue.prototype.$getMusicInfo =(file,cb)=>{
    let name=path.basename(file);
    jsmediatags.read(file,{
        onSuccess: function(tag) {
            cb({
                name:path.basename(file),
                artist:tag.tags.artist||name.split('-')[0],
                title:tag.tags.title||path.basename(file),
                album:tag.tags.album||'暂无',
            })
        },
        onError: function(error) {
            cb({
                name:path.basename(file),
                artist:name.split('-')[0],
                title:path.basename(file),
                album:"暂无"
            })
        }
    });
};//音乐解析
Vue.handleListData = Vue.prototype.$handleListData =(data)=>{
    let _return=[];
    let list={};
    data.forEach((item,index)=>{
        list={
            id:item.id,
            artistId:item.artists[0].id,
            type:"online",
            title:item.name,
            name:item.name,
            artist:item.artists[0].name,
            album:item.album.name,
            time:item.duration||(item.mMusic?item.mMusic.playTime:0),
            mvid:item.mvid,
            url:'https://music.163.com/song/media/outer/url?id='+item.id+'.mp3'
        };
        _return.push(list);
    });
    return _return
};//音乐列表处理
