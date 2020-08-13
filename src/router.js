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
        // {
        //     path: '/docker',
        //     name: 'Docker',
        //     component: () => import('@/views/Docker.vue')
        // },
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
            path: '/asteroid',
            name: 'Asteroid',
            component: () => import('@/views/Asteroid.vue')
        },
        {
            path: '/webhook',
            name: 'WebHook',
            component: () => import('@/views/WebHook.vue')
        },
        {
            path: '/config',
            name: 'Config',
            component: () => import('@/views/Config.vue')
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
    if (!localStorage.getItem('managerToken') && to.name !== 'Login') {
        next({
            name: 'Login'
        })
        return
    }
    // Login again
    if (localStorage.getItem('managerToken') && to.name === 'Login') {
        next({
            name: 'Main'
        })
        return
    }

    next()
})

export default router