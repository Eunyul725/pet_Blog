<template>
  <div
    @click="goToDetail"
    class="bg-white rounded-xl border border-[#D9D9D9] shadow-sm overflow-hidden cursor-pointer transition hover:scale-[1.02] hover:shadow-md max-w-[430px] mx-auto flex"
  >
    <div class="flex-shrink-0 w-40 h-40">
      <img
        v-if="post.image"
        :src="post.image"
        alt="반려동물 이미지"
        class="w-full h-full object-cover"
      />
      <div
        v-else
        class="w-40 h-40 bg-[#f9f4f1] flex items-center justify-center text-7xl"
      >
        <PhPawPrint size="64" weight="fill" class="text-[#634d4d]" />
      </div>
    </div>
    
    <div class="flex-1 px-4 py-2 flex flex-col justify-between">
      <!-- 제목 + 즐겨찾기 -->
      <div class="flex justify-between items-center mb-1">
        <h2 class="text-xl font-bold text-[#634D4D] truncate">
          {{ post.title }}
        </h2>
        <button
          @click.stop="toggleFavorite"
          :class="[
            'transition-transform duration-300',
            favoriteAnimation ? 'scale-125' : ''
          ]"
        >
          <component
            :is="post.favorite ? HeartSolid : HeartOutline"
            class="w-5 h-5"
            :class="post.favorite ? 'text-red-500' : 'text-gray-400'"
          />
        </button>
      </div>

      <!-- 내용 미리보기  -->
      <div 
        v-html="formatContent(post.content)"
        class="text-gray-700 text-base overflow-hidden"
        style="
          display: -webkit-box; 
          -webkit-box-orient: vertical; 
          -webkit-line-clamp: 3;
          line-clamp: 3;
          word-break: break-word;
        "
      ></div>
      <!-- 작성일 -->
      <span class="text-sm text-gray-400 text-right">
        {{ formatDate(post.createAt) }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import DOMPurify from 'dompurify'
import { PhPawPrint } from '@phosphor-icons/vue'
import { HeartIcon as HeartOutline } from '@heroicons/vue/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/vue/24/solid'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['toggle-favorite'])

const router = useRouter()
const favoriteAnimation = ref(false)

function goToDetail() {
  router.push({ name: 'PostDetail', params: { id: props.post.id } })
}

// 즐겨찾기
function toggleFavorite() {
  props.post.favorite = !props.post.favorite

  const posts = JSON.parse(localStorage.getItem('posts')) || []
  const index = posts.findIndex(p => p.id === props.post.id)
  if (index !== -1) {
    posts[index].favorite = props.post.favorite
    localStorage.setItem('posts', JSON.stringify(posts))
  }

  const message = props.post.favorite
    ? '❤️ 즐겨찾기에 추가했어요!'
    : '🤍 즐겨찾기에서 제거했어요!'
  emit('toggle-favorite', message)

  favoriteAnimation.value = true
  setTimeout(() => {
    favoriteAnimation.value = false
  }, 400)
}

function formatDate(dateString) {
  if ( !dateString ) return ''
  const date = new Date( dateString )
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`
}

function formatContent(content) {
  if (!content) return ''
  const cleanContent = DOMPurify.sanitize(content)
  return cleanContent.replace(/\n/g, '<br>')
}

</script>

<style scoped>
.scale-125 {
  transform: scale(1.25);
}
</style>