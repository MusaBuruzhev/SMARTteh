<template>
  <div class="product-card" @click="goToProduct">
    <div class="product-image-container">
      <img 
        v-if="product.images && product.images.length" 
        :src="'http://localhost:5000' + product.images[0]" 
        alt="Изображение товара" 
        class="product-image"
      >
      <div v-else class="product-image-placeholder">
        <span>📷</span>
      </div>
    </div>
    
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-price">{{ formatPrice(product.price) }} ₽</p>
      <div class="product-stock" :class="{ 'low-stock': product.stock < 10, 'out-of-stock': product.stock === 0 }">
        {{ getStockText(product.stock) }}
      </div>
    </div>
    
    <div class="product-actions" @click.stop>
      <button 
        v-if="product.stock > 0"
        :class="['cart-btn', { 'in-cart': inCart }]" 
        @click="handleCartClick"
      >
        <span class="btn-icon">{{ inCart ? '✓' : '🛒' }}</span>
        {{ inCart ? 'В корзине' : 'В корзину' }}
      </button>
      <button 
        v-else
        class="cart-btn disabled"
        disabled
      >
        <span class="btn-icon">⛔</span>
        Нет в наличии
      </button>
      <button class="buy-now-btn" @click="handleBuyNow">
        <span class="btn-icon">⚡</span>
        Купить сейчас
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true
    },
    categoryMap: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      inCart: false
    }
  },
  mounted() {
    this.checkInCart();
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('ru-RU').format(price);
    },
    
    getStockText(stock) {
      if (stock === 0) return 'Нет в наличии';
      if (stock < 10) return `Осталось ${stock} шт.`;
      return `В наличии: ${stock} шт.`;
    },
    
    goToProduct() {
      this.$router.push(`/product/${this.product._id}`)
    },
    
    async handleBuyNow() {
      if (!this.inCart) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('http://localhost:5000/api/cart/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productId: this.product._id })
          });
          if (response.ok) {
            this.inCart = true;
          }
        } catch (error) {
          console.error('Ошибка добавления в корзину:', error);
          return;
        }
      }
      // Переходим к оформлению заказа
      this.$router.push('/checkout');
    },
    
    async checkInCart() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/cart/list', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const { cart } = await response.json();
          this.inCart = cart.some(item => item && item.product && item.product._id === this.product._id);
        }
      } catch (error) {
        console.error('Ошибка проверки корзины:', error);
      }
    },
    
    async handleCartClick() {
      if (this.inCart) {
        this.$router.push('/profile?tab=cart');
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ productId: this.product._id })
        });
        const data = await response.json();
        if (response.ok) {
          this.inCart = true;
          this.$emit('addedToCart', this.product);
        } else {
          this.$emit('error', data.message || 'Ошибка добавления в корзину');
        }
      } catch (error) {
        console.error('Ошибка соединения:', error);
        this.$emit('error', 'Ошибка соединения');
      }
    }
  }
}
</script>

<style scoped>
.product-card {
  max-height: 469px;
  min-width: 350px;
  background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
  border: 1px solid rgba(255, 107, 53, 0.3);
  border-radius: 20px;
  padding: 1.5rem;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}
.product-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(135deg, #ff6b35, #ff8e53);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.product-card:hover::before {
  transform: scaleX(1);
}

.product-image-container {
  position: relative;
  margin-bottom: 1rem;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(26, 26, 26, 0.6);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-image-placeholder {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(42, 42, 42, 0.8);
  border: 2px dashed rgba(255, 107, 53, 0.3);
  border-radius: 12px;
}

.product-image-placeholder span {
  font-size: 3rem;
  opacity: 0.5;
}

.product-info {
  margin-bottom: 1.5rem;
}

.product-name {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
  color: #ffffff;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #ff6b35, #ff8e53);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.product-stock {
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  display: inline-block;
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.product-stock.low-stock {
  background: rgba(255, 152, 0, 0.2);
  color: #ff9800;
  border-color: rgba(255, 152, 0, 0.3);
}

.product-stock.out-of-stock {
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
  border-color: rgba(244, 67, 54, 0.3);
}

.product-actions {
  display: flex;
  gap: 0.75rem;
}

.cart-btn, .buy-now-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
}

.cart-btn {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8e53 100%);
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
}

.cart-btn:hover {
  box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
}

.cart-btn.in-cart {
  background: linear-gradient(135deg, #4caf50, #66bb6a);
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
}

.cart-btn.in-cart:hover {
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
}

.buy-now-btn {
  background: rgba(42, 42, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #b0b0b0;
}

.buy-now-btn:hover {
  background: rgba(255, 107, 53, 0.1);
  border-color: rgba(255, 107, 53, 0.3);
  color: #ffffff;

}

.cart-btn.disabled {
  background: rgba(42, 42, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #666;
  cursor: not-allowed;
  box-shadow: none;
}

.cart-btn.disabled:hover {
  transform: none;
  box-shadow: none;
}

.btn-icon {
  font-size: 1rem;
}

/* Адаптивность */
@media (max-width: 768px) {
  .product-card {
    padding: 1rem;
  }
  
  .product-image {
    height: 160px;
  }
  
  .product-image-placeholder {
    height: 160px;
  }
  
  .product-name {
    font-size: 1.1rem;
  }
  
  .product-price {
    font-size: 1.3rem;
  }
  
  .product-actions {
    flex-direction: column;
  }
  
  .cart-btn, .buy-now-btn {
    padding: 0.6rem 0.8rem;
    font-size: 0.85rem;
  }
}
</style>