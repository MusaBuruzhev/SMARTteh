<template>
  <div class="checkout-page">
    <Header />
    <div class="container">
      <div v-if="loading" class="loading">Загрузка...</div>
      <div v-else class="checkout-content">
        <h1 class="page-title">Оформление заказа</h1>
        
        <div class="checkout-grid">
          <div class="order-info">
            <div class="section">
              <h3>Выберите товары для заказа</h3>
              <div class="order-items">
                <div v-for="item in cartItems" :key="item.product._id" class="order-item">
                  <div class="item-select">
                    <input 
                      type="checkbox" 
                      v-model="selectedItems" 
                      :value="item.product._id"
                      :disabled="item.product.stock === 0"
                    />
                  </div>
                  <div class="item-image">
                    <img 
                      v-if="item.product.images && item.product.images.length" 
                      :src="getFullImageUrl(item.product.images[0])" 
                      :alt="item.product.name"
                    />
                  </div>
                  <div class="item-details">
                    <h4>{{ item.product.name }}</h4>
                    <p class="item-price">{{ item.product.price }} руб. × {{ item.quantity }}</p>
                    <p class="item-stock" :class="{ 'out-of-stock': item.product.stock === 0 }">
                      {{ item.product.stock > 0 ? `В наличии: ${item.product.stock} шт.` : 'Нет в наличии' }}
                    </p>
                  </div>
                  <div class="item-total">
                    {{ item.product.price * item.quantity }} руб.
                  </div>
                </div>
              </div>

              <div class="selection-actions">
                <button @click="selectAll" class="select-btn">Выбрать все</button>
                <button @click="deselectAll" class="select-btn">Очистить выбор</button>
              </div>

              <div class="order-summary">
                <div class="summary-row">
                  <span>Выбрано товаров:</span>
                  <span>{{ selectedItemsCount }}</span>
                </div>
                <div class="summary-row">
                  <span>Общая сумма:</span>
                  <span class="total-amount">{{ totalAmount }} руб.</span>
                </div>
              </div>
            </div>

            <div class="section">
              <h3>Адрес доставки</h3>
              <AddressDelivery 
                :initial-address="userAddress" 
                @address-updated="updateAddress" 
              />
            </div>
          </div>

          <!-- Правая колонка - оформление -->
          <div class="checkout-form">
            <div class="section">
              <h3>Способ оплаты</h3>
              <div class="payment-methods">
                <label class="payment-method">
                  <input 
                    type="radio" 
                    v-model="paymentMethod" 
                    value="cash" 
                    checked
                  />
                  <span class="checkmark"></span>
                  <span>Наличными при получении</span>
                </label>
                <label class="payment-method">
                  <input 
                    type="radio" 
                    v-model="paymentMethod" 
                    value="online" 
                  />
                  <span class="checkmark"></span>
                  <span>Онлайн-оплата (при доставке)</span>
                </label>
              </div>
            </div>

            <div class="section">
              <h3>Контактная информация</h3>
              <div class="contact-info">
                <div class="input-group">
                  <input v-model="contactInfo.email" type="email" required />
                  <label>Email</label>
                </div>
                <div class="input-group">
                  <input 
                    v-model="contactInfo.phone" 
                    @input="formatPhoneInput"
                    type="tel" 
                    required 
                  />
                  <label>Телефон</label>
                </div>
                <div class="input-group">
                  <input v-model="contactInfo.fullName" type="text" required />
                  <label>ФИО</label>
                </div>
              </div>
            </div>

            <div class="section">
              <h3>Комментарий к заказу</h3>
              <div class="input-group">
                <textarea 
                  v-model="orderComment" 
                  placeholder="Дополнительные пожелания к заказу..."
                  rows="3"
                ></textarea>
              </div>
            </div>

            <div class="order-actions">
              <button 
                @click="placeOrder" 
                :disabled="!canPlaceOrder || processing"
                class="place-order-btn"
              >
                {{ processing ? 'Оформление...' : `Оформить заказ - ${totalAmount} руб.` }}
              </button>
              <button @click="$router.back()" class="back-btn">
                Вернуться назад
              </button>
            </div>

            <div v-if="error" class="error-message">
              {{ error }}
            </div>
            <div v-if="success" class="success-message">
              {{ success }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import AddressDelivery from '@/components/AddressDelivery.vue'

export default {
  name: 'Checkout',
  components: {
    Header,
    AddressDelivery
  },
  data() {
    return {
      loading: true,
      processing: false,
      cartItems: [],
      selectedItems: [], 
      userAddress: '',
      paymentMethod: 'cash',
      contactInfo: {
        email: '',
        phone: '',
        fullName: ''
      },
      orderComment: '',
      error: '',
      success: ''
    }
  },
  computed: {
    selectedCartItems() {
      return this.cartItems.filter(item => 
        this.selectedItems.includes(item.product._id)
      )
    },
    
    selectedItemsCount() {
      return this.selectedItems.length
    },

    totalAmount() {
      return this.selectedCartItems.reduce((total, item) => {
        return total + (item.product.price * item.quantity)
      }, 0)
    },

    canPlaceOrder() {
      return this.selectedItems.length > 0 && 
             this.userAddress && 
             this.contactInfo.email && 
             this.contactInfo.phone &&
             this.contactInfo.fullName
    },

    availableItems() {
      return this.cartItems.filter(item => item.product.stock > 0)
    }
  },
  async mounted() {
    await this.fetchUserData()
    await this.fetchCartItems()
    this.loading = false
  },
  methods: {
    getFullImageUrl(imgPath) {
      return imgPath.startsWith('http') ? imgPath : `http://localhost:5000${imgPath}`
    },

    async fetchUserData() {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:5000/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (response.ok) {
          const data = await response.json()
          this.userAddress = data.user.deliveryAddress || ''
          this.contactInfo.email = data.user.email || ''
          this.contactInfo.phone = data.user.phoneNumber || ''
          this.contactInfo.fullName = `${data.user.firstName || ''} ${data.user.lastName || ''}`.trim()
        }
      } catch (error) {
        console.error('Ошибка загрузки данных пользователя:', error)
      }
    },

    async fetchCartItems() {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:5000/api/cart/list', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (response.ok) {
          const data = await response.json()
          this.cartItems = data.cart
          this.selectedItems = this.availableItems.map(item => item.product._id)
        }
      } catch (error) {
        console.error('Ошибка загрузки корзины:', error)
      }
    },

    updateAddress(newAddress) {
      this.userAddress = newAddress
    },

    formatPhoneInput(event) {
      let value = event.target.value.replace(/\D/g, '')
      if (value.startsWith('8') && value.length === 1) {
        value = '7'
      }
      if (value.length > 0) {
        let formattedValue = '+7'
        if (value.length > 1) formattedValue += '(' + value.substring(1, 4)
        if (value.length > 4) formattedValue += ')' + value.substring(4, 7)
        if (value.length > 7) formattedValue += '-' + value.substring(7, 9)
        if (value.length > 9) formattedValue += '-' + value.substring(9, 11)
        this.contactInfo.phone = formattedValue
      } else {
        this.contactInfo.phone = ''
      }
    },

    selectAll() {
      this.selectedItems = this.availableItems.map(item => item.product._id)
    },

    deselectAll() {
      this.selectedItems = []
    },

    async placeOrder() {
      if (!this.canPlaceOrder) return

      this.processing = true
      this.error = ''
      this.success = ''

      try {
        const token = localStorage.getItem('token')
        const orderData = {
          items: this.selectedCartItems.map(item => ({
            productId: item.product._id,
            quantity: item.quantity,
            price: item.product.price
          })),
          deliveryAddress: this.userAddress,
          paymentMethod: this.paymentMethod,
          contactInfo: this.contactInfo,
          comment: this.orderComment,
          totalAmount: this.totalAmount
        }

        const response = await fetch('http://localhost:5000/api/orders/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(orderData)
        })

        const data = await response.json()

        if (response.ok) {
          this.success = 'Заказ успешно оформлен!'
          await this.removeOrderedItemsFromCart()
          setTimeout(() => {
            this.$router.push('/profile?tab=history')
          }, 2000)
        } else {
          this.error = data.message || 'Ошибка при оформлении заказа'
        }
      } catch (error) {
        this.error = 'Ошибка соединения. Попробуйте еще раз.'
        console.error('Ошибка оформления заказа:', error)
      } finally {
        this.processing = false
      }
    },

    async removeOrderedItemsFromCart() {
      try {
        const token = localStorage.getItem('token')
        for (const productId of this.selectedItems) {
          await fetch(`http://localhost:5000/api/cart/remove/${productId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          })
        }
      } catch (error) {
        console.error('Ошибка удаления товаров из корзины:', error)
      }
    }
  }
}
</script>

<style scoped>
.checkout-page {
  background: #1a1a1a;
  min-height: 100vh;
  color: #ffffff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  font-size: 28px;
  margin-bottom: 30px;
  text-align: center;
}

.checkout-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.section {
  background: #2d2d2d;
  padding: 25px;
  border-radius: 12px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.section h3 {
  margin: 0 0 20px 0;
  color: #ffffff;
  font-size: 18px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.order-item:last-child {
  border-bottom: none;
}

.item-select {
  flex-shrink: 0;
}

.item-select input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
}

.item-details h4 {
  margin: 0 0 5px 0;
  font-size: 16px;
}

.item-price {
  color: #cccccc;
  font-size: 14px;
  margin: 0 0 3px 0;
}

.item-stock {
  font-size: 12px;
  margin: 0;
}

.item-stock.out-of-stock {
  color: #f44336;
}

.item-total {
  font-weight: 600;
  color: #ff6f00;
  flex-shrink: 0;
}

/* Кнопки выбора */
.selection-actions {
  display: flex;
  gap: 10px;
  margin: 15px 0;
}

.select-btn {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.select-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.order-summary {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid rgba(255, 255, 255, 0.1);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 16px;
}

.summary-row:last-child {
  margin-bottom: 0;
  font-size: 18px;
  font-weight: 600;
}

.total-amount {
  font-size: 24px;
  font-weight: bold;
  color: #ff6f00;
}

.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.payment-method {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.payment-method:hover {
  border-color: #ff6f00;
}

.payment-method input {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  position: relative;
  transition: all 0.3s ease;
}

.payment-method input:checked + .checkmark {
  border-color: #ff6f00;
  background: #ff6f00;
}

.payment-method input:checked + .checkmark::after {
  content: '';
  position: absolute;
  top: 4px;
  left: 4px;
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
}

\.input-group {
  position: relative;
  margin-bottom: 20px;
}

.input-group input,
.input-group textarea {
  width: 100%;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #ffffff;
  font-size: 16px;
  transition: all 0.3s ease;
  font-family: inherit;
}

.input-group input:focus,
.input-group textarea:focus {
  outline: none;
  border-color: #ff6f00;
  background: rgba(255, 255, 255, 0.15);
}

.input-group label {
  position: absolute;
  left: 15px;
  top: 15px;
  color: #cccccc;
  transition: all 0.3s ease;
  pointer-events: none;
  background: #2d2d2d;
  padding: 0 5px;
}

.input-group input:focus + label,
.input-group input:not(:placeholder-shown) + label,
.input-group textarea:focus + label,
.input-group textarea:not(:placeholder-shown) + label {
  top: -8px;
  font-size: 12px;
  color: #ff6f00;
}

/* Стили для кнопок */
.order-actions {
  margin-top: 30px;
}

.place-order-btn, .back-btn {
  width: 100%;
  padding: 16px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 15px;
}

.place-order-btn {
  background: #ff6f00;
  color: white;
}

.place-order-btn:hover:not(:disabled) {
  background: #ff8f00;
  transform: translateY(-2px);
}

.place-order-btn:disabled {
  background: #666;
  cursor: not-allowed;
  transform: none;
}

.back-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Сообщения */
.error-message {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
  padding: 12px;
  border-radius: 8px;
  margin-top: 15px;
  border: 1px solid rgba(244, 67, 54, 0.3);
}

.success-message {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
  padding: 12px;
  border-radius: 8px;
  margin-top: 15px;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.loading {
  text-align: center;
  padding: 40px;
  color: #ff6f00;
  font-size: 18px;
}

@media (max-width: 768px) {
  .checkout-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .order-item {
    flex-wrap: wrap;
  }
  
  .section {
    padding: 20px;
  }
  
  .selection-actions {
    flex-direction: column;
  }
}
</style>