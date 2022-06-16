import guard from './guard'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: guard,
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
    ]
  },
  {
    path: '/quiz',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: guard,
    children: [
      { path: 'create', component: () => import('pages/Quiz/Create.vue') },
      { path: 'control', component: () => import('pages/Quiz/Control.vue') },
      { path: 'positions', component: () => import('pages/Quiz/Positions.vue') }
    ]
  },
  {
    path: '/auth',
    component: () => import('pages/Auth.vue')
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
