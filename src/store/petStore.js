import { ref } from 'vue'
import { defineStore } from 'pinia'

export const usePetStore = defineStore('petStore', ()=> {
  const pets = ref([])

  function loadPets() {
    const savedPets = JSON.parse( localStorage.getItem('pets')) || []
    if( savedPets && savedPets.length ) {
      pets.value = savedPets
    } else {
      pets.value = ['리오', '리나']
      localStorage.setItem( 'pets', JSON.stringify(pets.value) )
    }
  }

  function addPet(name) {
    pets.value.push(name)
    localStorage.setItem( 'pets', JSON.stringify(pets.value) )
  }

  return { pets, loadPets, addPet }
})