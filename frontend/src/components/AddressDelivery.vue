
<template>
  <div class="address-section">
    <h4 class="address-title">Адрес доставки</h4>
    <div v-if="address" class="current-address">
      <div class="address-display">
        <span class="address-text">{{ address }}</span>
        <button @click="editAddress" class="edit-btn">
          <span class="btn-icon">✏️</span>
          Изменить
        </button>
      </div>
    </div>
    <div v-else class="add-address">
      <button @click="showForm = true" class="add-btn">
        <span class="btn-icon">📍</span>
        Добавить адрес
      </button>
    </div>
    
    <div v-if="showForm" class="address-form-overlay">
      <div class="address-form-container">
        <div class="form-header">
          <h5>{{ address ? 'Изменить адрес' : 'Добавить адрес' }}</h5>
          <button @click="closeForm" class="close-btn">
            <span>&times;</span>
          </button>
        </div>
        <form @submit.prevent="saveAddress" class="address-form">
          <div class="input-group">
            <vue-dadata
              ref="addressInput"
              type="address"
              v-model="formData.address"
              :token="dadataToken"
              :lang="lang"
              :locations="locations"
              :placeholder="'Введите адрес'"
              class="dadata-input"
              @change="onAddressChange"
            />
            <label>Адрес (город, улица, дом)</label>
          </div>
          <div class="form-actions">
            <button type="submit" :disabled="!formData.address" class="save-btn">
              Сохранить адрес
            </button>
            <button type="button" @click="closeForm" class="cancel-btn">
              Отмена
            </button>
          </div>
          <div v-if="error" class="error-message">{{ error }}</div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { VueDadata } from 'vue-dadata'

export default {
  name: 'AddressDelivery',
  components: { VueDadata },
  props: {
    initialAddress: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      address: this.initialAddress,
      showForm: false,
      formData: {
        address: ''
      },
      error: '',
      dadataToken: 'af18825804cefa054ca822cb7ad1d61d609aa5dc',
      lang: 'ru',
      locations: [
        { country: 'RU' },
        { country: 'BY' },
        { country: 'KZ' }
      ]
    }
  },
  methods: {
    editAddress() {
      this.formData.address = this.address
      this.showForm = true
      this.error = ''
    },
    closeForm() {
      this.showForm = false
      this.error = ''
      this.formData.address = ''
    },
    onAddressChange(value) {
      if (value && value.value) {
        this.formData.address = value.value
      }
    },
    async saveAddress() {
      if (!this.formData.address) {
        this.error = 'Выберите адрес из подсказок'
        return
      }
      this.error = ''
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:5000/api/auth/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ deliveryAddress: this.formData.address })
        })
        if (response.ok) {
          this.address = this.formData.address
          this.$emit('address-updated', this.address)
          this.closeForm()
        } else {
          const data = await response.json()
          this.error = data.message || 'Ошибка сохранения'
        }
      } catch (err) {
        this.error = 'Ошибка соединения'
      }
    }
  }
}
</script>

<style scoped>
.address-section {
  margin: 30px 0;
  padding: 25px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.address-title {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 20px;
  text-align: center;
}

.current-address {
  text-align: center;
}

.address-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.address-text {
  font-size: 16px;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
  padding: 15px 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 400px;
  width: 100%;
  word-break: break-word;
}

.add-address {
  text-align: center;
}

.add-btn, .edit-btn {
  background: linear-gradient(135deg, #ff6f00, #ff8f00);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.add-btn:hover, .edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 111, 0, 0.4);
}

.btn-icon {
  font-size: 16px;
}

.address-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.address-form-container {
  background: #2d2d2d;
  border-radius: 20px;
  padding: 0;
  width: 90%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  background: rgba(255, 111, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.form-header h5 {
  margin: 0;
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
}

.close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  border-radius: 8px;
  width: 35px;
  height: 35px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 111, 0, 0.2);
  border-color: #ff6f00;
  transform: scale(1.1);
}

.address-form {
  padding: 30px;
}

.input-group {
  position: relative;
  margin-bottom: 25px;
}

.dadata-input {

  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: #ffffff;
  font-size: 16px;
  transition: all 0.3s ease;
}

.dadata-input:focus {
  outline: none;
  border-color: #ff6f00;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 3px rgba(255, 111, 0, 0.1);
}

.input-group label {
  position: absolute;
  left: 15px;
  top: 15px;
  color: #cccccc;
  transition: all 0.3s ease;
  pointer-events: none;
  background: transparent;
  padding: 0 5px;
}

.dadata-input:focus + label,
.dadata-input:not(:placeholder-shown) + label {
  top: -10px;
  left: 10px;
  font-size: 12px;
  color: #ff6f00;
  background: #2d2d2d;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 25px;
}

.save-btn {
  flex: 1;
  background: linear-gradient(135deg, #ff6f00, #ff8f00);
  color: white;
  border: none;
  padding: 15px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 111, 0, 0.4);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  background: rgba(255, 255, 255, 0.1);
}

.cancel-btn {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 15px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.error-message {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
  padding: 12px;
  border-radius: 8px;
  margin-top: 15px;
  border: 1px solid rgba(244, 67, 54, 0.3);
  text-align: center;
  font-size: 14px;
}

@media (max-width: 768px) {
  .address-section {
    padding: 20px;
    margin: 20px 0;
  }
  
  .address-form-container {
    width: 95%;
  }
  
  .form-header {
    padding: 20px;
  }
  
  .address-form {
    padding: 20px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .address-text {
    font-size: 14px;
    padding: 12px 16px;
  }
}
</style>
