import Vue from 'vue';
import Router from 'vue-router';
const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
	return routerPush.call(this, location).catch(error => error);
};
Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/',
			name: 'main',
			component: require('@/views/MusicWindow.vue').default,
			redirect: '/discover',
			children: [
				{
					path: '/discover',
					name: 'discover',
					component: require('@/views/MusicPage/DiscoverMusic.vue').default
				},
				{
					path: '/fm',
					name: 'fm',
					component: require('@/views/MusicPage/FmMusic.vue').default
				},
				{
					path: '/local',
					name: 'local',
					component: require('@/views/MusicPage/LocalMusic.vue').default
				},
				{
					path: '/download',
					name: 'download',
					component: require('@/views/MusicPage/DownloadPage.vue').default
				},
				{
					path: '/history',
					name: 'history',
					component: require('@/views/MusicPage/PlayHistory.vue').default
				},
				{
					path: '/my-radio',
					name: 'my-radio',
					component: require('@/views/MusicPage/MyRadio.vue').default
				},
				{
					path: '/my-collect',
					name: 'my-collect',
					component: require('@/views/MusicPage/MyCollect.vue').default
				},
				{
					path: '/user-playlist/:id',
					name: 'user-playlist',
					component: require('@/views/MusicPage/PlayListDetail.vue').default
				},
				{
					path: '/search/:keywords',
					name: 'search',
					component: require('@/views/MusicPage/SearchPage.vue').default
				},
				{
					path: '/artist-detail/:id',
					name: 'artist-detail',
					component: require('@/views/MusicPage/ArtistDetail.vue').default
				},
				{
					path: '/playlist-detail/:id',
					name: 'playlist-detail',
					component: require('@/views/MusicPage/PlayListDetail.vue').default
				},
				{
					path: '/album-detail/:id',
					name: 'album-detail',
					component: require('@/views/MusicPage/AlbumDetail.vue').default
				},
				{
					path: '/video-detail/:id',
					name: 'video-detail',
					component: require('@/views/MusicPage/VideoDetail.vue').default
				},
				{
					path: '/radio-detail/:id',
					name: 'radio-detail',
					component: require('@/views/MusicPage/RadioDetail.vue').default
				},
				{
					path: '/user-detail/:id',
					name: 'user-detail',
					component: require('@/views/MusicPage/UserDetail.vue').default
				},
				{
					path: '/setting',
					name: 'setting',
					component: require('@/views/MusicPage/SettingPage.vue').default
				}
			]
		},
		{
			path: '/login',
			name: 'login',
			component: require('@/views/LoginPage.vue').default
		},
		{
			path: '/about',
			name: 'MusicAbout',
			component: require('@/views/AboutWindow').default
		},
		{
			path: '/lrc',
			name: 'lrc',
			component: require('@/views/LrcWindow').default
		},
		{
			path: '*',
			redirect: '/'
		}
	]
});
