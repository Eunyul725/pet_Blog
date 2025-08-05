<template>
  <div class="min-h-screen bg-[#FFFBF6]">
    <div class="max-w-[430px] mx-auto">
      <div class="p-4 space-y-5">
        <h1 class="text-2xl font-bold text-[#634d4d]">
          {{  isEditMode ? '건강일기 수정' : '건강일기 작성' }}
        </h1>
        <form @submit.prevent="savePost" class="space-y-4">
          <!-- 제목 입력 -->
          <div>
            <label class="block text-sm font-medium text-gray-700">제목</label>
            <input
              v-model="title"
              type="text"
              placeholder="제목을 입력하세요"
              required
              class="w-full px-4 py-3 rounded-lg border border-[#D9D9D9] focus:outline-none focus:border-[#634D4D] transition"
            />
          </div>
        
          <!-- 내용 입력 -->
          <div>
            <label class="block text-sm font-medium text-gray-700">내용</label>
            <textarea
              v-model="content"
              rows="6"
              placeholder="오늘의 건강일기를 작성해보세요"
              class="w-full px-4 py-3 rounded-lg border border-[#D9D9D9] focus:outline-none focus:border-[#634D4D] transition"
            ></textarea>
          </div>

          <!-- 이미지 미리보기 -->
          <div>
            <div
              v-if="previewUrl"
              class="relative w-full flex justify-center p-4 rounded-lg bg-[#F9F4F1] border border-[#D9D9D9] preview mb-2"
            >
              <img
                :src="previewUrl"
                alt="미리보기 이미지"
                class="max-h-40 rounded-lg object-cover shadow-md"
              />
              <!-- 이미지 교체 안내 -->
              <span
                class="absolute top-2 right-3 text-xs text-gray-400 bg-white px-2 py-0.5 rounded-full shadow"
              >
                이미지 미리보기
              </span>
            </div>
      
            <!-- 이미지 업로드 -->
            <div class="space-y-3">
              <label
                for="fileUpload"
                class="inline-block px-4 py-2 rounded-xl bg-[#E4B9B4] text-white text-sm font-medium cursor-pointer hover:brightness-110 transition shadow"
              >
                {{ previewUrl ? '이미지 변경' : '이미지 추가' }}
              </label>
              <input
                id="fileUpload"
                type="file"
                accept="image/*"
                @change="handleImageFile"
                class="hidden"
              />
            </div>
          </div>
        </form>

        <!-- 저장 / 취소 버튼 -->
        <div class="flex gap-4 mt-4">
          <button
            :disabled="isSaving"
            type="submit"
            @click="savePost"
            class="w-full py-3 rounded-lg bg-[#634D4D] text-white font-bold hover:bg-[#9E7C76] transition"
          >
            {{ isEditMode ? '수정하기' : '저장하기' }}
          </button>
          <button
            @click="cancel"
            class="w-full py-3 rounded-lg bg-[#634D4D] text-white font-bold hover:bg-[#9E7C76] transition"
            >
            취소
          </button>
        </div>
      </div>

    </div>
  </div>
</template>


<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps({
  pets: Array,
  selectedPet: String
})
const emit = defineEmits([ 'update:selectedPet' ])

const router = useRouter()
const route = useRoute()

const isEditMode = ref(false)
const isSaving = ref(false)
const postId = ref(null)

const pet = ref(props.selectedPet)
const title = ref('')
const content = ref('')
const imageUrl = ref('')
const previewUrl = ref('')

const toastMessage = ref('')
const showToast = ref(false)

const posts = JSON.parse( localStorage.getItem('posts')) || []

function loadPost() {
  const query = route.query
  if( query.mode === 'edit' && query.id ) {
    //수정 모드
    isEditMode.value = true
    postId.value = Number( query.id )

    const foundPost = posts.find( p => p.id === postId.value )
    if( foundPost ) {
      pet.value = foundPost.pet
      title.value = foundPost.title
      content.value = foundPost.content
      imageUrl.value = foundPost.image
      previewUrl.value = foundPost.image
    }
  } else if( query.pet) {
    //새 포스트
    isEditMode.value = false
    pet.value = query.pet
  }
}

function showToastMessage(message) {
  toastMessage.value = message
  showToast.value = true
  setTimeout( ()=> {
    showToast.value = false
  }, 1500)
}

watch(() => props.selectedPet, (newPet) => {
  pet.value = newPet
})

function savePost() {
  if( isSaving.value ) return
  isSaving.value = true

  try {
    if( isEditMode.value ) {
      // 수정 모드
      const index = posts.findIndex( p => p.id === postId.value )
      if( index !== -1 ) {
        posts[index] = {
          ...posts[index],
          pet: pet.value,
          title: title.value,
          content: content.value,
          image: imageUrl.value,
          updateAt: new Date().toISOString(),
        }
      }
    } else {
      //새 포스트
      const newPost = {
        id: Date.now(),
        pet: pet.value,
        title: title.value,
        content: content.value,
        image: imageUrl.value,
        createAt: new Date().toISOString(),
        favorite: false
      }
      posts.push( newPost )
    }

    localStorage.setItem( 'posts', JSON.stringify(posts) )
    showToastMessage( isEditMode.value ? '✍️ 건강일기 수정 완료!' : '📝 건강일기 저장 완료!')

    setTimeout( ()=> {
     router.push({ name: 'Home', query: {pet: pet.value} })
    }, 1500)
  } finally {
    isSaving.value = false
  }
}

function cancel() {
  router.back()
}

function handleImageFile(event) {
  const file = event.target.files[0]
  if( file && file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e)=> {
      previewUrl.value = e.target.result
      imageUrl.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
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