<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <router-link to="/" class="logo">SMART</router-link>
        <nav class="nav">
          <router-link to="/" class="nav-link">Главная</router-link>
          <router-link to="/catalog" class="nav-link">Каталог</router-link>
          <router-link to="/about" class="nav-link">О нас</router-link>
          <router-link to="/contacts" class="nav-link">Контакты</router-link>
          <router-link to="/help" class="nav-link">Помощь</router-link>
          
          <router-link v-if="hasToken" to="/profile" class="nav-link">Профиль</router-link>
          
          <button v-else class="auth-btn" @click="toggleDropdown">
            <span class="btn-text">Войти</span>
          </button>
        </nav>
        
        <button v-if="hasToken" class="logout-btn" @click="logout">Выйти</button>
      </div>
    </div>
    
    <div v-if="showDropdown" class="dropdown-overlay" @click="closeDropdown">
      <div class="auth-container" :class="{'closing': isClosing, 'wide': activeTab === 'register'}" @click.stop>
        <div class="auth-header">
          <div class="auth-tabs">
            <button class="tab-btn" :class="{'active': activeTab === 'login'}" @click="activeTab = 'login'">
              <span class="tab-icon">🔐</span>
              Вход
            </button>
            <button class="tab-btn" :class="{'active': activeTab === 'register'}" @click="activeTab = 'register'">
              <span class="tab-icon">👤</span>
              Регистрация
            </button>
          </div>
          <button class="close-btn" @click="closeDropdown">×</button>
        </div>

        <!-- Форма входа -->
        <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="auth-form">
          <div class="form-header">
            <h3>Добро пожаловать!</h3>
            <p>Войдите в свой аккаунт</p>
          </div>
          
          <div class="input-group loading-email">
            <div class="input-icon">📧</div>
            <input v-model="loginForm.email" type="email" placeholder=" " required />
            <label>Email</label>
          </div>
          
          <div class="input-group loading-password">
            <div class="input-icon">🔒</div>
            <input v-model="loginForm.password" type="password" placeholder=" " required />
            <label>Пароль</label>
          </div>
          
          <button type="submit" class="submit-btn" :disabled="loading">
            <span class="btn-spinner" v-if="loading"></span>
            {{ loading ? 'Вход...' : 'Войти в аккаунт' }}
          </button>
          
          <div v-if="error" class="error-message">
            <span class="error-icon">⚠️</span>
            {{ error }}
          </div>

          <!-- Простая стильная зона -->
          <div class="simple-design">
            <div class="design-line"></div>
            <div class="design-text">
              <span>SMART</span>
              <span>SYSTEM</span>
            </div>
            <div class="design-line"></div>
          </div>
        </form>

        <!-- Форма регистрации -->
        <form v-if="activeTab === 'register'" @submit.prevent="handleRegister" class="auth-form register-form">
          <div class="form-header">
            <h3>Создать аккаунт</h3>
            <p>Присоединяйтесь к нашему сообществу</p>
          </div>
          
          <div class="form-grid">
            <div class="input-group">
              <div class="input-icon  input-icon-castom">👨</div>
              <input v-model="registerForm.firstName" type="text" placeholder=" " required maxlength="50" />
              <label>Имя</label>
            </div>
            
            <div class="input-group">
              <div class="input-icon input-icon-castom">👪</div>
              <input v-model="registerForm.lastName" type="text" placeholder=" " required maxlength="50" />
              <label>Фамилия</label>
            </div>

            <div class="input-group">
              <div class="input-icon">👤</div>
              <input v-model="registerForm.username" type="text" placeholder=" " required minlength="3" maxlength="30" />
              <label class="l3">Логин</label>
              <div class="input-hint">3-30 символов</div>
            </div>
            
            <div class="input-group">
              <div class="input-icon">📧</div>
              <input v-model="registerForm.email" type="email" placeholder=" " required />
              <label class="l3">Email</label>
            </div>

             <div class="input-group">
              <div class="input-icon">🔒</div>
              <input v-model="registerForm.password" type="password" placeholder=" " required minlength="6" />
              <label class="l3">Пароль</label>
              <div class="input-hint">мин. 6 символов</div>
            </div>
          </div>

          <div class="form-features">
            <div class="feature-item">
              <span class="feature-icon">✓</span>
              <span>Безопасное хранение данных</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">✓</span>
              <span>Доступ ко всем функциям</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">✓</span>
              <span>Техническая поддержка 24/7</span>
            </div>
          </div>
          
          <button type="submit" class="submit-btn register-btn" :disabled="loading">
            <span class="btn-spinner" v-if="loading"></span>
            {{ loading ? 'Регистрация...' : 'Создать аккаунт' }}
          </button>
          
          <div v-if="error" class="error-message">
            <span class="error-icon">⚠️</span>
            {{ error }}
          </div>
        </form>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      showDropdown: false,
      isClosing: false,
      activeTab: 'login',
      loginForm: {
        email: '',
        password: ''
      },
      registerForm: {
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: ''
      },
      loading: false,
      error: '',
      token: localStorage.getItem('token')
    }
  },
  computed: {
    hasToken() {
      return !!this.token;
    }
  },
  methods: {
    toggleDropdown() {
      if (this.showDropdown) {
        this.closeDropdown();
      } else {
        this.showDropdown = true;
        this.error = '';
        this.loginForm.email = '';
        this.loginForm.password = '';
        document.body.style.overflow = 'hidden';
      }
    },
    closeDropdown() {
      this.isClosing = true;
      setTimeout(() => {
        this.showDropdown = false;
        this.isClosing = false;
        document.body.style.overflow = '';
      }, 300);
    },
    async handleLogin() {
      this.loading = true;
      this.error = '';
      try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.loginForm)
        });
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem('token', data.token);
          this.token = data.token;
          this.$router.push('/profile');
          this.closeDropdown();
          this.loginForm.email = '';
          this.loginForm.password = '';
        } else {
          this.error = data.message || 'Ошибка входа';
        }
      } catch (error) {
        this.error = 'Ошибка соединения';
        console.error('Login error:', error);
      }
      this.loading = false;
    },
    async handleRegister() {
      this.loading = true;
      this.error = '';
      try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.registerForm)
        });
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem('token', data.token);
          this.token = data.token;
          this.$router.push('/profile');
          this.closeDropdown();
          this.registerForm = {
            username: '',
            email: '',
            password: '',
            firstName: '',
            lastName: ''
          };
        } else {
          this.error = data.message || 'Ошибка регистрации';
        }
      } catch (error) {
        this.error = 'Ошибка соединения';
        console.error('Register error:', error);
      }
      this.loading = false;
    },
    logout() {
      localStorage.removeItem('token');
      this.token = null;
      this.$router.push('/');
    }
  },
  mounted() {
    window.addEventListener('storage', this.handleStorageChange);
    document.addEventListener('keydown', this.handleEscape);
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.handleStorageChange);
    document.removeEventListener('keydown', this.handleEscape);
    document.body.style.overflow = '';
  },
  created() {
    this.handleStorageChange = () => {
      this.token = localStorage.getItem('token');
    };
    this.handleEscape = (e) => {
      if (e.key === 'Escape' && this.showDropdown) {
        this.closeDropdown();
      }
    };
  }
}
</script>

<style scoped>

.simple-design {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-top: 3rem;
  padding: 2rem 0;
}

.design-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255, 107, 53, 0.5), 
    transparent
  );
}

.design-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #ff6b35;
  font-weight: 700;
  font-size: 1.1rem;
  text-align: center;
}

.design-text span:first-child {
  background: linear-gradient(135deg, #ff6b35, #ff8e53);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.3rem;
}

.design-text span:last-child {
  color: #b0b0b0;
  font-size: 0.9rem;
  font-weight: 500;
  opacity: 0.8;
}

/* Адаптивность для простого дизайна */
@media (max-width: 768px) {
  .simple-design {
    gap: 1rem;
    margin-top: 2rem;
    padding: 1.5rem 0;
  }
  
  .design-text {
    font-size: 1rem;
  }
  
  .design-text span:first-child {
    font-size: 1.1rem;
  }
  
  .design-text span:last-child {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .simple-design {
    flex-direction: column;
    gap: 1rem;
    margin-top: 1.5rem;
    padding: 1rem 0;
  }
  
  .design-line {
    width: 100px;
    height: 1px;
  }
}

/* Остальные стили без изменений */
.header {
  background: rgba(26, 26, 26, 0.95);
  border-bottom: 1px solid rgba(255, 107, 53, 0.2);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.container {
  max-width: 90%;
  margin: 0 auto;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: 2rem;
  font-weight: 800;
  color: #ff6b35;
  text-decoration: none;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #ff6b35 0%, #ff8e53 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo:hover {
  transform: scale(1.05);
  text-shadow: 0 0 20px rgba(255, 107, 53, 0.5);
}

.nav {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-link {
  font-size: 1rem;
  color: #e0e0e0;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  background: rgba(42, 42, 42, 0.8);
  transition: all 0.3s ease;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-link:hover {
  color: #ffffff;
  background: rgba(255, 107, 53, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 107, 53, 0.3);
  border-color: rgba(255, 107, 53, 0.3);
}

.nav-link.router-link-active {
  color: #ffffff;
  background: rgba(255, 107, 53, 0.3);
  border-color: rgba(255, 107, 53, 0.5);
}

.auth-btn,
.logout-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #ff6b35 0%, #ff8e53 100%);
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
}

.auth-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.auth-btn:hover,
.logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
}

.dropdown-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
  backdrop-filter: blur(10px);
  padding: 2rem;
}

.auth-container {
  background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
  border-radius: 20px;
  padding: 0;
  width: 100%;
  margin-top: 44%;
  max-width: 900px;
  min-height: 800px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  animation: slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 107, 53, 0.3);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.auth-container.closing {
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.auth-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 107, 53, 0.05);
  flex-shrink: 0;
}

.auth-tabs {
  display: flex;
  gap: 1rem;
}

.tab-btn {
  background: none;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #b0b0b0;
  font-weight: 600;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border: 1px solid transparent;
}

.tab-btn.active {
  background: rgba(255, 107, 53, 0.15);
  color: #ff6b35;
  border: 1px solid rgba(255, 107, 53, 0.3);
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.2);
}

.tab-btn:hover {
  color: #ffffff;
  background: rgba(255, 107, 53, 0.1);
  border: 1px solid rgba(255, 107, 53, 0.2);
}

.tab-icon {
  font-size: 1.2rem;
}

.close-btn {
  background: none;
  border: none;
  color: #b0b0b0;
  font-size: 2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(255, 107, 53, 0.1);
  color: #ff6b35;
  transform: rotate(90deg);
}

.auth-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem 2.5rem 2.5rem;
}

.register-form {
  padding: 2rem 2.5rem 2.5rem;
}

.form-header {
  text-align: center;
}

.form-header h3 {
  color: #ffffff;
  font-weight: 700;
  font-size: 1.8rem;
  margin-bottom: 0.75rem;
  background: linear-gradient(135deg, #ff6b35 0%, #ff8e53 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.form-header p {
  color: #b0b0b0;
  font-size: 1.1rem;
  font-weight: 400;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.input-group {
  position: relative;
  width: 80%;
  margin-bottom: 1.5rem;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 35%;
  transform: translateY(-50%);
  color: #b0b0b0;
  z-index: 2;
  font-size: 1.1rem;
}

.input-group input {
  width: 125%;
  padding: 1rem 1rem 1rem 3rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 1rem;
  background: rgba(26, 26, 26, 0.8);
  color: #ffffff;
  transition: all 0.3s ease;
  font-weight: 400;
}

.input-group input:focus {
  outline: none;
  border-color: #ff6b35;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.2);
  background: rgba(42, 42, 42, 0.8);
}

.input-group input::placeholder {
  color: transparent;
}

.input-group label {
  position: absolute;
  top: 50%;
  left: 3rem;
  transform: translateY(-50%);
  color: #b0b0b0;
  transition: all 0.3s ease;
  pointer-events: none;
  background: rgba(26, 26, 26, 0.9);
  padding: 0 0.3rem;
  font-size: 1rem;
  font-weight: 500;
}

.input-group input:focus + label,
.input-group input:not(:placeholder-shown) + label {
  top: -0.5rem;
  left: 1rem;
  border-radius: 20px;
  transform: translateY(0);
  font-size: 0.8rem;
  color: #ff6b35;
  background: #2a2a2a;
}

.input-hint {
  font-size: 0.75rem;
  color: #888;
  margin-top: 0.5rem;
  padding-left: 0.5rem;
  font-weight: 400;
}

.form-features {
  background: rgba(255, 107, 53, 0.08);
  border: 1px solid rgba(255, 107, 53, 0.15);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #d0d0d0;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.feature-item:last-child {
  margin-bottom: 0;
}

.feature-icon {
  color: #ff6b35;
  font-weight: bold;
  font-size: 1rem;
}

.submit-btn {
  width: 100%;
  padding: 1.2rem;
  background: linear-gradient(135deg, #ff6b35 0%, #ff8e53 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
  margin-top: auto;
}

.input-icon-castom {
  margin-top: 8px;
}

.register-btn {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8e53 100%);
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid transparent;
  border-top: 2px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.75rem;
}

.error-message {
  color: #ff6b6b;
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.95rem;
  background: rgba(255, 107, 107, 0.1);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 107, 107, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-weight: 500;
}

.error-icon {
  font-size: 1.1rem;
}

@keyframes slideDown {
  from {
    transform: translateY(-50px) scale(0.9);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  to {
    transform: translateY(-50px) scale(0.9);
    opacity: 0;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Адаптивность */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .nav {
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
  }

  .nav-link {
    width: 100%;
    text-align: center;
  }

  .auth-btn,
  .logout-btn {
    width: 100%;
    padding: 1rem;
  }

  .dropdown-overlay {
    padding: 1rem;
  }

  .auth-container {
    max-width: 100%;
    max-height: 95vh;
  }

  .auth-container.wide {
    max-width: 100%;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .auth-header {
    padding: 1.5rem;
  }

  .auth-form {
    padding: 1.5rem;
    
  }

  .register-form {
    padding: 1rem 1.5rem 1.5rem;
  }

  .tab-btn {
    padding: 0.75rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .auth-tabs {
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }

  .tab-btn {
    justify-content: center;
    width: 100%;
  }

  .auth-header {
    flex-direction: column;
    gap: 1rem;
  }

  .close-btn {
    align-self: flex-end;
  }

  .dropdown-overlay {
    padding: 0.5rem;
  }
}

.l3{
  margin-top: -10px;
}

.loading-email {
  margin-left: 5%;
  margin-top: 30px;
  
}

.loading-email input {
  width: 110% ;
  
}
.loading-email .input-icon{
  margin-top: 7px;
  
}

.loading-password{
  margin-left: 5%;
}

.loading-password .input-icon{
  margin-top: 7px;
}

.loading-password input {
  width: 110% ;
  
}
</style>