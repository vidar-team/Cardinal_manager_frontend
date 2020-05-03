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
        {
            path: '/bulletin',
            name: 'Bulletin',
            component: () => import('@/views/Bulletin.vue')
        },
        {
            path: '/manager',
            name: 'Manager',
            component: () => import('@/views/Manager.vue')
        },
    ]
})

router.beforeEach((to, from, next) => {
    // Router guard
    if(!localStorage.getItem('managerToken') && to.name !== 'Login'){
        next({
            name: 'Login'
        })
        return
    }
    // Login again
    if(localStorage.getItem('managerToken') && to.name === 'Login'){
        next({
            name: 'Main'
        })
        return
    }

    next()
})

export default router