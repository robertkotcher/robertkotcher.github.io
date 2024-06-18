import Vue from 'vue';
import VueRouter from 'vue-router';
import vuetify from './plugins/vuetify';

import App from './App';

import Home from './components/Home/Home';
import PostWrapper from './components/Posts/PostWrapper';
import PostSubrouter from './components/Posts/PostSubrouter';

Vue.use(VueRouter);
Vue.config.productionTip = false;

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Home,
      meta: { title: 'Robert Kotcher' }
    },
    {
      path: '/posts',
      component: PostWrapper,
      children: PostSubrouter
    }
  ]
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
});

new Vue({
  router,
  vuetify,
  render: h => h(App),
}).$mount('#root');
