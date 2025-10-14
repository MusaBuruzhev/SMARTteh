<template>
  <div class="catalog-page">
    <Header />
    <div class="container">
      <h1>Каталог товаров</h1>
      <div class="layout">
        <aside class="filters">
          <h2>Фильтры</h2>
          <div class="filter-group">
            <label>Поиск по имени/артикулу</label>
            <input v-model="searchQuery" type="text" placeholder="Введите текст" class="input">
          </div>
          <div class="filter-group">
            <label>Категории</label>
            <div v-for="(cat, key) in categoryMap" :key="key" class="checkbox-group">
              <input type="checkbox" :value="key" v-model="selectedCategories">
              <span>{{ cat }}</span>
            </div>
          </div>
          <div class="filter-group">
            <label>Цена (руб.)</label>
            <div class="range-group">
              <input type="number" v-model="priceMin" placeholder="Min" min="0" class="input range-input">
              <input type="number" v-model="priceMax" placeholder="Max" min="0" class="input range-input">
            </div>
          </div>  
          <div class="filter-actions">
            <button @click="applyFilters" class="apply-btn">Применить</button>
            <button @click="resetFilters" class="reset-btn">Сбросить</button>
          </div>
        </aside>
        <main class="products-grid">
          <ProductCard v-for="product in filteredProducts" :key="product._id" :product="product" :categoryMap="categoryMap"/>
          <div v-if="loading" class="loading">Загрузка...</div>
          <div v-if="error" class="error-message">{{ error }}</div>
          <div v-if="!filteredProducts.length && !loading" class="empty-state">Нет товаров</div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import ProductCard from '@/components/ProductCard.vue'

export default {
  components: { Header, ProductCard },
  data() {
    return {
      products: [],  // Все товары
      filteredProducts: [],  // Отфильтрованные
      loading: true,
      error: '',
      searchQuery: '',
      selectedCategories: [],
      priceMin: 0,
      priceMax: Infinity,
      stockMin: 0,
      stockMax: Infinity,
      // Маппинг категорий на русский
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
    uniqueCategories() {
      return [...new Set(this.products.map(p => p.category))].filter(cat => this.categoryMap[cat]);
    }
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      this.loading = true;
      this.error = '';
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.error = 'Нужна авторизация';
          this.loading = false;
          return;
        }
        const response = await fetch('http://localhost:5000/api/products/list', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Ошибка загрузки');
        const data = await response.json();
        this.products = data.products;
        this.filteredProducts = [...this.products];
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    applyFilters() {
      this.filteredProducts = this.products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                              p.articleNumber.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesCategory = this.selectedCategories.length === 0 || this.selectedCategories.includes(p.category);
        const matchesPrice = p.price >= (this.priceMin || 0) && p.price <= (this.priceMax || Infinity);
        const matchesStock = p.stock >= (this.stockMin || 0) && p.stock <= (this.stockMax || Infinity);
        return matchesSearch && matchesCategory && matchesPrice && matchesStock;
      });
    },
    resetFilters() {
      this.searchQuery = '';
      this.selectedCategories = [];
      this.priceMin = 0;
      this.priceMax = Infinity;
      this.stockMin = 0;
      this.stockMax = Infinity;
      this.filteredProducts = [...this.products];
    }
  },
  watch: {
    searchQuery: 'applyFilters'  // Авто-применение для поиска
  }
}
</script>

<style scoped>
.catalog-page {
  background: #1a1a1a;
  min-height: 100vh;
  color: #ffffff;
  font-family: Arial, sans-serif;
}

.container {
  max-width: 90%;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  font-size: 28px;
  margin-bottom: 20px;
}

.layout {
  display: flex;
  gap: 20px;
}

.filters {
  width: 20%;
  background: #2d2d2d;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.filter-group {
  margin-bottom: 20px;
}

.filter-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 16px;
  color: #cccccc;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.input {
  width: 90%;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
}

.range-group {
  display: flex;
  gap: 10px;
}

.range-input {
  width: 50%;
}

.filter-actions {
  display: flex;
  gap: 10px;
}

.apply-btn, .reset-btn {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.apply-btn {
  background: #ff6f00;
  color: #ffffff;
}

.reset-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.products-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.loading, .error-message, .empty-state {
  text-align: center;
  padding: 20px;
  font-size: 16px;
}

.loading {
  color: #ff6f00;
}

.error-message {
  color: #f44336;
  background: rgba(244, 67, 54, 0.1);
  border-radius: 8px;
}

.empty-state {
  color: #cccccc;
}
</style>