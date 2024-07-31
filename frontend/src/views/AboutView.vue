<template>
    <div class="row">
        <div class="col-3" style="position: absolute; left: -9999px">
            <div ref="pageCanvas" class="col-3 pageCanvas gaegu-bold p-5">
                <!-- @click="saveAsImage($event)" -->
                <!-- <img src="@/assets/logo.png" /> -->
                <p class="pt-5 ps-2">{{ 현재페이지줄거리 }}</p>
            </div>
        </div>
        <div class="col-9">
            <flipbook class="flipbook" :pages="pages" v-slot="flipbook" :zooms="null" :flipDuration="2000" :centering="true" :dragToFlip="false" :singlePage="false">
                <div v-for="(page, index) in pages" :key="index" class="page col">
                    <h1>{{ page.title }}</h1>
                    <p>{{ page.content }}</p>
                </div>
                <div class="flipbook-head">
                    <button @click="이전(flipbook)" :disabled="isProcessing">이전페이지</button>
                    <!-- <button @click="addPage">페이지 추가</button> -->
                    <button @click="다음줄거리요청(flipbook)" :disabled="isProcessing">다음페이지</button>
                </div>
            </flipbook>
        </div>
    </div>
    <div class="row" style="color: black">
        {{ pages }}
        선택한책고유번호 {{ 선택한책고유번호 }} 현재페이지번호 {{ 현재페이지번호 }} 마지막페이지번호 {{ 마지막페이지번호 }} isProcessing {{ isProcessing }}
    </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import { nextTick } from 'vue';
import Flipbook from 'flipbook-vue';

export default {
    components: {
        Flipbook,
    },
    name: 'App',
    computed: {
        ...mapState(['선택한책줄거리', '선택한책고유번호', '현재페이지번호', 'pages', '마지막페이지번호', 'isProcessing']),
        현재페이지줄거리() {
            if (this.현재페이지번호 > 0) {
                const 현재페이지 = this.선택한책줄거리.find((page) => page.id === this.현재페이지번호);
                return 현재페이지 ? 현재페이지.줄거리 : '';
            }
            return '';
        },
    },
    created() {},
    beforeUnmount() {},
    methods: {
        ...mapMutations(['이전페이지뮤테이션', '현재페이지번호증가']),
        ...mapActions(['saveAsImage', 'generateRandomText', '다음줄거리요청액션']),
        // handleKeyDown(event) {
        //     if (event.key === 's' || event.key === 'S') {
        //         // 's' 키를 눌렀을 때
        //         const element = this.$refs.pageCanvas;
        //         this.saveAsImage(element);
        //     }
        // },
        async 이전(flipbook) {
            flipbook.flipLeft();
            await new Promise((resolve) => setTimeout(resolve, 3000)); // 애니메이션 지속 시간 2000ms 추가
            this.이전페이지뮤테이션();
        },
        async 다음줄거리요청(flipbook) {
            this.$store.commit('업데이트처리상태', true); // 버튼 비활성화 추가
            try {
                if (this.현재페이지번호 === this.마지막페이지번호) {
                    await this.다음줄거리요청액션({
                        다음페이지번호: this.현재페이지번호 + 1,
                        선택한책고유번호: this.선택한책고유번호,
                    });
                    flipbook.flipRight();
                    new Promise((resolve) => setTimeout(resolve, 3000)); // 애니메이션 지속 시간 2000ms 추가
                } else {
                    flipbook.flipRight();
                    new Promise((resolve) => setTimeout(resolve, 3000)); // 애니메이션 지속 시간 2000ms 추가
                    this.현재페이지번호증가();
                }
            } finally {
                this.$store.commit('업데이트처리상태', false); // 버튼 활성화 추가
            }
        },
    },
};
</script>

<style scoped>
.flipbook {
    width: 90vw;
    height: 90vh;
}
.flipbook-head {
    text-align: center;
}
.bounding-box {
    box-shadow: 0 15px 15px rgba(0, 0, 0, 0.5);
}
.pageCanvas {
    font-size: 2rem;
    color: black;
    width: 480px;
    height: 640px;
    background-image: url('@/assets/paper.jpg'); /* 타일 PNG 이미지 경로 */
    background-size: contain; /* 타일 이미지를 원래 크기로 사용 */
    overflow: hidden; /* 넘치는 텍스트 숨김 */
    white-space: pre-wrap;
    line-break: loose; /* 한국어 문장의 자연스러운 줄바꿈 */
    word-break: keep-all; /* 어절 단위로 줄바꿈 */
    line-height: 2; /* 줄 간격을 1.5배로 설정 */
    letter-spacing: -0.1rem;
}
</style>
