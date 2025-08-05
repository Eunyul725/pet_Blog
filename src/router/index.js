import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import PostDetail from '../views/PostDetail.vue'
import WritePost from '../views/WritePost.vue'

const routes = [
  { path: '/', name: 'Home', component: HomePage, props: true },
  { path: '/post/:id', name: 'PostDetail', component: PostDetail, props: true },
  { path: '/write', name: 'WritePost', component: WritePost, props: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router