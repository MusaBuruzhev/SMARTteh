<template>
  <div class="page">
    <Header/>
    <main class="main-content">
      <div class="container">
        <div class="page-header">
          <h1>Контакты</h1>
          <p>Свяжитесь с нами любым удобным способом</p>
        </div>
        
        <div class="contacts-grid">
          <div class="contact-info">
            <div class="contact-card">
              <div class="contact-icon">📍</div>
              <h3>Адрес</h3>
              <p>г. Москва, ул. Технологическая, д. 42</p>
              <p>Бизнес-центр "Смарт Плаза"</p>
            </div>
            
            <div class="contact-card">
              <div class="contact-icon">📞</div>
              <h3>Телефоны</h3>
              <p>+7 (495) 123-45-67</p>
              <p>+7 (800) 555-35-35 (бесплатно)</p>
            </div>
            
            <div class="contact-card">
              <div class="contact-icon">✉️</div>
              <h3>Email</h3>
              <p>info@smart-tech.ru</p>
              <p>support@smart-tech.ru</p>
            </div>
            
            <div class="contact-card">
              <div class="contact-icon">🕒</div>
              <h3>Время работы</h3>
              <p>Пн-Пт: 9:00 - 21:00</p>
              <p>Сб-Вс: 10:00 - 18:00</p>
            </div>
          </div>
          
          <div class="contact-form-section">
            <div class="form-card">
              <h3>Напишите нам</h3>
              <form class="contact-form">
                <div class="form-group">
                  <input type="text" placeholder="Ваше имя" required>
                </div>
                <div class="form-group">
                  <input type="email" placeholder="Ваш email" required>
                </div>
                <div class="form-group">
                  <input type="text" placeholder="Тема сообщения" required>
                </div>
                <div class="form-group">
                  <textarea placeholder="Ваше сообщение" rows="5" required></textarea>
                </div>
                <button type="submit" class="submit-btn">Отправить сообщение</button>
              </form>
            </div>
          </div>
        </div>
        

        
        <div class="social-section">
          <h2>Мы в соцсетях</h2>
          <div class="social-grid">
            <a href="#" class="social-link">
              <span class="social-icon">📘</span>
              <span>VK</span>
            </a>
            <a href="#" class="social-link">
              <span class="social-icon">📷</span>
              <span>Instagram</span>
            </a>
            <a href="#" class="social-link">
              <span class="social-icon">🐦</span>
              <span>Twitter</span>
            </a>
            <a href="#" class="social-link">
              <span class="social-icon">💼</span>
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'

export default {
  name: 'ContactsPage',
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

.contacts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 4rem;
}

.contact-info {
  display: grid;
  gap: 1.5rem;
}

.contact-card {
  background: rgba(42, 42, 42, 0.8);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 107, 53, 0.2);
  transition: all 0.3s ease;
}

.contact-card:hover {
  transform: translateY(-3px);
  border-color: rgba(255, 107, 53, 0.5);
  box-shadow: 0 8px 25px rgba(255, 107, 53, 0.2);
}

.contact-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.contact-card h3 {
  color: #ff6b35;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.contact-card p {
  color: #cccccc;
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.form-card {
  background: rgba(42, 42, 42, 0.8);
  padding: 2.5rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 107, 53, 0.2);
  height: fit-content;
}

.form-card h3 {
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
  font-weight: 600;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid #444;
  border-radius: 10px;
  background: #1a1a1a;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #ff6b35;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.2);
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.submit-btn {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #ff6b35 0%, #ff8e53 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
}

.map-section {
  margin-bottom: 4rem;
}

.map-section h2 {
  color: #ffffff;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 700;
}

.map-placeholder {
  background: rgba(42, 42, 42, 0.8);
  border: 1px solid rgba(255, 107, 53, 0.2);
  border-radius: 16px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-content {
  text-align: center;
  color: #cccccc;
}

.map-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.social-section h2 {
  color: #ffffff;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 700;
}

.social-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(42, 42, 42, 0.8);
  border: 1px solid rgba(255, 107, 53, 0.2);
  border-radius: 12px;
  color: #cccccc;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 500;
}

.social-link:hover {
  background: rgba(255, 107, 53, 0.1);
  color: #ff6b35;
  transform: translateY(-3px);
  border-color: rgba(255, 107, 53, 0.5);
}

.social-icon {
  font-size: 1.5rem;
}

@media (max-width: 968px) {
  .contacts-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .form-card {
    padding: 2rem;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .page-header h1 {
    font-size: 2.5rem;
  }
  
  .social-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .map-placeholder {
    height: 250px;
  }
}
</style>