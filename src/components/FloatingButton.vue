<template>
  <div class="max-w-[430px] mx-auto relative">
    <button
      @click="$emit('click')"
      class="absolute top-1 right-5  w-14 h-14 rounded-full bg-[#634D4D] text-white shadow-lg z-50
            hover:bg-[#9E7C76] transition-all duration-200 flex items-center justify-center"
    >
      <PlusIcon class="w-8 h-8" />
    </button>
  </div>
</template>

<script setup>
import { PlusIcon } from '@heroicons/vue/24/solid'
defineEmits(['click'])
</script>
