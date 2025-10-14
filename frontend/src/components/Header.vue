<template>
  <header class="header">
    <div class="logo">SMART</div>
    <nav>
      <router-link to="/">Главная</router-link>
      <router-link to="/catalog">Каталог</router-link>
      <router-link to="/about">О нас</router-link>
      <router-link to="/contacts">Контакты</router-link>
      <router-link to="/help">Помощь</router-link>
      
      <router-link v-if="hasToken" to="/profile" class="profile-link">Профиль</router-link>
      
      <button v-else class="auth-btn btn-blue" @click="toggleDropdown">
        <span class="btn-text" :class="{'hidden': showDropdown}">Войти</span>
        <span class="btn-arrow" :class="{'visible': showDropdown}">&gt;</span>
      </button>
    </nav>
    
    <div v-if="showDropdown" class="dropdown-overlay" @click="closeDropdown">
      <div class="auth-container" :class="{'closing': isClosing}" @click.stop>
        <div class="auth-tabs">
          <button class="tab-btn" :class="{'active': activeTab === 'login'}" @click="activeTab = 'login'">Вход</button>
          <button class="tab-btn" :class="{'active': activeTab === 'register'}" @click="activeTab = 'register'">Регистрация</button>
        </div>

        <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="auth-form">
          <h3>Вход в аккаунт</h3>
          <div class="input-group">
            <input v-model="loginForm.email" type="email" placeholder=" " required />
            <label>Email</label>
          </div>
          <div class="input-group">
            <input v-model="loginForm.password" type="password" placeholder=" " required />
            <label>Пароль</label>
          </div>
          <button type="submit" class="submit-btn" :disabled="loading">{{ loading ? 'Вход...' : 'Войти' }}</button>
          <div v-if="error" class="error-message">{{ error }}</div>
        </form>

        <form v-if="activeTab === 'register'" @submit.prevent="handleRegister" class="auth-form">
          <h3>Создать аккаунт</h3>
          <div class="input-group">
            <input v-model="registerForm.username" type="text" placeholder=" " required minlength="3" maxlength="30" />
            <label>Логин (3-30 символов)</label>
          </div>
          <div class="input-group">
            <input v-model="registerForm.email" type="email" placeholder=" " required />
            <label>Email</label>
          </div>
          <div class="input-group">
            <input v-model="registerForm.password" type="password" placeholder=" " required minlength="6" />
            <label>Пароль (мин. 6 символов)</label>
          </div>
          <div class="input-group">
            <input v-model="registerForm.firstName" type="text" placeholder=" " required maxlength="50" />
            <label>Имя</label>
          </div>
          <div class="input-group">
            <input v-model="registerForm.lastName" type="text" placeholder=" " required maxlength="50" />
            <label>Фамилия</label>
          </div>
          <button type="submit" class="submit-btn" :disabled="loading">{{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}</button>
          <div v-if="error" class="error-message">{{ error }}</div>
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
      error: ''
    }
  },
  computed: {
    hasToken() {
      return !!localStorage.getItem('token')
    }
  },
  methods: {
    toggleDropdown() {
      if (this.showDropdown) {
        this.isClosing = true
        setTimeout(() => {
          this.showDropdown = false
          this.isClosing = false
        }, 300)
      } else {
        this.showDropdown = true
      }
    },
    closeDropdown() {
      this.isClosing = true
      setTimeout(() => {
        this.showDropdown = false
        this.isClosing = false
      }, 300)
    },
    async handleLogin() {
      this.loading = true
      this.error = ''
      try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.loginForm)
        })
        const data = await response.json()
        if (response.ok) {
          localStorage.setItem('token', data.token)
          this.$router.push('/profile')
          this.closeDropdown()
        } else {
          this.error = data.message || 'Ошибка входа'
        }
      } catch (error) {
        this.error = 'Ошибка соединения'
      }
      this.loading = false
    },
    async handleRegister() {
      this.loading = true
      this.error = ''
      try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.registerForm)
        })
        const data = await response.json()
        if (response.ok) {
          localStorage.setItem('token', data.token)
          this.$router.push('/profile')
          this.closeDropdown()
        } else {
          this.error = data.message || 'Ошибка регистрации'
        }
      } catch (error) {
        this.error = 'Ошибка соединения'
      }
      this.loading = false
    }
  }
}
</script>

<style scoped>
.header {
  background: #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #007bff;
}

nav {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

nav a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s;
}

nav a:hover {
  color: #007bff;
}

.auth-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.btn-blue {
  background: #007bff;
  color: white;
}

.btn-blue:hover {
  background: #0056b3;
}

.btn-text.hidden {
  display: none;
}

.btn-arrow {
  display: none;
}

.btn-arrow.visible {
  display: inline;
}

.dropdown-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.auth-container {
  background: white;
  border-radius: 10px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.2);
  animation: slideDown 0.3s ease-out;
}

.auth-container.closing {
  animation: slideUp 0.3s ease-out;
}

.auth-tabs {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
}

.tab-btn {
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-btn.active {
  border-bottom: 2px solid #007bff;
  color: #007bff;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.auth-form h3 {
  text-align: center;
  margin-bottom: 1rem;
}

.input-group {
  position: relative;
}

.input-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.input-group input:focus {
  outline: none;
  border-color: #007bff;
}

.input-group label {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  color: #999;
  transition: all 0.2s;
  pointer-events: none;
}

.input-group input:focus + label,
.input-group input:not(:placeholder-shown) + label {
  top: -0.75rem;
  left: 0.5rem;
  font-size: 0.75rem;
  color: #007bff;
  background: white;
  padding: 0 0.25rem;
}

.submit-btn {
  padding: 0.75rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

.submit-btn:hover:not(:disabled) {
  background: #0056b3;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  text-align: center;
  margin-top: 0.5rem;
}

@keyframes slideDown {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(0); opacity: 1; }
  to { transform: translateY(-20px); opacity: 0; }
}
</style>