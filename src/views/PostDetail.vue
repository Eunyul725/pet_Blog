<template>
  <div class="min-h-screen bg-[#FFFBF6] ">
    <div class="max-w-[430px] mx-auto">
      <div v-if="post" class="space-y-4">
        <div v-if="!isEditing">
          <div class="bg-white rounded-xl p-4 border shadow-sm">
            <div class="flex justify-between items-center mb-4">
              <h1 class="text-2xl font-bold text-[#634D4D]">{{ post.title }}</h1>
              <!-- 즐겨찾기 버튼 -->
              <button
                @click="toggleFavorite"
                :class="[
                  'text-2xl transition-transform duration-300',
                  favoriteAnimation ? 'scale-125' : ''
                ]"
              >
                <component
                  :is="post.favorite ? HeartSolid : HeartOutline"
                  class="w-7 h-7"
                  :class="post.favorite ? 'text-red-500' : 'text-red-400'"
                />
              </button>
            </div>

            <div class="text-gray-800 mb-4" v-html="formatContent( post.content )"></div>
            <img
              v-if="post.image"
              :src="post.image"
              alt="이미지"
              class="w-full rounded-xl border border-[#D9D9D9] mb-4"
            />
            <!-- 포스팅 날짜, 수정일 날짜 -->
            <div class="text-right flex justify-between item-center text-sm">
                <div class="text-gray-500">{{ formatDate( post.createAt ) }}</div>
                <div v-if="post.updateAt" class="text-gray-400">{{ formatDate( post.updateAt ) }}(수정됨)</div>
            </div>
          </div>
          <!-- 수정/삭제 버튼 -->
          <div class="flex gap-4 mt-6">
            <button
              @click="editPost"
              class="flex-1 py-3 rounded-lg bg-[#E4B9B4] text-white text-sm font-semibold hover:brightness-110 transition"
            >
              수정
            </button>
            <button
              @click="deletePost"
              class="flex-1 py-3 rounded-lg bg-[#9E7C76] text-white text-sm font-semibold hover:brightness-110 transition"
            >
              삭제
            </button>
          </div>
        </div>
      </div>
        
      <transition name="fade" >
        <div 
          v-if="showToast"
          class="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-[#634D4D] text-white px-4 py-2 rounded-xl shadow-lg text-base z-50"
        >
          {{ toastMessage }}
        </div>
      </transition>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { HeartIcon as HeartOutline } from '@heroicons/vue/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/vue/24/solid'

const props = defineProps({
  pets: Array,
  selectedPet: String
})
const emit = defineEmits([ 'update:selectedPet'])

const router = useRouter()
const route = useRoute()

const post = ref(null)
const isEditing = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const favoriteAnimation = ref(false)

const posts = JSON.parse(localStorage.getItem('posts')) || []

function loadPost() {
  const postId = Number(route.params.id)
  const foundPost = posts.find (p => p.id === postId )

  if( foundPost ) {
    post.value = foundPost
    emit( 'update:selectedPet', foundPost.pet )
  } else {
    showToastAndRedirect('포스트를 찾을 수 없습니다.')
  }
}

//즐겨찾기
function toggleFavorite() {
  post.value.favorite = !post.value.favorite
  const index = posts.findIndex( p => p.id === post.value.id )
  if( index !== -1 ) {
    posts[index].favorite = post.value.favorite
    localStorage.setItem('posts', JSON.stringify(posts))
  }

  favoriteAnimation.value = true
  setTimeout( ()=> {
    favoriteAnimation.value = false
  }, 400)

  const message = post.value.favorite ?  '❤️ 즐겨찾기에 추가했어요!' : '🤍 즐겨찾기에서 제거했어요!'
  showToastMessage(message)
}

function showToastMessage(message) {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 1500)
}

function editPost() {
  router.push({
    name: 'WritePost',
    query: {
      mode: 'edit',
      id: post.value.id
    }
  })
}

function deletePost() {
  if( confirm('정말 건강일기를 삭제하겠습니까?') ) {
    const posts = JSON.parse( localStorage.getItem('posts')) || []
    const updatedPosts = posts.filter( p => p.id !== post.value.id )
    localStorage.setItem( 'posts', JSON.stringify(updatedPosts) )
    showToastAndRedirect('🗑️ 건강일기 삭제 완료!')
  }
}

function showToastAndRedirect(message) {
  toastMessage.value = message
  showToast.value = true
  setTimeout( ()=> {
    showToast.value = false
    router.push('/')
  }, 1500)
}


function formatDate(dateString) {
  if( !dateString ) return ''
  const date = new Date( dateString )
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`
}

function formatContent(content) {
  return content ? content.replace(/\n/g, '<br>') : ''
}

loadPost()

</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>