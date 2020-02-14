import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: () => import('@/views/Login.vue')
        },
        {
            path: '/',
            name: 'DataPanel',
            component: () => import('@/views/DataPanel.vue')
        },
        {
            path: '/team',
            name: 'Team',
            component: () => import('@/views/Team.vue')
        },
        {
            path: '/challenge',
            name: 'Challenge',
            component: () => import('@/views/Challenge.vue')
        },
        {
            path: '/gamebox',
            name: 'GameBox',
            component: () => import('@/views/GameBox.vue')
        },
        {
            path: '/flag',
            name: 'Flag',
            component: () => import('@/views/Flag.vue')
        },
    ]
})

router.beforeEach((to, from, next) => {
    // 路由守卫
    if(!localStorage.getItem('token') && to.name !== 'Login'){
        next({
            name: 'Login'
        })
        return
    }
    // 登录后再访问登录
    if(localStorage.getItem('token') && to.name === 'Login'){
        next({
            name: 'Main'
        })
        return
    }

    next()
})

export default router