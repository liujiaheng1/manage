import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// axios
import axios from 'axios'
import VueAxios from 'vue-axios'
// element ui
import ElementUI from 'element-ui';

//引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'


import 'element-ui/lib/theme-chalk/index.css';
// 引入公共样式
import './assets/public/public.css'

//引入字体图标库
import 'font-awesome-sass/assets/stylesheets/_font-awesome.scss'


Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(VueAxios, axios)
Vue.use(VueQuillEditor)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
