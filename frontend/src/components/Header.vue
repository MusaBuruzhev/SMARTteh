<template>
  <header class="header">
    <nav>
      <router-link to="/">Главная</router-link>
      
      <router-link 
        v-if="hasToken" 
        to="/profile" 
        class="profile-link"
      >
        Профиль
      </router-link>
      
      <button 
        v-else
        class="auth-btn btn-blue"
        @click="toggleDropdown"
      >
        <span class="btn-text" :class="{'hidden': showDropdown}">
          Войти
        </span>
        <span class="btn-arrow" :class="{'visible': showDropdown}">
          >
        </span>
      </button>
    </nav>
    
    <div 
      v-if="showDropdown" 
      class="dropdown-overlay" 
      @click="closeDropdown"
    >
      <div 
        class="auth-container" 
        :class="{'closing': isClosing}"
        @click.stop
      >
        <div class="auth-tabs">
          <button 
            class="tab-btn" 
            :class="{'active': activeTab === 'login'}"
            @click="activeTab = 'login'"
          >
            Вход
          </button>
          <button 
            class="tab-btn" 
            :class="{'active': activeTab === 'register'}"
            @click="activeTab = 'register'"
          >
            Регистрация
          </button>
        </div>

        <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="auth-form">
          <h3>Вход в аккаунт</h3>
          
          <div class="input-group">
            <input 
              v-model="loginForm.email"
              type="email" 
              placeholder=" "
              required
            />
            <label>Email</label>
          </div>

          <div class="input-group">
            <input 
              v-model="loginForm.password"
              type="password" 
              placeholder=" "
              required
            />
            <label>Пароль</label>
          </div>

          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? 'Вход...' : 'Войти' }}
          </button>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>
        </form>

        <form v-if="activeTab === 'register'" @submit.prevent="handleRegister" class="auth-form">
          <h3>Создать аккаунт</h3>
          
          <div class="input-group">
            <input 
              v-model="registerForm.username"
              type="text" 
              placeholder=" "
              required
              minlength="3"
              maxlength="30"
            />
            <label>Логин (3-30 символов)</label>
          </div>

          <div class="input-group">
            <input 
              v-model="registerForm.email"
              type="email" 
              placeholder=" "
              required
            />
            <label>Email</label>
          </div>

          <div class="input-group">
            <input 
              v-model="registerForm.password"
              type="password" 
              placeholder=" "
              required
              minlength="6"
            />
            <label>Пароль (мин. 6 символов)</label>
          </div>

          <div class="input-group">
            <input 
              v-model="registerForm.firstName"
              type="text" 
              placeholder=" "
              required
              maxlength="50"
            />
            <label>Имя</label>
          </div>

          <div class="input-group">
            <input 
              v-model="registerForm.lastName"
              type="text" 
              placeholder=" "
              required
              maxlength="50"
            />
            <label>Фамилия</label>
          </div>

          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
          </button>

          <div v-if="error" class="error-message">
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
      hasToken: !!localStorage.getItem('token'),
      activeTab: 'login',
      loading: false,
      error: '',
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
      }
    }
  },
  methods: {
    toggleDropdown() {
      if (this.showDropdown) {
        this.closeDropdown()
      } else {
        this.showDropdown = true
        this.isClosing = false
        this.activeTab = 'login'
        this.error = ''
      }
    },
    
    closeDropdown() {
      this.isClosing = true
      setTimeout(() => {
        this.showDropdown = false
        this.isClosing = false
        this.error = ''
        this.loginForm = { email: '', password: '' }
        this.registerForm = { username: '', email: '', password: '', firstName: '', lastName: '' }
      }, 300)
    },

    async handleLogin() {
      this.loading = true
      this.error = ''

      try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.loginForm)
        })

        const data = await response.json()

        if (response.ok) {
          localStorage.setItem('token', data.token)
          this.hasToken = true
          this.closeDropdown()
          alert('Вход выполнен успешно!')
        } else {
          this.error = data.message || 'Ошибка входа'
        }
      } catch (error) {
        this.error = 'Ошибка соединения с сервером'
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
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.registerForm)
        })

        const data = await response.json()

        if (response.ok) {
          localStorage.setItem('token', data.token)
          this.hasToken = true
          this.closeDropdown()
          alert('Регистрация прошла успешно!')
        } else {
          this.error = data.message || 'Ошибка регистрации'
        }
      } catch (error) {
        this.error = 'Ошибка соединения с сервером'
      }

      this.loading = false
    }
  }
}
</script>

<style scoped>
.header {
  background: #2c3e50;
  color: white;
  padding: 1rem;
  position: relative;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

a {
  color: white;
  text-decoration: none;
}

.auth-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  min-width: 80px;
  height: 40px;
}

.btn-blue {
  background: linear-gradient(45deg, #007bff, #0056b3);
}

.btn-red {
  background: linear-gradient(45deg, #dc3545, #c82333);
}

.btn-text, .btn-arrow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
}

.btn-text {
  opacity: 1;
}

.btn-text.hidden {
  opacity: 0;
  transform: translate(-50%, -50%) translateX(-20px);
}

.btn-arrow {
  opacity: 0;
  transform: translate(-50%, -50%) translateX(20px);
  font-size: 1.2rem;
  font-weight: bold;
}

.btn-arrow.visible {
  opacity: 1;
  transform: translate(-50%, -50%);
}

.dropdown-overlay {
  position: fixed;
  top: 72px;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
}

.auth-container {
  width: 90%;
  max-width: 575px;
  background: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  animation: slideIn 0.3s ease-out;
}

.auth-container.closing {
  animation: slideOut 0.3s ease-in;
}

@keyframes slideIn {
  from { 
    opacity: 0;
    transform: translate(-50%, -60%);
  }
  to { 
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

@keyframes slideOut {
  from { 
    opacity: 1;
    transform: translate(-50%, -50%);
  }
  to { 
    opacity: 0;
    transform: translate(-50%, -60%);
  }
}

.auth-tabs {
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 2px solid #f0f0f0;
}

.tab-btn {
  flex: 1;
  padding: 1rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
  border-bottom: 3px solid transparent;
}

.tab-btn.active {
  color: #007bff;
  border-bottom-color: #007bff;
  font-weight: bold;
}

.auth-form h3 {
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
}

.input-group {
  position: relative;
  margin-bottom: 1.5rem;
}

.input-group input {
  width: 94%;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
  background: transparent;
}

.input-group input:focus {
  outline: none;
  border-color: #007bff;
}

.input-group label {
  position: absolute;
  left: 1rem;
  top: 1rem;
  color: #999;
  transition: all 0.3s;
  pointer-events: none;
}

.input-group input:focus + label,
.input-group input:not(:placeholder-shown) + label {
  top: -0.5rem;
  left: 0.8rem;
  font-size: 0.8rem;
  color: #007bff;
  background: white;
  padding: 0 0.5rem;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(45deg, #007bff, #0056b3);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,123,255,0.3);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  margin-top: 1rem;
  padding: 0.5rem;
  background: #f8d7da;
  color: #721c24;
  border-radius: 4px;
  text-align: center;
}
</style>