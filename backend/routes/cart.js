const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');
const mongoose = require('mongoose');

router.get('/list', authMiddleware, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.userId }).populate('items.product');
    if (!cart) {
      cart = new Cart({ user: req.user.userId, items: [] });
      await cart.save();
    }
    // Фильтруем элементы, исключая undefined и null
    cart.items = cart.items.filter(item => item && item.product);
    await cart.save();
    console.log('Cart items sent:', cart.items); // Логирование для отладки
    res.status(200).json({ cart: cart.items });
  } catch (error) {
    console.error('Error in /cart/list:', error);
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Некорректный ID товара' });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Товар не найден' });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Недостаточно товаров в наличии' });
    }
    let cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      cart = new Cart({ user: req.user.userId, items: [] });
    }
    const existingItem = cart.items.find(item => item && item.product && item.product.toString() === productId);
    const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;
    if (product.stock < newQuantity) {
      return res.status(400).json({ message: 'Недостаточно товаров в наличии' });
    }
    if (existingItem) {
      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    await cart.save();
    await cart.populate('items.product');
    // Фильтруем перед отправкой
    cart.items = cart.items.filter(item => item && item.product);
    console.log('Cart items after add:', cart.items); // Логирование для отладки
    res.status(200).json({ message: 'Товар добавлен в корзину', cart: cart.items });
  } catch (error) {
    console.error('Error in /cart/add:', error);
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

router.delete('/remove/:productId', authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Некорректный ID товара' });
    }
    let cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Корзина не найдена' });
    }
    cart.items = cart.items.filter(item => item && item.product && item.product.toString() !== productId);
    await cart.save();
    await cart.populate('items.product');
    cart.items = cart.items.filter(item => item && item.product);
    res.status(200).json({ message: 'Товар удален из корзины', cart: cart.items });
  } catch (error) {
    console.error('Error in /cart/remove:', error);
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

router.put('/update/:productId', authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Некорректный ID товара' });
    }
    if (quantity < 1) {
      return res.status(400).json({ message: 'Количество должно быть не менее 1' });
    }
    let cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Корзина не найдена' });
    }
    const item = cart.items.find(item => item && item.product && item.product.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: 'Товар не найден в корзине' });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Товар не найден' });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Недостаточно товаров в наличии' });
    }
    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.product');
    cart.items = cart.items.filter(item => item && item.product);
    res.status(200).json({ message: 'Количество обновлено', cart: cart.items });
  } catch (error) {
    console.error('Error in /cart/update:', error);
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
});

module.exports = router;