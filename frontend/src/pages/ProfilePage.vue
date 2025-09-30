<template>
  <div class="profile-page">
    <Header />
    <div class="container">
      <div class="profile-card">
        <h2 class="page-title">Мой профиль</h2>
        
        <div v-if="loading" class="loading">Загрузка...</div>
        
        <div v-else-if="user" class="profile-content">
          <div class="avatar-section">
            <div class="avatar">
              {{ getInitials }}
            </div>
            <h3 class="user-name">{{ user.firstName }} {{ user.lastName }}</h3>
            <p class="username">@{{ user.username }}</p>
          </div>
          
          <div class="edit-section">
            <button @click="toggleEdit" class="edit-toggle">
              {{ editing ? 'Отмена' : 'Редактировать профиль' }}
            </button>
          </div>
          
          <div v-if="editing" class="edit-form">
            <form @submit.prevent="updateProfile" class="profile-form">
              <div class="form-row">
                <div class="input-group">
                  <input 
                    v-model="editData.firstName"
                    type="text" 
                    placeholder=" "
                    maxlength="50"
                    required
                  />
                  <label>Имя</label>
                </div>
                <div class="input-group">
                  <input 
                    v-model="editData.lastName"
                    type="text" 
                    placeholder=" "
                    maxlength="50"
                    required
                  />
                  <label>Фамилия</label>
                </div>
              </div>
              
              <div class="input-group full">
                <input 
                  v-model="editData.email"
                  type="email" 
                  placeholder=" "
                  required
                />
                <label>Email</label>
              </div>
              
              <!-- Телефон с маской -->
              <div class="input-group full">
                <input 
                  v-model="editData.phoneNumber"
                  @input="formatPhoneInput"
                  type="tel" 
                  placeholder="+7(___)___-__-__"
                  maxlength="16"
                />
                <label>Телефон</label>
              </div>
              
              <!-- Паспорт с маской -->
              <div class="input-group full">
                <input 
                  v-model="editData.passportNumber"
                  @input="formatPassportInput"
                  type="text" 
                  placeholder="__ __ ______"
                  maxlength="12"
                />
                <label>Паспорт</label>
              </div>
              
              <!-- Банковская карта с маской -->
              <div class="input-group full">
                <input 
                  v-model="editData.bankCardNumber"
                  @input="formatCardInput"
                  type="text" 
                  placeholder="____ ____ ____ ____"
                  maxlength="19"
                />
                <label>Банковская карта</label>
              </div>
              
              <div class="input-group full">
                <vue-dadata
                  ref="addressInput"
                  type="address"
                  v-model="editData.deliveryAddress"
                  :token="dadataToken"
                  :lang="lang"
                  :locations="locations"
                  :placeholder="'Введите адрес'"
                  class="dadata-input"
                  @change="onAddressChange"
                />
                <label>Адрес доставки (город, улица, дом)</label>
              </div>
              
              <button type="submit" class="save-profile-btn" :disabled="saving">
                {{ saving ? 'Сохранение...' : 'Сохранить изменения' }}
              </button>
            </form>
            <div v-if="error" class="error-message">{{ error }}</div>
          </div>
          
          <div v-else class="profile-info">
            <!-- Остальная часть без изменений -->
            <div class="details-section">
              <div class="detail-item">
                <label>Email:</label>
                <span>{{ user.email }}</span>
              </div>
              
              <div class="detail-item">
                <label>Имя:</label>
                <span>{{ user.firstName }}</span>
              </div>
              
              <div class="detail-item">
                <label>Фамилия:</label>
                <span>{{ user.lastName }}</span>
              </div>
              
              <div v-if="user.phoneNumber" class="detail-item">
                <label>Телефон:</label>
                <span>{{ user.phoneNumber }}</span>
              </div>
              
              <div v-if="user.passportNumber" class="detail-item">
                <label>Паспорт:</label>
                <span>{{ user.passportNumber }}</span>
              </div>
              
              <div v-if="user.bankCardNumber" class="detail-item">
                <label>Банковская карта:</label>
                <span>{{ user.bankCardNumber }}</span>
              </div>
              
              <div class="detail-item" v-if="user.deliveryAddress">
                <label>Адрес доставки:</label>
                <span>{{ user.deliveryAddress }}</span>
              </div>
              <div v-else class="add-address-inline">
                <button @click="toggleEdit" class="add-btn">Добавить адрес</button>
              </div>
            </div>
          </div>
          
          <div class="actions">
            <button @click="logout" class="logout-btn">Выйти</button>
          </div>
        </div>
        
        <div v-else class="error">
          <p>Ошибка загрузки профиля</p>
          <button @click="fetchProfile">Попробовать снова</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import { VueDadata } from 'vue-dadata'

export default {
  name: 'ProfilePage',
  components: {
    Header,
    VueDadata
  },
  data() {
    return {
      user: null,
      loading: true,
      error: null,
      editing: false,
      saving: false,
      editData: {},
      dadataToken: 'af18825804cefa054ca822cb7ad1d61d609aa5dc',
      lang: 'ru',
      locations: [
        { country: 'RU' },
        { country: 'BY' },
        { country: 'KZ' }
      ]
    }
  },
  computed: {
    getInitials() {
      if (!this.user) return ''
      return (this.user.firstName[0] + this.user.lastName[0]).toUpperCase()
    }
  },
  async mounted() {
    await this.fetchProfile()
  },
  methods: {
    // Маска для телефона: +7(123)456-78-90
    formatPhoneInput(e) {
      let numbers = e.target.value.replace(/\D/g, '')
      if (numbers.startsWith('7')) numbers = numbers.substring(1)
      if (numbers.startsWith('8')) numbers = numbers.substring(1)
      
      let formatted = '+7('
      if (numbers.length > 0) formatted += numbers.substring(0, 3)
      if (numbers.length > 3) formatted += ')' + numbers.substring(3, 6)
      if (numbers.length > 6) formatted += '-' + numbers.substring(6, 8)
      if (numbers.length > 8) formatted += '-' + numbers.substring(8, 10)
      
      this.editData.phoneNumber = formatted
    },
    
    // Маска для паспорта: 12 34 567890
    formatPassportInput(e) {
      let numbers = e.target.value.replace(/\D/g, '')
      let formatted = ''
      
      if (numbers.length > 0) formatted += numbers.substring(0, 2)
      if (numbers.length > 2) formatted += ' ' + numbers.substring(2, 4)
      if (numbers.length > 4) formatted += ' ' + numbers.substring(4, 10)
      
      this.editData.passportNumber = formatted
    },
    
    // Маска для банковской карты: 1234 5678 9012 3456
    formatCardInput(e) {
      let numbers = e.target.value.replace(/\D/g, '')
      let formatted = ''
      
      if (numbers.length > 0) formatted += numbers.substring(0, 4)
      if (numbers.length > 4) formatted += ' ' + numbers.substring(4, 8)
      if (numbers.length > 8) formatted += ' ' + numbers.substring(8, 12)
      if (numbers.length > 12) formatted += ' ' + numbers.substring(12, 16)
      
      this.editData.bankCardNumber = formatted
    },
    
    async fetchProfile() {
      this.loading = true
      this.error = null
      
      const token = localStorage.getItem('token')
      
      if (!token) {
        this.$router.push('/')
        return
      }
      
      try {
        const response = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          this.user = data.user
          this.editData = { ...data.user }
        } else if (response.status === 401) {
          localStorage.removeItem('token')
          this.$router.push('/')
        } else {
          this.error = 'Ошибка загрузки профиля'
        }
      } catch (error) {
        this.error = 'Ошибка соединения'
      }
      
      this.loading = false
    },
    
    toggleEdit() {
      if (this.editing) {
        this.editing = false
      } else {
        this.editing = true
        this.error = ''
      }
    },
    
    onAddressChange(value) {
      if (value && value.value) {
        this.editData.deliveryAddress = value.value
      }
    },
    
    async updateProfile() {
      this.saving = true
      this.error = ''
      
      const token = localStorage.getItem('token')
      
      try {
        const response = await fetch('http://localhost:5000/api/auth/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(this.editData)
        })
        
        if (response.ok) {
          const data = await response.json()
          this.user = data.user
          this.editing = false
        } else {
          const data = await response.json()
          this.error = data.message || 'Ошибка обновления'
        }
      } catch (err) {
        this.error = 'Ошибка соединения'
      }
      
      this.saving = false
    },
    
    logout() {
      localStorage.removeItem('token')
      this.$router.push('/')
    }
  }
}
</script>



<style scoped>
.profile-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.profile-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  animation: slideUp 0.5s ease-out;
}

.page-title {
  text-align: center;
  margin: 0 0 2rem;
  color: #2c3e50;
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #007bff, #0056b3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.loading {
  text-align: center;
  padding: 3rem;
  font-size: 1.3rem;
  color: #6c757d;
}

.avatar-section {
  text-align: center;
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 3px solid #e9ecef;
  position: relative;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0 auto 1.5rem;
  box-shadow: 0 8px 20px rgba(0,123,255,0.3);
  transition: transform 0.3s ease;
}

.avatar:hover {
  transform: scale(1.05);
}

.user-name {
  margin: 0.5rem 0;
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 600;
}

.username {
  margin: 0;
  color: #6c757d;
  font-size: 1.1rem;
}

.edit-section {
  text-align: center;
  margin-bottom: 2rem;
}

.edit-toggle {
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(40,167,69,0.3);
}

.edit-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40,167,69,0.4);
}

.edit-form {
  margin-bottom: 2rem;
  animation: fadeIn 0.3s ease-out;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.input-group {
  position: relative;
  margin-right: 25px;
}

.input-group.full {
  grid-column: 1 / -1;
}

.input-group input,
.input-group .dadata-input {
  width: 100%;
  padding: 1rem 1.2rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.input-group input:focus,
.input-group .dadata-input:focus {
  outline: none;
  border-color: #007bff;
  background: white;
  box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
}

.input-group input:invalid,
.input-group .dadata-input:invalid {
  border-color: #dc3545;
}

.input-group label {
  position: absolute;
  left: 1.2rem;
  top: 1rem;
  color: #999;
  transition: all 0.3s ease;
  pointer-events: none;
  font-size: 0.9rem;
}

.input-group input:focus + label,
.input-group input:not(:placeholder-shown) + label,
.input-group .dadata-input:focus + label,
.input-group .dadata-input:not(:placeholder-shown) + label {
  top: -0.5rem;
  left: 1rem;
  font-size: 0.75rem;
  color: #007bff;
  background: white;
  padding: 0 0.5rem;
  border-radius: 4px;
}

/* Кастом стили для подсказок DaData */
.dadata-suggestions {
  max-height: 200px; /* Компактный скролл */
  overflow-y: auto;
  border: 1px solid #ced4da;
  border-radius: 8px;
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 0;
  margin-top: 0.5rem;
  z-index: 1001;
}

.dadata-suggestion-item {
  padding: 0.5rem 1rem; /* Компактнее */
  cursor: pointer;
  border-bottom: 1px solid #e9ecef;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.dadata-suggestion-item:hover {
  background: #f0f0f0;
}

.dadata-suggestion-item:last-child {
  border-bottom: none;
}

.save-profile-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.save-profile-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,123,255,0.3);
}

.save-profile-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.profile-info {
  animation: fadeIn 0.5s ease-out;
}

.details-section {
  margin-bottom: 2rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem;
  background: #f8f9fa;
  border-radius: 10px;
  margin-bottom: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-left: 4px solid #e9ecef;
}

.detail-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.detail-item label {
  font-weight: 600;
  color: #495057;
  flex: 0 0 40%;
}

.detail-item span {
  color: #2c3e50;
  font-weight: 500;
  text-align: right;
  flex: 1;
}

.add-address-inline {
  text-align: center;
  padding: 1rem;
  border: 2px dashed #007bff;
  border-radius: 8px;
}

.add-btn {
  padding: 0.5rem 1.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
}

.add-btn:hover {
  background: #0056b3;
  transform: translateY(-1px);
}

.actions {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 3px solid #e9ecef;
}

.logout-btn {
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, #dc3545, #c82333);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(220,53,69,0.3);
}

.logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(220,53,69,0.4);
}

.error {
  text-align: center;
  color: #dc3545;
  padding: 2rem;
}

.error button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.error-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #f8d7da;
  color: #721c24;
  border-radius: 6px;
  text-align: center;
  font-size: 0.9rem;
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}


@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .profile-card {
    padding: 1.5rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .detail-item span {
    text-align: left;
  }

}
</style>

<style>
.vue-dadata__input {
  width: 98% !important;
  padding: 12px !important;
  border: 1px solid #ddd !important;
  border-radius: 8px !important;
  font-size: 14px !important;
}

.vue-dadata__suggestions span {
  border: 2px solid #007bff !important;
  border-radius: 12px !important;
  padding: 16px !important;
  background: white !important;
  box-shadow: 0 4px 20px rgba(0,123,255,0.15) !important;
  display: block !important;
}

.vue-dadata__suggestion {
  padding: 12px 16px !important;
  margin: 8px 0 !important;
  border-radius: 8px !important;
  background: #f8f9fa !important;
  border: 1px solid #e9ecef !important;
}

.vue-dadata__suggestion:hover {
  background: #007bff !important;
  color: white !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 2px 8px rgba(0,123,255,0.3) !important;
}

</style>
