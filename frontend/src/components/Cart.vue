<template>
  <div class="cart-container">
    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="cartItems.length === 0" class="empty-state">
      <p>Ваша корзина пуста</p>
      <router-link to="/catalog" class="catalog-btn">Перейти в каталог</router-link>
    </div>
    <div v-else class="cart-content">
      <div class="cart-items">
        <div v-for="item in cartItems" :key="item.product._id" class="cart-item">
          <img 
            v-if="item.product.images && item.product.images.length" 
            :src="'http://localhost:5000' + item.product.images[0]" 
            alt="Изображение товара" 
            class="item-image"
          >
          <div class="item-details">
            <h3>{{ item.product.name }}</h3>
            <p>Цена: {{ item.product.price }} руб.</p>
             <div class="quantity-control">
                <button @click="updateQuantity(item.product._id, item.quantity - 1)" :disabled="item.quantity <= 1">-</button>
                <span>{{ item.quantity }}</span>
                <button @click="updateQuantity(item.product._id, item.quantity + 1)" :disabled="item.quantity >= item.product.stock">+</button>
            </div>
            <p>Итого: {{ item.product.price * item.quantity }} руб.</p>
          </div>
          <button class="remove-btn" @click="removeFromCart(item.product._id)">Удалить</button>
        </div>
      </div>
      <div class="cart-summary">
        <h3>Итог</h3>
        <p>Товаров: {{ totalItems }}</p>
        <p>Общая сумма: {{ totalPrice }} руб.</p>
        <button class="checkout-btn">Оформить заказ</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cartItems: [],
      loading: true,
      error: ''
    }
  },
  computed: {
    totalItems() {
      return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    },
    totalPrice() {
      return this.cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    }
  },
  mounted() {
    this.fetchCart();
  },
  methods: {
    async fetchCart() {
      this.loading = true;
      this.error = '';
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.error = 'Нужна авторизация';
          return;
        }
        const response = await fetch('http://localhost:5000/api/cart/list', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Ошибка загрузки');
        const { cart } = await response.json();
        this.cartItems = cart;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async removeFromCart(productId) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/cart/remove/${productId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          this.fetchCart();
        } else {
          const data = await response.json();
          alert(data.message || 'Ошибка удаления');
        }
      } catch (error) {
        alert('Ошибка соединения');
      }
    },
    async updateQuantity(productId, newQuantity) {
        const item = this.cartItems.find(i => i.product._id === productId);
        if (!item || newQuantity < 1 || newQuantity > item.product.stock) {
            alert('Недопустимое количество: превышает наличие');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/cart/update/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ quantity: newQuantity })
            });
            if (response.ok) {
            this.fetchCart();
            } else {
            const data = await response.json();
            alert(data.message || 'Ошибка обновления');
            }
        } catch (error) {
            alert('Ошибка соединения');
        }
        }
  }
}
</script>

<style scoped>

.quantity-control {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
}

.quantity-control button {
  background: #ff6f00;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.quantity-control button:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.quantity-control span {
  min-width: 20px;
  text-align: center;
}
.cart-container {
  padding: 20px;
  background: #1a1a1a;
  color: #ffffff;
  border-radius: 12px;
}

.cart-content {
  display: flex;
  gap: 20px;
}

.cart-items {
  flex: 2;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #2d2d2d;
  border-radius: 12px;
  margin-bottom: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.item-details {
  flex: 1;
}

.item-details h3 {
  font-size: 18px;
  margin: 0 0 10px;
}

.item-details p {
  font-size: 14px;
  color: #cccccc;
  margin: 5px 0;
}

.remove-btn {
  background: #f44336;
  color: #ffffff;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.remove-btn:hover {
  background: #d32f2f;
}

.cart-summary {
  flex: 1;
  padding: 15px;
  background: #2d2d2d;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.cart-summary h3 {
  font-size: 20px;
  margin: 0 0 15px;
}

.cart-summary p {
  font-size: 16px;
  color: #cccccc;
  margin: 10px 0;
}

.checkout-btn {
  width: 100%;
  padding: 12px;
  background: #ff6f00;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
}

.checkout-btn:hover {
  background: #e55f00;
}

.empty-state {
  text-align: center;
  padding: 40px;
}

.empty-state p {
  font-size: 18px;
  color: #cccccc;
  margin-bottom: 20px;
}

.catalog-btn {
  display: inline-block;
  padding: 10px 20px;
  background: #ff6f00;
  color: #ffffff;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.catalog-btn:hover {
  background: #e55f00;
}
</style>

