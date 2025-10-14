<template>
  <div class="product-card">
    <img 
      v-if="product.images && product.images.length" :src="'http://localhost:5000' + product.images[0]" alt="Изображение товара" class="product-image">
    <h3>{{ product.name }}</h3>
    <p>Цена: {{ product.price }} руб.</p>
    <p>В наличии: {{ product.stock }}</p>
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
</style>