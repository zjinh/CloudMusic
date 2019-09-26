import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: require('@/components/MusicWindow.vue').default,
      redirect:"/discover",
      children:[
        {
          path: '/discover',
          name: 'discover',
          component: require('@/components/MusicPage/DiscoverMusic.vue').default
        },
        {
          path: '/fm',
          name: 'fm',
          component: require('@/components/MusicPage/FmMusic.vue').default
        },
        {
          path: '/local',
          name: 'local',
          component: require('@/components/MusicPage/LocalMusic.vue').default
        },
        {
          path: '/search/:type/:keywords',
          name: 'search',
          component: require('@/components/MusicPage/SearchPage.vue').default
        },
        {
          path: '/artist-detail/:id',
          name: 'artist-detail',
          component: require('@/components/MusicPage/ArtistDetail.vue').default
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: require('@/components/LoginPage.vue').default,
    },
    {
      path: '/music-about/:version',
      name: 'MusicAbout',
      component: require('@/components/MusicAbout').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
