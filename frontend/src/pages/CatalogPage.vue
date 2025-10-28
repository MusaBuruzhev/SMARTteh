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
      products: [],  
      filteredProducts: [], 
      loading: true,
      error: '',
      searchQuery: '',
      selectedCategories: [],
      priceMin: 0,
      priceMax: Infinity,
      stockMin: 0,
      stockMax: Infinity,
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
    shuffleArray(array) {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    },

    async fetchProducts() {
      this.loading = true;
      this.error = '';
      try {
        const token = localStorage.getItem('token');
       
        const response = await fetch('http://localhost:5000/api/products/list', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Ошибка загрузки');
        const data = await response.json();
        
        this.products = this.shuffleArray(data.products);
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
    searchQuery: 'applyFilters'  
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
  padding: 2rem 0;
}

h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #ff6b35 0%, #ff8e53 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
}

.layout {
  display: flex;
  gap: 2rem;
}

.filters {
  width: 435px;
  background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 107, 53, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  height: fit-content;
  position: sticky;
  top: 2rem;
}

.filters h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #ffffff;
  text-align: center;
}

.filter-group {
  margin-bottom: 2rem;
}

.filter-group label {
  display: block;
  margin-bottom: 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: #e0e0e0;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.checkbox-group:hover {
  background: rgba(255, 107, 53, 0.1);
}

.checkbox-group input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #ff6b35;
}

.checkbox-group span {
  color: #b0b0b0;
  font-weight: 500;
}

.input {
  width: 89%;
  padding: 1rem;
  background: rgba(26, 26, 26, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-weight: 500;
}

.input:focus {
  outline: none;
  border-color: #ff6b35;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.2);
  background: rgba(42, 42, 42, 0.8);
}

.input::placeholder {
  color: #888;
}

.range-group {
  display: flex;
  gap: 1rem;
}

.range-input {
  width: 100%;
}

.filter-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.apply-btn, .reset-btn {
  flex: 1;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.apply-btn {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8e53 100%);
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
}

.apply-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
}

.reset-btn {
  background: rgba(42, 42, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #b0b0b0;
}

.reset-btn:hover {
  background: rgba(255, 107, 53, 0.1);
  border-color: rgba(255, 107, 53, 0.3);
  color: #ffffff;
  transform: translateY(-2px);
}

.products-grid{
    flex: 1;
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
}

.loading, .error-message, .empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  border-radius: 16px;
}

.loading {
  color: #ff6b35;
  background: rgba(255, 107, 53, 0.1);
  border: 1px solid rgba(255, 107, 53, 0.3);
}

.error-message {
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
}

.empty-state {
  color: #b0b0b0;
  background: rgba(42, 42, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Адаптивность */
@media (max-width: 1024px) {
  .layout {
    flex-direction: column;
  }
  
  .filters {
    width: 100%;
    position: static;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .container {
    max-width: 95%;
    padding: 1rem 0;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .filters {
    padding: 1.5rem;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem;
  }
  
  .filter-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .range-group {
    flex-direction: column;
  }
}
</style>