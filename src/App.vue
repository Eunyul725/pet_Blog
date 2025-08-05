<template>
  <div class="bg-[#fffbf6] min-h-screen">
      <NavBar 
      :isHome="$route.name === 'Home'" 
      :pets="pets" 
      v-model:selectedPet="selectedPet"
      @update:selected-pet="updateSelectedPet"
      :disableFilter="isDetailOrEdit"
    />
    <router-view 
      :pet="pets"
      :selectedPet="selectedPet"
      @update:selected-pet="updateSelectedPet"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from './components/NavBar.vue';
import { usePetStore } from './store/petStore'

const route = useRoute();

const petStore = usePetStore()
const pets = computed(() => petStore.pets)

//const pets = ref(['리오', '리나']);
const selectedPet = ref('');

const isHome = computed(() => route.name === 'Home');

const isDetailOrEdit = computed( ()=> {
  return (
    route.name === 'PostDetail' ||
    (route.name === 'WritePost' && route.query.mode === 'edit')
  );
})

function updateSelectedPet(pet) {
  selectedPet.value = pet;
}
</script>