
<template>
  <div class="profile-page">
    <Header />
    <div class="container">
      <div class="profile-header">
        <div class="profile-nav">
          <button :class="{ 'active': activeTab === 'profile' }" @click="setTab('profile')">
            <img src="../../public/prof.png" alt="Профиль" width="30px">
          </button>
          <button :class="{ 'active': activeTab === 'cart' }" @click="setTab('cart')">
            <img src="../../public/cart.png" alt="Корзина" width="30px">
          </button>
          <button :class="{ 'active': activeTab === 'history' }" @click="setTab('history')">
            <img src="../../public/history.png" alt="История" width="30px">
          </button>
          <template v-if="user && user.role === 'admin'">
            <button :class="{ 'active': activeTab === 'add-product' }" @click="setTab('add-product')">
              <img src="../../public/add.png" alt="Добавить товар" width="30px">
            </button>
            <button :class="{ 'active': activeTab === 'edit-product' }" @click="setTab('edit-product')">
              <img src="../../public/edit.png" alt="Изменить товар" width="30px">
            </button>
            <button :class="{ 'active': activeTab === 'delete-product' }" @click="setTab('delete-product')">
              <img src="../../public/delite.png" alt="Удалить товар" width="30px">
            </button>
            <button :class="{ 'active': activeTab === 'users' }" @click="setTab('users')">
              <img src="../../public/users.png" alt="Пользователи" width="30px">
            </button>
          </template>
        </div>
        <div class="header-actions">
          <button @click="logout" class="logout-btn">Выйти</button>
          <button @click="openDeleteModal(user._id)" class="delete-btn">Удалить</button>
        </div>
      </div>

      <div class="profile-content-card">
        <h2 class="page-title">{{ tabTitle }}</h2>

        <div v-if="activeTab === 'profile'">
          <div v-if="loading" class="loading">Загрузка...</div>
          
          <div v-else-if="user" class="profile-content">
            <div class="user-header">
              <div class="avatar">
                {{ getInitials }}
              </div>
              <div class="user-info">
                <h3 class="user-name">{{ user.firstName }} {{ user.lastName }}</h3>
                <p class="username">@{{ user.username }}</p>
              </div>
            </div>
            
            <div class="action-section">
              <button @click="toggleEdit" class="edit-toggle">
                {{ editing ? 'Отмена' : 'Редактировать профиль' }}
              </button>
            </div>
            
            <div v-if="editing" class="edit-section">
              <form @submit.prevent="updateProfile" class="profile-form">
                <div class="form-grid">
                  <div class="input-group">
                    <input v-model="editData.firstName" type="text" placeholder=" " maxlength="50" style="width: 95%;" required />
                    <label>Имя</label>
                  </div>
                  <div class="input-group">
                    <input v-model="editData.lastName" type="text" placeholder=" " maxlength="50" required />
                    <label>Фамилия</label>
                  </div>
                  <div class="input-group full-width">
                    <input v-model="editData.email" type="email" placeholder=" " required />
                    <label>Email</label>
                  </div>
                  <div class="input-group full-width">
                    <input v-model="editData.phoneNumber" @input="formatPhoneInput" type="tel" placeholder="" maxlength="16" />
                    <label>Телефон</label>
                  </div>
                  <div class="input-group full-width">
                    <input v-model="editData.passportNumber" @input="formatPassportInput" type="text" placeholder="__ __ ______" maxlength="12" />
                    <label>Паспорт</label>
                  </div>
                  <div class="input-group full-width">
                    <input v-model="editData.bankCardNumber" @input="formatCardInput" type="text" placeholder="____ ____ ____ ____" maxlength="19" />
                    <label>Банковская карта</label>
                  </div>
                </div>
                
                <button type="submit" class="save-btn" :disabled="loading">
                  {{ loading ? 'Сохранение...' : 'Сохранить' }}
                </button>
                <div v-if="error" class="error-message">{{ error }}</div>
              </form>
              
              <AddressDelivery :initial-address="user.deliveryAddress" @address-updated="updateAddress" />
            </div>
            
            <div v-else class="details-grid">
              <div class="detail-card">
                <label>Имя</label>
                <span>{{ user.firstName }}</span>
              </div>
              <div class="detail-card">
                <label>Фамилия</label>
                <span>{{ user.lastName }}</span>
              </div>
              <div class="detail-card">
                <label>Email</label>
                <span>{{ user.email }}</span>
              </div>
              <div class="detail-card" v-if="user.phoneNumber">
                <label>Телефон</label>
                <span>{{ user.phoneNumber }}</span>
              </div>
              <div class="detail-card" v-if="user.passportNumber">
                <label>Паспорт</label>
                <span>{{ user.passportNumber }}</span>
              </div>
              <div class="detail-card" v-if="user.bankCardNumber">
                <label>Банковская карта</label>
                <span>{{ user.bankCardNumber }}</span>
              </div>
              <div class="detail-card" v-if="user.deliveryAddress">
                <label>Адрес доставки</label>
                <span>{{ user.deliveryAddress }}</span>
              </div>
            </div>
          </div>
          
          <div v-else class="error-state">
            <p>Ошибка при загрузке профиля</p>
            <button @click="fetchUser">Попробовать снова</button>
          </div>
        </div>
        
        <div v-if="activeTab === 'cart'">
          <div class="empty-state">
            <Cart/>
          </div>
        </div>
        
        <div v-if="activeTab === 'history'">
          <div class="empty-state">
            <p>История заказов пуста</p>
          </div>
        </div>
        
        <div v-if="activeTab === 'add-product' && user && user.role === 'admin'">
          <form @submit.prevent="addProduct" class="product-form" enctype="multipart/form-data">
            <div class="form-grid">
              <div class="input-group">
                <input v-model="newProduct.name" type="text"  placeholder=" " style="width: 95%;" required />
                <label>Название</label>
              </div>
              <div class="input-group">
                <input v-model.number="newProduct.price" type="number" placeholder=" " min="0" style="width: 95%;" step="0.01" required />
                <label>Цена</label>
              </div>
              <div class="input-group">
                <input v-model.number="newProduct.stock" type="number" placeholder=" " min="0" style="width: 95%;" required />
                <label>Количество</label>
              </div>
              <div class="input-group" style="width: 98.5%;">
                <select v-model="newProduct.category" required @change="updateCharSuggestions">
                  <option value="" disabled>Выберите категорию</option>
                  <option value="smartphones">Смартфоны</option>
                  <option value="laptops">Ноутбуки</option>
                  <option value="tablets">Планшеты</option>
                  <option value="accessories">Аксессуары</option>
                  <option value="gadgets">Гаджеты</option>
                </select>
                <label>Категория</label>
              </div>
              <div class="input-group full-width">
                <textarea v-model="newProduct.description" placeholder=" " style="width: 97.5%;" required rows="4"></textarea>
                <label>Описание</label>
              </div>
            </div>
            
            <div class="characteristics-section" style="width: 96%;">
              <h4>Характеристики</h4>
              <div v-for="(char, index) in newProduct.characteristics" :key="index" class="char-grid" >
                <div class="input-group">
                  <select v-model="char.key" required>
                    <option value="" disabled>Выберите характеристику</option>
                    <option v-for="suggestion in charSuggestions[newProduct.category]" :key="suggestion" :value="suggestion">{{ suggestion }}</option>
                  </select>
                  <label>Название характеристики</label>
                </div>
                <div class="input-group" >
                  <input v-model="char.value" placeholder=" " required :list="'charValues-' + index"  style="width: 93%;"/>
                  <label>Значение</label>
                  <datalist :id="'charValues-' + index" >
                    <option v-for="value in valueSuggestions[newProduct.category]?.[char.key] || []" :key="value" :value="value" />
                  </datalist>
                </div>
                <button type="button" class="remove-btn" @click="removeCharacteristic(index)">×</button>
              </div>
              <button type="button" class="add-char-btn" @click="addCharacteristic">+ Добавить характеристику</button>
            </div>
            
            <div class="image-upload-section">
              <div class="input-group full-width">
                <input type="file" multiple accept="image/*" @change="handleFileUpload" ref="fileInput"  style=" width: 97.4%;"/>
                <label>Изображения (3-10)</label>
                <div class="image-previews" v-if="imagePreviews.length">
                  <div v-for="(img, index) in imagePreviews" :key="index" class="image-preview">
                    <img :src="img" />
                  </div>
                </div>
              </div>
            </div>
            
            <button type="submit" class="save-btn" :disabled="loading">
              {{ loading ? 'Добавление...' : 'Добавить товар' }}
            </button>
            <div v-if="error" class="error-message">{{ error }}</div>
          </form>
        </div>
        
        <div v-if="activeTab === 'edit-product' && user && user.role === 'admin'">
          <div class="input-group full-width">
            <select v-model="selectedProductId" @change="fetchProduct">
              <option value="" disabled>Выберите товар</option>
              <option v-for="product in products" :key="product._id" :value="product._id">{{ product.name }}</option>
            </select>
            <label>Товар</label>
          </div>
          
          <form v-if="selectedProduct" @submit.prevent="updateProduct" class="product-form" enctype="multipart/form-data">
            <div class="form-grid">
              <div class="input-group">
                <input v-model="selectedProduct.name" type="text" placeholder=" " required />
                <label>Название</label>
              </div>
              <div class="input-group">
                <input v-model.number="selectedProduct.price" type="number" placeholder=" " min="0" step="0.01" required />
                <label>Цена</label>
              </div>
              <div class="input-group">
                <input v-model.number="selectedProduct.stock" type="number" placeholder=" " min="0" required />
                <label>Количество</label>
              </div>
              <div class="input-group">
                <select v-model="selectedProduct.category" required @change="updateCharSuggestions">
                  <option value="" disabled>Выберите категорию</option>
                  <option value="smartphones">Смартфоны</option>
                  <option value="laptops">Ноутбуки</option>
                  <option value="tablets">Планшеты</option>
                  <option value="accessories">Аксессуары</option>
                  <option value="gadgets">Гаджеты</option>
                </select>
                <label>Категория</label>
              </div>
              <div class="input-group full-width">
                <textarea v-model="selectedProduct.description" placeholder=" " required rows="4"></textarea>
                <label>Описание</label>
              </div>
            </div>
            
            <div class="characteristics-section">
              <h4>Характеристики</h4>
              <div v-for="(char, index) in selectedProduct.characteristics" :key="index" class="char-grid">
                <div class="input-group">
                  <select v-model="char.key" required>
                    <option value="" disabled>Выберите характеристику</option>
                    <option v-for="suggestion in charSuggestions[selectedProduct.category]" :key="suggestion" :value="suggestion">{{ suggestion }}</option>
                  </select>
                  <label>Название характеристики</label>
                </div>
                <div class="input-group">
                  <input v-model="char.value" placeholder=" " required :list="'editCharValues-' + index" />
                  <label>Значение</label>
                  <datalist :id="'editCharValues-' + index">
                    <option v-for="value in valueSuggestions[selectedProduct.category]?.[char.key] || []" :key="value" :value="value" />
                  </datalist>
                </div>
                <button type="button" class="remove-btn" @click="removeEditCharacteristic(index)">×</button>
              </div>
              <button type="button" class="add-char-btn" @click="addEditCharacteristic">+ Добавить характеристику</button>
            </div>
            
            <div class="image-management">
              <div class="input-group full-width">
                <label>Текущие изображения</label>
                <div class="current-images" v-if="selectedProduct.images.length">
                  <div v-for="(img, index) in selectedProduct.images" :key="index" class="image-container">
                    <div class="image-wrapper">
                      <img :src="getFullImageUrl(img)" />
                      <button type="button" class="remove-image-btn" @click="markForDelete(index)">×</button>
                      <span v-if="imagesToDelete.includes(index)" class="image-status">Удалено</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="input-group full-width">
                <input type="file" multiple accept="image/*" @change="handleEditFileUpload" ref="editFileInput" />
                <label>Новые изображения (3-10)</label>
                <div class="image-previews" v-if="newImagePreviews.length">
                  <div v-for="(img, index) in newImagePreviews" :key="index" class="image-preview">
                    <img :src="img" />
                  </div>
                </div>
              </div>
            </div>
            
            <button type="submit" class="save-btn" :disabled="loading">
              {{ loading ? 'Сохранение...' : 'Сохранить изменения' }}
            </button>
            <div v-if="error" class="error-message">{{ error }}</div>
          </form>
          
          <div v-else-if="selectedProductId && !selectedProduct" class="error-state">
            <p>Ошибка при загрузке товара</p>
            <button @click="fetchProduct">Попробовать снова</button>
          </div>
        </div>
        
        <div v-if="activeTab === 'delete-product' && user && user.role === 'admin'">
          <div v-if="loading" class="loading">Загрузка...</div>
          <div v-else-if="products.length" class="products-grid">
            <div v-for="product in products" :key="product._id" class="product-card">
              <div class="product-info">
                <div class="product-image">
                  <img v-if="product.images && product.images.length" :src="getFullImageUrl(product.images[0])" />
                </div>
                <span>{{ product.name }}</span>
              </div>
              <button class="delete-btn" @click="deleteProduct(product._id)">Удалить</button>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>Нет товаров для удаления</p>
          </div>
        </div>
        
        <div v-if="activeTab === 'users' && user && user.role === 'admin'">
          <div v-if="loading" class="loading">Загрузка...</div>
          
          <div v-else-if="users.length" class="users-grid">
            <div v-for="u in users" :key="u._id" class="user-card">
              <div class="user-info">
                <span>{{ u.username }} ({{ u.role }})</span>
              </div>
              <div class="user-actions">
                <select v-model="u.role" @change="updateUserRole(u._id, $event.target.value)">
                  <option value="user">Пользователь</option>
                  <option value="admin">Администратор</option>
                </select>
                <button class="delete-btn" @click="openDeleteModal(u._id)">Удалить</button>
              </div>
            </div>
          </div>
          
          <div v-else class="empty-state">
            <p>Пользователи не найдены</p>
            <button @click="fetchUsers">Попробовать снова</button>
          </div>
        </div>
        
        <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
          <div class="modal-content" @click.stop>
            <h3>Подтверждение удаления</h3>
            <p>Вы уверены, что хотите удалить этот аккаунт?</p>
            <div class="modal-actions">
              <button class="confirm-btn" @click="confirmDelete">Да, удалить</button>
              <button class="cancel-btn" @click="closeDeleteModal">Отмена</button>
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
import Cart from '@/components/Cart.vue'

export default {
  name: 'ProfilePage',
  components: {
    Header,
    AddressDelivery,
    Cart
  },
  data() {
    return {
      activeTab: 'profile',
      user: null,
      loading: false,
      error: '',
      editing: false,
      editData: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        passportNumber: '',
        bankCardNumber: ''
      },
      newProduct: {
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        characteristics: [],
        images: []
      },
      imagePreviews: [],
      products: [],
      selectedProductId: '',
      selectedProduct: null,
      newImagePreviews: [],
      imagesToDelete: [],
      users: [],
      showDeleteModal: false,
      deleteUserId: null,
      charSuggestions: {
        smartphones: ['Процессор', 'ОЗУ', 'Память', 'Камера', 'Экран', 'Батарея', 'ОС', 'Разрешение экрана'],
        laptops: ['Процессор', 'ОЗУ', 'SSD', 'Графический процессор', 'Дисплей', 'Батарея', 'ОС', 'Вес'],
        tablets: ['Процессор', 'ОЗУ', 'Память', 'Экран', 'Батарея', 'ОС', 'Камера', 'Вес'],
        accessories: ['Тип', 'Совместимость', 'Цвет', 'Материал', 'Бренд', 'Размер'],
        gadgets: ['Тип устройства', 'Функции', 'Батарея', 'Совместимость', 'Цвет', 'Вес']
      },
      valueSuggestions: {
        smartphones: {
          Процессор: ['Snapdragon 8 Gen 3', 'Exynos 2400', 'Dimensity 9200', 'A16 Bionic'],
          ОЗУ: ['4 ГБ', '6 ГБ', '8 ГБ', '12 ГБ', '16 ГБ'],
          Память: ['64 ГБ', '128 ГБ', '256 ГБ', '512 ГБ', '1 ТБ'],
          Камера: ['12 МП', '48 МП', '64 МП', '108 МП'],
          Экран: ['AMOLED', 'IPS', 'OLED', 'Retina'],
          Батарея: ['4000 мАч', '5000 мАч', '6000 мАч'],
          ОС: ['Android 14', 'iOS 17', 'HarmonyOS'],
          'Разрешение экрана': ['1080x2400', '1440x3200', '1240x2772']
        },
        laptops: {
          Процессор: ['Intel Core i5', 'Intel Core i7', 'AMD Ryzen 5', 'AMD Ryzen 7'],
          ОЗУ: ['8 ГБ', '16 ГБ', '32 ГБ', '64 ГБ'],
          SSD: ['256 ГБ', '512 ГБ', '1 ТБ', '2 ТБ'],
          'Графический процессор': ['NVIDIA GTX 1650', 'NVIDIA RTX 3060', 'Intel Iris Xe', 'AMD Radeon'],
          Дисплей: ['13.3"', '15.6"', '17.3"', '16"'],
          Батарея: ['50 Вт·ч', '70 Вт·ч', '90 Вт·ч'],
          ОС: ['Windows 11', 'macOS Ventura', 'Linux Ubuntu'],
          Вес: ['1.2 кг', '1.8 кг', '2.5 кг']
        },
        tablets: {
          Процессор: ['Snapdragon 870', 'A14 Bionic', 'Dimensity 9000'],
          ОЗУ: ['4 ГБ', '6 ГБ', '8 ГБ', '12 ГБ'],
          Память: ['64 ГБ', '128 ГБ', '256 ГБ'],
          Экран: ['IPS', 'AMOLED', 'Retina'],
          Батарея: ['7000 мАч', '8000 мАч', '10000 мАч'],
          ОС: ['Android 14', 'iPadOS 17'],
          Камера: ['8 МП', '12 МП', '20 МП'],
          Вес: ['400 г', '500 г', '600 г']
        },
        accessories: {
          Тип: ['Чехол', 'Зарядное устройство', 'Наушники', 'Кабель'],
          Совместимость: ['iPhone', 'Samsung', 'Универсальный'],
          Цвет: ['Чёрный', 'Белый', 'Синий', 'Красный'],
          Материал: ['Пластик', 'Силикон', 'Кожа', 'Металл'],
          Бренд: ['Apple', 'Samsung', 'Anker', 'Spigen'],
          Размер: ['S', 'M', 'L']
        },
        gadgets: {
          'Тип устройства': ['Смарт-часы', 'Фитнес-трекер', 'VR-очки'],
          Функции: ['GPS', 'Пульсометр', 'Шагомер', 'Уведомления'],
          Батарея: ['300 мАч', '400 мАч', '500 мАч'],
          Совместимость: ['Android', 'iOS', 'Универсальный'],
          Цвет: ['Чёрный', 'Серебристый', 'Золотой'],
          Вес: ['50 г', '100 г', '200 г']
        }
      }
    }
  },
  computed: {
    tabTitle() {
      const titles = {
        profile: 'Профиль',
        cart: 'Корзина',
        history: 'История заказов',
        'add-product': 'Добавить товар',
        'edit-product': 'Изменить товар',
        'delete-product': 'Удалить товар',
        users: 'Пользователи'
      }
      return titles[this.activeTab] || 'Профиль'
    },
    getInitials() {
      if (!this.user) return ''
      const first = this.user.firstName ? this.user.firstName[0] : ''
      const last = this.user.lastName ? this.user.lastName[0] : ''
      return `${first}${last}`.toUpperCase()
    }
  },
  methods: {
    setTab(tab) {
      this.activeTab = tab
      this.error = ''
      if (tab === 'edit-product' || tab === 'delete-product') {
        this.loadProducts()
      }
      if (tab === 'users') {
        this.fetchUsers()
      }
    },
    
    async fetchUser() {
      this.loading = true
      this.error = ''
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const data = await response.json()
        if (response.ok) {
          this.user = data.user
          this.editData = {
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            email: data.user.email,
            phoneNumber: data.user.phoneNumber || '',
            passportNumber: data.user.passportNumber || '',
            bankCardNumber: data.user.bankCardNumber || ''
          }
        } else {
          this.error = data.message || 'Ошибка загрузки профиля'
        }
      } catch (error) {
        this.error = 'Ошибка соединения'
      }
      this.loading = false
    },
    toggleEdit() {
      this.editing = !this.editing
      this.error = ''
      if (!this.editing) {
        this.editData = {
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          email: this.user.email,
          phoneNumber: this.user.phoneNumber || '',
          passportNumber: this.user.passportNumber || '',
          bankCardNumber: this.user.bankCardNumber || ''
        }
      }
    },
    async updateProfile() {
      this.loading = true
      this.error = ''
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:5000/api/auth/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(this.editData)
        })
        const data = await response.json()
        if (response.ok) {
          this.user = data.user
          this.editing = false
        } else {
          this.error = data.message || 'Ошибка обновления профиля'
        }
      } catch (error) {
        this.error = 'Ошибка соединения'
      }
      this.loading = false
    },
    updateAddress(newAddress) {
      this.user.deliveryAddress = newAddress
    },
formatPhoneInput(event) {
  let value = event.target.value.replace(/\D/g, '');
  
  // Если пользователь начинает с 8, заменяем на +7
  if (value.startsWith('8') && value.length === 1) {
    value = '7';
  }
  
  // Форматируем только если есть цифры
  if (value.length > 0) {
    let formattedValue = '+7';
    
    if (value.length > 1) {
      formattedValue += '(' + value.substring(1, 4);
    }
    if (value.length > 4) {
      formattedValue += ')' + value.substring(4, 7);
    }
    if (value.length > 7) {
      formattedValue += '-' + value.substring(7, 9);
    }
    if (value.length > 9) {
      formattedValue += '-' + value.substring(9, 11);
    }
    
    this.editData.phoneNumber = formattedValue;
  } else {
    this.editData.phoneNumber = '';
  }
},
    formatPassportInput(event) {
      let value = event.target.value.replace(/\D/g, '')
      if (value.length > 2) {
        value = value.slice(0, 2) + ' ' + value.slice(2)
      }
      if (value.length > 5) {
        value = value.slice(0, 5) + ' ' + value.slice(5)
      }
      this.editData.passportNumber = value.slice(0, 12)
    },
    formatCardInput(event) {
      let value = event.target.value.replace(/\D/g, '')
      if (value.length > 4) {
        value = value.slice(0, 4) + ' ' + value.slice(4)
      }
      if (value.length > 9) {
        value = value.slice(0, 9) + ' ' + value.slice(9)
      }
      if (value.length > 14) {
        value = value.slice(0, 14) + ' ' + value.slice(14)
      }
      this.editData.bankCardNumber = value.slice(0, 19)
    },
    addCharacteristic() {
      this.newProduct.characteristics.push({ key: '', value: '' })
    },
    removeCharacteristic(index) {
      this.newProduct.characteristics.splice(index, 1)
    },
    addEditCharacteristic() {
      this.selectedProduct.characteristics.push({ key: '', value: '' })
    },
    removeEditCharacteristic(index) {
      this.selectedProduct.characteristics.splice(index, 1)
    },
    updateCharSuggestions() {
      this.newProduct.characteristics = []
      if (this.selectedProduct) {
        this.selectedProduct.characteristics = []
      }
    },
    getFullImageUrl(imgPath) {
      return imgPath.startsWith('http') ? imgPath : `http://localhost:5000${imgPath}`
    },
    handleFileUpload(e) {
      const files = Array.from(e.target.files)
      if (files.length > 10) {
        this.error = 'Максимум 10 изображений'
        return
      }
      if (files.length < 3) {
        this.error = 'Требуется минимум 3 изображения'
        return
      }
      this.newProduct.images = files
      this.imagePreviews = []
      files.forEach(file => {
        const reader = new FileReader()
        reader.onload = ev => this.imagePreviews.push(ev.target.result)
        reader.readAsDataURL(file)
      })
    },
    handleEditFileUpload(e) {
      const files = Array.from(e.target.files)
      if (files.length > 10) {
        this.error = 'Максимум 10 изображений'
        return
      }
      this.selectedProduct.newImages = files
      this.newImagePreviews = []
      files.forEach(file => {
        const reader = new FileReader()
        reader.onload = ev => this.newImagePreviews.push(ev.target.result)
        reader.readAsDataURL(file)
      })
    },
    markForDelete(index) {
      this.imagesToDelete.push(index)
    },
    async addProduct() {
      this.loading = true
      this.error = ''
      try {
        const token = localStorage.getItem('token')
        const formData = new FormData()
        formData.append('name', this.newProduct.name)
        formData.append('description', this.newProduct.description)
        formData.append('price', this.newProduct.price)
        formData.append('stock', this.newProduct.stock)
        formData.append('category', this.newProduct.category)
        formData.append('characteristics', JSON.stringify(
          this.newProduct.characteristics.reduce((acc, char) => {
            if (char.key && char.value) acc[char.key] = char.value
            return acc
          }, {})
        ))
        this.newProduct.images.forEach(file => formData.append('images', file))
        const response = await fetch('http://localhost:5000/api/products/add', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        })
        if (response.ok) {
          this.newProduct = { name: '', description: '', price: '', stock: '', category: '', characteristics: [], images: [] }
          this.imagePreviews = []
          this.$refs.fileInput.value = ''
          await this.loadProducts()
        } else {
          this.error = (await response.json()).message || 'Ошибка добавления товара'
        }
      } catch (err) {
        this.error = 'Ошибка соединения'
      }
      this.loading = false
    },
    async loadProducts() {
      this.loading = true
      this.error = ''
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:5000/api/products/list', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const data = await response.json()
        if (response.ok) {
          this.products = data.products
        } else {
          this.error = data.message || 'Ошибка загрузки товаров'
        }
      } catch (error) {
        this.error = 'Ошибка соединения'
      }
      this.loading = false
    },
    async fetchProduct() {
      if (!this.selectedProductId) return
      this.loading = true
      this.error = ''
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`http://localhost:5000/api/products/${this.selectedProductId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const data = await response.json()
        if (response.ok) {
          this.selectedProduct = data.product
          this.selectedProduct.characteristics = Object.entries(data.product.characteristics || {}).map(([key, value]) => ({ key, value }))
          this.selectedProduct.newImages = []
          this.newImagePreviews = []
          this.imagesToDelete = []
        } else {
          this.error = data.message || 'Ошибка загрузки товара'
        }
      } catch (error) {
        this.error = 'Ошибка соединения'
      }
      this.loading = false
    },
    async updateProduct() {
      this.loading = true
      this.error = ''
      try {
        if (this.selectedProduct.images.length + this.selectedProduct.newImages.length - this.imagesToDelete.length < 3) {
          this.error = 'Требуется минимум 3 изображения'
          this.loading = false
          return
        }
        const token = localStorage.getItem('token')
        for (const index of this.imagesToDelete.sort((a, b) => b - a)) {
          await fetch(`http://localhost:5000/api/products/${this.selectedProduct._id}/image/${index}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
          })
        }
        const formData = new FormData()
        if (this.selectedProduct.name) formData.append('name', this.selectedProduct.name)
        if (this.selectedProduct.description) formData.append('description', this.selectedProduct.description)
        if (this.selectedProduct.price) formData.append('price', this.selectedProduct.price)
        if (this.selectedProduct.stock) formData.append('stock', this.selectedProduct.stock)
        if (this.selectedProduct.category) formData.append('category', this.selectedProduct.category)
        formData.append('characteristics', JSON.stringify(
          this.selectedProduct.characteristics.reduce((acc, char) => {
            if (char.key && char.value) acc[char.key] = char.value
            return acc
          }, {})
        ))
        this.selectedProduct.newImages.forEach(file => formData.append('images', file))
        const response = await fetch(`http://localhost:5000/api/products/update/${this.selectedProduct._id}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        })
        if (response.ok) {
          this.selectedProductId = ''
          this.selectedProduct = null
          this.newImagePreviews = []
          this.imagesToDelete = []
          await this.loadProducts()
        } else {
          this.error = (await response.json()).message || 'Ошибка обновления товара'
        }
      } catch (err) {
        this.error = 'Ошибка соединения'
      }
      this.loading = false
    },
    async deleteProduct(productId) {
      
      this.loading = true
      this.error = ''
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`http://localhost:5000/api/products/delete/${productId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        })
        if (response.ok) {
          await this.loadProducts()
        } else {
          this.error = (await response.json()).message || 'Ошибка удаления товара'
        }
      } catch (err) {
        this.error = 'Ошибка соединения'
      }
      this.loading = false
    },
    async fetchUsers() {
      this.loading = true
      this.error = ''
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:5000/api/auth/users', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const data = await response.json()
        if (response.ok) {
          this.users = data.users
        } else {
          this.error = data.message || 'Ошибка загрузки пользователей'
        }
      } catch (error) {
        this.error = 'Ошибка соединения'
      }
      this.loading = false
    },
    async updateUserRole(userId, newRole) {
      this.loading = true
      this.error = ''
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`http://localhost:5000/api/auth/users/${userId}/role`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ role: newRole })
        })
        if (!response.ok) {
          this.error = (await response.json()).message || 'Ошибка обновления роли'
        }
      } catch (error) {
        this.error = 'Ошибка соединения'
      }
      this.loading = false
    },
    openDeleteModal(userId) {
      this.deleteUserId = userId
      this.showDeleteModal = true
    },
    closeDeleteModal() {
      this.showDeleteModal = false
      this.deleteUserId = null
    },
    async confirmDelete() {
      if (!this.deleteUserId) return
      this.loading = true
      this.error = ''
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`http://localhost:5000/api/auth/users/${this.deleteUserId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (response.ok) {
          if (this.deleteUserId === this.user._id) {
            this.logout()
          } else {
            this.fetchUsers()
          }
          this.closeDeleteModal()
        } else {
          this.error = (await response.json()).message || 'Ошибка удаления пользователя'
        }
      } catch (error) {
        this.error = 'Ошибка соединения'
      }
      this.loading = false
    },
    logout() {
      localStorage.removeItem('token')
      this.$router.push('/')
    }
  },
  mounted() {
    this.fetchUser()
    if (this.$route.query.tab) {
      this.activeTab = this.$route.query.tab; 
    }
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: #f5f5f5;
}

.container {
  max-width: 90%;
  margin: 0 auto;
  padding: 20px;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.profile-nav {
  display: flex;
  gap: 15px;
}

.profile-nav button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-nav button:hover {
  background: rgba(255, 111, 0, 0.2);
  border-color: #ff6f00;
  transform: translateY(-2px);
}

.profile-nav button.active {
  background: #ff6f00;
  border-color: #ff6f00;
  box-shadow: 0 4px 15px rgba(255, 111, 0, 0.3);
}

.header-actions {
  display: flex;
  gap: 15px;
}

.logout-btn, .delete-btn {
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 14px;
}

.logout-btn {
  background: rgba(255, 111, 0, 0.9);
  color: white;
}

.logout-btn:hover {
  background: #ff8f00;
  box-shadow: 0 4px 15px rgba(255, 111, 0, 0.4);
  transform: translateY(-2px);
}

.delete-btn {
  background: rgba(244, 67, 54, 0.9);
  color: white;
}

.delete-btn:hover {
  background: #f44336;
  box-shadow: 0 4px 15px rgba(244, 67, 54, 0.4);
  transform: translateY(-2px);
}

.profile-content-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  min-height: 900px;
  padding: 30px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 30px;
  color: #ffffff;
  text-align: center;
}

.profile-content {
  margin: 0 auto;
}

.user-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6f00, #ff8f00);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: white;
  box-shadow: 0 4px 15px rgba(255, 111, 0, 0.3);
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 5px 0;
  color: #ffffff;
}

.username {
  font-size: 16px;
  color: #cccccc;
  margin: 0;
}

.action-section {
  margin-bottom: 30px;
  text-align: center;
}

.edit-toggle {
  background: linear-gradient(135deg, #ff6f00, #ff8f00);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
}

.edit-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 111, 0, 0.4);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 25px;
}

.input-group {
  position: relative;
  margin-bottom: 20px;
}

.input-group.full-width {
  grid-column: 1 / -1;
}

.input-group input,
.input-group select,
.input-group textarea {
  width: 100%;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: #ffffff;
  font-size: 16px;
  transition: all 0.3s ease;
}

.input-group input:focus,
.input-group select:focus,
.input-group textarea:focus {
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

.input-group input:focus + label,
.input-group input:not(:placeholder-shown) + label,
.input-group select:focus + label,
.input-group select:not(:placeholder-shown) + label,
.input-group textarea:focus + label,
.input-group textarea:not(:placeholder-shown) + label {
  top: -6px;
  left: 10px;
  font-size: 12px;
  color: #ff6f00;
  background-color: #2d2d2d ;
  border-radius: 20px;
  
}

.save-btn {
  background: linear-gradient(135deg, #ff6f00, #ff8f00);
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
  width: 100%;
  margin-top: 20px;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 111, 0, 0.4);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.details-grid {
    display: flex;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    flex-direction: column;
}

.detail-card {
  background: rgba(255, 255, 255, 0.08);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.detail-card label {
  display: block;
  font-size: 12px;
  color: #ff6f00;
  margin-bottom: 5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-card span {
  font-size: 16px;
  color: #ffffff;
  font-weight: 500;
}

.characteristics-section {
  margin: 30px 0;
  padding: 25px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.characteristics-section h4 {
  margin: 0 0 20px 0;
  color: #ffffff;
  font-size: 18px;
}

.char-grid {
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    gap: 15px;
    align-items: start;
    margin-bottom: 15px;
}

.remove-btn {
  background: #f44336;
  color: white;
  border: none;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  margin-top: 5px;
}

.remove-btn:hover {
  background: #d32f2f;
  transform: scale(1.1);
}

.add-char-btn {
  background: rgba(255, 111, 0, 0.2);
  color: #ff6f00;
  border: 1px dashed #ff6f00;
  padding: 12px 20px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  width: 100%;
}

.add-char-btn:hover {
  background: rgba(255, 111, 0, 0.3);
  transform: translateY(-2px);
}

.image-upload-section,
.image-management {
  margin: 25px 0;
}

.image-previews {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.image-preview {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.current-images {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 15px;
}

.image-container {
  position: relative;
}

.image-wrapper {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-status {
  position: absolute;
  bottom: 5px;
  left: 5px;
  background: rgba(244, 67, 54, 0.9);
  color: white;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 10px;
}

.products-grid,
.users-grid {
  display: grid;
  gap: 20px;
}

.product-card,
.user-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.product-card:hover,
.user-card:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-2px);
}

.product-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.product-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-actions select {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px 12px;
  color: white;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #cccccc;
}

.empty-state p {
  font-size: 18px;
  margin-bottom: 20px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #ff6f00;
  font-size: 18px;
}

.error-state {
  text-align: center;
  padding: 40px;
  color: #f44336;
}

.error-state button {
  background: #f44336;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 15px;
}

.error-message {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
  padding: 12px;
  border-radius: 8px;
  margin-top: 15px;
  border: 1px solid rgba(244, 67, 54, 0.3);
  text-align: center;
}

.modal-overlay {
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

.modal-content {
  background: #2d2d2d;
  padding: 30px;
  border-radius: 20px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-content h3 {
  margin: 0 0 15px 0;
  color: #ffffff;
  font-size: 22px;
}

.modal-content p {
  color: #cccccc;
  margin-bottom: 25px;
  font-size: 16px;
}

.modal-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.confirm-btn {
  background: #f44336;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.confirm-btn:hover {
  background: #d32f2f;
  transform: translateY(-2px);
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 12px 25px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .container {
    padding: 15px;
  }
  
  .profile-header {
    flex-direction: column;
    gap: 20px;
  }
  
  .profile-nav {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .char-grid {
    grid-template-columns: 1fr;
  }
  
  .product-card,
  .user-card {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .user-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style>


<style>
.vue-dadata__input {
  width: 98% !important;
  padding: 12px !important;
  border: 1px solid #4a4a4a !important;
  border-radius: 8px !important;
  font-size: 14px !important;
  background: #3a3a3a !important;
  color: #e0e0e0 !important;
}

.vue-dadata__suggestions span {
  border: 2px solid #ff6f00 !important;
  border-radius: 12px !important;
  padding: 16px !important;
  margin-top: 3px;
  background: #3a3a3a !important;
  box-shadow: 0 4px 20px rgba(0, 212, 255, 0.2) !important;
  display: block !important;
  color: #e0e0e0 !important;
}

.vue-dadata__suggestion {
  padding: 12px 16px !important;
  margin: 8px 0 !important;
  border-radius: 8px !important;
  background: #4a4a4a !important;
  border: 1px solid #5a5a5a !important;
  color: #e0e0e0 !important;
}

.vue-dadata__suggestion:hover {
  background: #ff6f00 !important;
  color: #1a1a1a !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 2px 8px rgba(0, 212, 255, 0.3) !important;
}
.input-group select option,
.user-actions select option{
  color:black;
}
</style>