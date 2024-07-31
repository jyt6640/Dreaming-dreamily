import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Vue 애플리케이션 생성
const app = createApp(App);

// 이벤트 리스너를 수동(passive)으로 설정
document.addEventListener(
    'touchstart',
    function (event) {
        event.preventDefault();
    },
    { passive: true }
);

createApp(App).use(store).use(router).mount('#app');