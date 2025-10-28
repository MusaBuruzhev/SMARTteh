<template>
  <div class="product-detail-page">
    <Header />
    <div class="container">
      <div v-if="loading" class="loading">Загрузка...</div>
      <div v-else-if="error" class="error-message">{{ error }}</div>
      <div v-else-if="product" class="product-content">
        <div class="product-header">
          <h1 class="page-title">{{ product.name }}</h1>
          <p class="article-number">Артикул: {{ product.articleNumber }}</p>
        </div>
        <div class="product-grid">
          <div class="product-images">
            <img
              v-if="product.images && product.images.length"
              :src="mainImage"
              alt="Изображение товара"
              class="main-image"
            />
            <div class="thumbnail-gallery">
              <img
                v-for="(image, index) in product.images"
                :key="index"
                :src="'http://localhost:5000' + image"
                alt="Миниатюра товара"
                class="thumbnail"
                :class="{ active: activeImageIndex === index }"
                @click="setMainImage(index)"
              />
            </div>
          </div>
          <div class="product-details">
            <p class="category">{{ categoryMap[product.category] || product.category }}</p>
            <p class="price">Цена: {{ product.price }} руб.</p>
            <p class="stock">В наличии: {{ product.stock }}</p>
            <AddressDelivery :initialAddress="userAddress" @address-updated="updateUserAddress" />
            <div class="product-actions">
              <button
                v-if="product.stock > 0"
                :class="['cart-btn', { 'in-cart': inCart }]"
                @click="handleCartClick"
              >
                {{ inCart ? 'В корзине' : 'В корзину' }}
              </button>
              <button v-else class="cart-btn disabled" disabled>
                Нет в наличии
              </button>
              <button
                class="buy-now-btn"
                :disabled="!userAddress || product.stock === 0 || processing"
                @click="handleBuyClick"
              >
                {{ processing ? 'Обработка...' : 'Купить сейчас' }}
              </button>
            </div>
            
            <!-- Уведомления -->
            <div v-if="showAddressError" class="error-notification">
              Пожалуйста, укажите адрес доставки перед покупкой
            </div>
            <div v-if="buyError" class="error-notification">
              {{ buyError }}
            </div>
            <div v-if="buySuccess" class="success-notification">
              Товар добавлен в корзину! Переходим к оформлению...
            </div>
            
            <div class="description">
              <h3>Описание</h3>
              <p>{{ product.description }}</p>
            </div>
            <div class="characteristics">
              <h3>Характеристики</h3>
              <div class="char-grid">
                <div v-for="(value, key) in product.characteristics" :key="key" class="char-item">
                  <span class="char-key">{{ key }}:</span>
                  <span class="char-value">{{ value }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">Товар не найден</div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import AddressDelivery from '@/components/AddressDelivery.vue'

export default {
  name: 'ProductDetail',
  components: { Header, AddressDelivery },
  data() {
    return {
      product: null,
      userAddress: '',
      loading: true,
      error: '',
      inCart: false,
      activeImageIndex: 0,
      processing: false,
      showAddressError: false,
      buyError: '',
      buySuccess: false,
      categoryMap: {
        smartphones: 'Смартфоны',
        laptops: 'Ноутбуки',
        tablets: 'Планшеты',
        accessories: 'Аксессуары',
        gadgets: 'Гаджеты'
      }
    }
  },
  computed: {
    mainImage() {
      return this.product && this.product.images && this.product.images.length
        ? 'http://localhost:5000' + this.product.images[this.activeImageIndex]
        : ''
    }
  },
  async mounted() {
    await this.fetchUserProfile()
    await this.fetchProduct()
    await this.checkInCart()
  },
  methods: {
    async fetchUserProfile() {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:5000/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (response.ok) {
          const data = await response.json()
          this.userAddress = data.user.deliveryAddress || ''
        }
      } catch (error) {
        console.error('Ошибка загрузки профиля:', error)
      }
    },
    async fetchProduct() {
      this.loading = true
      this.error = ''
      try {
        const token = localStorage.getItem('token')
        const productId = this.$route.params.id
        const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (!response.ok) {
          throw new Error('Ошибка загрузки товара')
        }
        const data = await response.json()
        this.product = data.product
      } catch (error) {
        this.error = 'Ошибка загрузки товара: ' + error.message
      } finally {
        this.loading = false
      }
    },
    async checkInCart() {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:5000/api/cart/list', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (response.ok) {
          const { cart } = await response.json()
          this.inCart = cart.some(item => item && item.product && item.product._id === this.$route.params.id)
        }
      } catch (error) {
        console.error('Ошибка проверки корзины:', error)
      }
    },
    async handleCartClick() {
      if (this.inCart) {
        this.$router.push('/profile?tab=cart')
        return
      }
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:5000/api/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ productId: this.$route.params.id })
        })
        const data = await response.json()
        if (response.ok) {
          this.inCart = true
        } else {
          this.buyError = data.message || 'Ошибка добавления в корзину'
          setTimeout(() => { this.buyError = '' }, 3000)
        }
      } catch (error) {
        console.error('Ошибка соединения:', error)
        this.buyError = 'Ошибка соединения'
        setTimeout(() => { this.buyError = '' }, 3000)
      }
    },
    async handleBuyClick() {
 
      this.showAddressError = false
      this.buyError = ''
      this.buySuccess = false

      if (!this.userAddress) {
        this.showAddressError = true
        setTimeout(() => { this.showAddressError = false }, 3000)
        return
      }
        if (this.product.stock === 0) {
        this.buyError = 'Товара нет в наличии'
        setTimeout(() => { this.buyError = '' }, 3000)
        return
      }
      
      this.processing = true
      
      try {
        const token = localStorage.getItem('token')
          if (!this.inCart) {
          const addResponse = await fetch('http://localhost:5000/api/cart/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productId: this.$route.params.id })
          })
          
          if (!addResponse.ok) {
            const data = await addResponse.json()
            throw new Error(data.message || 'Ошибка добавления в корзину')
          }
          
          this.inCart = true
        }
        
        this.buySuccess = true
          setTimeout(() => {
          this.$router.push('/checkout')
        }, 1000)
        
      } catch (error) {
        console.error('Ошибка при покупке:', error)
        this.buyError = error.message || 'Ошибка при оформлении заказа'
        setTimeout(() => { this.buyError = '' }, 3000)
      } finally {
        this.processing = false
      }
    },
    updateUserAddress(newAddress) {
      this.userAddress = newAddress
      if (this.showAddressError) {
        this.showAddressError = false
      }
    },
    setMainImage(index) {
      this.activeImageIndex = index
    }
  }
}
</script>

<style scoped>
.product-detail-page {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  min-height: 100vh;
  color: #ffffff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.container {
  max-width: 90%;
  margin: 0 auto;
  padding: 30px 20px;
}

.product-header {
  margin-bottom: 40px;
  padding: 0 10px;
}

.page-title {
  font-size: 36px;
  margin: 0 0 12px;
  color: #ffffff;
  font-weight: 800;
  background: linear-gradient(45deg, #ff6f00, #ff8f00, #ffab00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 20px rgba(255, 111, 0, 0.3);
}

.article-number {
  font-size: 16px;
  color: #b0b0b0;
  font-style: italic;
  letter-spacing: 0.5px;
}

.product-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  align-items: start;
}

.product-images {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.main-image {
  width: 100%;
  max-height: 900px;
  object-fit: cover;
  border-radius: 20px;
  border: 2px solid rgba(255, 111, 0, 0.3);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  background: linear-gradient(45deg, #2d2d2d, #3d3d3d);
}

.main-image:hover {
  box-shadow: 0 20px 50px rgba(255, 111, 0, 0.3);
  border-color: rgba(255, 111, 0, 0.6);
}

.thumbnail-gallery {
    display: flex;
    gap: 15px;
    overflow-x: auto;
    padding: 15px 5px;
    scrollbar-width: thin;
    scrollbar-color: #ff6f00 #2d2d2d;
    justify-content: flex-end;
}

.thumbnail-gallery::-webkit-scrollbar {
  height: 8px;
}

.thumbnail-gallery::-webkit-scrollbar-track {
  background: #2d2d2d;
  border-radius: 10px;
}

.thumbnail-gallery::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #ff6f00, #ff8f00);
  border-radius: 10px;
}

.thumbnail {
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.15);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  background: linear-gradient(45deg, #2d2d2d, #3d3d3d);
}

.thumbnail.active {
  border-color: #ff6f00;
  transform: scale(1.15);
  box-shadow: 0 8px 25px rgba(255, 111, 0, 0.5);
}

.thumbnail:hover {
  border-color: #ff8f00;
  box-shadow: 0 6px 20px rgba(255, 111, 0, 0.4);
}

.product-details {
  background: rgba(45, 45, 45, 0.8);
  backdrop-filter: blur(20px);
  padding: 40px 35px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.product-details::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #ff6f00, #ff8f00, #ff6f00);
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { background-position: -200% 0; }
  50% { background-position: 200% 0; }
}

.category {
  font-size: 18px;
  color: #ff6f00;
  margin-bottom: 20px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  display: inline-block;
  padding: 8px 16px;
  background: rgba(255, 111, 0, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(255, 111, 0, 0.3);
}

.price {
  font-size: 42px;
  font-weight: 800;
  color: #ffffff;
  margin: 25px 0 20px;
  background: linear-gradient(45deg, #ffffff, #ff8f00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 20px rgba(255, 143, 0, 0.3);
}

.stock {
  font-size: 18px;
  color: #4caf50;
  margin-bottom: 30px;
  font-weight: 700;
  padding: 10px 20px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(76, 175, 80, 0.3);
  display: inline-block;
}

.product-actions {
  display: flex;
  gap: 20px;
  margin: 35px 0;
}

.cart-btn, .buy-now-btn {
  flex: 1;
  padding: 18px 24px;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  font-size: 17px;
  font-weight: 700;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
  letter-spacing: 0.5px;
}

.cart-btn {
  background: linear-gradient(135deg, #ff6f00 0%, #ff8f00 50%, #ff6f00 100%);
  color: #ffffff;
  background-size: 200% 100%;
}

.cart-btn.in-cart {
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 50%, #4caf50 100%);
}

.cart-btn::before, .buy-now-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.6s;
}

.cart-btn:hover::before, .buy-now-btn:hover::before {
  left: 100%;
}

.buy-now-btn {
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 50%, #2196f3 100%);
  color: #ffffff;
  background-size: 200% 100%;
}

.cart-btn:hover, .buy-now-btn:hover:not(:disabled) {
  box-shadow: 0 15px 35px rgba(255, 111, 0, 0.5);
  background-position: 100% 0;
}

.buy-now-btn:hover:not(:disabled) {
  box-shadow: 0 15px 35px rgba(33, 150, 243, 0.5);
}

.cart-btn.disabled, .buy-now-btn:disabled {
  background: #666666;
  cursor: not-allowed;
  color: #999999;
  transform: none !important;
  box-shadow: none !important;
}

.cart-btn.disabled::before, .buy-now-btn:disabled::before {
  display: none;
}

/* Стили для уведомлений */
.error-notification {
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.15), rgba(244, 67, 54, 0.25));
  color: #ff5252;
  padding: 18px;
  border-radius: 14px;
  margin: 25px 0;
  border: 1px solid rgba(244, 67, 54, 0.4);
  text-align: center;
  animation: slideInBounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  font-weight: 600;
  font-size: 15px;
  backdrop-filter: blur(10px);
}

.success-notification {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.15), rgba(76, 175, 80, 0.25));
  color: #69f0ae;
  padding: 18px;
  border-radius: 14px;
  margin: 25px 0;
  border: 1px solid rgba(76, 175, 80, 0.4);
  text-align: center;
  animation: slideInBounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  font-weight: 600;
  font-size: 15px;
  backdrop-filter: blur(10px);
}

@keyframes slideInBounce {
  0% { 
    opacity: 0; 
    transform: translateY(-20px) scale(0.9);
  }
  60% { 
    opacity: 1; 
    transform: translateY(10px) scale(1.02);
  }
  100% { 
    transform: translateY(0) scale(1);
  }
}

.description h3, .characteristics h3 {
  font-size: 26px;
  margin: 35px 0 25px;
  color: #ffffff;
  border-bottom: 3px solid #ff6f00;
  padding-bottom: 12px;
  font-weight: 700;
  background: linear-gradient(45deg, #ffffff, #ff8f00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.description p {
  font-size: 17px;
  color: #e0e0e0;
  line-height: 1.8;
  padding: 0 5px;
}

.char-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.char-item {
  display: flex;
  justify-content: space-between;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.char-item:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 111, 0, 0.4);
  box-shadow: 0 8px 25px rgba(255, 111, 0, 0.2);
}

.char-key {
  font-weight: 700;
  color: #ffffff;
  font-size: 15px;
}

.char-value {
  color: #b0b0b0;
  font-weight: 600;
  font-size: 15px;
}

.loading, .error-message, .empty-state {
  text-align: center;
  padding: 60px 20px;
  font-size: 20px;
  border-radius: 20px;
  margin: 40px 0;
}

.loading {
  color: #ff6f00;
  font-size: 24px;
  font-weight: 700;
  background: rgba(255, 111, 0, 0.1);
  border: 2px solid rgba(255, 111, 0, 0.3);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.error-message {
  color: #ff5252;
  background: rgba(244, 67, 54, 0.1);
  border-radius: 16px;
  border: 2px solid rgba(244, 67, 54, 0.3);
  font-weight: 600;
}

.empty-state {
  color: #b0b0b0;
  font-size: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
}

/* Адаптивность */
@media (max-width: 1024px) {
  .product-grid {
    gap: 40px;
  }
  
  .main-image {
    height: 450px;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 20px 15px;
  }
  
  .product-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .main-image {
    height: 350px;
  }

  .product-details {
    padding: 30px 25px;
  }

  .product-actions {
    flex-direction: column;
  }

  .char-grid {
    grid-template-columns: 1fr;
  }
  
  .page-title {
    font-size: 28px;
  }
  
  .price {
    font-size: 36px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 15px 10px;
  }
  
  .product-details {
    padding: 25px 20px;
  }
  
  .cart-btn, .buy-now-btn {
    padding: 16px 20px;
    font-size: 16px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .price {
    font-size: 32px;
  }
}
</style>