<template>
  <div id="app">
    <section class="todoapp">
      

    <header class="header">
      <h1>Todo</h1>
      <input type="text" class="newTodo" placeholder="ajouter une tache" v-model="nouvelleTache" @keyup.enter="ajouterTache">
    </header>
  
    <div class="main">
      <ul class="listeTaches">
        <li v-for="tache in listeTaches"> <input type="checkbox" checked v-if="tache.fait" v-model="tache.fait"> <input type="checkbox" v-else v-model="tache.fait"> <label for="">{{ tache.nom }}</label></li>
      </ul>


    </div>



    </section>
  </div>
</template>

<script>

export default {
  data ()   {
    return {
      nouvelleTache: '',
      listeTaches: [{
        nom : "test",
        fait: false
      }]
    }
  },
  methods: {
    ajouterTache () {
      this.listeTaches.push({
        nom : this.nouvelleTache,
        fait: false
      })
      this.nouvelleTache = ''
    }
  }
}


</script>

<style>
#app {
  
}
</style>
