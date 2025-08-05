<template>
  <div class="bg-[#FFFBF6]">
    <div class="flex items-center max-w-[430px] mx-auto  text-gray- py-4 text-2xl font-bold">
      <!-- 뒤로가기 아이콘: 홈이 아닐 때만 표시 -->
      <button
        v-if="!props.isHome"
        @click="goBack"
        class="p-2 text-gray-800 hover:text-gray-500 transition"
      >
        <ArrowLeftIcon class="w-6 h-6" />
      </button>

      <!-- 타이틀: 클릭 시 홈으로 이동 -->
      <div
        :class="props.isHome ? 'flex-grow text-center' : 'flex-grow text-center mr-6'"
        @click="goHome"
        class="cursor-pointer select-none hover:opacity-80 transition"
      >
        반려동물 건강일기 
        <PhPawPrint size="24" weight="fill" class="inline text-[#634D4D] ml-1" />
      </div>
    </div>

    <!-- Pet Filter -->
    <div
      class="flex gap-3 px-4 py-2 overflow-x-auto max-w-[430px] mx-auto text-sm whitespace-nowrap"
      style="flex-wrap: nowrap; justify-content: start;"
    >
      <!-- 전체 버튼 -->
      <button
        :disabled="props.disableFilter"
        :class="[
          'px-4 py-2 rounded-xl font-medium shadow-sm border border-[#d9d9d9] transition-all duration-200',
          props.selectedPet === ''
            ? 'bg-[#634D4D] text-white border-[#634D4D]'
            : 'bg-[#f9f4f1] text-gray-800 hover:bg-[#9E7C76] hover:text-white hover:border-[#9E7C76]'
        ]"
        @click="selectPet('')"
      >
        전체
      </button>

      <!-- 반려동물 버튼 -->
      <button
        v-for="pet in petStore.pets"
        :key="pet"
        :disabled="props.disableFilter"
        :class="[
          'px-4 py-2 rounded-xl font-medium shadow-sm whitespace-nowrap border border-[#d9d9d9] transition-all duration-200',
          props.selectedPet === pet
            ? 'bg-[#634d4d] text-white border-[#634d4d]'
            : 'bg-[#fffbf6] text-gray-800 hover:bg-[#9e7c76]/80 hover:text-white hover:border-[#9e7c76]/80'
        ]"
        @click="selectPet(pet)"
      >
        {{ pet }}
      </button>

      <!-- 추가 버튼 -->
      <button
        :disabled="props.disableFilter"
        class="px-3 py-2 rounded-xl bg-[#e4b9b4] text-white shadow-sm border border-[#e4b9b4] hover:brightness-110"
        @click="openModal"
      >
        + 추가
      </button>

      <!-- 반려동물 추가 모달 -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-100"
        @click.self="closeModal"
      >
        <div class="bg-white rounded-xl shadow-sm p-6 w-80">
          <h2 class="text-lg font-bold mb-4">새로운 반려동물 등록</h2>
          <form @submit.prevent="submitForm">
            <input
              ref="inputRef"
              v-model="newPetName"
              type="text"
              placeholder="반려동물의 이름을 입력하세요."
              class="w-full px-3 py-2 border rounded-md mb-6"
              required
            />
            <div v-if="errorMessage" class="text-gray-600 text-base mb-2">
              {{ errorMessage }}
            </div>
            <div class="flex justify-end gap-2">
              <button
                type="button"
                class="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                @click="closeModal"
              >
                취소
              </button>
              <button
                type="submit"
                class="px-4 py-2 rounded-lg bg-[#e4b9b4] text-white hover:brightness-110"
              >
                등록
              </button>
            </div>
          </form>
        </div>
      </div>

      <transition name="fade">
        <div
          v-if="showToast"
          class="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-[#634D4D] text-white px-4 py-2 rounded-xl shadow-lg text-base z-[9999]"
        >
          {{ toastMessage }}
        </div>
      </transition>

    </div>
  </div>
</template>


<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePetStore } from '../store/petStore'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import { PhPawPrint } from '@phosphor-icons/vue'

const props = defineProps({
  isHome: Boolean,
  pets: Array,
  selectedPet: String,
  disableFilter: Boolean
})

const emit = defineEmits(['update:selectedPet'])

const router = useRouter()
const petStore = usePetStore()

const showModal = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const newPetName = ref('')
const errorMessage = ref('')
const inputRef = ref(null)

petStore.loadPets()

function goBack() {
  if( window.history.length > 1 ) {
    router.back();
  } else {
    router.push('/');
  }
}

function goHome() {
  router.push('/')
}

function selectPet(pet) {
  emit('update:selectedPet', pet)
}

function openModal() {
  showModal.value = true
  errorMessage.value = ''
  nextTick( ()=> inputRef.value?.focus() )
}

function closeModal() {
  showModal.value = false
  newPetName.value = ''
  errorMessage.value = ''
}

function submitForm() {
  const name = newPetName.value.trim()
  if( !name ) return

  try {
     if( petStore.pets.includes(name) ) {
      throw new Error ('이미 등록된 이름이에요!')
    }
    petStore.addPet(name)
    emit( 'update:selectedPet', name )
    closeModal()

    toastMessage.value = `${name} 등록 되었습니다! 🐾`
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, 1500)
  } catch(error) {
    errorMessage.value = error.message
  }
}

// ESC 눌렀을 때 모달 닫기
function handleKeydown(event) {
  if (event.key === 'Escape' && showModal.value) {
    closeModal()
  }
}

onMounted(() => window.addEventListener( 'keydown', handleKeydown ))
onUnmounted(() => window.removeEventListener( 'keydown', handleKeydown ))
</script>


<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>