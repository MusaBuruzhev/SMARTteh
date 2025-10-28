<template>
  <div class="page">
    <Header/>
    <main class="main-content">
      <div class="container">
        <div class="page-header">
          <h1>Помощь и поддержка</h1>
          <p>Мы всегда готовы помочь вам с любыми вопросами</p>
        </div>
        
        <div class="help-sections">
          <div class="help-card">
            <div class="help-icon">❓</div>
            <h3>Частые вопросы</h3>
            <div class="faq-list">
              <div class="faq-item">
                <div class="faq-question">Как подключить умное устройство?</div>
                <div class="faq-answer">Скачайте наше приложение SMART, создайте аккаунт и следуйте инструкциям по подключению.</div>
              </div>
              <div class="faq-item">
                <div class="faq-question">Какие устройства совместимы?</div>
                <div class="faq-answer">Все устройства SMART совместимы между собой и работают через единое приложение.</div>
              </div>
              <div class="faq-item">
                <div class="faq-question">Есть ли гарантия?</div>
                <div class="faq-answer">Да, на все устройства предоставляется гарантия от 1 до 3 лет в зависимости от категории товара.</div>
              </div>
            </div>
          </div>
          
          <div class="help-card">
            <div class="help-icon">📞</div>
            <h3>Техническая поддержка</h3>
            <div class="support-info">
              <p>Наша команда поддержки работает 24/7 и готова помочь с:</p>
              <ul>
                <li>Настройкой устройств</li>
                <li>Решение технических проблем</li>
                <li>Консультации по использованию</li>
                <li>Обновлениями ПО</li>
              </ul>
              <div class="support-contacts">
                <p>📞 +7 (800) 555-35-35</p>
                <p>✉️ support@smart-tech.ru</p>
              </div>
            </div>
          </div>
          
            
          
          <div class="help-card">
            <div class="help-icon">🚚</div>
            <h3>Доставка и возврат</h3>
            <div class="shipping-info">
              <div class="info-item">
                <strong>Бесплатная доставка</strong>
                <p>При заказе от 5000 рублей по всей России</p>
              </div>
              <div class="info-item">
                <strong>Быстрая доставка</strong>
                <p>1-3 дня в крупных городах, 3-7 дней в регионах</p>
              </div>
              <div class="info-item">
                <strong>Легкий возврат</strong>
                <p>14 дней на возврат товара без объяснения причин</p>
              </div>
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
  name: 'HelpPage',
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

.help-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.help-card {
  background: rgba(42, 42, 42, 0.8);
  padding: 2.5rem 2rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 107, 53, 0.2);
  transition: all 0.3s ease;
}

.help-card:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 107, 53, 0.5);
  box-shadow: 0 10px 30px rgba(255, 107, 53, 0.2);
}

.help-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.help-card h3 {
  color: #ff6b35;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 700;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.faq-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 1.5rem;
}

.faq-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.faq-question {
  color: #ffffff;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.faq-answer {
  color: #cccccc;
  line-height: 1.5;
}

.support-info p {
  color: #cccccc;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.support-info ul {
  color: #cccccc;
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
}

.support-info li {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.support-contacts {
  background: rgba(255, 107, 53, 0.1);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 107, 53, 0.2);
}

.support-contacts p {
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.support-contacts p:last-child {
  margin-bottom: 0;
}

.docs-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.doc-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 107, 53, 0.1);
  border: 1px solid rgba(255, 107, 53, 0.2);
  border-radius: 8px;
  color: #cccccc;
  text-decoration: none;
  transition: all 0.3s ease;
}

.doc-link:hover {
  background: rgba(255, 107, 53, 0.2);
  color: #ff6b35;
  transform: translateX(5px);
}

.doc-icon {
  font-size: 1.3rem;
}

.shipping-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-item {
  border-left: 3px solid #ff6b35;
  padding-left: 1rem;
}

.info-item strong {
  color: #ffffff;
  display: block;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.info-item p {
  color: #cccccc;
  margin: 0;
  line-height: 1.5;
}

.quick-help {
  text-align: center;
  background: rgba(42, 42, 42, 0.8);
  padding: 3rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 107, 53, 0.2);
}

.quick-help h2 {
  color: #ffffff;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  font-weight: 700;
}

.quick-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
}

.quick-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #ff6b35 0%, #ff8e53 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quick-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
}

.btn-icon {
  font-size: 1.3rem;
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .page-header h1 {
    font-size: 2.5rem;
  }
  
  .help-sections {
    grid-template-columns: 1fr;
  }
  
  .help-card {
    padding: 2rem 1.5rem;
  }
  
  .quick-help {
    padding: 2rem 1.5rem;
  }
  
  .quick-buttons {
    grid-template-columns: 1fr;
  }
  
  .quick-help h2 {
    font-size: 2rem;
  }
}
</style>