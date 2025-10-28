<template>
  <div class="page">
    <Header/>
    <main class="main-content">
      <div class="container">
        <div class="page-header">
          <h1>О компании SMART</h1>
          <p>Инновации, технологии и комфорт для вашего дома</p>
        </div>
        
        <div class="content-grid">
          <div class="info-card">
            <div class="card-icon">🚀</div>
            <h3>Наша миссия</h3>
            <p>Мы создаем умные технологии, которые делают жизнь проще, комфортнее и безопаснее. Наша цель - превратить каждый дом в интеллектуальное пространство будущего.</p>
          </div>
          
          <div class="info-card">
            <div class="card-icon">💡</div>
            <h3>Наши ценности</h3>
            <p>Инновации, качество, доступность и забота о клиентах. Мы верим, что передовые технологии должны быть доступны каждому.</p>
          </div>
          
          <div class="info-card">
            <div class="card-icon">🏆</div>
            <h3>Достижения</h3>
            <p>Более 50 000 довольных клиентов, 3 международные награды за инновации и партнерство с ведущими технологическими компаниями мира.</p>
          </div>
        </div>
        
        <div class="stats-section">
          <h2>SMART в цифрах</h2>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-number">5+</div>
              <div class="stat-label">лет на рынке</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">50K+</div>
              <div class="stat-label">довольных клиентов</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">200+</div>
              <div class="stat-label">умных устройств</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">24/7</div>
              <div class="stat-label">техподдержка</div>
            </div>
          </div>
        </div>
        
        <div class="team-section">
          <h2>Наша команда</h2>
          <div class="team-grid">
            <div class="team-member">
              <div class="member-avatar">👨‍💼</div>
              <h4>Алексей Петров</h4>
              <p>CEO & Основатель</p>
            </div>
            <div class="team-member">
              <div class="member-avatar">👩‍🔬</div>
              <h4>Мария Иванова</h4>
              <p>Технический директор</p>
            </div>
            <div class="team-member">
              <div class="member-avatar">👨‍💻</div>
              <h4>Дмитрий Сидоров</h4>
              <p>Lead Developer</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'

export default {
  name: 'AboutPage',
  components: {
    Header
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%);
}

.main-content {
  padding: 2rem 0;
  min-height: calc(100vh - 80px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.page-header {
  text-align: center;
  margin-bottom: 4rem;
}

.page-header h1 {
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ff6b35 0%, #ff8e53 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
}

.page-header p {
  font-size: 1.3rem;
  color: #e0e0e0;
  font-weight: 300;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.info-card {
  background: rgba(42, 42, 42, 0.8);
  padding: 2.5rem 2rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 107, 53, 0.2);
  text-align: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.info-card:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 107, 53, 0.5);
  box-shadow: 0 10px 30px rgba(255, 107, 53, 0.2);
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.info-card h3 {
  color: #ff6b35;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.info-card p {
  color: #cccccc;
  line-height: 1.6;
  font-size: 1rem;
}

.stats-section {
  text-align: center;
  margin-bottom: 4rem;
}

.stats-section h2 {
  color: #ffffff;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  font-weight: 700;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.stat-item {
  background: rgba(255, 107, 53, 0.1);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 107, 53, 0.3);
}

.stat-number {
  font-size: 3rem;
  font-weight: 800;
  color: #ff6b35;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #cccccc;
  font-size: 1.1rem;
  font-weight: 500;
}

.team-section {
  text-align: center;
}

.team-section h2 {
  color: #ffffff;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  font-weight: 700;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.team-member {
  background: rgba(42, 42, 42, 0.8);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 107, 53, 0.2);
  transition: all 0.3s ease;
}

.team-member:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 107, 53, 0.5);
}

.member-avatar {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.team-member h4 {
  color: #ffffff;
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.team-member p {
  color: #ff6b35;
  font-weight: 500;
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .page-header h1 {
    font-size: 2.5rem;
  }
  
  .page-header p {
    font-size: 1.1rem;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .team-grid {
    grid-template-columns: 1fr;
  }
}
</style>