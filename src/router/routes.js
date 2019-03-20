// Pull in the route names as constants
// to prevent magic string issues
import routeNames from './routeNames'
let authRoutes = routeNames.authRoutes.AUTH

const routes = [
  {
    path: '/',
    component: () => import('layouts/Basic.vue'),
    children: [
      {
        name: 'Home',
        path: '',
        component: () => import('pages/Index.vue'),
        meta: {
          requiresAuth: true,
          verifiedAcc: true
        }
      },
      {
        name: 'Groepen',
        path: 'groepen',
        component: () => import('components/Groups.vue'),
        meta: {
          requiresAuth: true,
          verifiedAcc: true
        }
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/Basic.vue'),
    children: [
      {
        name: 'Login',
        path: authRoutes.LOGIN,
        component: () => import('components/Auth.vue')
      },
      {
        name: 'Register',
        path: authRoutes.REGISTER,
        component: () => import('components/Auth.vue')
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/Basic.vue'),
    children: [
      {
        name: 'User',
        path: authRoutes.USER,
        component: () => import('components/Dashboard.vue'),
        meta: {
          requiresAuth: true
        }
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
