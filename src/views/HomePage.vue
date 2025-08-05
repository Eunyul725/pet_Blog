<template>
  <div class="min-h-screen bg-[#FFFBF6]">
    <div class="max-w-[430px] mx-auto">
      <div class="p-4 space-y-4">
        <!-- 선택된 반려동물에 맞는 포스트 출력 -->
        <BlogPost 
          v-for="post in filteredPosts"
          :key="post.id"
          :post="post" 
          @click="goToDetail(post)"
          @toggle-favorite="showToastMessage" 
        />
      </div>

      <transition name="fade">
        <div
          v-if="showToast"
          class="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-[#634D4D] text-white px-4 py-2 rounded-xl shadow-lg text-base z-[9999]"
        >
          {{ toastMessage }}
        </div>
      </transition>

      <div v-if="filteredPosts.length === 0" class="text-center text-gray-500">
        등록된 포스트 글이 없습니다.
      </div>

      <!-- 플로팅 버튼: 반려동물 선택 시만 표시 -->
      <FloatingButton v-if="selectedPet" @click="goToWrite" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePetStore } from '../store/petStore'
import BlogPost from '../components/BlogPost.vue'
import FloatingButton from '../components/FloatingButton.vue'

const props = defineProps({ 
  pets: Array,
  selectedPet: String,
  disableFilter: Boolean
})
const emit = defineEmits(['update:selectedPet'])

const router = useRouter()
const petStore = usePetStore()

const posts = ref([])
const nextPostId = ref(0)

const showToast = ref(false)
const toastMessage = ref('')


const selectedPet = computed(() => props.selectedPet);

const filteredPosts = computed(()=> {
  if (selectedPet.value && selectedPet.value !== '전체') {
    return posts.value.filter(post => post.pet === selectedPet.value)
  }
  return posts.value.slice().reverse()
});


function loadPosts() {
  const storedPosts = JSON.parse( localStorage.getItem('posts') ) || []
  if( !storedPosts.length ) {
    const now = new Date().toISOString()
    posts.value = [
      {
        id:1,
        pet: '리오',
        title:'예방접종 💉', 
        content:'리오 오늘 병원 다녀왔어요. 씩씩하게 주사도 잘 맞고 기특해서 츄르도 먹었어요!', 
        createAt:now, 
        image: '/images/rio.jpg'
      },
      {
        id:2,
        pet: '리나', 
        title:'목욕 완료 🛁', 
        content:'리나 목욕하고 털 말렸어요. 목욕하는 건 정말 싫지만 엄마 품에 안겨서 씻으면 나쁘지만은 않아요!', 
        createAt:now, 
        image: '/images/rina.jpg'
      },
    ]
    nextPostId.value = 3
    savePosts()
  } else {
    posts.value = storedPosts
    nextPostId.value = storedPosts.length > 0
      ? Math.max( ...storedPosts.map(p => p.id) ) +1
      : 1
  }
}

function savePosts() {
  localStorage.setItem( 'posts', JSON.stringify(posts.value) )
}

function showToastMessage(message) {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 1500)
}

function goToWrite() {
  router.push({ name: 'WritePost', query: {pet: props.selectedPet} })
}

function goToDetail(post) {
  emit( 'update:selectedPet', post.pet )
  router.push({ name: 'PostDetail', params: { id: post.id}})
}

onMounted(() => {
  petStore.loadPets()  // 초기 로드
})

loadPosts()

</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>