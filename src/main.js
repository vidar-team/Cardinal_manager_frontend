import Vue from 'vue'
import VueI18n from 'vue-i18n'
import App from './App.vue'
import utils from './utils'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
Vue.use(VueI18n)

const i18n = new VueI18n({
    locale: 'zh-CN',
    messages: {
        'zh-CN': require('@/assets/languages/zh-CN.json'),
        'en-US': require('@/assets/languages/en-US.json')
    }
});

Vue.config.productionTip = false
Vue.prototype.utils = utils

new Vue({
    render: h => h(App),
    i18n,
    router: router
}).$mount('#app')
