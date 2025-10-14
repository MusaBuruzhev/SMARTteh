<!-- src/pages/HomePage.vue -->
<template>
  <div class="home">
    <Header/>
    <main>
      <div class="hero-section">
        <div class="hero-content">
          <h2>Добро пожаловать в SMART</h2>
          <p>Лучшие технологии для вашего комфорта</p>
          <router-link to="/catalog" class="cta-button">Смотреть каталог</router-link>
        </div>
      </div>
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

<style scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%);
}

.hero-section {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);
  padding: 2rem;
  background: radial-gradient(circle at center, #2a2a2a 0%, #0c0c0c 100%);
}

.hero-content {
  text-align: center;
  color: white;
  max-width: 600px;
}

.hero-content h2 {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #888888 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-content p {
  font-size: 1.3rem;
  margin-bottom: 2.5rem;
  color: #b0b0b0;
  line-height: 1.6;
}

.cta-button {
  display: inline-block;
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
}

@media (max-width: 768px) {
  .hero-content h2 {
    font-size: 2.5rem;
  }
  
  .hero-content p {
    font-size: 1.1rem;
  }
}
</style>