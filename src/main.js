import Vue from 'vue'
import App from './App.vue'
import utils from './utils'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

Vue.config.productionTip = false
Vue.prototype.utils = utils

new Vue({
    render: h => h(App),
    router: router
}).$mount('#app')
