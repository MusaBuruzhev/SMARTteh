<!-- src/pages/HomePage.vue -->
<template>
  <div class="home">
    <Header/>
    <main>
      <h2>Главная страница</h2>
      <p>Содержимое главной страницы</p>
    </main>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'

export default {
  name: 'HomePage',
  components: {
    Header
  }
}
</script>

<style>
main {
  padding: 2rem;
}
</style>