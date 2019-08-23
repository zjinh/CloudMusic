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
          name: 'main',
          component: require('@/components/MusicPage/DiscoverMusic.vue').default
        },
      ]
    },

    {
      path: '*',
      redirect: '/'
    }
  ]
})
