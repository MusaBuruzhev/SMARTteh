<template>
  <div class="product-card">
    <img 
      v-if="product.images && product.images.length" :src="'http://localhost:5000' + product.images[0]" alt="Изображение товара" class="product-image">
    <h3>{{ product.name }}</h3>
    <p>Цена: {{ product.price }} руб.</p>
    <p>В наличии: {{ product.stock }}</p>
    <div class="product-actions">
      <button 
        v-if="product.stock > 0"
        :class="['cart-btn', { 'in-cart': inCart }]" 
        @click="handleCartClick"
      >
        {{ inCart ? 'В корзине' : 'В корзину' }}
      </button>
      <button 
        v-else
        class="cart-btn disabled"
        disabled
      >
        Нет в наличии
      </button>
      <button class="buy-now-btn">Купить</button>
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
    async checkInCart() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/cart/list', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const { cart } = await response.json();
          console.log('Check inCart response:', cart); // Логирование для отладки
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
        console.log('Add to cart response:', data); // Логирование для отладки
        if (response.ok) {
          this.inCart = true;
        } else {
          alert(data.message || 'Ошибка добавления в корзину');
        }
      } catch (error) {
        console.error('Ошибка соединения:', error);
        alert('Ошибка соединения');
      }
    }
  }
}
</script>

<style scoped>
.product-card {
  background: #2d2d2d;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 12px;
  color: #ffffff;
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
}

h3 {
  font-size: 20px;
  margin: 0 0 10px;
}

p {
  font-size: 14px;
  margin: 5px 0;
  color: #cccccc;
}

.product-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.cart-btn, .buy-now-btn, .favorite-btn {
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.cart-btn {
  background: #ff6f00;
  color: #ffffff;
  flex: 1;
}

.cart-btn.in-cart {
  background: #4caf50;
}

.buy-now-btn {
  background: #7e7e7e;
  color: #ffffff;
  flex: 1;
}

.favorite-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ff4444;
}

.cart-btn:hover, .buy-now-btn:hover {
  opacity: 0.7;
}

.favorite-btn:hover {
  background: rgba(255, 68, 68, 0.1);
}

.heart-icon {
  font-size: 16px;
}

.cart-btn.disabled {
  background: #cccccc;
  cursor: not-allowed;
  color: #666666;
}
</style>