<template>
  <div class="address-section">
    <h4 class="address-title">Адрес доставки</h4>
    <div v-if="address" class="current-address">
      <p>{{ address }}</p>
      <button @click="editAddress" class="edit-btn">Изменить</button>
    </div>
    <div v-else class="add-address">
      <button @click="showForm = true" class="add-btn">Добавить адрес</button>
    </div>
    <div v-if="showForm" class="address-form-overlay">
      <div class="address-form-container">
        <div class="form-header">
          <h5>{{ address ? 'Изменить адрес' : 'Добавить адрес' }}</h5>
          <button @click="closeForm" class="close-btn">&times;</button>
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
            <button type="submit" :disabled="!formData.address" class="save-btn">Сохранить</button>
            <button type="button" @click="closeForm" class="cancel-btn">Отмена</button>
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

</style>